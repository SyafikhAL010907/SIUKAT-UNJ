import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Table, Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Alert, FormText } from 'reactstrap'
import { Field, reduxForm, reset, formValueSelector } from 'redux-form'
import { ayah, provinsi, pekerjaan, kabkot, kecamatan } from '../../../../actions'
import { InputBs, InputDayPicker, InputFileBs, money } from '../../../components'
import { cookies, cookieName, rupiah, storage, service } from '../../../../global'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

let FormAyah = (props) => {
    const { handleSubmit, handleToggleAyah, toggleAyah,
            pristine, submitting, dispatch,
            ref_pekerjaan, ref_provinsi_ayah, ref_kabkot_ayah, ref_kecamatan_ayah,
            status_ayah, penghasilan_ayah, sampingan_ayah, } = props

    const handleProvinsi = (e) => {
        dispatch(kabkot.fetchForAyah(e.target.value))
        dispatch(kecamatan.fetchForAyah({type: "FETCH_KECAMATAN_FULFILLED", payload: []}))
    }
    const handleKabkot = (e) => {
        dispatch(kecamatan.fetchForAyah(e.target.value))
    }
    return (
        <Modal isOpen={toggleAyah} toggle={handleToggleAyah} size="lg" centered className="border-none">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-emerald-600 p-6 flex justify-between items-center text-white">
                    <h3 className="text-xl font-bold">Perbarui Data Ayah</h3>
                    <button onClick={handleToggleAyah} className="hover:rotate-90 transition-transform text-2xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto">
                    <FormGroup row>
                        <Label for="nama_ayah" md={3}>Nama Lengkap</Label>
                        <Col md={9}>
                            <Field name="nama_ayah" component={InputBs} type="text" placeholder="Nama Lengkap"/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="status_ayah" md={3}></Label>                                            
                        <Col md={4}>
                            <Label check>
                                <Field name="status_ayah" component={InputBs} type="radio" value="hidup" />{' '}
                                Hidup
                            </Label>
                        </Col>
                        <Col md={5}>
                            <Label check>
                                <Field name="status_ayah" component={InputBs} type="radio" value="wafat" />{' '}
                                Wafat
                            </Label>
                        </Col>
                    </FormGroup>

                    { status_ayah === "hidup" && (
                        <div>
                            <FormGroup row>
                                <Label for="nik_ayah" md={3}>NIK</Label>
                                <Col md={9}>
                                    <Field name="nik_ayah" component={InputBs} type="text" placeholder="NIK Ayah"/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="file_scan_ktp_ayah" md={3}>KTP Ayah</Label>
                                <Col md={5}>
                                    <Field component={InputFileBs} type="file" className="form-control" name="file_scan_ktp_ayah" id="file_scan_ktp_ayah" />
                                </Col>
                                { props.initialValues.scan_ktp_ayah && (
                                    <Col md={4}>
                                        <a href={storage+"/"+props.initialValues.scan_ktp_ayah} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-block"><i className="fa fa-file"></i> Lihat KTP Ayah</a>
                                    </Col>
                                )}
                            </FormGroup>
                            <FormGroup row>
                                <Label md={3} xs={12}>Tempat & <br/>Tanggal Lahir</Label>
                                <Col md={5}>
                                    <Field name="tempat_lahir_ayah" component={InputBs} type="text" placeholder="Tempat Lahir"/>{' '}     
                                </Col>
                                <Col md={4} xs={12}>
                                    <Field name="tanggal_lahir_ayah" component={InputDayPicker} startYear={1950} placeholder="Tanggal Lahir"/>
                                </Col>
                            </FormGroup>                     
                            <FormGroup row>
                                <Label for="alamat_ayah" md={3}>Alamat Lengkap</Label>
                                <Col md={9}>
                                    <Field name="alamat_ayah" component={InputBs} type="textarea" rows="3" placeholder="Alamat Lengkap"/>{' '}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="provinsi_ayah" md={3}>Provinsi</Label>
                                <Col md={9}>
                                    <Field name="provinsi_ayah" component={InputBs} type="select" 
                                        onChange={handleProvinsi}>{' '}
                                        <option value="">-- Pilih Provinsi --</option>
                                        { Array.isArray(ref_provinsi_ayah) ? ref_provinsi_ayah.map((data, key) => 
                                            <option value={data.provinsi_id} key={key}>{data.provinsi_nama}</option>
                                        ) : "" }
                                    </Field>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="kabkot_ayah" md={3}>Kab/Kota</Label>
                                <Col md={9}>
                                    <Field name="kabkot_ayah" component={InputBs} type="select" 
                                        onChange={handleKabkot}>{' '}        
                                        <option value="">-- Pilih Kabupaten/Kota --</option>
                                        { Array.isArray(ref_kabkot_ayah) ? ref_kabkot_ayah.map((data, key) => 
                                            <option value={data.kab_id} key={key}>{data.kab_nama}</option>
                                        ) : "" }
                                    </Field>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="kecamatan_ayah" sm={3}>Kecamatan</Label>
                                <Col sm={9}>
                                    <Field name="kecamatan_ayah" component={InputBs} type="select">{' '}        
                                        <option value="">-- Pilih Kecamatan --</option>
                                        { Array.isArray(ref_kecamatan_ayah) ? ref_kecamatan_ayah.map((data, key) => 
                                            <option value={data.kecam_id} key={key}>{data.kecam_nama}</option>
                                        ) : "" }
                                    </Field>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="pekerjaan_ayah" md={3}>Pekerjaan</Label>
                                <Col md={9}>
                                    <Field type="select" component={InputBs} name="pekerjaan_ayah" id="pekerjaan_ayah">   
                                        <option value="">-- Pilih Pekerjaan --</option>
                                        { Array.isArray(ref_pekerjaan) ? ref_pekerjaan.map((data, key) => 
                                            <option value={data.kode} key={key}>{data.nama}</option>
                                        ) : "" }
                                    </Field>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="penghasilan_ayah" md={3}>Penghasilan</Label>
                                <Col md={5} xs={12}>
                                    <Field type="number" component={InputBs} pattern="[0-9]*" title="Hanya isi dengan angka (0-9)" name="penghasilan_ayah" id="penghasilan_ayah" placeholder="Penghasilan Ayah" validate={[ money ]}/>
                                    <FormText color="muted">
                                        <ul className="list-reset">
                                            <li>Penghasilan <b>per bulan</b>;</li>
                                            <li>Hanya isi dengan angka (0-9).</li>
                                        </ul>
                                    </FormText>
                                </Col>
                                <Col md={4} xs={12}>
                                    <Alert color="success">{ rupiah(penghasilan_ayah) }</Alert>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="sampingan_ayah" md={3}>Sampingan</Label>
                                <Col md={5} xs={12}>
                                    <Field type="number" component={InputBs} pattern="[0-9]*" title="Hanya isi dengan angka (0-9)" name="sampingan_ayah" id="sampingan_ayah" placeholder="Penghasilan Sampingan Ayah"/>
                                    <FormText color="muted">
                                        <ul className="list-reset">
                                            <li>Sampingan <b>per bulan</b>;</li>
                                            <li>Hanya isi dengan angka (0-9).</li>
                                        </ul>
                                    </FormText>
                                </Col>
                                <Col md={4} xs={12}>
                                    <Alert color="success">{ rupiah(sampingan_ayah) }</Alert>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="file_scan_slip_ayah" md={3}>Slip Gaji / Bukti Penghasilan</Label>
                                <Col md={5}>
                                    <Field component={InputFileBs} type="file" name="file_scan_slip_ayah" id="file_scan_slip_ayah" />
                                </Col>
                                { props.initialValues.scan_slip_ayah && (
                                    <Col md={4}>
                                        <a href={storage+"/"+props.initialValues.scan_slip_ayah} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-block"><i className="fa fa-file"></i> Lihat Slip Gaji Ayah</a>
                                    </Col>
                                )}
                            </FormGroup>
                            <FormGroup row>
                                <Label for="telepon_ayah" md={3}>Nomor Telepon</Label>
                                <Col md={9}>
                                    <Field name="telepon_ayah" component={InputBs} type="text" placeholder="Nomor Telepon" pattern="[0-9]{0,13}" title="Hanya isi dengan angka 0-9. Maksimal 13 digit."/>                    
                                    <FormText color="muted">
                                        Hanya isi dengan angka. Maksimal 13 digit.
                                    </FormText>
                                </Col>
                            </FormGroup>
                        </div>
                    )}
                </form>

                <div className="mt-10 flex justify-end space-x-3 border-t pt-6">
                    <button type="button" onClick={handleToggleAyah} className="px-6 py-2.5 font-bold text-gray-500">Batal</button>
                    <button type="submit" disabled={pristine || submitting} className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg">
                        <i className="fa fa-save mr-2"></i> Simpan Perubahan
                    </button>
                </div>
            </div>
        </Modal>
    )
}

