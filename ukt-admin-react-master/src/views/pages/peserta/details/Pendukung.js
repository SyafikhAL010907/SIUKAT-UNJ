import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Table, Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, FormText } from 'reactstrap'
import { Field, reduxForm, reset, formValueSelector } from 'redux-form'
import { pendukung, } from '../../../../actions'
import { InputBs, InputFileBs } from '../../../components'
import { cookies, cookieName, storage, } from '../../../../global'
import { connect } from 'react-redux'

let FormPendukung = (props) => {
    const { handleSubmit, handleTogglePendukung, togglePendukung,
        pristine, submitting,
        scan_kk } = props
    return (
        <Form onSubmit={handleSubmit} id="form-pendukung" className="form-horizontal">        
            <Modal isOpen={togglePendukung} toggle={handleTogglePendukung} size="lg"
            className={'modal-success'}>
                <ModalHeader toggle={handleTogglePendukung}>Form Pendukung</ModalHeader>
                <ModalBody>
                    <FormGroup row>
                        <Label for="tanggungan" md={3}>Jumlah Tanggungan</Label>
                        <Col md={9}>
                            <Field component={InputBs} type="text" name="tanggungan" id="tanggungan" placeholder="Jumlah Tanggungan" />
                            <FormText>
                                Termasuk Kepala Keluarga
                            </FormText>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="file_scan_kk" md={3}>Kartu Keluarga</Label>
                        <Col md={5}>
                            <Field component={InputFileBs} type="file" name="file_scan_kk" id="file_scan_kk" />
                            <FormText color="muted">
                                <ul className="list-reset">
                                    <li>Ekstensi berkas berupa PDF;</li>
                                    <li>Ukuran berkas tidak lebih dari 500KB.</li>
                                </ul>
                            </FormText>
                        </Col>
                        { scan_kk && (
                            <Col md={4}>
                                <Link to={storage+"/"+props.initialValues.no_peserta+"/"+scan_kk} target="_blank" className="btn btn-success btn-block"><i className="fa fa-file"></i> Lihat Kartu Keluarga</Link>
                            </Col>
                        )}
                    </FormGroup>
                </ModalBody>
                <ModalFooter className="text-right">
                    <Button color="success" type="submit" form="form-pendukung" disabled={pristine || submitting}><i className="fa fa-save"></i> Simpan</Button>{' '}
                    <Button color="warning" onClick={handleTogglePendukung}>Batal</Button>
                </ModalFooter>
            </Modal>
        </Form>
    )
}

class Pendukung extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            modalToggle: false
        }
        this.modalToggle = this.modalToggle.bind(this)
        this.submitPendukung = this.submitPendukung.bind(this)
    }
    componentWillMount(){
        this.props.dispatch(pendukung.getById(cookies.get(cookieName), this.props.noPeserta))
    }
    modalToggle = () => {
        this.setState({
            modalToggle: !this.state.modalToggle
        })
    }
    submitPendukung = (values) => {
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
        this.props.dispatch(pendukung.updateData(cookies.get(cookieName), formData, this.props.noPeserta))
        this.props.dispatch(reset('DataPendukungSeleksi'));
    }
    render(){
        return (
            <Row>
                <Col md={12}>
                    <Row>
                        <Col md="6">
                            <h4>Pendukung</h4>
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
                                <td width="30%">Jumlah Tanggungan</td>
                                <td width="5%">:</td>
                                <td>{ this.props.pendukung.tanggungan }</td>
                            </tr>
                            <tr>
                                <td>Kartu Keluarga</td>
                                <td>:</td>
                                <td>
                                { this.props.pendukung.scan_kk && (
                                    <Link to={ storage+"/"+this.props.pendukung.no_peserta+"/"+this.props.pendukung.scan_kk} target="_blank">
                                        <Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat Kartu Keluarga</Button>
                                    </Link>
                                )}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    <FormPendukung
                        onSubmit={this.submitPendukung}
                        initialValues={this.props.pendukung}
                        togglePendukung={this.state.modalToggle}
                        handleTogglePendukung={this.modalToggle}
                        />
                </Col>
            </Row>
        )
    }
}

FormPendukung = reduxForm({
    form: 'DataPendukungSeleksi',
    enableReinitialize: true,
})(FormPendukung)

const selector = formValueSelector('DataPendukungSeleksi')

FormPendukung = connect((store) => {
    let scan_kk = selector(store, 'scan_kk')
    return {
        scan_kk,
    }
})(FormPendukung)

export default connect(
    (store) => ({
        pendukung: store.pendukung.pendukung,
    })
)(Pendukung)