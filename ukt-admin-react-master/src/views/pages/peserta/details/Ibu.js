import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Table, Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Alert, FormText } from 'reactstrap'
import { Field, reduxForm, reset, formValueSelector } from 'redux-form'
import { ibu, provinsi, pekerjaan, kabkot, kecamatan } from '../../../../actions'
import { InputBs, InputDayPicker, InputFileBs, money } from '../../../components'
import { cookies, cookieName, rupiah, storage, } from '../../../../global'
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
                                Wafat
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
                                        <Link to={storage+"/"+props.initialValues.no_peserta+"/"+props.initialValues.scan_ktp_ibu} target="_blank" className="btn btn-success btn-block"><i className="fa fa-file"></i> Lihat KTP Ibu</Link>
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
                                        <Link to={storage+"/"+props.initialValues.no_peserta+"/"+props.initialValues.scan_slip_ibu} target="_blank" className="btn btn-success btn-block"><i className="fa fa-file"></i> Lihat Slip Gaji Ibu</Link>
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
        this.props.dispatch(ibu.fetchAllData(cookies.get(cookieName), this.props.noPeserta))        
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
        return (
            <Row>
                <Col md={12}>
                    <Row>
                        <Col md="6">
                            <h4>Ibu</h4>
                        </Col>
                        <Col md="6" className="text-right">
                            { this.props.editable && (
                                <Button color="warning" size="sm" onClick={this.modalToggle}><i className="fa fa-pencil"></i> Perbarui</Button>
                            )}
                        </Col>
                    </Row>
                    <hr/>
                    <Table responsive striped bordered>
                        <tbody>
                            <tr>
                                <td width="30%">Nama</td>
                                <td width="5%">:</td>
                                <td>{this.props.ibu.nama_ibu}</td>
                            </tr>
                            <tr>
                                <td>Status Ibu</td>
                                <td>:</td>
                                <td>{ this.props.ibu.status_ibu }</td>
                            </tr>
                        </tbody>

                        { this.props.ibu.status_ibu === "hidup" && (
                            <tbody>
                                <tr>
                                    <td>NIK</td>
                                    <td>:</td>
                                    <td>{ this.props.ibu.nik_ibu }</td>
                                </tr>
                                <tr>
                                    <td>KTP</td>
                                    <td>:</td>
                                    <td>
                                    { this.props.ibu.scan_ktp_ibu !== "" && (
                                        <Link to={ storage+"/"+this.props.ibu.no_peserta+"/"+this.props.ibu.scan_ktp_ibu } target="_blank"><Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat KTP</Button></Link>
                                    )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Tempat, Tanggal Lahir</td>
                                    <td>:</td>
                                    <td>{ this.props.ibu.tempat_lahir_ibu+", "+this.props.ibu.tanggal_lahir_ibu }</td>
                                </tr>
                                <tr>
                                    <td>Alamat</td>
                                    <td>:</td>
                                    <td>
                                    { this.props.ibu.provinsi != null && 
                                        ( this.props.ibu.alamat_ibu+", "+this.props.ibu.kecamatan.kecam_nama+", "+this.props.ibu.kabkot.kab_nama+", "+this.props.ibu.provinsi.provinsi_nama )
                                    }
                                    </td>
                                </tr>
                                <tr>
                                    <td>Pekerjaan</td>
                                    <td>:</td>
                                    <td>
                                    { this.props.ibu.pekerjaan != null && 
                                        ( this.props.ibu.pekerjaan.nama )
                                    }
                                    </td>
                                </tr>
                                <tr>
                                    <td>Penghasilan</td>
                                    <td>:</td>
                                    <td>{ rupiah(this.props.ibu.penghasilan_ibu) } <b>/ bulan</b></td>
                                </tr>
                                <tr>
                                    <td>Sampingan</td>
                                    <td>:</td>
                                    <td>{ rupiah(this.props.ibu.sampingan_ibu) } <b>/ bulan</b></td>
                                </tr>
                                <tr>
                                    <td>Bukti Penghasilan</td>
                                    <td>:</td>
                                    <td>
                                    { this.props.ibu.scan_slip_ibu !== "" && (
                                        <Link to={ storage+"/"+this.props.ibu.no_peserta+"/"+this.props.ibu.scan_slip_ibu } target="_blank">
                                            <Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat Bukti Penghasilan</Button>
                                        </Link>
                                    )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Nomor Telepon</td>
                                    <td>:</td>
                                    <td>{ this.props.ibu.telepon_ibu } </td>
                                </tr>
                                x
                            </tbody>
                        )}
                    </Table>

                    <FormIbu
                        onSubmit={this.submitIbu}
                        initialValues={this.props.ibu}
                        toggleIbu={this.state.modalToggle}
                        handleToggleIbu={this.modalToggle}
                        /> 
                </Col>
            </Row>
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