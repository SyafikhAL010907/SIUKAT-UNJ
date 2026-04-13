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
    InputGroupText,
    Card,
    CardBody
} from 'reactstrap';
import { rekapitulasi } from "../../../actions";
import { cookies, cookieName, rupiah } from "../../../global";

const GOLONGAN_LIST = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

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
            padding: 12px 28px;
            border-radius: 9999px !important; /* Force Pill Shape */
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

        /* Essential Targeting for Search Bar Lonjong */
        .search-wrapper, 
        .search-wrapper .input-group, 
        .search-wrapper .input-group-text, 
        .search-wrapper input {
            border-radius: 9999px !important;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .animate-up {
            animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .jalur-select {
            min-width: 160px;
            height: 48px; 
            padding: 0 40px 0 20px;
            background: white url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 1rem center/12px 12px;
            border: 0;
            border-radius: 9999px !important; /* Force Pill Shape */
            font-weight: 800;
            color: #064e3b;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            cursor: pointer;
            transition: all 0.3s ease;
            appearance: none;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); /* Subtle shadow for depth */
        }
        .jalur-select:hover {
            transform: translateY(-2px);
        }
        .jalur-select:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }
    ` }} />
);

class ProgramStudi extends React.Component {
    state = {
        search: '',
        isModalOpen: false
    };

    componentDidMount() {
        const token = cookies.get(cookieName);
        this.props.dispatch(rekapitulasi.fetchDataProdi(token));
    }

    toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });
    handleSearch = (e) => this.setState({ search: e.target.value });

    handleExport = () => {
        const data = this.props.data.rekapProdi || [];
        if (!data.length) return;

        const headers = ['Program Studi', 'Total Mhs', ...GOLONGAN_LIST, 'Bidikmisi', 'Selesai', 'Total Nominal UKT'];
        const rows = data.map(item => [
            item.prodi || '-',
            item.total_mahasiswa || 0,
            ...GOLONGAN_LIST.map(g => item[g] || 0),
            item.bidikmisi || 0,
            item.subtotal || 0,
            item.total_ukt || 0
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(v => `"${v}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Rekap_Program_Studi_SIUKAT.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    getFilteredData = () => {
        const { rekapProdi = [] } = this.props.data;
        return rekapProdi.filter(item =>
            (item.prodi || "").toLowerCase().includes(this.state.search.toLowerCase())
        );
    };

    calculateGrandTotal = (field) => {
        const data = this.props.data.rekapProdi || [];
        return data.reduce((sum, item) => sum + parseInt(item[field] || 0, 10), 0);
    };

    render() {
        const filteredData = this.getFilteredData();

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
                                        <h1 className="text-3xl md:text-4xl font-black mb-1 tracking-tighter italic">REKAPITULASI PROGRAM STUDI</h1>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="h-1 w-20 bg-yellow-400 rounded-full"></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Official Data Report — SIUKAT UNJ</span>
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            <Col lg="6" md="12">
                                <Row className="justify-content-lg-end align-items-center">                                    <Col sm="12" md="auto" className="mb-3 mb-md-0 d-flex gap-3 align-items-center">
                                        <div className="search-wrapper shadow-2xl flex-grow-1 rounded-full">
                                            <InputGroup className="overflow-hidden border-0 bg-white rounded-full">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText className="bg-transparent border-0 text-emerald-500 pl-4 pr-0">
                                                        <i className="fa fa-search"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input 
                                                    className="py-4 border-0 font-bold placeholder:text-gray-300 text-emerald-950 focus:ring-0"
                                                    placeholder="Cari Program Studi..."
                                                    value={this.state.search}
                                                    onChange={this.handleSearch}
                                                />
                                            </InputGroup>
                                        </div>

                                        {/* Dropdown Jalur (Dummy) */}
                                        <div className="shadow-2xl rounded-full">
                                            <select 
                                                className="jalur-select"
                                                onChange={(e) => e.target.value !== "All" && this.toggleModal()}
                                            >
                                                <option value="All">All Jalur</option>
                                                <option value="SNBP">SNBP</option>
                                                <option value="SNBT">SNBT</option>
                                                <option value="MANDIRI">MANDIRI</option>
                                            </select>
                                        </div>
                                    </Col>

                                    <Col sm="auto" className="d-flex gap-3 mt-3 mt-sm-0">
                                        <Button color="white" className="btn-modern bg-white text-emerald-600 shadow-xl w-100 w-md-auto rounded-full" onClick={this.handleExport}>
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
                                    <th rowSpan="2" className="sticky-column text-center">Program Studi</th>
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
                                                {item.prodi}
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
                                            <i className="fa fa-folder-open-o text-6xl mb-4 d-block"></i>
                                            <h4 className="font-black">Data Tidak Tersedia</h4>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="grand-total-row">
                                    <td className="sticky-column text-center grand-total-row shadow-2xl">GRAND TOTAL</td>
                                    <td className="text-center">
                                        <div className="bg-yellow-400 text-emerald-950 px-3 py-1.5 rounded-lg inline-block">{this.calculateGrandTotal('total_mahasiswa')}</div>
                                    </td>
                                    {GOLONGAN_LIST.map(gol => (
                                        <td key={gol} className="text-center opacity-60 italic">{this.calculateGrandTotal(gol)}</td>
                                    ))}
                                    <td className="text-center text-sky-300">{this.calculateGrandTotal('bidikmisi')}</td>
                                    <td className="text-center text-amber-300">{this.calculateGrandTotal('subtotal')}</td>
                                    <td className="text-right pr-10">
                                        <div className="text-xl font-black text-yellow-300 drop-shadow-sm">
                                            {rupiah(this.calculateGrandTotal('total_ukt'))}
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>
                    </div>

                </Container>

                {this.state.isModalOpen && <FormModal onClose={this.toggleModal} />}
            </div>
        );
    }
}
const FormModal = ({ onClose }) => (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-emerald-900/40 backdrop-blur-md animate-fadeIn">
        <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden border border-emerald-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-400 p-8 flex justify-between items-center text-white">
                <div>
                    <h3 className="font-black uppercase tracking-widest text-base">Sistem Report</h3>
                    <p className="text-[10px] opacity-80 mt-1 font-bold italic uppercase tracking-widest">Analytics Dashboard</p>
                </div>
                <button onClick={onClose} className="hover:bg-white/20 p-2.5 rounded-2xl transition-all active:scale-90 bg-black/5">
                    <i className="fa fa-times text-xl"></i>
                </button>
            </div>

            {/* Modal Body: Coming Soon State */}
            <div className="p-12 text-center space-y-6">
                <div className="relative inline-block">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <i className="fa fa-sliders text-4xl text-emerald-500"></i>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h4 className="text-xl font-black text-emerald-900 uppercase italic">Under Development</h4>
                    <p className="text-sm text-emerald-700/60 font-medium leading-relaxed px-5">
                        Fitur filter jalur dan manajemen data prodi sedang dalam tahap integrasi database. Mohon tunggu update selanjutnya bro!
                    </p>
                </div>

                <div className="pt-4">
                    <button 
                        onClick={onClose}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl text-xs shadow-xl shadow-emerald-600/20 tracking-[0.2em] transition-all active:scale-95 uppercase"
                    >
                        MENGERTI
                    </button>
                </div>
            </div>

            {/* Modal Footer Decorative */}
            <div className="bg-emerald-50/50 p-4 text-center">
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">
                    Powered by SIUKAT-UNJ — 2026 Admin Panel
                </p>
            </div>
        </div>
    </div>
);



export default connect((store) => ({
    data: store.rekapitulasi
}))(ProgramStudi);