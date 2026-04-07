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
                
                {/* Kolom Kiri: Informasi Dasar & Klarifikasi */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                        <i className="fa fa-info-circle text-emerald-600"></i>
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Dasar & Klarifikasi</h4>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Jalur Seleksi</label>
                            <Field name="stage" component={InputBs} type="select" 
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white">
                                <option value="">-- Pilih Jalur --</option>
                                {["snmptn", "sbmptn", "mandiri"].map((data, key) => (
                                    <option value={data} key={key}>{data.toUpperCase()}</option>
                                ))}
                            </Field>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Kontak Person / Helpdesk</label>
                            <Field name="kontak" component={InputBs} type="text" placeholder="Contoh: 0812-xxxx-xxxx (Humas)"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"/>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Waktu Klarifikasi</label>
                            <Field name="klarifikasi_tanggal" component={InputBs} type="textarea" rows="3" placeholder="Contoh: 12 - 15 April 2024, Pukul 08.00 WIB"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"/>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Tempat Klarifikasi</label>
                            <Field name="klarifikasi_lokasi" component={InputBs} type="textarea" rows="3" placeholder="Contoh: Gedung Dewi Sartika Lt. 2, Kampus A UNJ"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"/>
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
    componentWillMount() {
        this.props.dispatch(user.getByLoggedIn(cookies.get(cookieName)))
        this.props.dispatch(info.fetchInfo())
    }

    submitForm = (values) => {
        this.props.dispatch(info.updateData(cookies.get(cookieName), values))
        this.props.dispatch(reset('DataJadwalUkt'))
    }

    render() {
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
                    </div>

                    <div className="p-8">
                        <FormJadwalUkt
                            onSubmit={this.submitForm}
                            initialValues={this.props.info}
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