import React from 'react'
import { Button,
         Col, Alert,
         Form, FormGroup, FormText, Label, Row, Table, 
         Modal, ModalBody, ModalHeader, ModalFooter  } from 'reactstrap'
import { Link, withRouter } from 'react-router-dom'         
import { Field, reduxForm, reset, formValueSelector } from 'redux-form'
import { InputBs, InputFileBs, money } from '../../../components'
import { wali, provinsi, kabkot, kecamatan } from '../../../../actions'   
import { connect } from 'react-redux'
import { cookies, cookieName, rupiah, storage, service } from '../../../../global';

let FormWali = (props) => {
    const { handleSubmit, handleToggleWali, toggleWali,
            pristine, submitting, dispatch,
            ref_provinsi_wali, ref_kabkot_wali, ref_kecamatan_wali,
            status_wali, kesanggupan_wali } = props

    const handleProvinsi = (e) => {
        dispatch(kabkot.fetchForWali(e.target.value))
        dispatch(kecamatan.fetchForWali({type: "FETCH_KECAMATAN_WALI_FULFILLED", payload: []}))
    }
    const handleKabkot = (e) => {
        dispatch(kecamatan.fetchForWali(e.target.value))
    }
    return (
        <Modal isOpen={toggleWali} toggle={handleToggleWali} size="lg" centered className="border-none">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-emerald-600 p-6 flex justify-between items-center text-white">
                    <h3 className="text-xl font-bold">Perbarui Data Wali</h3>
                    <button onClick={handleToggleWali} className="hover:rotate-90 transition-transform text-2xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto">
                    <FormGroup row>
                        <Label for="status_wali" md={3}>Status Wali</Label>                                             
                        <Col md={2}>
                            <Label check>
                                <Field name="status_wali" component={InputBs} type="radio" value="ada" />{' '}
                                Ada
                            </Label>
                        </Col>
                        <Col md={2}>
                            <Label check>
                                <Field name="status_wali" component={InputBs} type="radio" value="tidak" />{' '}
                                Tidak Ada
                            </Label>
                        </Col>
                    </FormGroup>
        
                    { status_wali === "ada" && (
                        <div>
                            <FormGroup row>
                                <Label for="nama_wali" md={3}>Nama Lengkap</Label>
                                <Col md={9}>
                                    <Field name="nama_wali" component={InputBs} type="text" placeholder="Nama Lengkap" />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="alamat_wali" md={3}>Alamat Lengkap</Label>
                                <Col md={9}>
                                    <Field name="alamat_wali" component={InputBs} type="textarea" rows="3" placeholder="Alamat Lengkap" />{' '}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="provinsi_wali" md={3}>Provinsi</Label>
                                <Col md={9}>
                                    <Field name="provinsi_wali" component={InputBs} type="select"  
                                        onChange={handleProvinsi}>{' '}
                                        <option value="">-- Pilih Provinsi --</option>
                                        { Array.isArray(ref_provinsi_wali) ? ref_provinsi_wali.map((data, key) => 
                                            <option value={data.provinsi_id} key={key}>{data.provinsi_nama}</option>
                                        ) : "" }
                                    </Field>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="kabkot_wali" md={3}>Kab/Kota</Label>
                                <Col md={9}>
                                    <Field name="kabkot_wali" component={InputBs} type="select"  
                                        onChange={handleKabkot}>{' '}        
                                        <option value="">-- Pilih Kabupaten/Kota --</option>
                                        { Array.isArray(ref_kabkot_wali) ? ref_kabkot_wali.map((data, key) => 
                                            <option value={data.kab_id} key={key}>{data.kab_nama}</option>
                                        ) : "" }
                                    </Field>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="kecamatan_wali" sm={3}>Kecamatan</Label>
                                <Col sm={9}>
                                    <Field name="kecamatan_wali" component={InputBs} type="select" >{' '}        
                                        <option value="">-- Pilih Kecamatan --</option>
                                        { Array.isArray(ref_kecamatan_wali) ? ref_kecamatan_wali.map((data, key) => 
                                            <option value={data.kecam_id} key={key}>{data.kecam_nama}</option>
                                        ) : "" }
                                    </Field>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="kesanggupan_wali" md={3}>Komitmen Pembiayaan</Label>
                                <Col md={5} xs={12}>
                                    <Field type="number" component={InputBs} pattern="[0-9]*" title="Hanya isi dengan angka (0-9)" name="kesanggupan_wali" id="kesanggupan_wali" placeholder="Komitmen Pembiayaan Wali" validate={[ money ]}/>
                                    <FormText color="muted">
                                        <ul className="list-reset">
                                            <li>Komitmen pembiayaan <b>per bulan</b>;</li>
                                            <li>Hanya isi dengan angka (0-9).</li>
                                        </ul>
                                    </FormText>
                                </Col>
                                <Col md={4} xs={12}>
                                    <Alert color="success">{ rupiah(kesanggupan_wali) }</Alert>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="file_scan_wali" md={3}>Surat Komitmen Pembiayaan Wali</Label>
                                <Col md={5}>
                                    <Field component={InputFileBs} type="file" name="file_scan_wali" id="file_scan_wali" />
                                    <FormText color="muted">
                                        <ul className="list-reset">
                                            <li>Ekstensi berkas berupa PDF;</li>
                                            <li>Ukuran berkas tidak lebih dari 500KB.</li>
                                        </ul>
                                    </FormText>
                                </Col>
                                <Col md={4}>
                                    <Button color="primary" size="sm" block><i className="fa fa-download"></i> Unduh Contoh <br/>Surat Komitmen Wali</Button>
                                    { (props.initialValues.scan_wali !== "" && props.initialValues.scan_wali !== null) && (
                                        <a href={storage+"/"+props.initialValues.scan_wali} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-block btn-sm"><i className="fa fa-file"></i> Lihat Surat Komitmen Wali</a>
                                    )}
                                </Col>
                            </FormGroup>
                        </div>
                    )} 
                </form>

                <div className="mt-10 flex justify-end space-x-3 border-t pt-6">
                    <button type="button" onClick={handleToggleWali} className="px-6 py-2.5 font-bold text-gray-500">Batal</button>
                    <button type="submit" disabled={pristine || submitting} className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg">
                        <i className="fa fa-save mr-2"></i> Simpan Perubahan
                    </button>
                </div>
            </div>
        </Modal>
    )
}
class Wali extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            modalToggle: false
        }
        this.modalToggle = this.modalToggle.bind(this)
        this.submitWali = this.submitWali.bind(this)
    }
    componentWillMount(){
        this.props.dispatch(provinsi.fetchProvinsi())
        this.props.dispatch(wali.fetchAllData(cookies.get(cookieName), this.props.noPeserta, this.props.atribut))
    }

    componentDidMount() {
        // Otomatis buka modal jika navigasi datang dari button "Sanggah" di DataTable
        const { location } = this.props;
        if (location.state && location.state.modeEdit) {
            setTimeout(() => {
                this.setState({ modalToggle: true });
            }, 800);
        }
    }
    modalToggle = () => {
        this.setState({
            modalToggle: !this.state.modalToggle
        })
    }
    submitWali = (values) => {
        this.setState({
            modalToggle: !this.state.modalToggle
        })
        var formData = new FormData()
        for(var key in values){
            var file = key.startsWith("file_scan") ? key : null
            if(file){
                formData.append(key, values[key][0])   
                document.getElementById(file).value = null;    
            }else{
                formData.append(key, values[key])
            }
        }
        this.props.dispatch(wali.updateData(cookies.get(cookieName), formData, this.props.noPeserta)).then(() => {
            this.modalToggle();
            // Refetch data agar tampilan InfoItem langsung terupdate
            this.props.dispatch(wali.fetchAllData(cookies.get(cookieName), this.props.noPeserta, this.props.atribut))
        })
        this.props.dispatch(reset('DataWaliSeleksi'))
    }
    render(){
        const { wali: w_raw, location } = this.props;
        const w = w_raw || {}
        const isModeSanggah = location.state && location.state.modeEdit;

        return (
            <div className="space-y-4">
                {/* Banner Mode Sanggah */}
                {isModeSanggah && (
                    <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center text-orange-700 animate-pulse">
                        <i className="fa fa-info-circle mr-3 text-xl"></i>
                        <span className="text-sm font-bold uppercase">Mode Sanggah Aktif: Anda dapat mengubah data wali sekarang.</span>
                    </div>
                )}

                <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                    <div>
                        <h4 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                            <i className="fa fa-shield text-blue-600"></i> Data Wali
                        </h4>
                        <p className="text-gray-500 text-sm">Informasi wali / penjamin mahasiswa.</p>
                    </div>
                    { isModeSanggah && (
                        <button onClick={this.modalToggle} className="bg-amber-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-amber-700 transition-all shadow-md">
                            <i className="fa fa-pencil mr-2"></i> Perbarui Data
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-blue-50 flex items-center gap-2 font-bold">
                        <i className="fa fa-shield text-blue-600"></i>
                        <span className="uppercase text-gray-700 tracking-wider text-sm">Informasi Wali</span>
                    </div>
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-1/3 text-xs uppercase">Status Wali</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${w.status_wali === 'ada' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {w.status_wali === 'ada' ? 'Ada' : (w.status_wali === 'tidak' ? 'Tidak Ada' : 'Belum diisi')}
                                    </span>
                                </td>
                            </tr>
                            { w.status_wali === "ada" && (<>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Nama Lengkap</td>
                                    <td className="p-4 font-medium text-gray-800">{w.nama_wali || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Alamat</td>
                                    <td className="p-4 text-gray-700">
                                        { w.provinsi != null
                                            ? `${w.alamat_wali}, ${w.kecamatan.kecam_nama}, ${w.kabkot.kab_nama}, ${w.provinsi.provinsi_nama}`
                                            : (w.alamat_wali || '-')
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Komitmen Pembiayaan</td>
                                    <td className="p-4 font-bold text-emerald-700">{rupiah(w.kesanggupan_wali)} <span className="text-gray-400 font-normal text-xs">/ bulan</span></td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Surat Komitmen</td>
                                    <td className="p-4">
                                        { (w.scan_wali && w.scan_wali !== "") ? (
                                            <a href={storage+"/"+w.scan_wali} target="_blank" rel="noopener noreferrer"
                                               className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-sm">
                                                <i className="fa fa-download"></i> Lihat Surat Komitmen
                                            </a>
                                        ) : <span className="text-gray-400 italic text-xs">Belum diunggah</span>}
                                    </td>
                                </tr>
                            </>)}
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

FormWali = reduxForm({
    form: 'DataWaliSeleksi',
    enableReinitialize: true,
})(FormWali)

const selector = formValueSelector('DataWaliSeleksi')

FormWali = connect((store) => {
    let {status_wali, kesanggupan_wali} = selector(store, 'status_wali', 'kesanggupan_wali')
    return {
        status_wali,
        kesanggupan_wali,

        ref_provinsi_wali: store.provinsi.provinsi,
        ref_kabkot_wali: store.kabkot.kabkot_wali,
        ref_kecamatan_wali: store.kecamatan.kecamatan_wali,
    }
}, {
    kabkot, kecamatan
})(FormWali)

export default withRouter(connect(
    (store) => ({
        wali: store.wali.wali,
    })
)(Wali))