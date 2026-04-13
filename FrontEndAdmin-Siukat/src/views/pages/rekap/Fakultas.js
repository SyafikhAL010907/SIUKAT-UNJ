import React from 'react';
import { connect } from 'react-redux';
import { 
    Container, 
    Row, 
    Col, 
    Table, 
    Badge, 
    Button, 
    Input, 
    InputGroup, 
    InputGroupAddon, 
    InputGroupText
} from 'reactstrap';
import { rekapitulasi } from "../../../actions";
import { cookies, cookieName, rupiah } from "../../../global";

// STYLES: CSS-in-JS "Senior Engineer" Style
const CustomStyles = () => (
    <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        
        .rekap-container {
            font-family: 'Inter', sans-serif;
            background: #f8fafc;
        }

        .glass-header-premium {
            background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
            border-radius: 24px;
            padding: 2.5rem;
            color: white;
            box-shadow: 0 20px 40px -10px rgba(16, 185, 129, 0.2);
            margin-bottom: -40px;
            position: relative;
            z-index: 10;
        }

        .table-glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(16, 185, 129, 0.1);
            border-radius: 32px;
            box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.08);
            overflow: hidden;
            padding-top: 50px;
        }

        .premium-table thead th {
            background: #10b981 !important;
            color: #ffffff !important;
            font-weight: 900;
            text-transform: uppercase;
            font-size: 10.5px;
            letter-spacing: 0.12em;
            padding: 22px 15px !important;
            border: none !important;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .premium-table tbody tr {
            transition: all 0.3s ease;
            border-bottom: 1px solid #f1f5f9;
        }

        .premium-table tbody tr:hover {
            background: rgba(16, 185, 129, 0.04) !important;
            transform: scale(0.998);
        }

        .sticky-column {
            position: sticky;
            left: 0;
            z-index: 20;
            background: white;
            box-shadow: 5px 0 15px -5px rgba(0,0,0,0.02);
        }

        .grand-total-row {
            background: #059669 !important;
            color: white !important;
            border: none !important;
        }

        .grand-total-row td {
            padding: 25px 15px !important;
            font-weight: 900;
            text-transform: uppercase;
            font-size: 11px;
            border: none !important;
        }

        .badge-mhs {
            background: #ecfdf5;
            color: #059669;
            padding: 8px 14px;
            border-radius: 12px;
            font-weight: 900;
            border: 2px solid #d1fae5;
        }

        .badge-nominal {
            background: #10b981;
            color: white;
            padding: 10px 16px;
            border-radius: 14px;
            font-weight: 900;
            box-shadow: 0 4px 10px rgba(16, 185, 129, 0.15);
            font-family: 'JetBrains Mono', monospace;
            border: 1px solid rgba(255,255,255,0.2);
        }

        .btn-modern {
            padding: 12px 24px;
            border-radius: 16px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 11px;
            border: none;
        }

        .btn-modern:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .animate-up {
            animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
    ` }} />
);

const GOLONGAN_LIST = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

class Fakultas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ''
        };
    }

    componentDidMount() {
        this.props.dispatch(rekapitulasi.fetchDataFakultas(cookies.get(cookieName)));
    }

    // Fungsi untuk menghitung total per kolom
    calculateTotal = (field) => {
        const data = this.props.data.rekapFakultas || [];
        return data.reduce((sum, item) => sum + parseInt(item[field] || 0, 10), 0);
    };

    handleSearch = (e) => {
        this.setState({ search: e.target.value });
    };

    handleExport = () => {
        const data = this.props.data.rekapFakultas || [];
        if (data.length === 0) return;

        const headers = ["Fakultas", "Total Mhs", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "Bidikmisi", "Selesai Isi", "Total UKT"];
        const csvRows = [headers.join(",")];

        data.forEach(item => {
            const row = [
                `"${item.fakultas}"`,
                item.total_mahasiswa,
                item.I, item.II, item.III, item.IV, item.V, item.VI, item.VII, item.VIII,
                item.bidikmisi,
                item.subtotal,
                item.total_ukt
            ];
            csvRows.push(row.join(","));
        });

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Rekap_Fakultas_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    render() {
        const { rekapFakultas } = this.props.data;
        const filteredData = (rekapFakultas || []).filter(item => 
            (item.fakultas || "").toLowerCase().includes(this.state.search.toLowerCase())
        );

        return (
             <div className="rekap-container min-h-screen pb-20">
                <CustomStyles />
                
                <Container fluid className="px-4 md:px-12 pt-10">
                    
                    {/* Header Section */}
                    <div className="glass-header-premium animate-up">
                        <Row className="align-items-center">
                            <Col lg="6" md="12" className="mb-4 mb-lg-0">
                                <div className="d-flex align-items-center">
                                    <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md mr-5 shadow-inner">
                                        <i className="fa fa-university text-4xl text-white"></i>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-black mb-1 tracking-tighter italic uppercase">REKAPITULASI FAKULTAS</h1>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="h-1 w-20 bg-yellow-400 rounded-full"></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Official Data Report — SIUKAT UNJ</span>
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            <Col lg="6" md="12">
                                <Row className="justify-content-lg-end align-items-center">
                                    <Col sm="12" md="auto" className="mb-3 mb-md-0">
                                        <div className="search-wrapper shadow-2xl">
                                            <InputGroup className="overflow-hidden border-0 bg-white rounded-2xl">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText className="bg-transparent border-0 text-emerald-500 pl-4 pr-0">
                                                        <i className="fa fa-search"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input 
                                                    className="py-4 border-0 font-bold placeholder:text-gray-300 text-emerald-950 focus:ring-0"
                                                    placeholder="Cari Fakultas..."
                                                    value={this.state.search}
                                                    onChange={this.handleSearch}
                                                />
                                            </InputGroup>
                                        </div>
                                    </Col>
                                    <Col sm="auto">
                                        <Button color="white" className="btn-modern bg-white text-emerald-600 shadow-xl" onClick={this.handleExport}>
                                            <i className="fa fa-file-excel-o mr-2"></i> Export CSV
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>

                    {/* Table Section */}
                    <div className="table-glass-card animate-up" style={{ animationDelay: '0.1s' }}>
                        <Table responsive hover borderless className="premium-table mb-0">
                            <thead>
                                <tr>
                                    <th rowSpan="2" className="sticky-column text-center">Fakultas</th>
                                    <th rowSpan="2" className="text-center">Total MHS</th>
                                    <th colSpan="8" className="text-center bg-emerald-800/10 border-b border-emerald-900/10">Distribusi Golongan UKT</th>
                                    <th rowSpan="2" className="text-center">Bidikmisi</th>
                                    <th rowSpan="2" className="text-center">Selesai</th>
                                    <th rowSpan="2" className="text-right pr-10">Total Nominal UKT</th>
                                </tr>
                                <tr>
                                    {GOLONGAN_LIST.map(gol => (
                                        <th key={gol} className="text-center border-l border-white/5">{gol}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-slate-800 font-bold text-[11.5px]">
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="sticky-column font-black text-emerald-950 px-6 py-5 min-w-[300px] uppercase italic tracking-tight">
                                                {item.fakultas}
                                            </td>
                                            <td className="text-center py-5">
                                                <span className="badge-mhs">{item.total_mahasiswa || 0}</span>
                                            </td>
                                            {GOLONGAN_LIST.map(gol => (
                                                <td key={gol} className="text-center py-5 text-slate-500 font-black">{item[gol] || 0}</td>
                                            ))}
                                            <td className="text-center py-5 font-black text-sky-600">{item.bidikmisi || 0}</td>
                                            <td className="text-center py-5 font-black text-amber-600 italic underline decoration-amber-400 decoration-2">{item.subtotal || 0}</td>
                                            <td className="text-right py-5 pr-10">
                                                <span className="badge-nominal">{rupiah(item.total_ukt || 0)}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={13} className="text-center py-32 opacity-30">
                                            <i className="fa fa-folder-open-o text-6xl d-block mb-4"></i>
                                            <h4 className="font-black italic">Data Fakultas Tidak Tersedia</h4>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="grand-total-row">
                                    <td className="sticky-column text-center grand-total-row shadow-2xl">GRAND TOTAL</td>
                                    <td className="text-center">
                                        <div className="bg-yellow-400 text-emerald-950 px-3 py-1.5 rounded-lg inline-block">{this.calculateTotal('total_mahasiswa')}</div>
                                    </td>
                                    {GOLONGAN_LIST.map(gol => (
                                        <td key={gol} className="text-center opacity-60 italic">{this.calculateTotal(gol)}</td>
                                    ))}
                                    <td className="text-center text-sky-300">{this.calculateTotal('bidikmisi')}</td>
                                    <td className="text-center text-amber-300">{this.calculateTotal('subtotal')}</td>
                                    <td className="text-right pr-10">
                                        <div className="text-xl font-black text-yellow-300 drop-shadow-sm">
                                            {rupiah(this.calculateTotal('total_ukt'))}
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>
                    </div>

                </Container>
            </div>
        );
    }
}

export default connect((store) => ({
    data: store.rekapitulasi
}))(Fakultas);