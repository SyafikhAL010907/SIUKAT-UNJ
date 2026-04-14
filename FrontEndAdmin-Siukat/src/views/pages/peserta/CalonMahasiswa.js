import React from 'react'
import { cmahasiswa, user } from '../../../actions'
import { connect } from 'react-redux'
import { cookies, cookieName, service } from '../../../global'
import { DataTable, SummaryCmahasiswa, Exports } from '../../components'

class CalonMahasiswa extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            toggleCalonMahasiswa: false,
            perPage: 10,
            keyword: ""
        }
    }

    componentDidMount() {
        this.props.dispatch(user.getByLoggedIn(cookies.get(cookieName)))
        this.props.dispatch(cmahasiswa.fetchCmahasiswa(cookies.get(cookieName), { perPage: this.state.perPage, page: 1, keyword: "" }))
        
        // Real-time Update: Polling setiap 15 detik untuk tabel master
        this.pollingMaster = setInterval(() => {
            // Hanya refresh jika tidak sedang search (biar nggak keganggu ngetiknya)
            if (!this.state.keyword) {
                this.props.dispatch(cmahasiswa.fetchCmahasiswa(cookies.get(cookieName), { 
                    perPage: this.state.perPage, 
                    page: this.props.currentPage || 1, 
                    keyword: "" 
                }))
            }
        }, 60000);
    }

    componentWillUnmount() {
        if (this.pollingMaster) clearInterval(this.pollingMaster);
    }

    // DATATABLE HANDLERS
    renderData = (e, perPage = 10, to = 1, key = null) => {
        if (e && e.preventDefault) e.preventDefault()
        // Pastikan perPage dan page selalu integer agar tidak ditolak backend Go
        this.props.dispatch(cmahasiswa.fetchCmahasiswa(cookies.get(cookieName), { 
            perPage: parseInt(perPage, 10), 
            page: parseInt(to, 10), 
            keyword: key || "" 
        }))
    }

    handlePerPage = (e) => {
        const value = parseInt(e.target.value, 10)  // Konversi ke integer
        this.setState({ perPage: value })
        this.props.dispatch(cmahasiswa.fetchCmahasiswa(cookies.get(cookieName), { 
            perPage: value, 
            page: 1, 
            keyword: this.state.keyword 
        }))
    }

    handleSearch = (e) => {
        const value = e.target.value
        this.setState({ keyword: value })
        this.props.dispatch(cmahasiswa.fetchCmahasiswa(cookies.get(cookieName), { 
            perPage: parseInt(this.state.perPage, 10), 
            page: 1, 
            keyword: value 
        }))
    }

    render() {
        return (
            <div className="p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
                
                {/* Section Summary / Statistik Teratas */}
                <div className="animate-fadeIn">
                    <SummaryCmahasiswa />
                </div>

                {/* Main Card Container */}
                <div className="modern-card bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* Header: Judul & Actions */}
                    <div className="glass-header p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-2 h-10 bg-gradient-to-b from-emerald-600 to-teal-400 rounded-full shadow-lg shadow-emerald-200"></div>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Data Master</h2>
                                <p className="text-[10px] text-white font-black uppercase tracking-[0.2em] opacity-70">CALON MAHASISWA BARU</p>
                            </div>
                        </div>

                       <div className="flex flex-wrap items-center gap-2">
                        {/* Tombol PDF Master - Restored to original UI state */}
                        {/* Tombol PDF Master - Restored to original UI state */}
                        <button 
                            onClick={() => {
                                const token = cookies.get(cookieName);
                                // Gunakan konstanta service langsung dari global.js
                                const url = (service.startsWith('http') ? service : window.location.origin + service) + '/pdf/master?token=' + token;
                                window.open(url);
                            }}
                            className="btn-pdf-modern"
                        >
                            <i className="fa fa-file-pdf-o"></i>
                            <span>PDF Master</span>
                        </button>

                        {/* Komponen Exports */}
                        <Exports 
                            count={this.props.count} 
                            title="Data Master" 
                            className="btn-excel-modern"
                        />
                    </div>

                    </div>

                    {/* Table Section */}
                    <div className="p-4 sm:p-6">
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-50">
                            <DataTable
                                data={this.props.cmahasiswa}
                                columns={{
                                    no_peserta: "Nomor Peserta",
                                    foto_cmahasiswa: "Foto",
                                    nama_cmahasiswa: "Nama Lengkap",
                                    bidik_misi_cmahasiswa: "BM",
                                    "fakultas.nama": "Fakultas",
                                    "prodi.nama": "Program Studi",
                                    original_golongan_id: "Kelompok Original",
                                    original_nominal: "Nominal Original",
                                    golongan_id: "Kelompok Sanggah",
                                    "ukt.nominal": "Nominal Sanggah",
                                    flag: "Status",
                                    ukt_tinggi: "UKT Tinggi",
                                    aksi: 'Aksi'
                                }}
                                primaryKey="no_peserta"
                                total={this.props.count}
                                currentPage={this.props.currentPage}
                                totalPages={this.props.totalPages}
                                perPage={this.state.perPage}
                                keyword={this.state.keyword}
                                handlePerPage={this.handlePerPage}
                                handleSearch={this.handleSearch}
                                renderData={this.renderData}
                            />
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50">
                        <div className="flex items-center text-xs text-gray-400 space-x-4">
                            <span className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span> Terverifikasi</span>
                            <span className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span> Belum Lapor Diri</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect((store) => ({
    cmahasiswa: store.cmahasiswa.cmahasiswa,
    count: store.cmahasiswa.datatable.count,
    totalPages: store.cmahasiswa.datatable.totalPages,
    currentPage: store.cmahasiswa.datatable.currentPage,
    perPage: store.cmahasiswa.datatable.perPage,
    keyword: store.cmahasiswa.datatable.keyword,
    user: store.user.user
}))(CalonMahasiswa)