import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Table, Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Alert, FormText } from 'reactstrap'
import { Field, reduxForm, reset, formValueSelector } from 'redux-form'
import { ibu, provinsi, pekerjaan, kabkot, kecamatan } from '../../../../actions' // Pastikan action 'ibu' sudah ada
import { InputBs, InputDayPicker, InputFileBs, money } from '../../../components'
import { cookies, cookieName, rupiah, storage, service } from '../../../../global'
import { connect } from 'react-redux'

let FormIbu = (props) => {
    const { handleSubmit, handleToggleIbu, toggleIbu,
            pristine, submitting, dispatch,
            ref_pekerjaan, ref_provinsi_ibu, ref_kabkot_ibu, ref_kecamatan_ibu,
            status_ibu, penghasilan_ibu, sampingan_ibu, } = props

    const handleProvinsi = (e) => {
        dispatch(kabkot.fetchForIbu(e.target.value))
        dispatch(kecamatan.fetchForIbu({type: "FETCH_KECAMATAN_FULFILLED", payload: []}))
    }
    const handleKabkot = (e) => {
        dispatch(kecamatan.fetchForIbu(e.target.value))
    }
    return (
        <Form onSubmit={handleSubmit} id="form-ibu" className="form-horizontal">        
            <Modal isOpen={toggleIbu} toggle={handleToggleIbu} size="lg"
            className={'modal-success'}>
                <ModalHeader toggle={handleToggleIbu}>Form Ibu</ModalHeader>
                <ModalBody>
                    <FormGroup row>
                        <Label for="nama_ibu" md={3}>Nama Lengkap</Label>
                        <Col md={9}>
                            <Field name="nama_ibu" component={InputBs} type="text" placeholder="Nama Lengkap"/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="status_ibu" md={3}></Label>                                            
                        <Col md={4}>
                            <Label check>
                                <Field name="status_ibu" component={InputBs} type="radio" value="hidup" />{' '}
                                Hidup
                            </Label>
                        </Col>
                        <Col md={5}>
                            <Label check>
                                <Field name="status_ibu" component={InputBs} type="radio" value="wafat" />{' '}
                                Wafat / Tidak Diketahui
                            </Label>
                        </Col>
                    </FormGroup>

                    { status_ibu === "hidup" && (
                        <div>
                            <FormGroup row>
                                <Label for="nik_ibu" md={3}>NIK</Label>
                                <Col md={9}>
                                    <Field name="nik_ibu" component={InputBs} type="text" placeholder="NIK Ibu"/>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="file_scan_ktp_ibu" md={3}>KTP Ibu</Label>
                                <Col md={5}>
                                    <Field component={InputFileBs} type="file" className="form-control" name="file_scan_ktp_ibu" id="file_scan_ktp_ibu" />
                                </Col>
                                { props.initialValues.scan_ktp_ibu && (
                                    <Col md={4}>
                                        <a href={storage+"/"+props.initialValues.scan_ktp_ibu} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-block"><i className="fa fa-file"></i> Lihat KTP Ibu</a>
                                    </Col>
                                )}
                            </FormGroup>
                            <FormGroup row>
                                <Label md={3} xs={12}>Tempat & <br/>Tanggal Lahir</Label>
                                <Col md={5}>
                                    <Field name="tempat_lahir_ibu" component={InputBs} type="text" placeholder="Tempat Lahir"/>{' '}     
                                </Col>
                                <Col md={4} xs={12}>
                                    <Field name="tanggal_lahir_ibu" component={InputDayPicker} startYear={1950} placeholder="Tanggal Lahir"/>
                                </Col>
                            </FormGroup>                     
                            <FormGroup row>
                                <Label for="alamat_ibu" md={3}>Alamat Lengkap</Label>
                                <Col md={9}>
                                    <Field name="alamat_ibu" component={InputBs} type="textarea" rows="3" placeholder="Alamat Lengkap"/>{' '}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="provinsi_ibu" md={3}>Provinsi</Label>
                                <Col md={9}>
                                    <Field name="provinsi_ibu" component={InputBs} type="select" 
                                        onChange={handleProvinsi}>{' '}
                                        <option value="">-- Pilih Provinsi --</option>
                                        { Array.isArray(ref_provinsi_ibu) ? ref_provinsi_ibu.map((data, key) => 
                                            <option value={data.provinsi_id} key={key}>{data.provinsi_nama}</option>
                                        ) : "" }
                                    </Field>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="kabkot_ibu" md={3}>Kab/Kota</Label>
                                <Col md={9}>
                                    <Field name="kabkot_ibu" component={InputBs} type="select" 
                                        onChange={handleKabkot}>{' '}        
                                        <option value="">-- Pilih Kabupaten/Kota --</option>
                                        { Array.isArray(ref_kabkot_ibu) ? ref_kabkot_ibu.map((data, key) => 
                                            <option value={data.kab_id} key={key}>{data.kab_nama}</option>
                                        ) : "" }
                                    </Field>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="kecamatan_ibu" sm={3}>Kecamatan</Label>
                                <Col sm={9}>
                                    <Field name="kecamatan_ibu" component={InputBs} type="select">{' '}        
                                        <option value="">-- Pilih Kecamatan --</option>
                                        { Array.isArray(ref_kecamatan_ibu) ? ref_kecamatan_ibu.map((data, key) => 
                                            <option value={data.kecam_id} key={key}>{data.kecam_nama}</option>
                                        ) : "" }
                                    </Field>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="pekerjaan_ibu" md={3}>Pekerjaan</Label>
                                <Col md={9}>
                                    <Field type="select" component={InputBs} name="pekerjaan_ibu" id="pekerjaan_ibu">   
                                        <option value="">-- Pilih Pekerjaan --</option>
                                        { Array.isArray(ref_pekerjaan) ? ref_pekerjaan.map((data, key) => 
                                            <option value={data.kode} key={key}>{data.nama}</option>
                                        ) : "" }
                                    </Field>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="penghasilan_ibu" md={3}>Penghasilan</Label>
                                <Col md={5} xs={12}>
                                    <Field type="number" component={InputBs} pattern="[0-9]*" title="Hanya isi dengan angka (0-9)" name="penghasilan_ibu" id="penghasilan_ibu" placeholder="Penghasilan Ibu" validate={[ money ]}/>
                                    <FormText color="muted">
                                        <ul className="list-reset">
                                            <li>Penghasilan <b>per bulan</b>;</li>
                                            <li>Hanya isi dengan angka (0-9).</li>
                                        </ul>
                                    </FormText>
                                </Col>
                                <Col md={4} xs={12}>
                                    <Alert color="success">{ rupiah(penghasilan_ibu) }</Alert>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="sampingan_ibu" md={3}>Sampingan</Label>
                                <Col md={5} xs={12}>
                                    <Field type="number" component={InputBs} pattern="[0-9]*" title="Hanya isi dengan angka (0-9)" name="sampingan_ibu" id="sampingan_ibu" placeholder="Penghasilan Sampingan Ibu"/>
                                    <FormText color="muted">
                                        <ul className="list-reset">
                                            <li>Sampingan <b>per bulan</b>;</li>
                                            <li>Hanya isi dengan angka (0-9).</li>
                                        </ul>
                                    </FormText>
                                </Col>
                                <Col md={4} xs={12}>
                                    <Alert color="success">{ rupiah(sampingan_ibu) }</Alert>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="file_scan_slip_ibu" md={3}>Slip Gaji / Bukti Penghasilan</Label>
                                <Col md={5}>
                                    <Field component={InputFileBs} type="file" name="file_scan_slip_ibu" id="file_scan_slip_ibu" />
                                </Col>
                                { props.initialValues.scan_slip_ibu && (
                                    <Col md={4}>
                                        <a href={storage+"/"+props.initialValues.scan_slip_ibu} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-block"><i className="fa fa-file"></i> Lihat Slip Gaji Ibu</a>
                                    </Col>
                                )}
                            </FormGroup>
                            <FormGroup row>
                                <Label for="telepon_ibu" md={3}>Nomor Telepon</Label>
                                <Col md={9}>
                                    <Field name="telepon_ibu" component={InputBs} type="text" placeholder="Nomor Telepon" pattern="[0-9]{0,13}" title="Hanya isi dengan angka 0-9. Maksimal 13 digit."/>                     
                                    <FormText color="muted">
                                        Hanya isi dengan angka. Maksimal 13 digit.
                                    </FormText>
                                </Col>
                            </FormGroup>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter className="text-right">
                    <Button color="success" type="submit" form="form-ibu" disabled={pristine || submitting}><i className="fa fa-save"></i> Simpan</Button>{' '}
                    <Button color="warning" onClick={handleToggleIbu}>Batal</Button>
                </ModalFooter>
            </Modal>
        </Form>
    )
}

class Ibu extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            modalToggle: false
        }
        this.modalToggle = this.modalToggle.bind(this)
        this.submitIbu = this.submitIbu.bind(this)
    }
    componentWillMount(){
        this.props.dispatch(pekerjaan.fetchPekerjaan(cookies.get(cookieName)))
        this.props.dispatch(provinsi.fetchProvinsi())
        this.props.dispatch(ibu.fetchAllData(cookies.get(cookieName), this.props.noPeserta, this.props.atribut))
    }
    modalToggle = () => {
        this.setState({
            modalToggle: !this.state.modalToggle
        })
    }
    submitIbu = (values) => {
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
        this.props.dispatch(ibu.updateData(cookies.get(cookieName), formData, this.props.noPeserta))
        this.props.dispatch(reset('DataIbu'))        
    }
    render(){
        const ibu = this.props.ibu || {}
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                    <div>
                        <h4 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                            <i className="fa fa-female text-pink-500"></i> Data Ibu
                        </h4>
                        <p className="text-gray-500 text-sm">Informasi orang tua kandung / ibu.</p>
                    </div>
                    { this.props.editable && (
                        <button onClick={this.modalToggle} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold shadow-md transition transform hover:scale-105 flex items-center gap-2 text-sm">
                            <i className="fa fa-pencil"></i> Perbarui Data
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-pink-50 flex items-center gap-2 font-bold">
                        <i className="fa fa-female text-pink-500"></i>
                        <span className="uppercase text-gray-700 tracking-wider text-sm">Informasi Ibu</span>
                    </div>
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 w-1/3 text-xs uppercase">Nama Lengkap</td>
                                <td className="p-4 font-medium text-gray-800">{ibu.nama_ibu || '-'}</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Status</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${ibu.status_ibu === 'hidup' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {ibu.status_ibu || 'Belum diisi'}
                                    </span>
                                </td>
                            </tr>
                            { ibu.status_ibu === "hidup" && (<>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">NIK</td>
                                    <td className="p-4 font-mono text-gray-700">{ibu.nik_ibu || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">KTP</td>
                                    <td className="p-4">
                                        { (ibu.scan_ktp_ibu && ibu.scan_ktp_ibu !== "") ? (
                                            <a href={storage+"/"+ibu.scan_ktp_ibu} target="_blank" rel="noopener noreferrer"
                                               className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-sm">
                                                <i className="fa fa-download"></i> Lihat KTP
                                            </a>
                                        ) : <span className="text-gray-400 italic text-xs">Belum diunggah</span>}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Tempat, Tgl Lahir</td>
                                    <td className="p-4 text-gray-700">{ibu.tempat_lahir_ibu ? `${ibu.tempat_lahir_ibu}, ${ibu.tanggal_lahir_ibu}` : '-'}</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Alamat</td>
                                    <td className="p-4 text-gray-700">
                                        { ibu.provinsi != null
                                            ? `${ibu.alamat_ibu}, ${ibu.kecamatan.kecam_nama}, ${ibu.kabkot.kab_nama}, ${ibu.provinsi.provinsi_nama}`
                                            : (ibu.alamat_ibu || '-')
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Pekerjaan</td>
                                    <td className="p-4 text-gray-700">{ibu.pekerjaan?.nama || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Penghasilan</td>
                                    <td className="p-4 font-bold text-emerald-700">{rupiah(ibu.penghasilan_ibu)} <span className="text-gray-400 font-normal text-xs">/ bulan</span></td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Penghasilan Sampingan</td>
                                    <td className="p-4 font-bold text-emerald-700">{rupiah(ibu.sampingan_ibu)} <span className="text-gray-400 font-normal text-xs">/ bulan</span></td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Bukti Penghasilan</td>
                                    <td className="p-4">
                                        { (ibu.scan_slip_ibu && ibu.scan_slip_ibu !== "") ? (
                                            <a href={storage+"/"+ibu.scan_slip_ibu} target="_blank" rel="noopener noreferrer"
                                               className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-sm">
                                                <i className="fa fa-download"></i> Lihat Slip Gaji
                                            </a>
                                        ) : <span className="text-gray-400 italic text-xs">Belum diunggah</span>}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-semibold text-gray-500 bg-gray-50/50 text-xs uppercase">Nomor Telepon</td>
                                    <td className="p-4 font-mono text-gray-700">{ibu.telepon_ibu || '-'}</td>
                                </tr>
                            </>)}
                        </tbody>
                    </table>
                </div>

                <FormIbu
                    onSubmit={this.submitIbu}
                    initialValues={this.props.ibu}
                    toggleIbu={this.state.modalToggle}
                    handleToggleIbu={this.modalToggle}
                />
            </div>
        )
    }

}

FormIbu = reduxForm({
    form: 'DataIbuSeleksi',
    enableReinitialize: true,
})(FormIbu)

const selector = formValueSelector('DataIbuSeleksi')

FormIbu = connect((store) => {
    let { status_ibu, penghasilan_ibu, sampingan_ibu } = selector(store, 'status_ibu', 'penghasilan_ibu', 'sampingan_ibu', 'provinsi_ibu', 'kabkot_ibu', 'kecamatan_ibu')
    return {
        status_ibu,
        penghasilan_ibu,
        sampingan_ibu,

        ref_provinsi_ibu: store.provinsi.provinsi,
        ref_kabkot_ibu: store.kabkot.kabkot_ibu,
        ref_kecamatan_ibu: store.kecamatan.kecamatan_ibu,
        ref_pekerjaan: store.pekerjaan.pekerjaan,
    }
}, {
    kabkot, kecamatan
})(FormIbu)

export default connect(
    (store) => ({
        ibu: store.ibu.ibu,
    })
)(Ibu)