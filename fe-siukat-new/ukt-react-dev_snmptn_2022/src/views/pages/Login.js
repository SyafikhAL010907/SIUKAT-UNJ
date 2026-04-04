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
            <div md={12} xs={12} className="container-fluid">
                <Row style={{ backgroundColor: '#fefefe' }}>
                    {stage !== 'snbp' && (
                        <Modal isOpen={this.state.modal} modalTransition={{ timeout: 20 }}>
                            <ModalHeader>Pengumuman</ModalHeader>
                            <ModalBody>
                                Pengumuman UKT dapat dilihat pada Tanggal 08 Mei 2024 Pukul 19:00 WIB.
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" block={true} onClick={this.toggle}>
                                    OK
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

                    <Col md={{ size: 9 }} xs={{ size: 12 }} className="px-0">
                        <div className="login-content">
                            <div className="title clearfix">
                                <img
                                    src={UNJ}
                                    style={{ width: '100px', verticalAlign: 'middle' }}
                                    alt="logo unj"
                                />
                                <div className="title-text">
                                    <span className="main">
                                        Sistem Informasi Uang Kuliah Tunggal (UKT){' '}
                                    </span>
                                    <span className="sub">
                                        Universitas Negeri Jakarta -{' '}
                                        {/* {stage == "sbmptn" ? "Jalur Prestasi" : "SNMPTN"} */}
                                        <span style={{ textTransform: 'uppercase' }}>
                                            {stage_detail === 'mandiri' ? 'Mandiri Ujian Tulis' : stage_detail}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <Row className="clearfix">
                                <Col md={{ size: 8 }} xs={{ size: 12 }}>
                                    <JadwalUkt info={this.props.info} />
                                    <br />
                                    {/* <Alert >
                                        <h5 style={{ textAlign: 'center' }}>Bagi peserta selain {' '}
                                            <span style={{ textTransform: 'uppercase' }}>
                                                {stage_detail == 'mandiri' ? 'Mandiri Ujian Tulis' : stage_detail}
                                            </span>, silahkan klik tombol berikut</h5>
                                        <hr />
                                        <Row>
                                            {stage_detail != 'snmptn' && (
                                                <Col className="text-center">
                                                    <h5>SNMPTN</h5>
                                                    <Button
                                                        id="bt"
                                                        onClick={this.GoToSNMPTN}
                                                        color="info"
                                                        style={{ marginBottom: '20px' }}
                                                    >
                                                        {' '}
                                                        // <i className="fa fa-sign-in"></i>
                                                         Klik Di sini
                                                    </Button>
                                                </Col>
                                            )}
                                            {stage_detail != 'japres' && (
                                                <Col className="text-center">
                                                    <h5>Jalur Prestasi</h5>
                                                    <Button
                                                        id="bt"
                                                        onClick={this.GoToJapres}
                                                        color="success"
                                                        style={{ marginBottom: '20px' }}
                                                    >
                                                        {' '}
                                                        // <i className="fa fa-sign-in"></i>
                                                         Klik Di sini
                                                    </Button>
                                                </Col>
                                            )}
                                            {stage_detail != 'sbmptn' && (
                                                <Col className="text-center">
                                                    <h5>SBMPTN</h5>
                                                    <Button
                                                        id="bt"
                                                        onClick={this.GoToSBMPTN}
                                                        color="warning"
                                                        style={{ marginBottom: '20px' }}
                                                    >
                                                        {' '}
                                                        // <i className="fa fa-sign-in"></i>
                                                         Klik Di sini
                                                    </Button>
                                                </Col>
                                            )}
                                            {stage_detail != 'mandiri' && (
                                                <Col className="text-center">
                                                    <h5>Mandiri</h5>
                                                    <Button
                                                        id="bt"
                                                        onClick={this.GoToMandiri}
                                                        color="primary"
                                                        style={{ marginBottom: '20px' }}
                                                    >
                                                        {' '}
                                                        // <i className="fa fa-sign-in"></i>
                                                         Klik Di sini
                                                    </Button>
                                                </Col>
                                            )}
                                        </Row>
                                    </Alert> */}
                                    <Alert >
                                        <h5 style={{ textAlign: 'center' }}>Panduan Pembayaran UKT</h5>
                                        <hr />
                                        <iframe width="100%" height="400" src="https://www.youtube.com/embed/fhgF8uaVbds" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                    </Alert>
                                </Col>
                                <Col md={{ size: 4 }} xs={{ size: 12 }}>
                                    <Row className="clearfix">
                                        <Col
                                            md={{ size: 12 }}
                                            xs={{ size: 12 }}
                                            className="login-panel"
                                        >
                                            <Card body color="danger" inverse>
                                                <CardTitle>Perhatian!</CardTitle>
                                                <CardText>
                                                    {' '}
                                                    Isilah seluruh form isian dengan benar. Kesalahan
                                                    pengisian data akan mempengaruhi besarnya UKT yang
                                                    akan keluar.
                                                </CardText>
                                            </Card>
                                        </Col>
                                        <Col
                                            md={{ size: 12 }}
                                            xs={{ size: 12 }}
                                            className="login-panel"
                                        >
                                            <Bantuan />
                                        </Col>
                                    </Row>
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
                            <Alert >
                                <h5 style={{ textAlign: 'center' }}>Bagi peserta selain {' '}
                                    <span style={{ textTransform: 'uppercase' }}>
                                        {stage_detail === 'mandiri' ? 'Mandiri Ujian Tulis' : stage_detail}
                                    </span>, silahkan klik tombol berikut</h5>
                                <hr />
                                <Row>
                                    {stage_detail !== 'snbp' && (
                                        <Col className="text-center">
                                            {/* <h5>SNMPTN</h5> */}
                                            <Button
                                                id="bt"
                                                onClick={this.GoToSNMPTN}
                                                color="info"
                                                style={{ marginBottom: '20px' }}
                                            >
                                                {' '}
                                                {/* <i className="fa fa-sign-in"></i> */}
                                                SNBP
                                            </Button>
                                        </Col>
                                    )}
                                    {stage_detail !== 'japres' && (
                                        <Col className="text-center">
                                            {/* <h5>Jalur Prestasi</h5> */}
                                            <Button
                                                id="bt"
                                                onClick={this.GoToJapres}
                                                color="success"
                                                style={{ marginBottom: '20px' }}
                                            >
                                                {' '}
                                                {/* <i className="fa fa-sign-in"></i> */}
                                                Jalur Prestasi
                                            </Button>
                                        </Col>
                                    )}
                                    {stage_detail !== 'sbmptn' && (
                                        <Col className="text-center">
                                            {/* <h5>SBMPTN</h5> */}
                                            <Button
                                                id="bt"
                                                onClick={this.GoToSBMPTN}
                                                color="warning"
                                                style={{ marginBottom: '20px' }}
                                            >
                                                {' '}
                                                {/* <i className="fa fa-sign-in"></i> */}
                                                SNBT
                                            </Button>
                                        </Col>
                                    )}
                                    {stage_detail !== 'mandiri' && (
                                        <Col className="text-center">
                                            {/* <h5>Mandiri</h5> */}
                                            <Button
                                                id="bt"
                                                onClick={this.GoToMandiri}
                                                color="primary"
                                                style={{ marginBottom: '20px' }}
                                            >
                                                {' '}
                                                {/* <i className="fa fa-sign-in"></i> */}
                                                Mandiri
                                            </Button>
                                        </Col>
                                    )}
                                </Row>
                            </Alert>
                            <hr />
                            <h3>Silakan Masuk</h3>
                            <hr />
                            <FormLogin open_login={this.state.open_login} stage={stage_detail} history={this.props.history} />
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
