import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Table, Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Alert, FormText } from 'reactstrap'
import { Field, reduxForm, reset, formValueSelector } from 'redux-form'
import { kendaraan, } from '../../../../actions'
import { InputBs, InputFileBs, money } from '../../../components'
import { cookies, cookieName, rupiah, storage, service } from '../../../../global'
import { connect } from 'react-redux'

let FormKendaraan = (props) => {
    const { handleSubmit, toggleKendaraan, handleToggleKendaraan,
            pristine, submitting,
            status_mobil, status_motor, pajak_motor, pajak_mobil } = props
    return (
        <Form onSubmit={handleSubmit} id="form-kendaraan" className="form-horizontal">        
            <Modal isOpen={toggleKendaraan} toggle={handleToggleKendaraan} size="lg"
            className={'modal-success'}>
                <ModalHeader toggle={handleToggleKendaraan}>Form Kendaraan</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <legend><i className="fa fa-motorcycle"></i> Data Motor</legend>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="status_motor" md={3} xs={12}>Status Motor</Label>
                        <Col md={4} xs={12}>
                            <Label check>
                                <Field type="radio" component={InputBs} name="status_motor" value="ada" />{' '}
                                Ada
                            </Label>
                        </Col>
                        <Col md={5} xs={12}>
                            <Label check>
                                <Field type="radio" component={InputBs} name="status_motor" value="tidak"/>{' '}
                                Tidak Ada
                            </Label>
                        </Col>
                    </FormGroup>

                    { status_motor === "ada" && (
                        <div>
                            <FormGroup row>
                                <Label for="jumlah_motor" md={3} xs={12}>Jumlah Motor</Label>
                                <Col md={9}>
                                    <Field type="number" component={InputBs} name="jumlah_motor" id="jumlah_motor" placeholder="Jumlah Motor" />
                                    <FormText>
                                        <ul className="list-reset">
                                            <li>Jumlah motor yang dimiliki anggota keluarga dalam Kartu Keluarga</li>
                                            <li>Hanya isi dengan angka (0-9).</li>
                                        </ul>
                                    </FormText>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="pajak_motor" md={3} xs={12}>Total Pajak Motor</Label>
                                <Col md={5} xs={12}>
                                    <Field type="number" component={InputBs} pattern="[0-9]*" title="Hanya isi dengan angka (0-9)" name="pajak_motor" id="pajak_motor" placeholder="Total Pajak Motor" validate={[ money ]}/>
                                    <FormText color="muted">
                                        <ul className="list-reset">
                                            <li>Total Pajak Motor <b>per tahun</b>;</li>
                                            <li>Jika memiliki lebih dari 1 motor, maka masukkan jumlah total pajak masing-masing motor yang dimiliki;</li>
                                            <li>Hanya isi dengan angka (0-9).</li>
                                        </ul>
                                    </FormText>
                                </Col>
                                <Col md={4} xs={12}>
                                    <Alert color="success">{ rupiah(pajak_motor) }</Alert>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="file_scan_motor" md={3}>STNK Motor</Label>
                                <Col md={5}>
                                    <Field component={InputFileBs} type="file" name="file_scan_motor" id="file_scan_motor" />
                                    <FormText color="muted">
                                        <ul className="list-reset">
                                            <li>Scan STNK seluruh motor yang dimiliki;</li>
                                            <li>Ekstensi berkas berupa PDF;</li>
                                            <li>Ukuran berkas tidak lebih dari 500KB.</li>
                                        </ul>
                                    </FormText>
                                </Col>
                                    { (props.initialValues.scan_motor !== "" && props.initialValues.scan_motor !== null) && (
                                        <Col md={4}>
                                            <a href={storage+"/"+props.initialValues.scan_motor} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-block"><i className="fa fa-file"></i> Lihat STNK Motor</a>
                                        </Col>
                                    )}
                            </FormGroup>
                        </div>
                    )}

                    <FormGroup>
                        <legend><i className="fa fa-car"></i> Data Mobil</legend>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="status_mobil" md={3} xs={12}>Status Mobil</Label>  
                        <Col md={4} xs={12}>
                            <Label check>
                                <Field type="radio" component={InputBs} name="status_mobil" value="ada" />{' '}
                                Ada
                            </Label>
                        </Col>
                        <Col md={5} xs={12}>
                            <Label check>
                                <Field type="radio" component={InputBs} name="status_mobil" value="tidak"/>{' '}
                                Tidak Ada
                            </Label>
                        </Col>
                    </FormGroup>
                    

                    { status_mobil === "ada" && (
                        <div>
                            <FormGroup row>
                                <Label for="jumlah_mobil" md={3} xs={12}>Jumlah Mobil</Label>
                                <Col md={9}>
                                    <Field type="number" component={InputBs} name="jumlah_mobil" id="jumlah_mobil" placeholder="Jumlah Mobil" />
                                    <FormText>
                                        <ul className="list-reset">
                                            <li>Jumlah mobil yang dimiliki anggota keluarga dalam Kartu Keluarga</li>
                                            <li>Hanya isi dengan angka (0-9).</li>
                                        </ul>
                                    </FormText>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="pajak_mobil" md={3} xs={12}>Total Pajak Mobil</Label>
                                <Col md={5} xs={12}>
                                    <Field type="number" component={InputBs} pattern="[0-9]*" title="Hanya isi dengan angka (0-9)" name="pajak_mobil" id="pajak_mobil" placeholder="Total Pajak Mobil" validate={[ money ]}/>
                                    <FormText color="muted">
                                        <ul className="list-reset">
                                            <li>Total Pajak Mobil <b>per tahun</b>;</li>
                                            <li>Jika memiliki lebih dari 1 mobil, maka masukkan jumlah total pajak masing-masing mobil yang dimiliki;</li>
                                            <li>Hanya isi dengan angka (0-9).</li>
                                        </ul>
                                    </FormText>
                                </Col>
                                <Col md={4} xs={12}>
                                    <Alert color="success">{ rupiah(pajak_mobil) }</Alert>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="file_scan_mobil" md={3}>STNK Mobil</Label>
                                <Col md={5}>
                                    <Field component={InputFileBs} type="file" name="file_scan_mobil" id="file_scan_mobil" />
                                    <FormText color="muted">
                                        <ul className="list-reset">
                                            <li>Scan STNK seluruh mobil yang dimiliki;</li>
                                            <li>Ekstensi berkas berupa PDF;</li>
                                            <li>Ukuran berkas tidak lebih dari 500KB.</li>
                                        </ul>
                                    </FormText>
                                </Col>
                                    { (props.initialValues.scan_mobil !== "" && props.initialValues.scan_mobil !== null) && (
                                        <Col md={4}>
                                            <a href={storage+"/"+props.initialValues.scan_mobil} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-block"><i className="fa fa-file"></i> Lihat STNK Mobil</a>
                                        </Col>
                                    )}
                            </FormGroup>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter className="text-right">
                    <Button color="success" type="submit" form="form-kendaraan" disabled={pristine || submitting}><i className="fa fa-save"></i> Simpan</Button>{' '}
                    <Button color="warning" onClick={handleToggleKendaraan}>Batal</Button>
                </ModalFooter>
            </Modal>
        </Form>
    )
}

class Kendaraan extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            modalToggle: false
        }
        this.modalToggle = this.modalToggle.bind(this)
        this.submitKendaraan = this.submitKendaraan.bind(this)
    }
    componentWillMount(){
        this.props.dispatch(kendaraan.getById(cookies.get(cookieName), this.props.noPeserta))
    }
    modalToggle = () => {
        this.setState({
            modalToggle: !this.state.modalToggle
        })
    }
    submitKendaraan = (values) => {
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
        this.props.dispatch(kendaraan.updateData(cookies.get(cookieName), formData, this.props.noPeserta))
        this.props.dispatch(reset('DataKendaraanSeleksi'));
    }
    render(){
        return (
            <Row>
                <Col md={12}>
                    <Row>
                        <Col md="6">
                            <h4>Kendaraan</h4>
                        </Col>
                        <Col md="6" className="text-right">
                            { this.props.editable && (
                                <Button color="warning" size="sm" onClick={this.modalToggle}><i className="fa fa-pencil"></i> Perbarui</Button>
                            )}
                        </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col md="6">
                            <Table responsive striped bordered>
                                <tbody>
                                    <tr>
                                        <td width="30%">Status Motor</td>
                                        <td width="5%">:</td>
                                        <td>{ this.props.kendaraan.status_motor }</td>
                                    </tr>
                                </tbody>

                                { this.props.kendaraan.status_motor === "ada" && (
                                    <tbody>
                                        <tr>
                                            <td>Jumlah Motor</td>
                                            <td>:</td>
                                            <td>{ this.props.kendaraan.jumlah_motor } <b>dalam 1 Kartu Keluarga</b></td>
                                        </tr>
                                        <tr>
                                            <td>Pajak Motor</td>
                                            <td>:</td>
                                            <td>{ rupiah(this.props.kendaraan.pajak_motor) } <b>/ tahun</b></td>
                                        </tr>
                                        <tr>
                                            <td>STNK Motor</td>
                                            <td>:</td>
                                            <td>
                                            { (this.props.kendaraan.scan_motor !== "" && this.props.kendaraan.scan_motor !== null) && (
                                                <a href={ storage+"/"+this.props.kendaraan.scan_motor } target="_blank" rel="noopener noreferrer">
                                                    <Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat STNK Motor</Button>
                                                </a>
                                            )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </Table>
                        </Col>
                        <Col md="6">
                            <Table responsive striped bordered>
                                <tbody>
                                    <tr>
                                        <td width="30%">Status Mobil</td>
                                        <td width="5%">:</td>
                                        <td>{ this.props.kendaraan.status_mobil }</td>
                                    </tr>
                                </tbody>

                                { this.props.kendaraan.status_mobil === "ada" && (                        
                                    <tbody>                        
                                        <tr>
                                            <td>Jumlah Mobil</td>
                                            <td>:</td>
                                            <td>{ this.props.kendaraan.jumlah_mobil } <b>dalam 1 Kartu Keluarga</b></td>
                                        </tr>
                                        <tr>
                                            <td>Pajak Mobil</td>
                                            <td>:</td>
                                            <td>{ rupiah(this.props.kendaraan.pajak_mobil) } <b>/ tahun</b></td>
                                        </tr>
                                        <tr>
                                            <td>STNK Mobil</td>
                                            <td>:</td>
                                            <td>
                                            { (this.props.kendaraan.scan_mobil !== "" && this.props.kendaraan.scan_mobil !== null) && (                                        
                                                <a href={ storage+"/"+this.props.kendaraan.scan_mobil } target="_blank" rel="noopener noreferrer">
                                                    <Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat STNK Mobil</Button>
                                                </a>
                                            )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </Table>
                        </Col>
                    </Row>
                        
                    <FormKendaraan
                        onSubmit={this.submitKendaraan}
                        initialValues={this.props.kendaraan}
                        toggleKendaraan={this.state.modalToggle}
                        handleToggleKendaraan={this.modalToggle}
                        /> 
                </Col>
            </Row>
        )
    }
}

FormKendaraan = reduxForm({
    form: 'DataKendaraanSeleksi',
    enableReinitialize: true,
})(FormKendaraan)

const selector = formValueSelector('DataKendaraanSeleksi')

FormKendaraan = connect((store) => {
    let {status_motor, status_mobil, pajak_motor, pajak_mobil} = selector(store, 'status_motor', 'status_mobil', 'pajak_motor', 'pajak_mobil')
    return {
        status_motor,
        status_mobil,
        pajak_motor, 
        pajak_mobil
    }
})(FormKendaraan)

export default connect(
    (store) => ({
        kendaraan: store.kendaraan.kendaraan,
    })
)(Kendaraan)