import React, { Component } from 'react';
import UNJ from '../dist/img/unj.png';
import {
    Row,
    Col,
    Card,
    CardTitle,
    CardText,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Alert
} from 'reactstrap';
import { FormLogin, JadwalUkt, Bantuan } from '../components';
import { connect } from 'react-redux';
import { info } from '../../actions';
import moment from 'moment';
import 'moment/locale/id';
import momentTz from 'moment-timezone';
moment.locale('id');

const open = '2020-08-24 08:00:00';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            stage: this.props.info.stage,
            stage_detail: this.props.info.stage_detail,
            open_login: false
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
        });
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(info.fetchInfo());
    }

    componentDidMount() {
        if (!this.state.open_login) {
            this.interval = setInterval(() => {
                const open_login = momentTz.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') > open;

                if (open_login) {
                    this.setState({ ...this.state, open_login: true });
                    clearInterval(this.interval);
                }
            }, 1000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    GoToJapres() {
        window.location = 'http://siukat.unj.ac.id:8080/';
    }
    GoToSNMPTN() {
        window.location = 'http://siukat.unj.ac.id/';
    }
    GoToSBMPTN() {
        window.location = 'http://siukat.unj.ac.id:8082/';
    }
    GoToMandiri() {
        window.location = 'http://siukat.unj.ac.id:8081/';
    }

    render() {
        const stage = this.props.info.stage;
        const stage_detail = this.props.info.stage_detail;
        // const UpperStage = stage.toString();
        return (
            <div className="container-fluid bg-light min-vh-100 p-0">
                <Row className="m-0 min-vh-100">
                    {stage !== 'snbp' && (
                        <Modal isOpen={this.state.modal} modalTransition={{ timeout: 20 }} className="premium-modal modal-dialog-centered">
                            <ModalHeader>
                                <i className="fa fa-info-circle mr-2"></i> Pengumuman
                            </ModalHeader>
                            <ModalBody className="text-center">
                                <div className="py-2">
                                    Pengumuman UKT dapat dilihat pada <strong>Tanggal 08 Mei 2024 Pukul 19:00 WIB</strong>.
                                </div>
                            </ModalBody>
                            <ModalFooter className="justify-content-center border-0 pt-0">
                                <Button className="modern-btn-primary px-5 py-2 font-weight-bold shadow-sm" onClick={this.toggle} style={{borderRadius: '12px'}}>
                                    Sip, Saya Mengerti
                                </Button>
                            </ModalFooter>
                        </Modal>
                    )}

                    {stage === 'snmptn' && (
                        <Modal isOpen={this.state.modal} modalTransition={{ timeout: 20 }}>
                            <ModalHeader>Pengumuman</ModalHeader>
                            <ModalBody>
                                Pengisian SIUKAT Sudah Bisa diisi
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" block={true} onClick={this.toggle}>
                                    OK
                                </Button>
                            </ModalFooter>
                        </Modal>
                    )}

                    <Col md={{ size: 9 }} xs={{ size: 12 }} className="px-0 bg-white">
                        <div className="login-content py-5 px-4 px-md-5">
                            <div className="title-section mb-5 d-flex align-items-center">
                                <img
                                    src={UNJ}
                                    style={{ width: '85px', marginRight: '30px' }}
                                    alt="logo unj"
                                />
                                <div>
                                    <h1 className="h3 font-weight-bold text-dark mb-1" style={{letterSpacing: '-1px'}}>
                                        Sistem Informasi Uang Kuliah Tunggal
                                    </h1>
                                    <div className="d-flex align-items-center mt-2">
                                        <div className="badge px-3 py-2 rounded-lg font-weight-bold shadow-sm" style={{backgroundColor: 'var(--unj-green)', color: '#ffffff', fontSize: '0.8rem'}}>
                                            UNIVERSITAS NEGERI JAKARTA
                                        </div>
                                        <div className="ml-3 text-muted font-weight-bold border-left pl-3" style={{ textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>
                                            {stage_detail === 'mandiri' ? 'Mandiri Ujian Tulis' : stage_detail}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Row className="clearfix">
                                <Col md={{ size: 8 }} xs={{ size: 12 }}>
                                    <div className="premium-card shadow-sm border-0 p-1 mb-5 overflow-hidden">
                                        <div className="bg-emerald-soft p-3 text-white font-weight-bold d-flex align-items-center">
                                            <i className="fa fa-calendar mr-2"></i> Jadwal Kegiatan UKT
                                        </div>
                                        <div className="p-3">
                                            <JadwalUkt info={this.props.info} />
                                        </div>
                                    </div>
                                    
                                    <div className="premium-card shadow-sm border-0 overflow-hidden mb-5">
                                        <div className="bg-emerald-soft p-3 text-white font-weight-bold d-flex align-items-center">
                                            <i className="fa fa-play-circle mr-2"></i> Panduan Pembayaran UKT
                                        </div>
                                        <div className="p-4 bg-white text-center">
                                            <div className="rounded-lg overflow-hidden shadow-sm border">
                                                <iframe width="100%" height="400" src="https://www.youtube.com/embed/fhgF8uaVbds" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={{ size: 4 }} xs={{ size: 12 }}>
                                    <div className="login-panel" style={{ marginTop: '0' }}>
                                        <div className="premium-card border-0 shadow-sm rounded-lg overflow-hidden" style={{ background: '#fff1f2', borderLeft: '5px solid #ef4444' }}>
                                            <div className="p-4">
                                                <div className="d-flex align-items-center mb-2">
                                                    <div className="bg-danger rounded-circle mr-2 d-flex align-items-center justify-content-center shadow-sm" style={{width: '24px', height: '24px'}}>
                                                        <i className="fa fa-exclamation text-white" style={{fontSize: '12px'}}></i>
                                                    </div>
                                                    <h6 className="mb-0 font-weight-bold text-danger">Perhatian!</h6>
                                                </div>
                                                <CardText className="text-secondary font-weight-bold" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                                                    Isilah seluruh form isian dengan benar. Kesalahan
                                                    pengisian data akan mempengaruhi besarnya UKT yang
                                                    akan keluar.
                                                </CardText>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="login-panel">
                                        <Bantuan />
                                    </div>
                                </Col>
                            </Row>
                            {/* <Row className="clearfix">
                                <Col md={{ size: 8 }}
                                    xs={{ size: 12 }}>
                                    <Alert >
                                        <h5 style={{ textAlign: 'center' }}>Panduan Pembayaran UKT</h5>
                                        <hr />
                                        <iframe width="100%" height="400" src="https://www.youtube.com/embed/fhgF8uaVbds" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    </Alert>
                                </Col>
                            </Row> */}
                            <hr />
                            <Row className="clearfix">
                                <Col md={12} xs={12} className="d-flex justify-content-center">
                                    <span>
                                        Siukat Front © 2017 - {new Date().getFullYear()} Pustikom
                                        UNJ. All Rights Reserved.
                                    </span>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col md={{ size: 3 }} xs={{ size: 12 }} className="px-0">
                        <div className="login-side">
                            <div className="alert border-0 shadow-sm py-4 mb-5 text-center">
                                <h6 className="font-weight-bold mb-3" style={{ opacity: 0.9 }}>
                                    Bagi peserta selain <span className="text-uppercase">{stage_detail === 'mandiri' ? 'Mandiri Ujian Tulis' : stage_detail}</span>, silakan klik tombol:
                                </h6>
                                <Row className="m-0 g-2">
                                    {stage_detail !== 'snbp' && (
                                        <Col xs="12" className="p-1">
                                            <Button block className="btn-soft-white py-2 shadow-sm" onClick={this.GoToSNMPTN}>
                                                SNBP
                                            </Button>
                                        </Col>
                                    )}
                                    {stage_detail !== 'sbmptn' && (
                                        <Col xs="6" className="p-1">
                                            <Button block className="btn-soft-white py-2 shadow-sm" onClick={this.GoToSBMPTN}>
                                                SNBT
                                            </Button>
                                        </Col>
                                    )}
                                    {stage_detail !== 'japres' && (
                                        <Col xs="6" className="p-1">
                                            <Button block className="btn-soft-white py-2 shadow-sm" onClick={this.GoToJapres}>
                                                Japres
                                            </Button>
                                        </Col>
                                    )}
                                    {stage_detail !== 'mandiri' && (
                                        <Col xs="12" className="p-1">
                                            <Button block className="btn-soft-white py-2 shadow-sm" onClick={this.GoToMandiri}>
                                                Mandiri
                                            </Button>
                                        </Col>
                                    )}
                                </Row>
                            </div>
                            
                            <h3>Silakan Masuk</h3>
                            <div className="login-form-wrapper mt-2">
                                <FormLogin open_login={this.state.open_login} stage={stage_detail} history={this.props.history} />
                            </div>
                            
                            <div className="mt-auto pt-5 text-center" style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                                Siukat Front © 2017 - {new Date().getFullYear()} Pustikom UNJ.<br/>All Rights Reserved.
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect((store) => {
    return {
        info: store.info.info,
    };
})(Login);
