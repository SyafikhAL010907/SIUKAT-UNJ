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
import { exportRekapExcel } from '../../../utils/exportExcel';

const GOLONGAN_LIST = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];


class ProgramStudi extends React.Component {
    state = {
        search: '',
        isModalOpen: false,
        selectedYear: "",
        selectedJalur: "" // All
    };

    componentDidMount() {
        // Initial state doesn't fetch until Year is selected
    }

    handleFilterChange = (field, value) => {
        this.setState({ [field]: value }, () => {
            const { selectedYear, selectedJalur } = this.state;
            const token = cookies.get(cookieName);
            
            if (selectedYear) {
                if (selectedYear === "2026") {
                    this.props.dispatch(rekapitulasi.fetchDataProdi(token, selectedYear, selectedJalur));
                } else {
                    this.toggleModal(`Rekapitulasi Tahun ${selectedYear}`);
                }
            }
        });
    }

    toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });
    handleSearch = (e) => this.setState({ search: e.target.value });

    handleExport = () => {
        if (!this.state.selectedYear) {
            return swal("Peringatan!", "Pilih Tahun dulu broo sebelum export!", "info");
        }
        const { rekapProdi = [] } = this.props.data;
        if (!rekapProdi.length) {
            return swal("Waduh!", "Data rekapitulasi masih kosong, gak ada yang bisa diexport broo!", "warning");
        }

        const totals = {
            total_mahasiswa: this.calculateGrandTotal('total_mahasiswa'),
            I: this.calculateGrandTotal('I'),
            II: this.calculateGrandTotal('II'),
            III: this.calculateGrandTotal('III'),
            IV: this.calculateGrandTotal('IV'),
            V: this.calculateGrandTotal('V'),
            VI: this.calculateGrandTotal('VI'),
            VII: this.calculateGrandTotal('VII'),
            VIII: this.calculateGrandTotal('VIII'),
            bidikmisi: this.calculateGrandTotal('bidikmisi'),
            subtotal: this.calculateGrandTotal('subtotal'),
            total_ukt: this.calculateGrandTotal('total_ukt'),
        };

        exportRekapExcel('program studi', rekapProdi, totals);
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
                                        <div className="search-wrapper shadow-2xl flex-grow-1">
                                           <InputGroup className="overflow-hidden border-0 bg-white rounded-full !h-[48px]">
                                               <InputGroupAddon addonType="prepend">
                                                   <InputGroupText className="!h-[48px] bg-transparent border-0 text-emerald-500 pl-4 pr-0">
                                                       <i className="fa fa-search"></i>
                                                   </InputGroupText>
                                               </InputGroupAddon>
                                               <Input 
                                                   className="!h-[48px] border-0 font-bold placeholder:text-gray-300 text-emerald-950 focus:ring-0 text-center placeholder:text-center"
                                                   placeholder="Cari Program Studi..."
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

                                    <Col sm="auto" className="d-flex gap-3 mt-3 mt-sm-0">
                                        <Button color="white" className="!h-[48px] px-7 font-[800] uppercase tracking-wider transition-all duration-300 text-[11px] border-none hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg bg-white text-emerald-600 rounded-full shadow-xl w-100 w-md-auto" onClick={this.handleExport}>
                                            <i className="fa fa-file-excel-o mr-2"></i> Export Excel
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
                                    <th rowSpan="2" className="sticky left-0 z-20 bg-emerald-500 text-white font-[900] uppercase text-[10.5px] tracking-[0.12em] py-2 px-[15px] border-none shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-center border-r-[0.5px] border-white/10">Program Studi</th>
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
                                                {item.prodi}
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
                                            <i className="fa fa-folder-open-o text-6xl mb-4 d-block"></i>
                                            <h4 className="font-black">Data Tidak Tersedia</h4>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="bg-emerald-600 text-white border-none">
                                    <td className="sticky left-0 z-20 bg-emerald-600 text-white font-[900] uppercase text-[11px] p-[25px_15px] border-none text-center shadow-2xl">GRAND TOTAL</td>
                                    <td className="text-center p-[25px_15px] font-[900] uppercase text-[11px] border-none">
                                        <div className="bg-yellow-400 text-emerald-950 px-3 py-1.5 rounded-lg inline-block">{this.calculateGrandTotal('total_mahasiswa')}</div>
                                    </td>
                                    {GOLONGAN_LIST.map(gol => (
                                        <td key={gol} className="text-center opacity-60 italic">{this.calculateGrandTotal(gol)}</td>
                                    ))}
                                    <td className="text-center text-sky-300">{this.calculateGrandTotal('bidikmisi')}</td>
                                    <td className="text-center text-amber-300">{this.calculateGrandTotal('subtotal')}</td>
                                    <td className="text-center">
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
}))(ProgramStudi);