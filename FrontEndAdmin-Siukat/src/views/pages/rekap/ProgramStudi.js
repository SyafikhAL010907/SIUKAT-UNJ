import React from 'react';
import { connect } from 'react-redux';
import { rekapitulasi } from "../../../actions";
import { cookies, cookieName, rupiah } from "../../../global";

const GOLONGAN_LIST = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

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
            <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans">
                <div className="max-w-full mx-auto">
                    
                    <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div className="border-l-4 border-green-600 pl-4">
                            <h2 className="text-2xl font-black text-gray-800 tracking-tight uppercase italic">
                                Rekapitulasi Program Studi
                            </h2>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Sistem Informasi UKT — UNJ</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <SearchInput value={this.state.search} onChange={this.handleSearch} />
                            <ExportButton onClick={this.handleExport} />
                            <AddButton onClick={this.toggleModal} />
                        </div>
                    </header>

                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            {/* FIX: Gunakan table-fixed jika perlu, tapi min-w wajib agar tidak berhimpitan */}
                            <table className="w-full text-left border-collapse min-w-[1200px]">
                                <thead>
                                    <tr className="bg-green-600 text-white uppercase text-[10px] tracking-wider">
                                        <th rowSpan="2" className="px-4 py-5 border-r border-green-500 text-center sticky left-0 bg-green-600 z-20 min-w-[250px]">Program Studi</th>
                                        <th rowSpan="2" className="px-2 py-5 border-r border-green-500 text-center w-20">Total Mhs</th>
                                        <th colSpan="8" className="px-4 py-3 border-b border-green-500 text-center bg-green-700/40">Distribusi Golongan UKT</th>
                                        <th rowSpan="2" className="px-2 py-5 border-x border-green-500 text-center w-24">Bidikmisi</th>
                                        <th rowSpan="2" className="px-2 py-5 border-r border-green-500 text-center text-yellow-200 w-24">Selesai</th>
                                        <th rowSpan="2" className="px-4 py-5 text-center min-w-[160px]">Total Nominal UKT</th>
                                    </tr>
                                    <tr className="bg-green-700 text-white text-[9px]">
                                        {GOLONGAN_LIST.map(gol => (
                                            <th key={gol} className="px-2 py-3 text-center border-r border-green-600/30 w-12">{gol}</th>
                                        ))}
                                    </tr>
                                </thead>
                                
                                <tbody className="divide-y divide-gray-100 text-[11px]">
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item, idx) => (
                                            <DataRow key={idx} item={item} />
                                        ))
                                    ) : (
                                        <EmptyState colSpan={13} />
                                    )}
                                </tbody>

                                <tfoot className="bg-gray-900 text-white font-bold uppercase text-[10px]">
                                    <tr>
                                        <td className="px-4 py-4 text-center sticky left-0 bg-gray-900 border-r border-gray-800">Grand Total</td>
                                        <td className="px-2 py-4 text-center border-r border-gray-800">{this.calculateGrandTotal('total_mahasiswa')}</td>
                                        {GOLONGAN_LIST.map(gol => (
                                            <td key={gol} className="px-2 py-4 text-center border-r border-gray-800/50">{this.calculateGrandTotal(gol)}</td>
                                        ))}
                                        <td className="px-2 py-4 text-center border-r border-gray-800 text-blue-400">{this.calculateGrandTotal('bidikmisi')}</td>
                                        <td className="px-2 py-4 text-center border-r border-gray-800 text-yellow-400">{this.calculateGrandTotal('subtotal')}</td>
                                        <td className="px-4 py-4 text-right bg-black text-green-400">
                                            {rupiah(this.calculateGrandTotal('total_ukt'))}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                {this.state.isModalOpen && <FormModal onClose={this.toggleModal} />}
            </div>
        );
    }
}

const DataRow = ({ item }) => (
    <tr className="hover:bg-green-50 transition-colors group border-b border-gray-100">
        {/* 1. Program Studi */}
        <td className="px-4 py-3 font-bold text-gray-700 border-r bg-white group-hover:bg-green-50 sticky left-0 z-10 uppercase whitespace-normal">
            {item.prodi}
        </td>
        
        {/* 2. Total Mahasiswa */}
        <td className="px-2 py-3 text-center font-mono text-gray-500 border-r border-gray-100">
            {item.total_mahasiswa || 0}
        </td>

        {/* 3-10. Kolom Golongan (I - VIII) */}
        {GOLONGAN_LIST.map(gol => (
            <td key={gol} className="px-2 py-3 text-center text-gray-600 border-r border-gray-100/50 italic">
                {item[gol] || 0}
            </td>
        ))}

        {/* 11. Bidikmisi */}
        <td className="px-2 py-3 text-center font-bold text-blue-600 bg-blue-50/20 border-r border-gray-100">
            {item.bidikmisi || 0}
        </td>

        {/* 12. Selesai (Subtotal) */}
        <td className="px-2 py-3 text-center font-medium text-orange-600 border-r border-gray-100">
            {item.subtotal || 0}
        </td>

        {/* 13. Total Nominal */}
        <td className="px-4 py-3 text-right font-bold text-green-700 bg-green-50/20">
            {rupiah(item.total_ukt || 0)}
        </td>
    </tr>
);

// ... (Komponen SearchInput, AddButton, EmptyState, FormModal tetap sama seperti sebelumnya)

const SearchInput = ({ value, onChange }) => (
    <div className="relative group">
        <input 
            type="text"
            value={value}
            onChange={onChange}
            placeholder="Cari Prodi..."
            className="pl-4 pr-10 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none text-sm w-full md:w-72 transition-all shadow-sm"
        />
        <div className="absolute right-3 top-2.5 text-gray-400 group-focus-within:text-green-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
    </div>
);

const AddButton = ({ onClick }) => (
    <button 
        onClick={onClick}
        className="bg-green-600 hover:bg-green-700 active:scale-95 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-green-600/20"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
    </button>
);

const ExportButton = ({ onClick }) => (
    <button
        onClick={onClick}
        title="Export CSV"
        className="flex items-center gap-2 px-4 py-2.5 bg-white text-green-700 border-2 border-green-200 hover:border-green-500 hover:bg-green-50 active:scale-95 rounded-xl font-bold text-sm transition-all shadow-sm"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export
    </button>
);

const EmptyState = ({ colSpan }) => (
    <tr>
        <td colSpan={colSpan} className="px-4 py-20 text-center">
            <div className="flex flex-col items-center opacity-30 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-bold">Data Program Studi Tidak Ditemukan</p>
            </div>
        </td>
    </tr>
);

const FormModal = ({ onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-green-600 p-5 flex justify-between items-center text-white">
                <h3 className="font-black uppercase tracking-widest text-sm">Update Data Prodi</h3>
                <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="p-8 space-y-5">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Pengguna</label>
                    <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-3 text-sm focus:border-green-500 outline-none transition-all" placeholder="Input username..." />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role Akses</label>
                    <select className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-3 text-sm focus:border-green-500 outline-none transition-all">
                        <option>Operator</option>
                        <option>Validator</option>
                        <option>Developer</option>
                    </select>
                </div>
                <div className="pt-6 flex gap-3">
                    <button onClick={onClose} className="flex-1 text-gray-400 font-bold py-3 text-sm hover:text-gray-600 transition-colors italic">BATAL</button>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-2xl text-sm shadow-lg shadow-green-600/30 tracking-widest transition-all">SIMPAN</button>
                </div>
            </div>
        </div>
    </div>
);

export default connect((store) => ({
    data: store.rekapitulasi
}))(ProgramStudi);