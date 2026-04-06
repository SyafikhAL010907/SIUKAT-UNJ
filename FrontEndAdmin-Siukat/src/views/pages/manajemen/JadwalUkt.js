import React from 'react'
import {Row, Col, Card, CardHeader, CardBody, Button,
        Form, FormGroup, Label} from 'reactstrap'
import { connect } from 'react-redux'
import { info, user } from '../../../actions';
import { Field, reduxForm, reset } from 'redux-form'
import { InputBs } from '../../components'
import { cookies, cookieName } from '../../../global';

let FormJadwalUkt = (props) => {
    const { handleSubmit,
            pristine, submitting } = props
    return (
        <Form onSubmit={handleSubmit} className="form-horizontal">
            <Row>
                <Col md={6}>
                    <FormGroup row>
                        <Col sm="3">
                            <Label htmlFor="stage">Jalur</Label>
                        </Col>
                        <Col sm="9">
                            <Field bsSize="sm" type="select" id="stage" name="stage" className="input-sm" component={InputBs}>  
                                <option value="">-- Pilih Jalur --</option>
                                { ["snmptn", "sbmptn", "mandiri"].map((data, key) => 
                                    <option value={data} key={key}>{data}</option>
                                )}
                                </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm="3">
                            <Label htmlFor="kontak">Kontak</Label>
                        </Col>
                        <Col sm="9">
                            <Field component={InputBs} bsSize="sm" type="text" id="kontak" name="kontak" className="input-sm"
                                placeholder="Kontak"/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm="3">
                            <Label htmlFor="klarifikasi_tanggal">Waktu Klarifikasi</Label>
                        </Col>
                        <Col sm="9">
                            <Field component={InputBs} bsSize="sm" type="textarea" rows="3" id="klarifikasi_tanggal" name="klarifikasi_tanggal" className="input-sm"
                                placeholder="Waktu Klarifikasi"/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm="3">
                            <Label htmlFor="klarifikasi_lokasi">Tempat Klarifikasi</Label>
                        </Col>
                        <Col sm="9">
                            <Field component={InputBs} bsSize="sm" type="textarea" rows="3" id="klarifikasi_lokasi" name="klarifikasi_lokasi" className="input-sm"
                                placeholder="Tempat Klarifikasi"/>
                        </Col>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup row>
                        <Col sm="3">
                            <Label htmlFor="pengisian">Pengisian</Label>
                        </Col>
                        <Col sm="9">
                            <Field component={InputBs} bsSize="sm" type="text" id="pengisian" name="pengisian" className="input-sm"
                                placeholder="Pengisian"/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm="3">
                            <Label htmlFor="pengumuman">Pengumuman</Label>
                        </Col>
                        <Col sm="9">
                            <Field component={InputBs} bsSize="sm" type="text" id="pengumuman" name="pengumuman" className="input-sm"
                                placeholder="Pengumuman"/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm="3">
                            <Label htmlFor="lapor_diri">Lapor Diri</Label>
                        </Col>
                        <Col sm="9">
                            <Field component={InputBs} bsSize="sm" type="text" id="lapor_diri" name="lapor_diri" className="input-sm"
                                placeholder="Lapor Diri"/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm="3">
                            <Label htmlFor="pembayaran">Pembayaran</Label>
                        </Col>
                        <Col sm="9">
                            <Field component={InputBs} bsSize="sm" type="text" id="pembayaran" name="pembayaran" className="input-sm"
                                placeholder="Pembayaran"/>
                        </Col>
                    </FormGroup>
                    <hr/>
                    <FormGroup row>
                        <Col sm="12">
                            <Button color="success" block disabled={pristine || submitting}><i className="fa fa-save"></i> Simpan</Button>
                        </Col>
                    </FormGroup>
                </Col>
            </Row>
        </Form>
    )
}
class JadwalUkt extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            toggleJadwalUkt: false
        }
        this.toggleJadwalUkt = this.toggleJadwalUkt.bind(this)
        this.submitForm = this.submitForm.bind(this)
    }
    componentWillMount(){
        this.props.dispatch(user.getByLoggedIn(cookies.get(cookieName)))
        this.props.dispatch(info.fetchInfo())
    }
    toggleJadwalUkt(){
        this.setState({
            toggleJadwalUkt: !this.state.toggleJadwalUkt
        })
    }
    submitForm(values){
        this.props.dispatch(info.updateData(cookies.get(cookieName), values))
        this.props.dispatch(reset('DataJadwalUkt'))
    }
    render(){
        return(
            <Row>
                <Col xs="12">
                    <Card className="card-accent-success">
                        <CardHeader>
                            <span>JadwalUkt</span>
                        </CardHeader>
                        <CardBody className="card-body">
                            <FormJadwalUkt
                                onSubmit={this.submitForm}
                                initialValues={this.props.info}
                                />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        )
    }
}

FormJadwalUkt = reduxForm({
    form: 'DataJadwalUkt',
    enableReinitialize: true,
})(FormJadwalUkt)

export default connect((store) => ({
    info: store.info.info,
    user: store.user.user
}))(JadwalUkt)