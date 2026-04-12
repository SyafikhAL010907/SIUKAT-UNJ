import React, { Component } from 'react';
import UNJ from '../dist/img/unj.png';
import {
    Row,
    Col,
    Modal,
    Button
} from 'reactstrap';
import { FormLogin, JadwalUkt, Bantuan } from '../components';
import { connect } from 'react-redux';
import { info } from '../../actions';
import moment from 'moment';
import 'moment/locale/id';
import momentTz from 'moment-timezone';
import { notif, setToken } from '../../global';
moment.locale('id');

const open = '2020-08-24 08:00:00';

class Login extends Component {
    constructor(props) {
        super(props);
        let is_open = false;
        try {
            is_open = momentTz.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') > open;
        } catch (e) {
            console.error("Error checking open status:", e);
        }

        this.state = {
            modal: false,
            stage: this.props.info ? this.props.info.stage : null,
            stage_detail: this.props.info ? this.props.info.stage_detail : null,
            open_login: is_open,
            // State for post-login validation modal
            showValidationModal: false,
            validationType: 'open', // 'open' | 'closed'
            validationInfo: null,
            tempAuthData: null
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
        });
    }

    toggleValidationModal = () => {
        this.setState({
            showValidationModal: !this.state.showValidationModal
        });
    }

    // Callback from FormLogin after login attempt
    handleLoginAttempt = (data, isError) => {
        if (isError) {
            // Jika jadwal tutup/belum buka (403 dari backend)
            this.setState({
                showValidationModal: true,
                validationType: 'closed',
                validationInfo: data.info
            });
        } else {
            // Jika jadwal buka/diperpanjang -> Langsung masuk (Gas Pol!)
            setToken(data.token);
            notif("Berhasil!", "Anda berhasil masuk", "success");
            window.location.reload();
        }
    }

    // Confirms and executes actual login after OK is clicked on "Open" modal
    confirmLogin = () => {
        const { tempAuthData } = this.state;
        if (tempAuthData) {
            setToken(tempAuthData.token);
            notif("Berhasil!", "Anda berhasil masuk", "success");
            // Reload to trigger dashboard redirect
            window.location.reload();
        }
    }

    // Helper to get stage name from code
    getStageName(code) {
        switch (code) {
            case 1: return 'SNBP (Seleksi Nasional Berdasarkan Prestasi)';
            case 2: return 'SNBT (Seleksi Nasional Berdasarkan Tes)';
            case 3: return 'MANDIRI (Ujian Tulis Mandiri)';
            default: return 'UMUM';
        }
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
        return (
            <div className="container-fluid bg-light min-vh-100 p-0">
                <Row className="m-0 min-vh-100">
                    {stage && stage !== 'snbp' && (
                        <Modal
                            isOpen={this.state.modal}
                            modalTransition={{ timeout: 300 }}
                            centered
                            className="border-none"
                            contentClassName="bg-transparent border-0"
                        >
                            <div className="lux-modal-card">
                                {/* HEADER */}
                                <div className="lux-modal-header">
                                    <div className="lux-modal-icon-bg">
                                        <i className="fa fa-info-circle text-warning font-size-30"></i>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="mb-0 text-white font-weight-bold" style={{ fontSize: '1.2rem' }}>Pengumuman Penting</h3>
                                        <p className="mb-0 text-white small" style={{ opacity: 0.8 }}>Informasi Akademik</p>
                                    </div>
                                </div>

                                {/* BODY */}
                                <div className="lux-modal-body">
                                    <p className="mb-2 text-muted small font-weight-bold text-uppercase" style={{ letterSpacing: '2px' }}>Jadwal Rilis</p>
                                    <div className="bg-light rounded-lg p-4 transition-all">
                                        <p className="text-secondary mb-2">
                                            Pengumuman UKT dapat Anda akses mulai pada:
                                        </p>
                                        <h2 className="font-weight-bold" style={{ color: '#006633' }}>
                                            08 Mei 2024
                                        </h2>
                                        <div className="badge badge-success px-3 py-2 rounded-pill font-weight-bold mt-2" style={{ backgroundColor: '#d1fae5', color: '#006633' }}>
                                            Pukul 19:00 WIB
                                        </div>
                                    </div>
                                </div>

                                {/* FOOTER */}
                                <div className="lux-modal-footer">
                                    <button
                                        onClick={this.toggle}
                                        className="lux-btn-submit py-3 mb-0 mt-3"
                                        style={{ background: '#006633', color: '#fff' }}
                                    >
                                        <span>Sip, Saya Mengerti</span>
                                        <i className="fa fa-arrow-right ml-2"></i>
                                    </button>
                                    <p className="mt-4 text-muted italic" style={{ fontSize: '11px' }}>
                                        Pastikan koneksi internet Anda stabil saat waktu pengumuman.
                                    </p>
                                </div>
                            </div>
                        </Modal>
                    )}

                    {/* NEW POST-LOGIN VALIDATION MODAL */}
                    <Modal
                        isOpen={this.state.showValidationModal}
                        toggle={this.toggleValidationModal}
                        centered
                        className="border-none"
                        contentClassName="bg-transparent border-0"
                    >
                        <div className="lux-modal-card">
                            <div className="lux-modal-header bg-danger">
                                <div className="lux-modal-icon-bg">
                                    <i className="fa fa-clock-o text-danger font-size-30"></i>
                                </div>
                                <div className="ml-3">
                                    <h3 className="mb-0 text-white font-weight-bold" style={{ fontSize: '1.2rem' }}>Status Akses: Ditutup</h3>
                                    <p className="mb-0 text-white small" style={{ opacity: 0.8 }}>Validasi Jalur Masuk</p>
                                </div>
                            </div>

                            <div className="lux-modal-body text-center py-4">
                                <span className="badge badge-pill badge-light px-3 py-2 mb-3 shadow-sm border text-uppercase font-weight-bold" style={{ letterSpacing: '1px', fontSize: '10px' }}>
                                    {this.state.validationInfo ? this.getStageName(this.state.validationInfo.kode) : '...'}
                                </span>
                                
                                <h4 className="font-weight-bold mb-3">
                                    Akses Pengisian Belum Tersedia
                                </h4>

                                <div className="bg-light rounded-lg p-3 text-left">
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="fa fa-calendar-check-o mr-2 text-primary"></i>
                                        <div className="small font-weight-bold">Jadwal Pengisian:</div>
                                    </div>
                                    <div className="ml-4 small text-muted">
                                        {this.state.validationInfo ? (
                                            <>
                                                {moment(this.state.validationInfo.tanggal_mulai).format('DD MMMM YYYY')} 
                                                <span className="mx-2">s/d</span> 
                                                {moment(this.state.validationInfo.tanggal_selesai).format('DD MMMM YYYY')}
                                            </>
                                        ) : 'Sedang memuat...'}
                                    </div>

                                    {this.state.validationInfo && this.state.validationInfo.tanggal_akhir && (
                                        <div className="mt-2 pt-2 border-top">
                                            <div className="d-flex align-items-center mb-1">
                                                <i className="fa fa-clock-o mr-2 text-warning"></i>
                                                <div className="small font-weight-bold text-warning">Tenggat Perpanjangan:</div>
                                            </div>
                                            <div className="ml-4 font-weight-bold text-danger">
                                                {moment(this.state.validationInfo.tanggal_akhir).format('DD MMMM YYYY')}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="lux-modal-footer">
                                <button
                                    onClick={this.toggleValidationModal}
                                    className="lux-btn-submit py-3 mb-0"
                                    style={{ background: '#ef4444', color: '#fff' }}
                                >
                                    <span>Saya Mengerti</span>
                                    <i className="fa fa-times-circle ml-2"></i>
                                </button>
                            </div>
                        </div>
                    </Modal>

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
                                        <div className="badge px-3 py-2 rounded-lg font-weight-bold shadow-sm" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>
                                            UNIVERSITAS NEGERI JAKARTA
                                        </div>
                                        {/* REMOVED LEGACY STAGE TEXT (SNMPT/SNBT) FROM HEADER */}
                                    </div>
                                </div>
                            </div>

                            <Row>
                                <Col md={{ size: 8 }} xs={{ size: 12 }}>
                                    {/* JADWAL UKT */}
                                    <div className="lux-card-schedule">
                                        <div className="lux-card-header-green">
                                            <i className="fa fa-calendar"></i>
                                            Jadwal Kegiatan UKT
                                        </div>
                                        <div className="p-4">
                                            <JadwalUkt info={this.props.info} />
                                        </div>
                                    </div>

                                    {/* VIDEO PANDUAN */}
                                    <div className="lux-card-schedule">
                                        <div className="lux-card-header-gold">
                                            <i className="fa fa-play-circle"></i>
                                            Panduan Pembayaran UKT
                                        </div>
                                        <div className="p-4">
                                            <div className="rounded-lg overflow-hidden shadow border bg-black">
                                                <iframe
                                                    style={{ height: '350px', width: '100%', border: 'none' }}
                                                    src="https://www.youtube.com/embed/fhgF8uaVbds"
                                                    title="YouTube video player"
                                                    allowFullScreen
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                <Col md={{ size: 4 }} xs={{ size: 12 }}>
                                    <div className="mb-4">
                                        <div className="rounded-xl overflow-hidden shadow-sm" style={{ background: '#fff1f2', borderLeft: '5px solid #ef4444' }}>
                                            <div className="p-4">
                                                <div className="d-flex align-items-center mb-2">
                                                    <div className="bg-danger rounded-circle mr-2 d-flex align-items-center justify-content-center shadow-sm" style={{width: '24px', height: '24px'}}>
                                                        <i className="fa fa-exclamation text-white" style={{fontSize: '12px'}}></i>
                                                    </div>
                                                    <h6 className="mb-0 font-weight-bold text-danger">Perhatian!</h6>
                                                </div>
                                                <p className="text-secondary font-weight-bold mb-0" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                                                    Isilah seluruh form isian dengan benar. Kesalahan
                                                    pengisian data akan mempengaruhi besarnya UKT yang
                                                    akan keluar.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Bantuan />
                                </Col>
                            </Row>

                            <hr className="my-5" />
                            <div className="text-center text-muted small">
                                Siukat Front © 2017 - {new Date().getFullYear()} Pustikom UNJ. All Rights Reserved.
                            </div>
                        </div>
                    </Col>

                    <Col md={{ size: 3 }} xs={{ size: 12 }} className="px-0">
                        <div className="login-side">
                            {/* <div className="lux-jalur-card">
                                <div className="text-center">
                                    <div className="mb-4 d-inline-flex align-items-center justify-content-center" style={{ background: '#0066331a', height: '64px', width: '64px', borderRadius: '16px' }}>
                                        <div className="bg-white rounded-lg shadow-sm d-flex align-items-center justify-content-center" style={{ height: '40px', width: '40px' }}>
                                            <i className="fa fa-users" style={{ color: '#006633' }}></i>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <p className="text-muted small font-weight-bold mb-1">Bagi peserta selain</p>
                                        <div className="badge badge-success py-2 px-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #006633, #004d26)', fontSize: '11px', fontWeight: 'bold' }}>
                                            {stage_detail === 'mandiri' ? 'Mandiri Ujian Tulis' : stage_detail}
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center gap-2 mt-4 mb-2">
                                            <span style={{ height: '1px', flex: 1, backgroundColor: '#eee' }}></span>
                                            <span className="text-muted font-weight-bold small text-uppercase px-2" style={{ letterSpacing: '2px', fontSize: '9px' }}>Pilih Jalur Lain</span>
                                            <span style={{ height: '1px', flex: 1, backgroundColor: '#eee' }}></span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        {stage_detail !== 'snbp' && (
                                            <a href="#snbp" onClick={(e) => { e.preventDefault(); this.GoToSNMPTN(); }} className="lux-jalur-btn lux-jalur-btn-center">
                                                <span>SNBP <i className="fa fa-chevron-right ml-2" style={{ fontSize: '0.8rem', opacity: 0.7 }}></i></span>
                                            </a>
                                        )}

                                        <div className="row no-gutters mb-0">
                                            {stage_detail !== 'sbmptn' && (
                                                <div className={stage_detail !== 'japres' ? 'col-6 pr-1' : 'col-12'}>
                                                    <a href="#snbt" onClick={(e) => { e.preventDefault(); this.GoToSBMPTN(); }} className="lux-jalur-btn lux-jalur-btn-center py-3">
                                                        <i className="fa fa-graduation-cap text-primary"></i>
                                                        <span>SNBT</span>
                                                    </a>
                                                </div>
                                            )}
                                            {stage_detail !== 'japres' && (
                                                <div className={stage_detail !== 'sbmptn' ? 'col-6 pl-1' : 'col-12'}>
                                                    <a href="#japres" onClick={(e) => { e.preventDefault(); this.GoToJapres(); }} className="lux-jalur-btn lux-jalur-btn-center py-3">
                                                        <i className="fa fa-trophy text-warning"></i>
                                                        <span>Japres</span>
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {stage_detail !== 'mandiri' && (
                                            <a href="#mandiri" onClick={(e) => { e.preventDefault(); this.GoToMandiri(); }} className="lux-jalur-btn lux-jalur-btn-center">
                                                <span>Mandiri <i className="fa fa-chevron-right ml-2" style={{ fontSize: '0.8rem', opacity: 0.7 }}></i></span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div> */}
                            
                            <h3 className="text-center mb-4 font-weight-bold text-white">Silakan Masuk</h3>
                             <div className="login-form-wrapper">
                                <FormLogin 
                                    open_login={this.state.open_login} 
                                    stage={stage_detail} 
                                    history={this.props.history} 
                                    onLoginAttempt={this.handleLoginAttempt}
                                />
                            </div>
                            
                            <div className="mt-auto pt-5 text-center" style={{ opacity: 0.6, fontSize: '0.8rem', color: '#fff' }}>
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

