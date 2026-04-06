import React from 'react'
import { Button,
         Col, Alert,
         Form, FormGroup, FormText, Label, Row, Table, 
         Modal, ModalBody, ModalHeader, ModalFooter  } from 'reactstrap'
import { Link } from 'react-router-dom'         
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
        <Form onSubmit={handleSubmit} id="form-wali" className="form-horizontal">        
            <Modal isOpen={toggleWali} toggle={handleToggleWali} size="lg"
            className={'modal-success'}>
                <ModalHeader toggle={handleToggleWali}>Form Wali</ModalHeader>
                <ModalBody>
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
                </ModalBody>
                <ModalFooter className="text-right">
                    <Button color="success" type="submit" form="form-wali" disabled={pristine || submitting}><i className="fa fa-save"></i> Simpan</Button>{' '}
                    <Button color="warning" onClick={handleToggleWali}>Batal</Button>
                </ModalFooter>
            </Modal>
        </Form>
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
        this.props.dispatch(wali.fetchAllData(cookies.get(cookieName), this.props.noPeserta))
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
        this.props.dispatch(wali.updateData(cookies.get(cookieName), formData, this.props.noPeserta))
        this.props.dispatch(reset('DataWaliSeleksi'))
    }
    render(){
        return (
            <Row>
                <Col md={12}>
                    <Row>
                        <Col md="6">
                            <h4>Wali</h4>
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
                                <td width="30%">Status Wali</td>
                                <td width="5%">:</td>
                                <td>{ this.props.wali.status_wali }</td>
                            </tr>
                        </tbody>

                        { this.props.wali.status_wali === "ada" && (
                            <tbody>
                                <tr>
                                    <td>Nama</td>
                                    <td>:</td>
                                    <td>{ this.props.wali.nama_wali }</td>
                                </tr>
                                <tr>
                                    <td>Alamat</td>
                                    <td>:</td>
                                    <td>
                                    { this.props.wali.provinsi != null && 
                                        ( this.props.wali.alamat_wali+", "+this.props.wali.kecamatan.kecam_nama+", "+this.props.wali.kabkot.kab_nama+", "+this.props.wali.provinsi.provinsi_nama )
                                    }
                                    </td>
                                </tr>
                                <tr>
                                    <td>Komitmen Pembiayaan</td>
                                    <td>:</td>
                                    <td>{ rupiah(this.props.wali.kesanggupan_wali) } <b>/ bulan</b></td>
                                </tr>
                                <tr>
                                    <td>Surat Komitmen Pembiayaan Pendukung</td>
                                    <td>:</td>
                                    <td>
                                    { (this.props.wali.scan_wali !== "" && this.props.wali.scan_wali !== null) && (
                                        <a href={ storage+"/"+this.props.wali.scan_wali } target="_blank" rel="noopener noreferrer">
                                            <Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat Scan Wali</Button>
                                        </a>
                                    )}
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </Table>

                    <FormWali
                        onSubmit={this.submitWali}
                        initialValues={this.props.wali}
                        toggleWali={this.state.modalToggle}
                        handleToggleWali={this.modalToggle}
                        /> 
                </Col>
            </Row>
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

export default connect(
    (store) => ({
        wali: store.wali.wali,
    })
)(Wali)