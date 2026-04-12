import React from 'react'
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
        dispatch(kabkot.fetchForWali(val))
        // Reset field kabkot dan kecamatan jika provinsi berubah
        dispatch(change('DataWaliSeleksi', 'kabkot_wali', ''))
        dispatch(change('DataWaliSeleksi', 'kecamatan_wali', ''))
        dispatch(kecamatan.fetchForWali({ type: "FETCH_KECAMATAN_WALI_FULFILLED", payload: [] }))
    }

    const handleKabkot = (e) => {
        const val = e.target.value
        dispatch(kecamatan.fetchForWali(val))
        // Reset field kecamatan jika kabkot berubah
        dispatch(change('DataWaliSeleksi', 'kecamatan_wali', ''))
    }

    return (
        <Modal isOpen={toggleWali} toggle={handleToggleWali} size="lg" centered className="border-none">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-emerald-600 p-6 flex justify-between items-center text-white">
                    <h3 className="text-xl font-bold">Perbarui Data Wali</h3>
                    <button onClick={handleToggleWali} className="hover:rotate-90 transition-transform text-2xl">&times;</button>
                </div>
                
                {/* Body Form */}
                <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto">
                    <FormGroup row>
                        <Label for="status_wali" md={3}>Status Wali</Label>                                            
                        <Col md={2}>
                            <Label check className="cursor-pointer">
                                <Field name="status_wali" component={InputBs} type="radio" value="ada" />{' '} Ada
                            </Label>
                        </Col>
                        <Col md={2}>
                            <Label check className="cursor-pointer">
                                <Field name="status_wali" component={InputBs} type="radio" value="tidak" />{' '} Tidak Ada
                            </Label>
                        </Col>
                    </FormGroup>
        
                    { status_wali === "ada" && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                            <FormGroup row>
                                <Label for="nama_wali" md={3}>Nama Lengkap</Label>
                                <Col md={9}>
                                    <Field name="nama_wali" component={InputBs} type="text" placeholder="Nama Lengkap" />
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="alamat_wali" md={3}>Alamat Lengkap</Label>
                                <Col md={9}>
                                    <Field name="alamat_wali" component={InputBs} type="textarea" rows="3" placeholder="Nama jalan, nomor rumah, RT/RW" />
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="provinsi_wali" md={3}>Provinsi</Label>
                                <Col md={9}>
                                    <Field name="provinsi_wali" component={InputBs} type="select" onChange={handleProvinsi}>
                                        <option value="">-- Pilih Provinsi --</option>
                                        { Array.isArray(ref_provinsi_wali) && ref_provinsi_wali.map((data, key) => 
                                            <option value={data.provinsi_id} key={key}>{data.provinsi_nama}</option>
                                        )}
                                    </Field>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="kabkot_wali" md={3}>Kab/Kota</Label>
                                <Col md={9}>
                                    <Field name="kabkot_wali" component={InputBs} type="select" onChange={handleKabkot}>
                                        <option value="">-- Pilih Kabupaten/Kota --</option>
                                        { Array.isArray(ref_kabkot_wali) && ref_kabkot_wali.map((data, key) => 
                                            <option value={data.kab_id} key={key}>{data.kab_nama}</option>
                                        )}
                                    </Field>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="kecamatan_wali" md={3}>Kecamatan</Label>
                                <Col md={9}>
                                    <Field name="kecamatan_wali" component={InputBs} type="select">
                                        <option value="">-- Pilih Kecamatan --</option>
                                        { Array.isArray(ref_kecamatan_wali) && ref_kecamatan_wali.map((data, key) => 
                                            <option value={data.kecam_id} key={key}>{data.kecam_nama}</option>
                                        )}
                                    </Field>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="kesanggupan_wali" md={3}>Komitmen Biaya</Label>
                                <Col md={5}>
                                    <Field type="number" component={InputBs} name="kesanggupan_wali" placeholder="Contoh: 1000000" validate={[ money ]}/>
                                    <FormText color="muted">Komitmen per bulan (Angka saja).</FormText>
                                </Col>
                                <Col md={4}>
                                    <Alert color="success" className="py-2 text-center font-bold">
                                        { rupiah(kesanggupan_wali || 0) }
                                    </Alert>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="file_scan_wali" md={3}>Scan Surat Komitmen</Label>
                                <Col md={5}>
                                    <Field component={InputFileBs} type="file" name="file_scan_wali" id="file_scan_wali" />
                                    <FormText color="muted">PDF (Maks. 500KB).</FormText>
                                </Col>
                                <Col md={4} className="space-y-2">
                                    <button type="button" className="btn btn-outline-primary btn-sm btn-block">
                                        <i className="fa fa-download mr-1"></i> Unduh Contoh
                                    </button>
                                    { props.initialValues?.scan_wali && (
                                        <a href={`${storage}/${props.initialValues.scan_wali}`} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-sm btn-block text-white">
                                            <i className="fa fa-file mr-1"></i> Lihat Berkas
                                        </a>
                                    )}
                                </Col>
                            </FormGroup>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-8 flex justify-end space-x-3 border-t pt-6">
                        <button type="button" onClick={handleToggleWali} className="px-6 py-2.5 font-bold text-gray-500 hover:text-gray-700">Batal</button>
                        <button 
                            type="submit" 
                            disabled={pristine || submitting} 
                            className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg hover:bg-emerald-700 disabled:opacity-50 transition-all"
                        >
                            {submitting ? <i className="fa fa-spinner fa-spin mr-2"></i> : <i className="fa fa-save mr-2"></i>}
                            Simpan Perubahan
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

    // componentDidMount() {
    //     const { dispatch, noPeserta, atribut, location } = this.props
    //     dispatch(provinsi.fetchProvinsi())
    //     dispatch(wali.fetchAllData(cookies.get(cookieName), noPeserta, atribut))

    //     if (location.state?.modeEdit) {
    //         setTimeout(() => this.setState({ modalToggle: true }), 800)
    //     }
    // }

    modalToggle = () => {
        this.setState({ modalToggle: !this.state.modalToggle })
    }

    submitWali = (values) => {
        const formData = new FormData()
        
        for (const key in values) {
            if (key === "file_scan_wali" && values[key] && values[key][0]) {
                formData.append(key, values[key][0])
                // Reset input file di DOM
                const fileInput = document.getElementById(key)
                if (fileInput) fileInput.value = null
            } else if (values[key] !== null && values[key] !== undefined) {
                formData.append(key, values[key])
            }
        }

        return this.props.dispatch(wali.updateData(cookies.get(cookieName), formData, this.props.noPeserta))
            .then(() => {
                this.modalToggle()
                this.props.dispatch(wali.fetchAllData(cookies.get(cookieName), this.props.noPeserta, this.props.atribut))
                this.props.dispatch(reset('DataWaliSeleksi'))
            })
            .catch(err => console.error("Update failed:", err))
    }

    render() {
        const { wali: w_raw, location } = this.props
        const w = w_raw || {}
        const isModeSanggah = location.state?.modeEdit

        return (
            <div className="space-y-4">
                {/* Mode Sanggah Alert */}
                {isModeSanggah && (
                    <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center text-orange-700 animate-pulse">
                        <i className="fa fa-info-circle mr-3 text-xl"></i>
                        <span className="text-sm font-bold uppercase tracking-wide">Mode Sanggah Aktif: Anda dapat mengubah data wali.</span>
                    </div>
                )}

                {/* Title & Action */}
                <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                    <div>
                        <h4 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                            <i className="fa fa-shield text-blue-600"></i> Data Wali
                        </h4>
                        <p className="text-gray-500 text-sm">Informasi wali / penjamin mahasiswa.</p>
                    </div>
                    {isModeSanggah && (
                        <button onClick={this.modalToggle} className="bg-amber-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-amber-700 transition-all shadow-md">
                            <i className="fa fa-pencil mr-2"></i> Perbarui Data
                        </button>
                    )}
                </div>

                {/* Data Display Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-blue-50 flex items-center gap-2 font-bold">
                        <i className="fa fa-info-circle text-blue-600"></i>
                        <span className="uppercase text-gray-700 tracking-wider text-xs">Detail Informasi</span>
                    </div>
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-1/3 text-xs uppercase">Status</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${w.status_wali === 'ada' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {w.status_wali === 'ada' ? 'Ada' : (w.status_wali === 'tidak' ? 'Tidak Ada' : 'Belum diisi')}
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
                                        <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Alamat</td>
                                        <td className="p-4 text-gray-700">
                                            { w.provinsi 
                                                ? `${w.alamat_wali}, ${w.kecamatan?.kecam_nama}, ${w.kabkot?.kab_nama}, ${w.provinsi?.provinsi_nama}`
                                                : (w.alamat_wali || '-')
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Komitmen</td>
                                        <td className="p-4 font-bold text-emerald-700">{rupiah(w.kesanggupan_wali || 0)} <span className="text-gray-400 font-normal text-xs">/ bulan</span></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Berkas</td>
                                        <td className="p-4">
                                            { w.scan_wali ? (
                                                <a href={`${storage}/${w.scan_wali}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold text-xs inline-flex items-center gap-1">
                                                    <i className="fa fa-external-link"></i> Buka Surat Komitmen
                                                </a>
                                            ) : <span className="text-gray-400 italic">Belum diunggah</span>}
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                <FormWali
                    onSubmit={this.submitWali}
                    initialValues={this.props.wali}
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
    return {
        status_wali,
        kesanggupan_wali,
        ref_provinsi_wali: store.provinsi.provinsi,
        ref_kabkot_wali: store.kabkot.kabkot_wali,
        ref_kecamatan_wali: store.kecamatan.kecamatan_wali,
    }
})(FormWali)

export default withRouter(connect(
    (store) => ({
        wali: store.wali.wali,
    })
)(Wali))