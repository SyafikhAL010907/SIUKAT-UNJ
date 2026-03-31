import React from 'react'
import {
    Card, Button, CardTitle, Alert,
    Collapse, Row, Col
} from 'reactstrap'
import { Pribadi, Ayah, Ibu, Wali, Pendukung } from './details'
import { cookies, cookieName } from '../../../../global'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { cmahasiswa } from '../../../../actions'

class Verifikasi extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            collapsePribadi: false,
            collapseAyah: false,
            collapseIbu: false,
            collapseWali: false,
            collapseSurat: false,
        }

        this.toggle = this.toggle.bind(this)
    }
    UNSAFE_componentWillMount() {
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)))
    }
    toggle = (stateName, val) => {
        var obj = { [stateName]: val }
        for (var key in this.state) {
            if (key !== stateName) obj[key] = false
        }
        this.setState(obj)
    }
    verify = () => {
        this.props.dispatch(cmahasiswa.tinggiSelesai(cookies.get(cookieName)))
    }
    render() {
        if (this.props.cmahasiswa.flag === "selesai_isi") {
            return <Redirect to="/main/ukt/selesai-isi" />
        }
        return (
            <Card body>
                <CardTitle>Verifikasi Data</CardTitle>
                { (this.props.allow === undefined || this.props.allow === 0) && (
                    <Alert color="warning"><i className="fa fa-info-circle"></i> Verifikasi dilakukan ketika seluruh data telah terisi.</Alert>
                )}

                { (this.props.allow !== undefined && this.props.allow !== 0) && (
                    <div>
                        {/* Data Pribadi */}
                        <div>
                            <legend className="clearfix">
                                <i className="fa fa-user"></i> Data Pribadi
                                <div className="pull-right">
                                    <Button size="sm" color="success" onClick={() => this.toggle("collapsePribadi", !this.state.collapsePribadi)}><i className="fa fa-bars"></i></Button>
                                </div>
                            </legend>
                            <Collapse isOpen={this.state.collapsePribadi}>
                                <Pribadi />
                            </Collapse>
                        </div>

                        {/* Data Ayah */}
                        <div>
                            <legend className="clearfix">
                                <i className="fa fa-user"></i> Data Ayah
                                <div className="pull-right">
                                    <Button size="sm" color="success" onClick={() => this.toggle("collapseAyah", !this.state.collapseAyah)}><i className="fa fa-bars"></i></Button>
                                </div>
                            </legend>
                            <Collapse isOpen={this.state.collapseAyah}>
                                <Ayah />
                            </Collapse>
                        </div>

                        {/* Data Ibu */}
                        <div>
                            <legend className="clearfix">
                                <i className="fa fa-user"></i> Data Ibu
                                <div className="pull-right">
                                    <Button size="sm" color="success" onClick={() => this.toggle("collapseIbu", !this.state.collapseIbu)}><i className="fa fa-bars"></i></Button>
                                </div>
                            </legend>
                            <Collapse isOpen={this.state.collapseIbu}>
                                <Ibu />
                            </Collapse>
                        </div>

                        {/* Data Wali */}
                        <div>
                            <legend className="clearfix">
                                <i className="fa fa-user"></i> Data Wali
                                <div className="pull-right">
                                    <Button size="sm" color="success" onClick={() => this.toggle("collapseWali", !this.state.collapseWali)}><i className="fa fa-bars"></i></Button>
                                </div>
                            </legend>
                            <Collapse isOpen={this.state.collapseWali}>
                                <Wali />
                            </Collapse>
                        </div>

                        {/* Data Surat Pernyataan */}
                        <div>
                            <legend className="clearfix">
                                <i className="fa fa-file"></i> Surat Pernyataan
                                <div className="pull-right">
                                    <Button size="sm" color="success" onClick={() => this.toggle("collapseSurat", !this.state.collapseSurat)}><i className="fa fa-bars"></i></Button>
                                </div>
                            </legend>
                            <Collapse isOpen={this.state.collapseSurat}>
                                <Pendukung />
                            </Collapse>
                        </div>

                        <hr />
                        <Row>
                            <Col md={{ size: 7 }} xs="12">
                                <Alert color="danger">
                                    <i className="fa fa-info-circle"></i> Dengan ini saya menyatakan bahwa data yang saya masukkan adalah data yang sebenar-benarnya dan sejujur-jujurnya.
                                </Alert>
                            </Col>
                            <Col md={{ size: 5 }} xs="12">
                                <Button color="success" block onClick={this.verify.bind(this)}><i className="fa fa-save"></i> Ya, Semua data sudah benar.</Button>
                            </Col>
                        </Row>
                    </div>
                )}
            </Card>
        )
    }
}

export default connect(
    (store) => ({
        cmahasiswa: store.cmahasiswa.cmahasiswa
    })
)(Verifikasi)