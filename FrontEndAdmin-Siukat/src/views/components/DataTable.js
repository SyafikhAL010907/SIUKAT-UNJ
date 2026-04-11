import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import axios from 'axios'
import { cookies, cookieName, service } from '../../global'

class DataTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalOpen: false,
            selectedId: null,
            isLoading: false,
            errorMsg: null
        }
    }

    toggleModal = (id = null) => {
        this.setState({
            modalOpen: !this.state.modalOpen,
            selectedId: id
        })
    }

    handleConfirm = async () => {
        const { selectedId } = this.state
        const { data: allData } = this.props
        
        // Cek apakah siswa ini sudah punya row sanggah (buat validasi alert reset)
        const hasSanggah = Array.isArray(allData) && allData.some(m => m.no_peserta === selectedId && m.atribut === 'sanggah');

        if (hasSanggah) {
            const confirmReset = window.confirm(
                "⚠️ PERHATIAN: Mahasiswa ini sudah memiliki data Sanggah/Klarifikasi.\n\n" +
                "Jika Anda melanjutkan, data sanggah yang lama (termasuk foto & detail) akan DIHAPUS dan " +
                "digantikan dengan salinan baru dari Master Data.\n\n" +
                "Apakah Anda yakin ingin melakukan RESET DATA SANGGAH?"
            );
            
            if (!confirmReset) return; // Batal
        }

        this.setState({ isLoading: true, errorMsg: null })
        try {
            const token = cookies.get(cookieName)
            await axios.put(
                `${service}/cmahasiswa/flag-klarifikasi-admin/${selectedId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
            this.setState({ isLoading: false })
            this.toggleModal()
            this.props.history.push({
                pathname: `/admin/peserta/${selectedId}`,
                state: { modeEdit: true }
            })
        } catch (err) {
            const msg = err?.response?.data?.error || 'Gagal memproses klarifikasi'
            this.setState({ isLoading: false, errorMsg: msg })
        }
    }

    renderColumns() {
        return Object.entries(this.props.columns).map((data, key) => (
            <th key={key} className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                {data[1]}
            </th>
        ))
    }

    renderValues(values) {
        return Object.entries(this.props.columns).map((data, key) => {
            const isLast = key === Object.entries(this.props.columns).length - 1;
            const columnKey = data[0];
            
            if (columnKey === 'aksi' || isLast) {
                if (values[columnKey] && React.isValidElement(values[columnKey])) {
                    return (
                        <td key={key} className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {values[columnKey]}
                        </td>
                    )
                }

                const pk = this.props.primaryKey;
                const id = values[pk] || values[Object.keys(values).find(k => k.toLowerCase() === pk.toLowerCase())] || "undefined";

                return (
                    <td key={key} className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {/* Tombol Lihat */}
                        <Link 
                            to={"/admin/peserta/" + id} 
                            className="inline-flex items-center px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded transition-colors shadow-sm"
                        >
                            <i className="fa fa-eye mr-1"></i> Lihat
                        </Link>

                        {/* Tombol Sanggah */}
                        <button
                            onClick={() => this.toggleModal(id)}
                            className="inline-flex items-center px-3 py-1 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white border border-orange-200 text-xs font-bold rounded transition-all shadow-sm"
                        >
                            <i className="fa fa-pencil-square-o mr-1"></i> Sanggah
                        </button>
                    </td>
                )
            } else {
                let keys = columnKey.split(".")
                let val = (keys.length > 1) ? (values[keys[0]] ? values[keys[0]][keys[1]] : "") : values[columnKey]
                return (
                    <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {val}
                    </td>
                )
            }
        })
    }

    renderList() {
        return Array.isArray(this.props.data) ? this.props.data.map((data, key) => (
            <tr key={key} className="hover:bg-emerald-50 transition-colors border-b border-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-800 bg-gray-50/50">
                    {((parseInt(this.props.currentPage) - 1) * parseInt(this.props.perPage)) + (key + 1)}
                </td>
                {this.renderValues(data)}
            </tr>
        )) : null
    }

    renderPagination() {
        let items = [];
        let currentPage = parseInt(this.props.currentPage, 10);
        let totalPages = parseInt(this.props.totalPages, 10);

        const btnClass = "relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ";
        const activeClass = "z-10 bg-emerald-700 border-emerald-700 text-white";
        const inactiveClass = "bg-white border-gray-300 text-gray-500 hover:bg-emerald-50 hover:text-emerald-700";

        items.push(
            <button
                key="prev"
                disabled={currentPage === 1}
                onClick={(e) => this.props.renderData(e, this.props.perPage, currentPage - 1, this.props.keyword)}
                className={`${btnClass} rounded-l-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : inactiveClass}`}
            >
                Prev
            </button>
        );

        let start = (currentPage <= 3) ? 1 : (currentPage >= totalPages - 2) ? Math.max(1, totalPages - 4) : currentPage - 2;
        let end = Math.min(start + 4, totalPages);

        for (let i = start; i <= end; i++) {
            items.push(
                <button
                    key={i}
                    onClick={(e) => this.props.renderData(e, this.props.perPage, i, this.props.keyword)}
                    className={`${btnClass} ${i === currentPage ? activeClass : inactiveClass}`}
                >
                    {i}
                </button>
            );
        }

        items.push(
            <button
                key="next"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={(e) => this.props.renderData(e, this.props.perPage, currentPage + 1, this.props.keyword)}
                className={`${btnClass} rounded-r-md ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400' : inactiveClass}`}
            >
                Next
            </button>
        );

        return items;
    }

    render() {
        return (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-emerald-100">
                <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleModal()} centered>
                    <ModalHeader toggle={() => this.toggleModal()}>
                        Konfirmasi Sanggah
                    </ModalHeader>
                    <ModalBody>
                        Apakah Anda yakin ingin melakukan sanggah untuk peserta <strong>{this.state.selectedId}</strong>? 
                        Sistem akan menyalin seluruh data ke mode sanggah dan halaman akan diarahkan ke mode pembaruan data.
                        {this.state.errorMsg && (
                            <div className="mt-3 p-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                                ⚠️ {this.state.errorMsg}
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.toggleModal()} disabled={this.state.isLoading}>Batal</Button>
                        <Button color="warning" onClick={this.handleConfirm} disabled={this.state.isLoading}>
                            {this.state.isLoading ? '⏳ Memproses...' : 'Ya, Lanjutkan'}
                        </Button>
                    </ModalFooter>
                </Modal>

                <div className="p-5 flex flex-col md:flex-row justify-between items-center gap-4 bg-white border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-600">Tampilkan</span>
                        <select 
                            value={this.props.perPage} 
                            onChange={this.props.handlePerPage}
                            className="block w-20 pl-3 pr-10 py-1.5 text-sm border-emerald-200 rounded-md shadow-sm"
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                        <span className="text-sm font-medium text-gray-600">Entri</span>
                    </div>

                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fa fa-search text-emerald-500"></i>
                        </div>
                        <input
                            type="text"
                            placeholder="Cari data..."
                            value={this.props.keyword}
                            onChange={this.props.handleSearch}
                            className="block w-full pl-10 pr-3 py-2 border border-emerald-200 rounded-lg sm:text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-emerald-200">
                        <thead className="bg-emerald-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-yellow-400 uppercase tracking-wider">No</th>
                                {this.renderColumns()}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {this.renderList()}
                        </tbody>
                    </table>
                </div>

                <div className="px-5 py-4 flex flex-col md:flex-row justify-between items-center bg-gray-50 border-t border-emerald-100">
                    <p className="text-sm text-gray-600">
                        Menampilkan <span className="font-bold text-emerald-700">{this.props.data ? this.props.data.length : 0}</span> dari <span className="font-bold text-emerald-700">{this.props.total || 0}</span> data
                    </p>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {this.renderPagination()}
                    </nav>
                </div>
            </div>
        )
    }
}

// Gunakan withRouter agar this.props.history tersedia
export default withRouter(DataTable)