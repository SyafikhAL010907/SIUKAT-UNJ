import React from 'react'
import moment from 'moment'
import { 
    Col, Alert, FormGroup, FormText, Label, Modal 
} from 'reactstrap'
import { withRouter } from 'react-router-dom'
import { Field, reduxForm, reset, formValueSelector, change } from 'redux-form'
import { connect } from 'react-redux'
import { InputBs, InputFileBs, money } from '../../../components'
import { wali, provinsi, kabkot, kecamatan } from '../../../../actions'
import { cookies, cookieName, rupiah, storage } from '../../../../global'

// --- KOMPONEN FORM (MODAL) ---
let FormWali = (props) => {
    const { 
        handleSubmit, handleToggleWali, toggleWali,
        pristine, submitting, dispatch,
        ref_provinsi_wali, ref_kabkot_wali, ref_kecamatan_wali,
        status_wali, kesanggupan_wali 
    } = props

    const handleProvinsi = (e) => {
        const val = e.target.value
        if (val) {
            dispatch(kabkot.fetchForWali(val))
        }
        // Reset field bawahnya agar tidak sinkron dengan provinsi lama
        dispatch(change('DataWaliSeleksi', 'kabkot_wali', ''))
        dispatch(change('DataWaliSeleksi', 'kecamatan_wali', ''))
    }

    const handleKabkot = (e) => {
        const val = e.target.value
        if (val) {
            dispatch(kecamatan.fetchForWali(val))
        }
        dispatch(change('DataWaliSeleksi', 'kecamatan_wali', ''))
    }

    return (
        <Modal isOpen={toggleWali} toggle={handleToggleWali} size="lg" centered className="border-none">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-emerald-600 p-6 flex justify-between items-center text-white">
                    <h3 className="text-xl font-bold">Perbarui Data Wali</h3>
                    <button type="button" onClick={handleToggleWali} className="hover:rotate-90 transition-transform text-2xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 max-h-[75vh] overflow-y-auto">
                    <FormGroup row className="items-center">
                        <Label for="status_wali" md={3} className="font-bold">Status Wali</Label>                                            
                        <Col md={3}>
                            <Label check className="cursor-pointer">
                                <Field name="status_wali" component={InputBs} type="radio" value="ada" />{' '} Ada
                            </Label>
                        </Col>
                        <Col md={3}>
                            <Label check className="cursor-pointer">
                                <Field name="status_wali" component={InputBs} type="radio" value="tidak" />{' '} Tidak Ada
                            </Label>
                        </Col>
                    </FormGroup>

                    { status_wali === "ada" && (
                        <div className="space-y-4 mt-4 border-t pt-4">
                            <FormGroup row>
                                <Label md={3}>Nama Lengkap</Label>
                                <Col md={9}>
                                    <Field name="nama_wali" component={InputBs} type="text" />
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label md={3}>Alamat Lengkap</Label>
                                <Col md={9}>
                                    <Field name="alamat_wali" component={InputBs} type="textarea" rows="2" />
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label md={3}>Provinsi</Label>
                                <Col md={9}>
                                    <Field name="provinsi_wali" component={InputBs} type="select" onChange={handleProvinsi}>
                                        <option value="">-- Pilih Provinsi --</option>
                                        {(ref_provinsi_wali || []).map((data, key) => 
                                            <option value={data.provinsi_id} key={key}>{data.provinsi_nama}</option>
                                        )}
                                    </Field>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label md={3}>Kab/Kota</Label>
                                <Col md={9}>
                                    <Field name="kabkot_wali" component={InputBs} type="select" onChange={handleKabkot}>
                                        <option value="">-- Pilih Kabupaten/Kota --</option>
                                        {(ref_kabkot_wali || []).map((data, key) => 
                                            <option value={data.kab_id} key={key}>{data.kab_nama}</option>
                                        )}
                                    </Field>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label md={3}>Kecamatan</Label>
                                <Col md={9}>
                                    <Field name="kecamatan_wali" component={InputBs} type="select">
                                        <option value="">-- Pilih Kecamatan --</option>
                                        {(ref_kecamatan_wali || []).map((data, key) => 
                                            <option value={data.kecam_id} key={key}>{data.kecam_nama}</option>
                                        )}
                                    </Field>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label md={3}>Komitmen Biaya</Label>
                                <Col md={5}>
                                    <Field type="number" component={InputBs} name="kesanggupan_wali" validate={[ money ]}/>
                                    <FormText color="muted">Jumlah per bulan.</FormText>
                                </Col>
                                <Col md={4}>
                                    <div className="bg-emerald-50 text-emerald-700 p-2 rounded text-center font-bold border border-emerald-100">
                                        { rupiah(kesanggupan_wali || 0) }
                                    </div>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label md={3}>Scan Surat Komitmen</Label>
                                <Col md={5}>
                                    <Field component={InputFileBs} type="file" name="file_scan_wali" id="file_scan_wali" />
                                    <FormText color="muted">PDF/JPG (Maks. 500KB).</FormText>
                                </Col>
                                <Col md={4} className="flex flex-col gap-2">
                                    { props.initialValues?.scan_wali && (
                                        <a href={`${storage}/${props.initialValues.scan_wali}`} target="_blank" rel="noopener noreferrer" className="btn btn-info btn-sm text-white">
                                            <i className="fa fa-file-text mr-1"></i> Lihat Berkas
                                        </a>
                                    )}
                                </Col>
                            </FormGroup>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end space-x-3 border-t pt-6">
                        <button type="button" onClick={handleToggleWali} className="px-6 py-2.5 font-bold text-gray-500">Batal</button>
                        <button 
                            type="submit" 
                            disabled={submitting} 
                            className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all"
                        >
                            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

// --- KOMPONEN UTAMA (CLASS) ---
class Wali extends React.Component {
    constructor(props) {
        super(props)
        this.state = { modalToggle: false }
    }

    modalToggle = () => {
        this.setState({ modalToggle: !this.state.modalToggle })
    }

    submitWali = async (values) => {
        const token = cookies.get(cookieName);
        const formData = new FormData()
        
        // Iterasi values untuk masuk ke FormData
        Object.keys(values).forEach(key => {
            if (key === "file_scan_wali") {
                if (values[key] && values[key][0]) {
                    formData.append(key, values[key][0])
                }
            } else if (values[key] !== null && values[key] !== undefined) {
                let val = values[key];
                
                if (val instanceof Date || moment.isMoment(val)) {
                    val = moment(val).format("YYYY-MM-DD");
                }
                // Ekstraksi value jika berupa object
                else if (val && typeof val === 'object' && !Array.isArray(val)) {
                    val = val.kode || val.id || val.provinsi_id || val.kab_id || val.kecam_id || val;
                }
                
                formData.append(key, val)
            }
        });

        try {
            // 1. Jalankan Update
            await this.props.dispatch(wali.updateData(token, formData, this.props.noPeserta));
            
            // 2. Jika Berhasil, Refresh Data Utama
            await this.props.dispatch(wali.fetchAllData(token, this.props.noPeserta, this.props.atribut));
            
            // 3. Close Modal & Alert
            this.modalToggle();
            alert("Data Wali berhasil disimpan!");
            
            // 4. Reset Field File (Manual DOM reset untuk input file)
            const fileInput = document.getElementById('file_scan_wali');
            if (fileInput) fileInput.value = null;

        } catch (err) {
            console.error("Gagal menyimpan data wali:", err);
            alert("Terjadi kesalahan saat menyimpan data.");
        }
    }

    render() {
        const { wali: w_raw, location, editable } = this.props
        const w = w_raw || {}
        const isModeSanggah = editable

        return (
            <div className="space-y-4">
                {isModeSanggah && (
                    <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center text-orange-700">
                        <i className="fa fa-info-circle mr-3 text-xl"></i>
                        <span className="text-sm font-bold uppercase tracking-wide">Mode Sanggah Aktif: Silahkan perbarui data wali.</span>
                    </div>
                )}

                <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                    <div>
                        <h4 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                            <i className="fa fa-shield text-blue-600"></i> Data Wali
                        </h4>
                        <p className="text-gray-500 text-sm">Informasi orang tua / wali mahasiswa.</p>
                    </div>
                    {isModeSanggah && (
                        <button onClick={this.modalToggle} className="bg-amber-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-amber-700 shadow-md">
                            <i className="fa fa-pencil mr-2"></i> Perbarui Data
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-1/3 text-xs uppercase">Status</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${w.status_wali === 'ada' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {w.status_wali === 'ada' ? 'Ada' : 'Tidak Ada'}
                                    </span>
                                </td>
                            </tr>
                            { w.status_wali === "ada" && (
                                <>
                                    <tr>
                                        <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Nama Lengkap</td>
                                        <td className="p-4 font-medium text-gray-800">{w.nama_wali || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Tempat, Tgl Lahir</td>
                                        <td className="p-4 text-gray-700">
                                            { (w.tempat_lahir_wali || w.tanggal_lahir_wali) ? (
                                                <>
                                                    {w.tempat_lahir_wali || '-'}, {w.tanggal_lahir_wali ? moment(w.tanggal_lahir_wali).format("DD MMMM YYYY") : '-'}
                                                </>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Pekerjaan</td>
                                        <td className="p-4 text-gray-700">{w.pekerjaan?.nama || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Alamat</td>
                                        <td className="p-4 text-gray-700">
                                            {w.alamat_wali || '-'}
                                            {w.kecamatan?.kecam_nama && `, ${w.kecamatan.kecam_nama}`}
                                            {w.kabkot?.kab_nama && `, ${w.kabkot.kab_nama}`}
                                            {w.provinsi?.provinsi_nama && `, ${w.provinsi.provinsi_nama}`}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Komitmen Biaya</td>
                                        <td className="p-4 font-bold text-emerald-700">{rupiah(w.kesanggupan_wali || 0)}</td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                <FormWali
                    onSubmit={this.submitWali}
                    initialValues={w}
                    toggleWali={this.state.modalToggle}
                    handleToggleWali={this.modalToggle}
                />
            </div>
        )
    }
}

// --- REDUX FORM & CONNECT ---
FormWali = reduxForm({
    form: 'DataWaliSeleksi',
    enableReinitialize: true,
})(FormWali)

const selector = formValueSelector('DataWaliSeleksi')

FormWali = connect((store) => {
    const { status_wali, kesanggupan_wali } = selector(store, 'status_wali', 'kesanggupan_wali')
    
    // Pastikan ref selalu array untuk mencegah error .map
    return {
        status_wali,
        kesanggupan_wali,
        ref_provinsi_wali: Array.isArray(store.provinsi.provinsi) ? store.provinsi.provinsi : [],
        ref_kabkot_wali: Array.isArray(store.kabkot.kabkot_wali) ? store.kabkot.kabkot_wali : [],
        ref_kecamatan_wali: Array.isArray(store.kecamatan.kecamatan_wali) ? store.kecamatan.kecamatan_wali : [],
    }
})(FormWali)

export default withRouter(connect(
    (store) => ({
        wali: store.wali.wali,
    })
)(Wali))