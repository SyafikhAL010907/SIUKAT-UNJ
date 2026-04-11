import React from 'react'
import defaultPhoto from '../../../dist/images/profile.png'
import { connect } from 'react-redux'
import { Field, reduxForm, reset, formValueSelector } from 'redux-form'
import { Modal } from 'reactstrap' 
import { cmahasiswa, provinsi, kabkot, kecamatan } from '../../../../actions'
import { InputBs, InputDayPicker, InputFileBs, money } from '../../../components'
import { cookies, cookieName, rupiah, storage } from '../../../../global'
import { withRouter } from 'react-router-dom'

// --- KOMPONEN MODAL FORM ---
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
                    <h3 className="text-xl font-bold">Perbarui Data Profil</h3>
                    <button onClick={handleToggleMahasiswa} className="hover:rotate-90 transition-transform text-2xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Nama Lengkap</label>
                            <Field name="nama_cmahasiswa" component={InputBs} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Jenis Kelamin</label>
                            <Field name="gender_cmahasiswa" component={InputBs} type="select" className="w-full px-4 py-3 rounded-xl border border-gray-200">
                                <option value="">Pilih</option>
                                <option value="laki-laki">Laki-Laki</option>
                                <option value="perempuan">Perempuan</option>
                            </Field>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Golongan Darah</label>
                            <Field name="goldar_cmahasiswa" component={InputBs} type="select" className="w-full px-4 py-3 rounded-xl border border-gray-200">
                                <option value="">Pilih</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="AB">AB</option>
                                <option value="O">O</option>
                            </Field>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Tempat Lahir</label>
                            <Field name="tempat_lahir_cmahasiswa" component={InputBs} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Tanggal Lahir</label>
                            <Field name="tanggal_lahir_cmahasiswa" component={InputDayPicker} startYear={1990} />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Nomor Telepon</label>
                            <Field name="telepon_cmahasiswa" component={InputBs} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Sosial Media (Instagram/X)</label>
                            <Field name="sosmed_cmahasiswa" component={InputBs} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Alamat Lengkap</label>
                            <Field name="alamat_cmahasiswa" component={InputBs} type="textarea" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                        </div>

                        <div className="md:col-span-2 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <label className="block text-xs font-bold text-emerald-700 uppercase mb-2">Penghasilan Per Bulan</label>
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <Field name="penghasilan_cmahasiswa" component={InputBs} type="number" validate={[money]} className="flex-1" />
                                <div className="text-lg font-bold text-emerald-800 bg-white px-6 py-2 rounded-full border border-emerald-200 shadow-sm">
                                    { rupiah(penghasilan_cmahasiswa) }
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Ganti Pas Foto</label>
                            <Field component={InputFileBs} name="file_foto_cmahasiswa" id="file_foto_cmahasiswa" type="file" accept="image/*" />
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end space-x-3 border-t pt-6">
                        <button type="button" onClick={handleToggleMahasiswa} className="px-6 py-2.5 font-bold text-gray-500">Batal</button>
                        <button type="submit" disabled={pristine || submitting} className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg">
                            <i className="fa fa-save mr-2"></i> Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

// --- KOMPONEN VIEW UTAMA ---
class Pribadi extends React.Component {
    constructor(props){
        super(props)
        this.state = { modalToggle: false }
    }

    componentWillMount(){
        // Fetch data awal berdasarkan No Peserta dari props
        const token = cookies.get(cookieName);
        this.props.dispatch(provinsi.fetchProvinsi())
        this.props.dispatch(cmahasiswa.fetchAllData(token, this.props.noPeserta))
    }

    componentDidMount() {
        // Modal auto-open removed as per user request
    }

    modalToggle = () => {
        this.setState({ modalToggle: !this.state.modalToggle })
    }

