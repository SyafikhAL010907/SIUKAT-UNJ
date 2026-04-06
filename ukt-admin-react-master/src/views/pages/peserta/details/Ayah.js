import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Table, Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Alert, FormText } from 'reactstrap'
import { Field, reduxForm, reset, formValueSelector } from 'redux-form'
import { ayah, provinsi, pekerjaan, kabkot, kecamatan } from '../../../../actions'
import { InputBs, InputDayPicker, InputFileBs, money } from '../../../components'
import { cookies, cookieName, rupiah, storage, } from '../../../../global'
import { connect } from 'react-redux'

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
        <Form onSubmit={handleSubmit} id="form-ayah" className="form-horizontal">        
            <Modal isOpen={toggleAyah} toggle={handleToggleAyah} size="lg"
            className={'modal-success'}>
                <ModalHeader toggle={handleToggleAyah}>Form Ayah</ModalHeader>
                <ModalBody>
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
                                        <Link to={storage+"/"+props.initialValues.no_peserta+"/"+props.initialValues.scan_ktp_ayah} target="_blank" className="btn btn-success btn-block"><i className="fa fa-file"></i> Lihat KTP Ayah</Link>
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
                                        <Link to={storage+"/"+props.initialValues.no_peserta+"/"+props.initialValues.scan_slip_ayah} target="_blank" className="btn btn-success btn-block"><i className="fa fa-file"></i> Lihat Slip Gaji Ayah</Link>
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
                </ModalBody>
                <ModalFooter className="text-right">
                    <Button color="success" type="submit" form="form-ayah" disabled={pristine || submitting}><i className="fa fa-save"></i> Simpan</Button>{' '}
                    <Button color="warning" onClick={handleToggleAyah}>Batal</Button>
                </ModalFooter>
            </Modal>
        </Form>
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
        this.props.dispatch(ayah.fetchAllData(cookies.get(cookieName), this.props.noPeserta))
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
        this.props.dispatch(ayah.updateData(cookies.get(cookieName), formData, this.props.noPeserta))
        this.props.dispatch(reset('DataAyah'))        
    }
    render(){
        return (
            <Row>
                <Col md={12}>
                    <Row>
                        <Col md="6">
                            <h4>Ayah</h4>
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
                                <td>{ this.props.ayah.nama_ayah }</td>
                            </tr>
                            <tr>
                                <td>Status Ayah</td>
                                <td>:</td>
                                <td>{ this.props.ayah.status_ayah }</td>
                            </tr>
                        </tbody>

                        { this.props.ayah.status_ayah === "hidup" && (
                            <tbody>
                                <tr>
                                    <td>NIK</td>
                                    <td>:</td>
                                    <td>{ this.props.ayah.nik_ayah }</td>
                                </tr>
                                <tr>
                                    <td>KTP</td>
                                    <td>:</td>
                                    <td>
                                    { this.props.ayah.scan_ktp_ayah !== "" && (
                                        <Link to={ storage+"/"+this.props.ayah.no_peserta+"/"+this.props.ayah.scan_ktp_ayah } target="_blank"><Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat KTP</Button></Link>
                                    )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Tempat, Tanggal Lahir</td>
                                    <td>:</td>
                                    <td>{ this.props.ayah.tempat_lahir_ayah+", "+this.props.ayah.tanggal_lahir_ayah }</td>
                                </tr>
                                <tr>
                                    <td>Alamat</td>
                                    <td>:</td>
                                    <td>
                                    { this.props.ayah.provinsi != null && 
                                        ( this.props.ayah.alamat_ayah+", "+this.props.ayah.kecamatan.kecam_nama+", "+this.props.ayah.kabkot.kab_nama+", "+this.props.ayah.provinsi.provinsi_nama )
                                    }
                                    </td>
                                </tr>
                                <tr>
                                    <td>Pekerjaan</td>
                                    <td>:</td>
                                    <td>
                                    { this.props.ayah.pekerjaan != null && 
                                        ( this.props.ayah.pekerjaan.nama )
                                    }
                                    </td>
                                </tr>
                                <tr>
                                    <td>Penghasilan</td>
                                    <td>:</td>
                                    <td>{ rupiah(this.props.ayah.penghasilan_ayah) } <b>/ bulan</b></td>
                                </tr>
                                <tr>
                                    <td>Sampingan</td>
                                    <td>:</td>
                                    <td>{ rupiah(this.props.ayah.sampingan_ayah) } <b>/ bulan</b></td>
                                </tr>
                                <tr>
                                    <td>Bukti Penghasilan</td>
                                    <td>:</td>
                                    <td>
                                    { this.props.ayah.scan_slip_ayah !== "" && (
                                        <Link to={ storage+"/"+this.props.ayah.no_peserta+"/"+this.props.ayah.scan_slip_ayah } target="_blank">
                                            <Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat Bukti Penghasilan</Button>
                                        </Link>
                                    )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Nomor Telepon</td>
                                    <td>:</td>
                                    <td>{ this.props.ayah.telepon_ayah } </td>
                                </tr>
                                
                            </tbody>
                        )}
                    </Table>

                    <FormAyah
                        onSubmit={this.submitAyah}
                        initialValues={this.props.ayah}
                        toggleAyah={this.state.modalToggle}
                        handleToggleAyah={this.modalToggle}
                        /> 
                </Col>
            </Row>
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

export default connect(
    (store) => ({
        ayah: store.ayah.ayah,
    })
)(Ayah)