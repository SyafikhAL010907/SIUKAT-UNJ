import React from 'react'
import { cmahasiswa, user } from '../../../actions'
import { connect } from 'react-redux'
import { cookies, cookieName } from '../../../global'
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

    componentWillMount() {
        this.props.dispatch(user.getByLoggedIn(cookies.get(cookieName)))
        this.props.dispatch(cmahasiswa.fetchCmahasiswa(cookies.get(cookieName), { perPage: 10, page: 1, keyword: "" }))
    }

    // DATATABLE HANDLERS
    renderData = (e, perPage = 10, to = 1, key = null) => {
        if (e) e.preventDefault()
        this.props.dispatch(cmahasiswa.fetchCmahasiswa(cookies.get(cookieName), { perPage: perPage, page: to, keyword: key }))
    }

    handlePerPage = (e) => {
        this.setState({ perPage: e.target.value })
        this.renderData(e, e.target.value, 1, this.state.keyword)
    }

    handleSearch = (e) => {
        this.setState({ keyword: e.target.value })
        this.renderData(e, this.state.perPage, 1, e.target.value)
    }

    render() {
        return (
            <div className="p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
                
                {/* Section Summary / Statistik Teratas */}
                <div className="animate-fadeIn">
                    <SummaryCmahasiswa />
                </div>

                {/* Main Card Container */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* Header: Judul & Actions */}
                    <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-1.5 h-8 bg-emerald-600 rounded-full"></div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Data Master</h2>
                                <p className="text-xs text-gray-400 font-medium tracking-wide">CALON MAHASISWA BARU</p>
                            </div>
                        </div>

                       <div className="flex flex-wrap items-center gap-2">
                        {/* Tombol PDF */}
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white text-red-600 hover:bg-red-50 border border-red-200 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
                            <i className="fa fa-file-pdf-o"></i>
                            <span>PDF Master</span>
                        </button>

                        {/* Komponen Exports - Kita hilangkan background emerald dari pembungkusnya 
                            agar tidak "double button", biarkan class di dalam komponen Exports yang bekerja */}
                        <div className="inline-block outline-none shadow-sm rounded-xl overflow-hidden active:scale-95 transition-transform">
                            <Exports 
                                count={this.props.count} 
                                title="Data Master" 
                                className="btn-excel-modern" // Jika komponen Exports menerima custom class
                            />
                        </div>
                    </div>
                    </div>

                    {/* Table Section */}
                    <div className="p-4 sm:p-6">
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-50">
                            <DataTable
                                data={this.props.cmahasiswa}
                                columns={{
                                    no_peserta: "Nomor Peserta",
                                    nama_cmahasiswa: "Nama Lengkap",
                                    bidik_misi_cmahasiswa: "BM",
                                    "fakultas.nama": "Fakultas",
                                    "prodi.nama": "Program Studi",
                                    golongan_id: "Kelompok UKT",
                                    "ukt.nominal": "Nominal UKT",
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