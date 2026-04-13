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
            <div className="finish-page-container">
                <Row className="w-100 justify-content-center m-0">
                    <Col xs={11} md={10} lg={9}>
                        {/* Gambar Hero - Full Width Container */}
                        <div className="image-wrapper">
                            <img src={Thx} alt='selesai-isi' />
                        </div>
                        
                        <Card className="modern-card text-center">
                            <CardTitle className="card-title-custom">
                                Terima Kasih Telah Melengkapi Semua Data
                            </CardTitle>

                            <div className="content-text">
                                <div className="mt-3">
                                    Anda dapat mengunduh bukti penyelesaian data UKT.<br />
                                    Kami akan memproses data yang Anda masukkan.<br />
                                    Jangan lupa untuk <b>MASUK</b> kembali untuk melihat <b>HASIL UKT</b> pada tanggal<br />
                                    <div className="date-highlight mt-2">
                                        📅 {this.props.info?.pengumuman || "-"}
                                    </div>
                                </div>
                            </div>

                            <div className="btn-container">
                                <Button
                                    className="btn-custom btn-download"
                                    onClick={this.unduhBuktiSelesai.bind(this)}
                                >
                                    <i className="fa fa-download mr-2"></i> {this.state.textBuktiSelesai}
                                </Button>

                                <Button
                                    className="btn-custom btn-logout"
                                    onClick={this.logout.bind(this)}
                                >
                                    <i className="fa fa-check mr-2"></i> Keluar
                                </Button>
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