    submitMahasiswa = (values) => {
        const token = cookies.get(cookieName);
        var formData = new FormData()
        
        for(var key in values){
            if(key === "file_foto_cmahasiswa"){
                if(values[key] && values[key][0]) {
                    formData.append(key, values[key][0])
                }
            } else if (values[key] !== null) {
                formData.append(key, values[key])
            }
        }

        // Jalankan Update
        this.props.dispatch(cmahasiswa.updateData(token, formData, this.props.noPeserta)).then(() => {
            this.modalToggle();
            // Refetch data agar tampilan InfoItem langsung terupdate
            this.props.dispatch(cmahasiswa.fetchAllData(token, this.props.noPeserta))
        })
    }

    render(){
        const { cmahasiswa: data, location } = this.props;
        if(!data) return <div className="p-10 text-center">Memuat Data...</div>;

        const isModeSanggah = location.state && location.state.modeEdit;

        return (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                {/* Banner Notifikasi Mode Sanggah */}
                {isModeSanggah && (
                    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center text-orange-700 animate-pulse">
                        <i className="fa fa-info-circle mr-3 text-xl"></i>
                        <span className="text-sm font-bold uppercase">Mode Sanggah Aktif: Anda dapat mengubah data profil sekarang.</span>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-10">
                    {/* Foto Profil */}
                    <div className="flex flex-col items-center md:w-1/4">
                        <img 
                            src={data.foto_cmahasiswa ? `${storage}/${data.foto_cmahasiswa}` : defaultPhoto} 
                            className="w-48 h-60 object-cover rounded-2xl shadow-lg border-4 border-white" 
                            alt="profil"
                        />
                    </div>

                    {/* Detail Informasi */}
                    <div className="flex-1 space-y-6">
                        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 uppercase">{data.nama_cmahasiswa}</h2>
                                <p className="text-emerald-600 font-semibold">{data.no_peserta}</p>
                            </div>
                            
                            <button onClick={this.modalToggle} className="bg-amber-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-amber-700 transition-all shadow-md">
                                <i className="fa fa-edit mr-2"></i> Perbarui Data
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            <InfoItem label="Jenis Kelamin" value={data.gender_cmahasiswa} />
                            <InfoItem label="Tempat, Tgl Lahir" value={`${data.tempat_lahir_cmahasiswa || '-'}, ${data.tanggal_lahir_cmahasiswa ? data.tanggal_lahir_cmahasiswa.split('T')[0] : '-'}`} />
                            <InfoItem label="Golongan Darah" value={data.goldar_cmahasiswa} />
                            <InfoItem label="Nomor Telepon" value={data.telepon_cmahasiswa} />
                            <InfoItem label="Penghasilan" value={`${rupiah(data.penghasilan_cmahasiswa)} / bulan`} />
                            
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Alamat Domisili</label>
                                <p className="text-sm text-gray-700 leading-relaxed uppercase">
                                    {data.alamat_cmahasiswa}
                                    {data.kecamatan_nama && `, ${data.kecamatan_nama}`}
                                    {data.kabkot_nama && `, ${data.kabkot_nama}`}
                                    {data.provinsi_nama && `, ${data.provinsi_nama}`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <FormMahasiswa
                    onSubmit={this.submitMahasiswa}
                    initialValues={data}
                    toggleMahasiswa={this.state.modalToggle}
                    handleToggleMahasiswa={this.modalToggle}
                /> 
            </div>
        )
    }
}

const InfoItem = ({ label, value }) => (
    <div className="border-b border-gray-50 pb-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">{label}</label>
        <p className="text-sm font-medium text-gray-700 uppercase">{value || '-'}</p>
    </div>
)

// --- REDUX WRAPPERS ---
FormMahasiswa = reduxForm({
    form: 'DataMahasiswa',
    enableReinitialize: true,
})(FormMahasiswa)

const selector = formValueSelector('DataMahasiswa')

FormMahasiswa = connect((store) => ({
    penghasilan_cmahasiswa: selector(store, 'penghasilan_cmahasiswa'),
    ref_provinsi: store.provinsi.provinsi,
    ref_kabkot: store.kabkot.kabkot_cmahasiswa,
    ref_kecamatan: store.kecamatan.kecamatan_cmahasiswa,
}))(FormMahasiswa)

export default withRouter(connect((store) => ({
    cmahasiswa: store.cmahasiswa.singleCmahasiswa,
}))(Pribadi))