class Ayah extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            modalToggle: false
        }
        this.modalToggle = this.modalToggle.bind(this)
        this.submitAyah = this.submitAyah.bind(this)
    }
    componentWillMount(){
        this.props.dispatch(pekerjaan.fetchPekerjaan(cookies.get(cookieName)))
        this.props.dispatch(provinsi.fetchProvinsi())
        this.props.dispatch(ayah.fetchAllData(cookies.get(cookieName), this.props.noPeserta, this.props.atribut))
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
    submitAyah = (values) => {
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
        this.props.dispatch(ayah.updateData(cookies.get(cookieName), formData, this.props.noPeserta)).then(() => {
            this.modalToggle();
            // Refetch data agar tampilan InfoItem langsung terupdate
            this.props.dispatch(ayah.fetchAllData(cookies.get(cookieName), this.props.noPeserta, this.props.atribut))
        })
        this.props.dispatch(reset('DataAyahSeleksi'))        
    }
    render(){
        const { ayah, location } = this.props;
        const data = ayah || {}
        const isModeSanggah = location.state && location.state.modeEdit;

        return (
            <div className="space-y-4">
                {/* Banner Notifikasi Mode Sanggah */}
                {isModeSanggah && (
                    <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center text-orange-700 animate-pulse">
                        <i className="fa fa-info-circle mr-3 text-xl"></i>
                        <span className="text-sm font-bold uppercase">Mode Sanggah Aktif: Anda dapat mengubah data ayah sekarang.</span>
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                    <div>
                        <h4 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                            <i className="fa fa-male text-emerald-600"></i> Data Ayah
                        </h4>
                        <p className="text-gray-500 text-sm">Informasi orang tua kandung / ayah.</p>
                    </div>
                    { isModeSanggah && (
                        <button onClick={this.modalToggle} className="bg-amber-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-amber-700 transition-all shadow-md">
                            <i className="fa fa-pencil mr-2"></i> Perbarui Data
                        </button>
                    )}
                </div>

                {/* Card Tabel */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-emerald-50 flex items-center gap-2 font-bold">
                        <i className="fa fa-user text-emerald-700"></i>
                        <span className="uppercase text-gray-700 tracking-wider text-sm">Informasi Ayah</span>
                    </div>
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-1/3 text-xs uppercase">Nama Lengkap</td>
                                <td className="p-4 font-medium text-gray-800">{data.nama_ayah || '-'}</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Status</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${data.status_ayah === 'hidup' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {data.status_ayah || 'Belum diisi'}
                                    </span>
                                </td>
                            </tr>

                            { data.status_ayah === "hidup" && (<>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">NIK</td>
                                    <td className="p-4 font-mono text-gray-700">{data.nik_ayah || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">KTP</td>
                                    <td className="p-4">
                                        { (data.scan_ktp_ayah && data.scan_ktp_ayah !== "") ? (
                                            <a href={storage+"/"+data.scan_ktp_ayah} target="_blank" rel="noopener noreferrer"
                                               className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-sm">
                                                <i className="fa fa-download"></i> Lihat KTP
                                            </a>
                                        ) : <span className="text-gray-400 italic text-xs">Belum diunggah</span>}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Tempat, Tgl Lahir</td>
                                    <td className="p-4 text-gray-700">{data.tempat_lahir_ayah ? `${data.tempat_lahir_ayah}, ${data.tanggal_lahir_ayah}` : '-'}</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Alamat</td>
                                    <td className="p-4 text-gray-700">
                                        { data.provinsi != null
                                            ? `${data.alamat_ayah}, ${data.kecamatan.kecam_nama}, ${data.kabkot.kab_nama}, ${data.provinsi.provinsi_nama}`
                                            : (data.alamat_ayah || '-')
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Pekerjaan</td>
                                    <td className="p-4 text-gray-700">{data.pekerjaan?.nama || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Penghasilan</td>
                                    <td className="p-4 font-bold text-emerald-700">{rupiah(data.penghasilan_ayah)} <span className="text-gray-400 font-normal text-xs">/ bulan</span></td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Penghasilan Sampingan</td>
                                    <td className="p-4 font-bold text-emerald-700">{rupiah(data.sampingan_ayah)} <span className="text-gray-400 font-normal text-xs">/ bulan</span></td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Bukti Penghasilan</td>
                                    <td className="p-4">
                                        { (data.scan_slip_ayah && data.scan_slip_ayah !== "") ? (
                                            <a href={storage+"/"+data.scan_slip_ayah} target="_blank" rel="noopener noreferrer"
                                               className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-sm">
                                                <i className="fa fa-download"></i> Lihat Slip Gaji
                                            </a>
                                        ) : <span className="text-gray-400 italic text-xs">Belum diunggah</span>}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Nomor Telepon</td>
                                    <td className="p-4 font-mono text-gray-700">{data.telepon_ayah || '-'}</td>
                                </tr>
                            </>)}
                        </tbody>
                    </table>
                </div>

                <FormAyah
                    onSubmit={this.submitAyah}
                    initialValues={this.props.ayah}
                    toggleAyah={this.state.modalToggle}
                    handleToggleAyah={this.modalToggle}
                />
            </div>
        )
    }
}

FormAyah = reduxForm({
    form: 'DataAyahSeleksi',
    enableReinitialize: true,
})(FormAyah)

const selector = formValueSelector('DataAyahSeleksi')

FormAyah = connect((store) => {
    let { status_ayah, penghasilan_ayah, sampingan_ayah } = selector(store, 'status_ayah', 'penghasilan_ayah', 'sampingan_ayah', 'provinsi_ayah', 'kabkot_ayah', 'kecamatan_ayah')
    return {
        status_ayah,
        penghasilan_ayah,
        sampingan_ayah,

        ref_provinsi_ayah: store.provinsi.provinsi,
        ref_kabkot_ayah: store.kabkot.kabkot_ayah,
        ref_kecamatan_ayah: store.kecamatan.kecamatan_ayah,
        ref_pekerjaan: store.pekerjaan.pekerjaan,
    }
}, {
    kabkot, kecamatan
})(FormAyah)

export default withRouter(connect(
    (store) => ({
        ayah: store.ayah.ayah,
    })
)(Ayah))