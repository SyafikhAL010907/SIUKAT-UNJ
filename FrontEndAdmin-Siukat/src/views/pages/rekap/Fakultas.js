import React from 'react';
import { connect } from 'react-redux';
import { rekapitulasi } from "../../../actions";
import { cookies, cookieName, rupiah } from "../../../global";

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

    render() {
        const { rekapFakultas } = this.props.data;
        const filteredData = (rekapFakultas || []).filter(item => 
            item.fakultas.toLowerCase().includes(this.state.search.toLowerCase())
        );

        return (
            <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
                <div className="max-w-full mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight italic uppercase">
                                <span className="border-l-4 border-green-600 pl-3">Rekapitulasi Fakultas</span>
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Sistem Informasi UKT - Universitas Negeri Jakarta</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <i className="fa fa-search"></i>
                                </span>
                                <input 
                                    type="text"
                                    placeholder="Cari Fakultas..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm w-full md:w-64"
                                    onChange={this.handleSearch}
                                />
                            </div>
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition shadow-sm">
                                <i className="fa fa-file-excel-o mr-2"></i> EXPORT CSV
                            </button>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-[11px] md:text-xs text-left border-collapse">
                                <thead>
                                    <tr className="bg-green-600 text-white uppercase tracking-wider">
                                        <th rowSpan="2" className="px-4 py-4 border-r border-green-500 font-bold text-center">Fakultas</th>
                                        <th rowSpan="2" className="px-4 py-4 border-r border-green-500 font-bold text-center">Total Mhs</th>
                                        <th colSpan="8" className="px-4 py-2 border-b border-green-500 font-bold text-center">Golongan UKT</th>
                                        <th rowSpan="2" className="px-4 py-4 border-r border-l border-green-500 font-bold text-center">Bidikmisi</th>
                                        <th rowSpan="2" className="px-4 py-4 border-r border-green-500 font-bold text-center">Selesai Isi</th>
                                        <th rowSpan="2" className="px-4 py-4 font-bold text-center">Total UKT</th>
                                    </tr>
                                    <tr className="bg-green-700 text-white text-[10px]">
                                        <th className="px-2 py-2 text-center border-r border-green-600">I</th>
                                        <th className="px-2 py-2 text-center border-r border-green-600">II</th>
                                        <th className="px-2 py-2 text-center border-r border-green-600">III</th>
                                        <th className="px-2 py-2 text-center border-r border-green-600">IV</th>
                                        <th className="px-2 py-2 text-center border-r border-green-600">V</th>
                                        <th className="px-2 py-2 text-center border-r border-green-600">VI</th>
                                        <th className="px-2 py-2 text-center border-r border-green-600">VII</th>
                                        <th className="px-2 py-2 text-center">VIII</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredData.length > 0 ? filteredData.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-green-50 transition-colors">
                                            <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50/50">{item.fakultas}</td>
                                            <td className="px-4 py-3 text-center font-mono">{item.total_mahasiswa}</td>
                                            <td className="px-2 py-3 text-center border-l">{item.I}</td>
                                            <td className="px-2 py-3 text-center">{item.II}</td>
                                            <td className="px-2 py-3 text-center">{item.III}</td>
                                            <td className="px-2 py-3 text-center">{item.IV}</td>
                                            <td className="px-2 py-3 text-center">{item.V}</td>
                                            <td className="px-2 py-3 text-center">{item.VI}</td>
                                            <td className="px-2 py-3 text-center">{item.VII}</td>
                                            <td className="px-2 py-3 text-center border-r">{item.VIII}</td>
                                            <td className="px-4 py-3 text-center bg-blue-50/50 font-bold text-blue-700">{item.bidikmisi}</td>
                                            <td className="px-4 py-3 text-center">{item.subtotal}</td>
                                            <td className="px-4 py-3 text-right font-bold text-green-700 bg-yellow-50/30">
                                                {rupiah(item.total_ukt)}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="13" className="px-4 py-10 text-center text-gray-400 italic">Data tidak ditemukan...</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-100 font-bold text-gray-800 border-t-2 border-gray-300">
                                        <td className="px-4 py-4 text-right uppercase tracking-widest text-[10px]">Grand Total</td>
                                        <td className="px-4 py-4 text-center bg-gray-200/50">{this.calculateTotal('total_mahasiswa')}</td>
                                        <td className="px-2 py-4 text-center">{this.calculateTotal('I')}</td>
                                        <td className="px-2 py-4 text-center">{this.calculateTotal('II')}</td>
                                        <td className="px-2 py-4 text-center">{this.calculateTotal('III')}</td>
                                        <td className="px-2 py-4 text-center">{this.calculateTotal('IV')}</td>
                                        <td className="px-2 py-4 text-center">{this.calculateTotal('V')}</td>
                                        <td className="px-2 py-4 text-center">{this.calculateTotal('VI')}</td>
                                        <td className="px-2 py-4 text-center">{this.calculateTotal('VII')}</td>
                                        <td className="px-2 py-4 text-center border-r">{this.calculateTotal('VIII')}</td>
                                        <td className="px-4 py-4 text-center text-blue-700 bg-blue-100/50">{this.calculateTotal('bidikmisi')}</td>
                                        <td className="px-4 py-4 text-center">{this.calculateTotal('subtotal')}</td>
                                        <td className="px-4 py-4 text-right text-green-800 bg-yellow-100/50">
                                            {rupiah(this.calculateTotal('total_ukt'))}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect((store) => ({
    data: store.rekapitulasi
}))(Fakultas);