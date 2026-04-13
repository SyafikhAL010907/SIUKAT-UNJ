import React from 'react';
import Thx from '../dist/img/thx.jpg';
import { Row, Col, Button, Card, CardTitle } from 'reactstrap';
import { notif, cookies, cookieName, removeToken } from '../../global';
import { Redirect } from 'react-router-dom';
import { cmahasiswa, info } from '../../actions';
import { files } from '../../api';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// IMPORT CSS DISINI BRO! (Sesuaikan path folder lu)
import '../dist/css/modern-ui.css'; 

class SelesaiIsi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textBuktiSelesai: 'Unduh Bukti Selesai'
        };
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(info.fetchInfo());
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
    }

    logout(e) {
        e.preventDefault();
        removeToken();
        this.props.history.push('/');
        notif('Berhasil!', 'Anda sudah keluar', 'success');
    }

    unduhBuktiSelesai() {
        this.setState({ textBuktiSelesai: 'Sedang Mengunduh...' });
        files.unduhBuktiSelesai(cookies.get(cookieName)).then(() => {
            this.setState({ textBuktiSelesai: 'Unduh Bukti Selesai' });
        }).catch(() => {
            this.setState({ textBuktiSelesai: 'Unduh Bukti Selesai' });
        });
    }

    render() {
        if (this.props.cmahasiswa.flag !== 'selesai_isi') {
            return <Redirect to="/main/ukt" />;
        }

        return (
            <div className="finish-page-container bg-white">
                <Row className="w-100 justify-content-center m-0">
                    <Col xs={11} md={10} lg={8} className="text-center">
                        <div className="image-wrapper d-none d-md-block">
                            <img src={Thx} alt='selesai-isi' />
                        </div>
                        
                        <Card className="success-card-premium p-4 p-md-5 pt-md-5">
                            <div className="pt-4 pt-md-2">
                                <i className="fa fa-check-circle success-hero-icon"></i>
                                <h3 className="font-weight-bold text-dark mb-3">
                                    Simpan Data Berhasil!
                                </h3>
                                <p className="text-muted mb-4 px-md-5">
                                    Terima kasih telah melengkapi seluruh persyaratan. Data Anda telah kami terima dan sedang dalam proses verifikasi oleh tim seleksi UKT.
                                </p>

                                <div className="announcement-box shadow-sm">
                                    <div className="announcement-label">Jadwal Pengumuman Hasil UKT</div>
                                    <div className="announcement-date">
                                        <i className="fa fa-calendar-check-o mr-2 text-emerald"></i>
                                        {this.props.info?.pengumuman || "Segera Hadir"}
                                    </div>
                                    <p className="small text-muted mt-2 mb-0 italic">
                                        *Silakan login kembali pada tanggal tersebut untuk melihat hasil penetapan UKT Anda.
                                    </p>
                                </div>

                                <div className="btn-container-modern mt-4">
                                    <Button
                                        className="modern-btn-primary px-4 py-3 shadow-lg"
                                        onClick={this.unduhBuktiSelesai.bind(this)}
                                        style={{minWidth: '220px'}}
                                    >
                                        <i className="fa fa-download mr-2"></i> {this.state.textBuktiSelesai}
                                    </Button>

                                    <Button
                                        className="btn outline-emerald px-4 py-3"
                                        onClick={this.logout.bind(this)}
                                        style={{minWidth: '150px'}}
                                    >
                                        <i className="fa fa-sign-out mr-2"></i> Keluar
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

SelesaiIsi.propTypes = {
    cmahasiswa: PropTypes.object,
    history: PropTypes.object,
    info: PropTypes.object,
    dispatch: PropTypes.func,
};

export default connect(
    (store) => ({
        cmahasiswa: store.cmahasiswa.cmahasiswa,
        info: store.info.info
    })
)(SelesaiIsi);