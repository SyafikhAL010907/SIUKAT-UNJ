import React from 'react'
import defaultPhoto from '../../../dist/images/profile.png'
import { connect } from 'react-redux'
import { Field, reduxForm, reset, formValueSelector } from 'redux-form'
import { Modal, ModalBody } from 'reactstrap' // Modal tetap gunakan reactstrap untuk logic, styling gunakan Tailwind
import { cmahasiswa, provinsi, kabkot, kecamatan } from '../../../../actions'
import { InputBs, InputDayPicker, InputFileBs, money } from '../../../components'
import { cookies, cookieName, rupiah, storage } from '../../../../global'

// --- KOMPONEN FORM MAHASISWA (MODAL) ---
let FormMahasiswa = (props) => {
    const { handleSubmit, handleToggleMahasiswa, toggleMahasiswa,
            pristine, submitting, dispatch,
            ref_provinsi, ref_kabkot, ref_kecamatan,
            penghasilan_cmahasiswa } = props

    const handleProvinsi = (e) => {
        dispatch(kabkot.fetchForCmahasiswa(e.target.value))
        dispatch(kecamatan.fetchForCmahasiswa({type: "FETCH_KECAMATAN_MHS_FULFILLED", payload: []}))
    }

    const handleKabkot = (e) => {
        dispatch(kecamatan.fetchForCmahasiswa(e.target.value))
    }

    return (
        <Modal isOpen={toggleMahasiswa} toggle={handleToggleMahasiswa} size="lg" centered className="border-none">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-emerald-600 p-6 flex justify-between items-center text-white">
                    <h3 className="text-xl font-bold">Edit Profil Mahasiswa</h3>
                    <button onClick={handleToggleMahasiswa} className="hover:rotate-90 transition-transform text-2xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} id="form-mahasiswa" className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nama Lengkap */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Nama Lengkap</label>
                            <Field name="nama_cmahasiswa" component={InputBs} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                        </div>

                        {/* Jenis Kelamin */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Jenis Kelamin</label>
                            <div className="flex space-x-6 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <Field name="gender_cmahasiswa" component="input" type="radio" value="laki-laki" className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                                    <span className="text-sm text-gray-700">Laki-Laki</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <Field name="gender_cmahasiswa" component="input" type="radio" value="perempuan" className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                                    <span className="text-sm text-gray-700">Perempuan</span>
                                </label>
                            </div>
                        </div>

                        {/* Tanggal Lahir */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Tanggal Lahir</label>
                            <Field name="tanggal_lahir_cmahasiswa" component={InputDayPicker} startYear={1990} className="w-full" />
                        </div>

                        {/* Alamat */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Alamat Lengkap</label>
                            <Field name="alamat_cmahasiswa" component={InputBs} type="textarea" rows="2" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>

                        {/* Lokasi Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 md:col-span-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Provinsi</label>
                                <Field name="provinsi_cmahasiswa" component={InputBs} type="select" onChange={handleProvinsi} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200">
                                    <option value="">Pilih Provinsi</option>
                                    { Array.isArray(ref_provinsi) && ref_provinsi.map((data, key) => (
                                        <option value={data.provinsi_id} key={key}>{data.provinsi_nama}</option>
                                    ))}
                                </Field>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Kab/Kota</label>
                                <Field name="kabkot_cmahasiswa" component={InputBs} type="select" onChange={handleKabkot} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200">
                                    <option value="">Pilih Kab/Kota</option>
                                    { Array.isArray(ref_kabkot) && ref_kabkot.map((data, key) => (
                                        <option value={data.kab_id} key={key}>{data.kab_nama}</option>
                                    ))}
                                </Field>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Kecamatan</label>
                                <Field name="kecamatan_cmahasiswa" component={InputBs} type="select" className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200">
                                    <option value="">Pilih Kecamatan</option>
                                    { Array.isArray(ref_kecamatan) && ref_kecamatan.map((data, key) => (
                                        <option value={data.kecam_id} key={key}>{data.kecam_nama}</option>
                                    ))}
                                </Field>
                            </div>
                        </div>

                        {/* Penghasilan Section */}
                        <div className="md:col-span-2 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <label className="block text-xs font-bold text-emerald-700 uppercase mb-2">Penghasilan Per Bulan</label>
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <Field name="penghasilan_cmahasiswa" component={InputBs} type="number" validate={[money]} className="flex-1 w-full px-4 py-2 rounded-lg border border-emerald-200 focus:ring-emerald-500" />
                                <div className="text-lg font-bold text-emerald-800 bg-white px-6 py-2 rounded-full border border-emerald-200 shadow-sm">
                                    { rupiah(penghasilan_cmahasiswa) }
                                </div>
                            </div>
                        </div>

                        {/* Upload Foto */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Pas Foto Baru</label>
                            <Field component={InputFileBs} name="file_foto_cmahasiswa" id="file_foto_cmahasiswa" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end space-x-3 border-t pt-6">
                        <button type="button" onClick={handleToggleMahasiswa} className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Batal</button>
                        <button type="submit" disabled={pristine || submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-100 active:scale-95 transition-all flex items-center">
                            <i className="fa fa-save mr-2"></i> Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

// --- KOMPONEN UTAMA (VIEW) ---
class Pribadi extends React.Component {
    constructor(props){
        super(props)
        this.state = { modalToggle: false }
    }

    componentWillMount(){
        this.props.dispatch(provinsi.fetchProvinsi())
        this.props.dispatch(cmahasiswa.fetchAllData(cookies.get(cookieName), this.props.noPeserta))
    }

    modalToggle = () => {
        this.setState({ modalToggle: !this.state.modalToggle })
    }

    submitMahasiswa = (values) => {
        this.modalToggle()
        var formData = new FormData()
        for(var key in values){
            if(key === "file_foto_cmahasiswa"){
                if(values[key]) formData.append(key, values[key][0])
                document.getElementById('file_foto_cmahasiswa').value = null;        
            } else {
                formData.append(key, values[key])
            }
        }
        this.props.dispatch(cmahasiswa.updateData(cookies.get(cookieName), formData, this.props.noPeserta))
        this.props.dispatch(reset('DataMahasiswa'))        
    }

    render(){
        const { cmahasiswa: data } = this.props;
        return (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Foto Profil Section */}
                    <div className="flex flex-col items-center md:w-1/4">
                        <div className="relative group">
                            <img 
                                src={data.foto_cmahasiswa ? `${storage}/${data.foto_cmahasiswa}` : defaultPhoto} 
                                className="w-48 h-60 object-cover rounded-2xl shadow-lg border-4 border-white transition-transform group-hover:scale-[1.02]" 
                                alt="foto-profil"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-xs font-bold uppercase tracking-widest">Pas Foto Mahasiswa</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Profil Section */}
                    <div className="flex-1 space-y-6">
                        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">{data.nama_cmahasiswa}</h2>
                                <p className="text-emerald-600 font-semibold">{data.no_peserta || 'Mahasiswa Aktif'}</p>
                            </div>
                            { this.props.editable && (
                                <button onClick={this.modalToggle} className="flex items-center space-x-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-600 hover:text-white transition-all">
                                    <i className="fa fa-pencil"></i>
                                    <span>Edit Profil</span>
                                </button>
                            )}
                        </div>

                        {/* Grid Data Detail */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            <InfoItem label="Jenis Kelamin" value={data.gender_cmahasiswa} />
                            <InfoItem label="Tempat, Tgl Lahir" value={`${data.tempat_lahir_cmahasiswa || '-'}, ${data.tanggal_lahir_cmahasiswa || '-'}`} />
                            <InfoItem label="Golongan Darah" value={data.goldar_cmahasiswa || 'Tidak Diketahui'} />
                            <InfoItem label="Nomor Telepon" value={data.telepon_cmahasiswa || '-'} />
                            <InfoItem label="Penghasilan" value={`${rupiah(data.penghasilan_cmahasiswa)} / bulan`} />
                            
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Alamat Domisili</label>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {data.alamat_cmahasiswa ? 
                                        `${data.alamat_cmahasiswa}, ${data.kecamatan?.kecam_nama || ''}, ${data.kabkot?.kab_nama || ''}, ${data.provinsi?.provinsi_nama || ''}` : 
                                        '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <FormMahasiswa
                    onSubmit={this.submitMahasiswa}
                    initialValues={this.props.cmahasiswa}
                    toggleMahasiswa={this.state.modalToggle}
                    handleToggleMahasiswa={this.modalToggle}
                /> 
            </div>
        )
    }
}

// Helper Component untuk list info
const InfoItem = ({ label, value }) => (
    <div className="border-b border-gray-50 pb-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">{label}</label>
        <p className="text-sm font-medium text-gray-700">{value}</p>
    </div>
)

// --- BOILERPLATE REDUX (Tetap Sama) ---
FormMahasiswa = reduxForm({
    form: 'DataMahasiswa',
    enableReinitialize: true,
})(FormMahasiswa)

const selector = formValueSelector('DataMahasiswa')

FormMahasiswa = connect((store) => {
    let penghasilan_cmahasiswa = selector(store, 'penghasilan_cmahasiswa')
    return {
        penghasilan_cmahasiswa,
        ref_provinsi: store.provinsi.provinsi,
        ref_kabkot: store.kabkot.kabkot_cmahasiswa,
        ref_kecamatan: store.kecamatan.kecamatan_cmahasiswa,
    }
}, { kabkot, kecamatan })(FormMahasiswa)

export default connect((store) => ({
    cmahasiswa: store.cmahasiswa.singleCmahasiswa,
}))(Pribadi)