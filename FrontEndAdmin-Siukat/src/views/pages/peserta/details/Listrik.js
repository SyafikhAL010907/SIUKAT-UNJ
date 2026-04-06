import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Table, Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Alert, FormText } from 'reactstrap'
import { Field, reduxForm, reset, formValueSelector } from 'redux-form'
import { listrik, } from '../../../../actions'
import { InputBs, InputFileBs, money } from '../../../components'
import { cookies, cookieName, rupiah, storage, service } from '../../../../global'
import { connect } from 'react-redux'

let FormListrik = (props) => {
    const { handleSubmit, handleToggleListrik, toggleListrik,
        pristine, submitting,
        pengeluaran, scan_listrik } = props
    return (
        <Form onSubmit={handleSubmit} id="form-listrik" className="form-horizontal">        
            <Modal isOpen={toggleListrik} toggle={handleToggleListrik} size="lg"
            className={'modal-success'}>
                <ModalHeader toggle={handleToggleListrik}>Form Listrik</ModalHeader>
                <ModalBody>
                    <FormGroup row>
                        <Label for="no_pelanggan" md={3}>Nomor Pelanggan</Label>
                        <Col md={9}>
                            <Field type="text" component={InputBs} name="no_pelanggan" id="no_pelanggan" placeholder="Nomor Pelanggan PLN" />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="jenis_pemakaian" md={3}>Status Listrik</Label>                                            
                        <Col md={4}>
                            <Label check>
                                <Field type="radio" component={InputBs} name="jenis_pemakaian" value="prabayar" />{' '}
                                Prabayar (Token)
                            </Label>
                        </Col>
                        <Col md={5}>
                            <Label check>
                                <Field type="radio" component={InputBs} name="jenis_pemakaian" value="pascabayar" />{' '}
                                Pascabayar
                            </Label>
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label md={3} xs={12}>Biaya Listrik</Label>
                        <Col md={5} xs={12}>
                            <Field type="number" component={InputBs} pattern="[0-9]*" title="Hanya isi dengan angka (0-9)" name="pengeluaran" placeholder="Biaya Listrik" id="pengeluaran" validate={[ money ]}/>
                            <FormText color="muted">
                                <ul className="list-reset">
                                    <li>Biaya listrik <b>3 bulan terakhir</b>;</li>
                                    <li>Hanya isi dengan angka (0-9).</li>
                                </ul>
                            </FormText>
                        </Col>
                        <Col md={4} xs={12}>
                            <Alert color="success">{ rupiah(pengeluaran) }</Alert>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="file_scan_listrik" md={3}>Bukti Tagihan Listrik</Label>
                        <Col md={5}>
                            <Field component={InputFileBs} type="file" name="file_scan_listrik" id="file_scan_listrik" />
                            <FormText color="muted">
                                <ul className="list-reset">
                                    <li>Bukti tagihan listrik <b>3 bulan terakhir</b>;</li>
                                    <li>Ekstensi berkas berupa PDF;</li>
                                    <li>Ukuran berkas tidak lebih dari 500KB.</li>
                                </ul>
                            </FormText>
                        </Col>
                        { (props.initialValues.scan_listrik !== "" && props.initialValues.scan_listrik !== null) && (
                            <Col md={4}>
                                <a href={storage+"/"+props.initialValues.scan_listrik} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-block"><i className="fa fa-file"></i> Lihat Scan Rekening Listrik</a>
                            </Col>
                        )}
                    </FormGroup>
                </ModalBody>
                <ModalFooter className="text-right">
                    <Button color="success" type="submit" form="form-listrik" disabled={pristine || submitting}><i className="fa fa-save"></i> Simpan</Button>{' '}
                    <Button color="warning" onClick={handleToggleListrik}>Batal</Button>
                </ModalFooter>
            </Modal>
        </Form>
    )
}

class Listrik extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            modalToggle: false
        }
        this.modalToggle = this.modalToggle.bind(this)
        this.submitListrik = this.submitListrik.bind(this)
    }
    componentWillMount(){
        this.props.dispatch(listrik.getById(cookies.get(cookieName), this.props.noPeserta))
    }
    modalToggle = () => {
        this.setState({
            modalToggle: !this.state.modalToggle
        })
    }
    submitListrik = (values) => {
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
        this.props.dispatch(listrik.updateData(cookies.get(cookieName), formData, this.props.noPeserta))
        this.props.dispatch(reset('DataListrikSeleksi'));
    }
    render(){
        return (
            <Row>
                <Col md={12}>
                    <Row>
                        <Col md="6">
                            <h4>Listrik</h4>
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
                                <td width="30%">Nomor Pelanggan</td>
                                <td width="5%">:</td>
                                <td>{ this.props.listrik.no_pelanggan }</td>
                            </tr>
                            <tr>
                                <td>Jenis Pemakaian</td>
                                <td>:</td>
                                <td>{ this.props.listrik.jenis_pemakaian }</td>
                            </tr>
                            <tr>
                                <td>Biaya Listrik</td>
                                <td>:</td>
                                <td>{ rupiah(this.props.listrik.pengeluaran) } <b>/ 3 bulan terakhir</b></td>
                            </tr>
                            <tr>
                                <td>Bukti Tagihan Listrik</td>
                                <td>:</td>
                                <td>
                                { (this.props.listrik.scan_listrik !== "" && this.props.listrik.scan_listrik !== null) && (
                                    <a href={ storage+"/"+this.props.listrik.scan_listrik } target="_blank" rel="noopener noreferrer">
                                        <Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat Scan Rekening Listrik</Button>
                                    </a>
                                )}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    <FormListrik
                        onSubmit={this.submitListrik}
                        initialValues={this.props.listrik}
                        toggleListrik={this.state.modalToggle}
                        handleToggleListrik={this.modalToggle}
                        /> 
                </Col>
            </Row>
        )
    }
}

FormListrik = reduxForm({
    form: 'DataListrikSeleksi',
    enableReinitialize: true,
})(FormListrik)

const selector = formValueSelector('DataListrikSeleksi')

FormListrik = connect((store) => {
    let {pengeluaran, scan_listrik} = selector(store, 'pengeluaran', 'scan_listrik')
    return {
        pengeluaran,
        scan_listrik,
    }
})(FormListrik)

export default connect(
    (store) => ({
        listrik: store.listrik.listrik,
    })
)(Listrik)