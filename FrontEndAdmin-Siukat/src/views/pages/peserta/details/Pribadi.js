import React from 'react'
import moment from 'moment'
import defaultPhoto from '../../../dist/images/profile.png'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { Modal } from 'reactstrap' 
import { cmahasiswa, provinsi, kabkot, kecamatan } from '../../../../actions'
import { InputBs, InputDayPicker, InputFileBs } from '../../../components'
import { cookies, cookieName, rupiah, storage } from '../../../../global'
import { withRouter } from 'react-router-dom'

// --- KOMPONEN MODAL FORM ---
let FormMahasiswa = (props) => {
    const { 
        handleSubmit, handleToggleMahasiswa, toggleMahasiswa,
        submitting, dispatch,
        ref_provinsi, ref_kabkot, ref_kecamatan,
        penghasilan_cmahasiswa 
    } = props

    // Handler Wilayah
    const handleProvinsi = (e) => {
        const id = e.target.value;
        if (id) {
            dispatch(kabkot.fetchForCmahasiswa(id));
            dispatch({ type: "FETCH_KECAMATAN_MHS_FULFILLED", payload: [] });
        }
    }

    const handleKabkot = (e) => {
        const id = e.target.value;
        if (id) {
            dispatch(kecamatan.fetchForCmahasiswa(id));
        }
    }

    return (
        <Modal isOpen={toggleMahasiswa} toggle={handleToggleMahasiswa} size="lg" centered className="border-none">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-emerald-600 p-6 flex justify-between items-center text-white">
                    <h3 className="text-xl font-bold">Perbarui Data Profil</h3>
                    <button onClick={handleToggleMahasiswa} type="button" className="hover:rotate-90 transition-transform text-2xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Nama Lengkap</label>
                            <Field name="nama_cmahasiswa" component={InputBs} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Jenis Kelamin</label>
                            <Field name="gender_cmahasiswa" component={InputBs} type="select" className="text-black">
                                <option value="">Pilih</option>
                                <option value="laki-laki">Laki-Laki</option>
                                <option value="perempuan">Perempuan</option>
                            </Field>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Golongan Darah</label>
                            <Field name="goldar_cmahasiswa" component={InputBs} type="select" className="text-black">
                                <option value="">Pilih</option>
                                <option value="A">A</option><option value="B">B</option>
                                <option value="AB">AB</option><option value="O">O</option>
                            </Field>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Tempat Lahir</label>
                            <Field name="tempat_lahir_cmahasiswa" component={InputBs} type="text" className="text-black" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Tanggal Lahir</label>
                            <Field name="tanggal_lahir_cmahasiswa" component={InputDayPicker} startYear={1990} className="text-black" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Provinsi</label>
                            <Field name="provinsi_cmahasiswa" component={InputBs} type="select" className="text-black" onChange={handleProvinsi}>
                                <option value="">Pilih Provinsi</option>
                                {ref_provinsi.map((v, i) => (
                                    <option key={i} value={v.provinsi_id}>{v.provinsi_nama}</option>
                                ))}
                            </Field>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Kabupaten/Kota</label>
                            <Field name="kabkot_cmahasiswa" component={InputBs} type="select" className="text-black" onChange={handleKabkot}>
                                <option value="">Pilih Kab/Kot</option>
                                {ref_kabkot.map((v, i) => (
                                    <option key={i} value={v.id || v.kab_id}>{v.nama || v.kab_nama}</option>
                                ))}
                            </Field>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Kecamatan</label>
                            <Field name="kecamatan_cmahasiswa" component={InputBs} type="select" className="text-black">
                                <option value="">Pilih Kecamatan</option>
                                {ref_kecamatan.map((v, i) => (
                                    <option key={i} value={v.id || v.kecam_id}>{v.nama || v.kecam_nama}</option>
                                ))}
                            </Field>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Alamat Lengkap</label>
                            <Field name="alamat_cmahasiswa" component={InputBs} type="textarea" className="text-black font-bold" />
                        </div>

                        <div className="md:col-span-2 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <label className="block text-xs font-bold text-emerald-700 uppercase mb-2">Penghasilan Per Bulan</label>
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <Field name="penghasilan_cmahasiswa" component={InputBs} type="number" className="flex-1 text-black" />
                                <div className="text-lg font-bold text-emerald-800 bg-white px-6 py-2 rounded-full border border-emerald-200">
                                    { rupiah(penghasilan_cmahasiswa || 0) }
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Ganti Pas Foto</label>
                            <Field component={InputFileBs} name="file_foto_cmahasiswa" id="file_foto_cmahasiswa" type="file" accept="image/*" className="text-black" />
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end space-x-3 border-t pt-6">
                        <button type="button" onClick={handleToggleMahasiswa} className="px-6 py-2.5 font-bold text-gray-500">Batal</button>
                        <button type="submit" disabled={submitting} className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg">
                            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
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

    async componentDidMount(){
        await this.initLoad();
    }

    initLoad = async () => {
        const token = cookies.get(cookieName);
        const { noPeserta, dispatch } = this.props;
        
        dispatch(provinsi.fetchProvinsi());
        
        try {
            const res = await dispatch(cmahasiswa.fetchAllData(token, noPeserta, this.props.atribut));
            const val = res?.value?.data || res?.payload?.data;
            
            if (val) {
                if (val.provinsi_cmahasiswa) dispatch(kabkot.fetchForCmahasiswa(val.provinsi_cmahasiswa));
                if (val.kabkot_cmahasiswa) dispatch(kecamatan.fetchForCmahasiswa(val.kabkot_cmahasiswa));
            }
        } catch (e) {
            console.error("Error loading data", e);
        }
    }

    modalToggle = () => {
        this.setState({ modalToggle: !this.state.modalToggle })
    }

    submitMahasiswa = async (values) => {
        const token = cookies.get(cookieName);
        const formData = new FormData();
        
        Object.keys(values).forEach(key => {
            if (key === "file_foto_cmahasiswa") {
                if (values[key] && values[key][0]) formData.append(key, values[key][0]);
            } else if (values[key] !== null && values[key] !== undefined) {
                let val = values[key];
                if (val instanceof Date) {
                    val = moment(val).format("YYYY-MM-DD");
                }
                formData.append(key, val);
            }
        });

        try {
            await this.props.dispatch(cmahasiswa.updateData(token, formData, this.props.noPeserta));
            await this.props.dispatch(cmahasiswa.fetchAllData(token, this.props.noPeserta, this.props.atribut));
            this.modalToggle();
            alert("Data Berhasil Diperbarui!");
        } catch (error) {
            console.error("Update Error", error);
            alert("Gagal menyimpan perubahan.");
        }
    }

    render(){
        const { cmahasiswa: data, location, editable } = this.props;
        if(!data) return <div className="p-10 text-center font-bold text-emerald-600">Memuat Profil...</div>;

        // PENGUBAHAN: Tombol hanya tampil jika isModeSanggah bernilai true
        const isModeSanggah = editable;

        return (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                {isModeSanggah && (
                    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center text-orange-700 animate-pulse">
                        <i className="fa fa-info-circle mr-3 text-xl"></i>
                        <span className="text-sm font-bold uppercase">Mode Sanggah Aktif: Anda dapat mengubah data profil sekarang.</span>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-10">
                    <div className="flex flex-col items-center md:w-1/4">
                        <img 
                            src={data.foto_cmahasiswa ? `${storage}/${data.foto_cmahasiswa}?t=${new Date(data.updated_at || Date.now()).getTime()}` : defaultPhoto} 
                            className="w-48 h-60 object-cover rounded-2xl shadow-lg border-4 border-white" 
                            alt="profil"
                            onError={(e) => {e.target.src = defaultPhoto}}
                        />
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 uppercase">{data.nama_cmahasiswa}</h2>
                                <p className="text-emerald-600 font-semibold">{data.no_peserta}</p>
                            </div>
                            {/* FIX: Menggunakan isModeSanggah alih-alih this.props.editable */}
                            {isModeSanggah && (
                                <button onClick={this.modalToggle} className="bg-amber-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-amber-700 shadow-md">
                                    <i className="fa fa-edit mr-2"></i> Perbarui Data
                                </button>
                            )}
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
    form: 'FormProfileMahasiswa',
    enableReinitialize: true,
})(FormMahasiswa)

const selector = formValueSelector('FormProfileMahasiswa')

FormMahasiswa = connect((store) => {
    const getArray = (data) => Array.isArray(data) ? data : [];
    
    return {
        penghasilan_cmahasiswa: selector(store, 'penghasilan_cmahasiswa'),
        ref_provinsi: getArray(store.provinsi.provinsi),
        ref_kabkot: getArray(store.kabkot.kabkot_cmahasiswa),
        ref_kecamatan: getArray(store.kecamatan.kecamatan_cmahasiswa),
    }
})(FormMahasiswa)

export default withRouter(connect((store) => ({
    cmahasiswa: store.cmahasiswa.singleCmahasiswa,
}))(Pribadi))