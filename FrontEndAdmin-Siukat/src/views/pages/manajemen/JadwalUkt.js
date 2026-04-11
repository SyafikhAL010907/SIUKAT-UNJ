import React from 'react'
import { connect } from 'react-redux'
import { info, user } from '../../../actions';
import { Field, reduxForm, reset } from 'redux-form'
import { InputBs } from '../../components'
import { cookies, cookieName } from '../../../global';

// Komponen Form Jadwal UKT Modern
let FormJadwalUkt = (props) => {
    const { handleSubmit, pristine, submitting } = props
    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Kolom Kiri: Pengaturan Akses Login (Wadah Baru) */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                        <i className="fa fa-lock text-emerald-600"></i>
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Akses & Kontak Seleksi</h4>
                    </div>
                    
                    <div className="space-y-4">
                        <Field name="kode" component="input" type="hidden" />
                        
                        {/* Box Read-Only untuk Verifikasi DB */}
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 mb-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status Database (Jalur)</label>
                            <Field name="stage" component={InputBs} type="text" readOnly
                                className="w-full bg-white/50 px-4 py-2 rounded-xl border border-gray-100 text-gray-500 font-bold uppercase text-sm outline-none cursor-not-allowed"/>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                             <div>
                                <label className="block text-xs font-bold uppercase mb-1 ml-1 text-emerald-700">Tanggal Mulai Login</label>
                                <Field name="tanggal_mulai" component={InputBs} type="date" 
                                    className="w-full px-4 py-2.5 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-emerald-50/30"/>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase mb-1 ml-1 text-red-700">Tanggal Selesai Login (Tutup)</label>
                                <Field name="tanggal_selesai" component={InputBs} type="date" 
                                    className="w-full px-4 py-2.5 rounded-xl border border-red-100 focus:ring-2 focus:ring-red-500 outline-none transition-all bg-red-50/30"/>
                            </div>

                            <div className="pt-2 border-t border-dashed border-gray-200">
                                <label className="block text-xs font-bold text-emerald-600 uppercase mb-1 ml-1">Tanggal Akhir (Masa Perpanjangan)</label>
                                <Field name="tanggal_akhir" component={InputBs} type="date" 
                                    className="w-full px-4 py-2.5 rounded-xl border-dashed border-2 border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-emerald-50/10"
                                    placeholder="Isi jika ingin memperpanjang masa login mahasiswa"/>
                                <p className="text-[10px] text-gray-400 mt-1 ml-1">*Jika diisi, mahasiswa tetap bisa login meskipun Tanggal Selesai sudah lewat.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Timeline Administrasi */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                        <i className="fa fa-calendar-check-o text-emerald-600"></i>
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Timeline Administrasi</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Periode Pengisian Data</label>
                            <Field name="pengisian" component={InputBs} type="text" placeholder="Contoh: 1 - 10 Maret 2024"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"/>
                        </div>
                        
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Tanggal Pengumuman UKT</label>
                            <Field name="pengumuman" component={InputBs} type="text" placeholder="Contoh: 20 Maret 2024"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"/>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Batas Lapor Diri</label>
                            <Field name="lapor_diri" component={InputBs} type="text" placeholder="25 Maret 2024"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"/>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Batas Pembayaran</label>
                            <Field name="pembayaran" component={InputBs} type="text" placeholder="30 Maret 2024"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"/>
                        </div>
                    </div>

                    {/* Tombol Simpan Terintegrasi */}
                    <div className="pt-6">
                        <button 
                            type="submit" 
                            disabled={pristine || submitting}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center space-x-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <i className="fa fa-save"></i>
                            <span>Simpan Perubahan Jadwal</span>
                        </button>
                        <p className="text-center text-[10px] text-gray-400 mt-3 italic">
                            *Perubahan ini akan langsung berdampak pada halaman dashboard mahasiswa.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    )
}
class JadwalUkt extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedKode: 1 // Default ke SNMPTN
        }
    }

    componentDidMount() {
        this.props.dispatch(user.getByLoggedIn(cookies.get(cookieName)))
        this.props.dispatch(info.fetchInfo(this.state.selectedKode))
    }

    handleStageChange = (e) => {
        const kode = e.target.value
        this.setState({ selectedKode: kode })
        this.props.dispatch(info.fetchInfo(kode))
    }

    submitForm = (values) => {
        // Pastikan kode terikut saat save
        const payload = { ...values, kode: parseInt(this.state.selectedKode) }
        this.props.dispatch(info.updateData(cookies.get(cookieName), payload))
    }

    formatDateForInput = (dateStr) => {
        if (!dateStr || dateStr.startsWith("0000")) return "";
        const date = new Date(dateStr);
        
        // Ambil komponen tanggal lokal (biar nggak kegeser 7 jam ke belakang sama UTC)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }

    render() {
        // Transform dates for form display if they exist
        const formattedInitialValues = {
            ...this.props.info,
            tanggal_mulai: this.formatDateForInput(this.props.info?.tanggal_mulai),
            tanggal_selesai: this.formatDateForInput(this.props.info?.tanggal_selesai),
            tanggal_akhir: this.formatDateForInput(this.props.info?.tanggal_akhir)
        }

        return (
            <div className="p-2 md:p-6">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Card dengan Aksen Kuning UNJ */}
                    <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-8 py-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-white">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <i className="fa fa-calendar text-2xl text-yellow-300"></i>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Pengaturan Jadwal UKT</h2>
                                <p className="text-emerald-100 text-xs">Kelola periode pengisian, klarifikasi, dan pembayaran</p>
                            </div>
                        </div>

                        {/* Dropdown Jalur Sejajar Header */}
                        <div className="flex items-center space-x-3 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20">
                            <span className="text-white text-xs font-bold uppercase ml-2 px-2 hidden sm:inline">Pilih Jalur:</span>
                            <select 
                                value={this.state.selectedKode} 
                                onChange={this.handleStageChange}
                                className="bg-white text-emerald-800 text-sm font-bold px-4 py-2 rounded-xl outline-none border-none focus:ring-2 focus:ring-yellow-400 transition-all cursor-pointer shadow-inner"
                            >
                                <option value="1">SNMPTN</option>
                                <option value="2">SBMPTN</option>
                                <option value="3">MANDIRI</option>
                            </select>
                        </div>
                    </div>

                    <div className="p-8">
                        <FormJadwalUkt
                            onSubmit={this.submitForm}
                            initialValues={formattedInitialValues}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

FormJadwalUkt = reduxForm({
    form: 'DataJadwalUkt',
    enableReinitialize: true,
})(FormJadwalUkt)

export default connect((store) => ({
    info: store.info.info,
    user: store.user.user
}))(JadwalUkt)