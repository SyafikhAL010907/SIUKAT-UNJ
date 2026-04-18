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
    renderSection = (title, icon, stateName, Component) => (
        <div className="mb-3 border rounded-xl overflow-hidden shadow-sm bg-white">
            <div 
                className="d-flex align-items-center justify-content-between p-3 cursor-pointer hover-bg-light"
                onClick={() => this.toggle(stateName, !this.state[stateName])}
                style={{ cursor: 'pointer', background: this.state[stateName] ? '#f8fafc' : '#fff' }}
            >
                <div className="font-weight-bold text-dark text-sm sm:text-base">
                    <i className={`fa ${icon} mr-3 text-emerald`}></i> {title}
                </div>
                <i className={`fa ${this.state[stateName] ? 'fa-chevron-up' : 'fa-chevron-down'} text-muted`}></i>
            </div>
            <Collapse isOpen={this.state[stateName]}>
                <div className="p-3 p-sm-4 p-md-5 border-top bg-white">
                    <Component />
                </div>
            </Collapse>
        </div>
    )

    render() {
        if (this.props.cmahasiswa.flag === "selesai_isi") {
            return <Redirect to="/main/ukt/selesai-isi" />
        }
        return (
            <Card className="premium-card p-3 p-sm-4 p-md-5">
                <CardTitle tag="h4" className="mb-4 font-weight-bold text-lg sm:text-xl md:text-2xl">
                    Verifikasi & Finalisasi Data
                </CardTitle>
                
                { (this.props.allow === undefined || this.props.allow === 0) && (
                    <Alert color="warning" className="rounded-xl shadow-sm border-0 mb-4 px-3 py-3 d-flex align-items-start">
                        <i className="fa fa-info-circle mr-3 mt-1 text-lg"></i> 
                        <span className="text-sm sm:text-base">
                            Verifikasi dapat dilakukan setelah <strong>seluruh tahapan data</strong> terisi lengkap.
                        </span>
                    </Alert>
                )}

                { (this.props.allow !== undefined && this.props.allow !== 0) && (
                    <div>
                        <div className="my-4">
                            <h5 className="mb-4 font-weight-bold text-secondary border-bottom pb-2 text-base sm:text-lg">
                                <i className="fa fa-search mr-2"></i> Pratinjau Seluruh Data:
                            </h5>
                            {this.renderSection('Data Pribadi', 'fa-user', 'collapsePribadi', Pribadi)}
                            {this.renderSection('Data Ayah', 'fa-user', 'collapseAyah', Ayah)}
                            {this.renderSection('Data Ibu', 'fa-user-o', 'collapseIbu', Ibu)}
                            {this.renderSection('Data Wali', 'fa-users', 'collapseWali', Wali)}
                            {this.renderSection('Surat Pernyataan', 'fa-file-text-o', 'collapseSurat', Pendukung)}
                        </div>

                        <div className="mt-5 pt-4 border-top">
                            <Row className="align-items-center">
                                <Col lg="8" md="7" xs="12">
                                    <Alert color="danger" className="rounded-xl border-0 shadow-sm mb-3 mb-md-0 px-3 py-3">
                                        <div className="d-flex align-items-center">
                                            <i className="fa fa-exclamation-triangle mr-3 text-lg d-none d-sm-block"></i>
                                            <div className="text-xs sm:text-sm">
                                                Dengan ini saya menyatakan bahwa data yang saya masukkan adalah data yang <strong>sebenar-benarnya dan sejujur-jujurnya</strong>.
                                            </div>
                                        </div>
                                    </Alert>
                                </Col>
                                <Col lg="4" md="5" xs="12">
                                    <Button 
                                        className="modern-btn-primary w-100 py-3 shadow font-weight-bold"
                                        onClick={this.verify.bind(this)}
                                    >
                                        <i className="fa fa-check-circle mr-2"></i> Konfirmasi Selesai
                                    </Button>
                                </Col>
                            </Row>
                        </div>
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