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


const GOLONGAN_LIST = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

class Fakultas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            isModalOpen: false,
            selectedYear: "",
            selectedJalur: "" // All
        };
    }

    toggleModal = () => {
        this.setState({ isModalOpen: !this.state.isModalOpen });
    }

    componentDidMount() {
        // Initial state doesn't fetch until Year is selected, or keep default if you wish.
        // Based on request: user must select year first.
    }

    handleFilterChange = (field, value) => {
        this.setState({ [field]: value }, () => {
            const { selectedYear, selectedJalur } = this.state;

            if (selectedYear) {
                if (selectedYear === "2026") {
                    this.props.dispatch(rekapitulasi.fetchDataFakultas(cookies.get(cookieName), selectedYear, selectedJalur));
                } else {
                    this.toggleModal(`Rekapitulasi Tahun ${selectedYear}`);
                    // Optional: clear data or keep old data
                }
            }
        });
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

        const headers = ["Fakultas", "Total Mhs", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "KIPK", "Selesai Isi", "Total UKT"];
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
            <div className="min-h-screen pb-20 bg-slate-50 font-['Inter']">

                <Container fluid className="px-4 md:px-12 pt-10">

                    {/* Header Section */}
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-[24px] p-10 text-white shadow-[0_20px_40px_-10px_rgba(16,185,129,0.2)] mb-[-40px] relative z-10">
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
                                    <Col sm="12" md="auto" className="mb-3 mb-md-0 d-flex gap-3 align-items-center">
                                        <div className="search-wrapper shadow-2xl flex-grow-1">
                                            <InputGroup className="overflow-hidden border-0 bg-white rounded-full !h-[48px]">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText className="!h-[48px] bg-transparent border-0 text-emerald-500 pl-4 pr-0">
                                                        <i className="fa fa-search"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input 
                                                    className="!h-[48px] border-0 font-bold placeholder:text-gray-300 text-emerald-950 focus:ring-0 text-center placeholder:text-center"
                                                    placeholder="Cari Fakultas..."
                                                    value={this.state.search}
                                                    onChange={this.handleSearch}
                                                />
                                            </InputGroup>
                                        </div>

                                        {/* Dual Dropdown Filter (Tahun & Jalur) - Premium Pill Style */}
                                        <div className="flex items-center !h-[48px] bg-white rounded-full shadow-xl border border-emerald-100 overflow-hidden">
                                            {/* Select Tahun */}
                                            <select 
                                                value={this.state.selectedYear}
                                                onChange={(e) => this.handleFilterChange('selectedYear', e.target.value)}
                                                className="!h-[48px] bg-white text-emerald-900 text-[10px] font-black uppercase tracking-widest px-6 border-0 outline-none cursor-pointer hover:bg-emerald-50 transition-colors"
                                            >
                                                <option value="" disabled>Pilih Tahun</option>
                                                <option value="2026">2026</option>
                                                <option value="2027">2027</option>
                                                <option value="2028">2028</option>
                                                <option value="2029">2029</option>
                                                <option value="2030">2030</option>
                                            </select>

                                            {/* Select Jalur */}
                                            <select 
                                                value={this.state.selectedJalur}
                                                onChange={(e) => this.handleFilterChange('selectedJalur', e.target.value)}
                                                disabled={!this.state.selectedYear}
                                                className="!h-[48px] bg-white text-emerald-900 text-[10px] font-black uppercase tracking-widest px-8 border-0 outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-50 transition-colors border-l border-emerald-100"
                                            >
                                                <option value="">All Jalur</option>
                                                <option value="1">SNBP</option>
                                                <option value="2">SNBT</option>
                                                <option value="3">MANDIRI</option>
                                            </select>
                                        </div>
                                    </Col>
                                    <Col sm="auto">
                                        <Button color="white" className="!h-[48px] px-7 font-[800] uppercase tracking-wider transition-all duration-300 text-[11px] border-none hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg bg-white text-emerald-600 rounded-full shadow-xl" onClick={this.handleExport}>
                                            <i className="fa fa-file-excel-o mr-2"></i> Export CSV
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white/70 backdrop-blur-2xl border border-emerald-500/10 rounded-[32px] shadow-[0_25px_50px_-12px_rgba(16,185,129,0.08)] overflow-hidden pt-[50px]">
                        <Table responsive hover borderless className="premium-table mb-0 w-full">
                            <thead>
                                <tr className="bg-emerald-500">
                                    <th rowSpan="2" className="sticky left-0 z-20 bg-emerald-500 text-white font-[900] uppercase text-[10.5px] tracking-[0.12em] py-2 px-[15px] border-none shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-center border-r-[0.5px] border-white/10">Fakultas</th>
                                    <th rowSpan="2" className="bg-emerald-500 text-white font-[900] uppercase text-[10.5px] tracking-[0.12em] py-2 px-[15px] border-none shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-center">Total MHS</th>
                                    <th colSpan="8" className="bg-emerald-600/20 text-white font-[900] uppercase text-[10.5px] tracking-[0.12em] py-2 px-[15px] border-none shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-center">Distribusi Golongan UKT</th>
                                    <th rowSpan="2" className="bg-emerald-500 text-white font-[900] uppercase text-[10.5px] tracking-[0.12em] py-2 px-[15px] border-none shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-center">KIPK</th>
                                    <th rowSpan="2" className="bg-emerald-500 text-white font-[900] uppercase text-[10.5px] tracking-[0.12em] py-2 px-[15px] border-none shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-center">Selesai</th>
                                    <th rowSpan="2" className="bg-emerald-500 text-white font-[900] uppercase text-[10.5px] tracking-[0.12em] py-2 px-[15px] border-none shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-center">Total Nominal UKT</th>
                                </tr>
                                <tr className="bg-emerald-500">
                                    {GOLONGAN_LIST.map(gol => (
                                        <th key={gol} className="bg-emerald-500 text-white font-[900] uppercase text-[10.5px] tracking-[0.12em] py-2 border-none shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-center border-l border-white/5">{gol}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-slate-800 font-bold text-[11.5px]">
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, idx) => (
                                        <tr key={idx} className="transition-all duration-300 border-b border-slate-100 hover:bg-emerald-500/5 hover:scale-[0.998]">
                                            <td className="sticky left-0 z-20 bg-white shadow-[5px_0_15px_-5px_rgba(0,0,0,0.02)] text-center font-black text-emerald-950 px-6 py-5 min-w-[300px] uppercase italic tracking-tight border-r border-slate-50">
                                                {item.fakultas}
                                            </td>
                                            <td className="text-center py-5">
                                                <span className="bg-[#ecfdf5] color-[#059669] px-3.5 py-2 rounded-xl font-black border-2 border-[#d1fae5]">{item.total_mahasiswa || 0}</span>
                                            </td>
                                            {GOLONGAN_LIST.map(gol => (
                                                <td key={gol} className="text-center py-5 text-slate-500 font-black">{item[gol] || 0}</td>
                                            ))}
                                            <td className="text-center py-5 font-black text-sky-600">{item.bidikmisi || 0}</td>
                                            <td className="text-center py-5 font-black text-amber-600 italic underline decoration-amber-400 decoration-2">{item.subtotal || 0}</td>
                                            <td className="text-center py-5">
                                                <span className="bg-[#10b981] text-white px-4 py-2.5 rounded-[14px] font-black shadow-[0_4px_10px_rgba(16,185,129,0.15)] font-mono border border-white/20 text-[11px]">{rupiah(item.total_ukt || 0)}</span>
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
                                <tr className="bg-emerald-600 text-white border-none">
                                    <td className="sticky left-0 z-20 bg-emerald-600 text-white font-[900] uppercase text-[11px] p-[25px_15px] border-none text-center shadow-2xl">GRAND TOTAL</td>
                                    <td className="text-center p-[25px_15px] font-[900] uppercase text-[11px] border-none">
                                        <div className="bg-yellow-400 text-emerald-950 px-3 py-1.5 rounded-lg inline-block">{this.calculateTotal('total_mahasiswa')}</div>
                                    </td>
                                    {GOLONGAN_LIST.map(gol => (
                                        <td key={gol} className="text-center opacity-60 italic">{this.calculateTotal(gol)}</td>
                                    ))}
                                    <td className="text-center text-sky-300">{this.calculateTotal('bidikmisi')}</td>
                                    <td className="text-center text-amber-300">{this.calculateTotal('subtotal')}</td>
                                    <td className="text-center">
                                        <div className="text-xl font-black text-yellow-300 drop-shadow-sm">
                                            {rupiah(this.calculateTotal('total_ukt'))}
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>
                    </div>

                </Container>

                {/* Modal Coming Soon */}
                {this.state.isModalOpen && (
                    <FormModal
                        title="Filter Jalur UKT"
                        onClose={this.toggleModal}
                    />
                )}
            </div>
        );
    }
}

const FormModal = ({ onClose, title }) => (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-emerald-900/40 backdrop-blur-md animate-fadeIn">
        <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden border border-emerald-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-400 p-8 flex justify-between items-center text-white">
                <div>
                    <h3 className="font-black uppercase tracking-widest text-base">{title || "Sistem Report"}</h3>
                    <p className="text-[10px] opacity-80 mt-1 font-bold italic uppercase tracking-widest">Rekapitulasi Analytics</p>
                </div>
                <button onClick={onClose} className="hover:bg-white/20 p-2.5 rounded-2xl transition-all active:scale-90 bg-black/5">
                    <i className="fa fa-times text-xl"></i>
                </button>
            </div>

            {/* Modal Body: Coming Soon State */}
            <div className="p-12 text-center space-y-6">
                <div className="relative inline-block">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <i className="fa fa-filter text-4xl text-emerald-500"></i>
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-xl font-black text-emerald-900 uppercase italic">Coming Soon</h4>
                    <p className="text-sm text-emerald-700/60 font-medium leading-relaxed px-5">
                        Data rekapitulasi untuk periode yang Anda pilih sedang dalam tahap sinkronisasi server. Mohon tunggu update selanjutnya bro!
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
}))(Fakultas);