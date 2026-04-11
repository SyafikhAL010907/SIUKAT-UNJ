import React from 'react';
import Thx from '../dist/img/thx.jpg';
import {
    Row, Col, Button,
    Card, CardTitle
} from 'reactstrap';
import { notif, cookies, cookieName, removeToken } from '../../global';
import { Redirect } from 'react-router-dom';
import { cmahasiswa, info } from '../../actions';
import { files } from '../../api';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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
        this.setState({
            textBuktiSelesai: 'Sedang Mengunduh...'
        });
        files.unduhBuktiSelesai(cookies.get(cookieName)).then(() => {
            this.setState({
                textBuktiSelesai: 'Unduh Bukti Selesai'
            });
        }).catch(() => {
            this.setState({
                textBuktiSelesai: 'Unduh Bukti Selesai'
            });
        });
    }
    render() {
        if (this.props.cmahasiswa.flag !== 'selesai_isi') {
            return <Redirect to="/main/ukt" />;
        }
        return (
            <Row className="margin-top-20">
                <Col md={2}></Col>
                <Col md={8}>
                    <img src={Thx} alt='selesai-isi' width="100%" />
                    <Card body className="text-center margin-top-20 bg-grey">
                        <CardTitle>Terima Kasih Telah Melengkapi Semua Data</CardTitle>
                        <p>
                            Anda dapat mengunduh bukti penyelesaian data UKT.<br />
                            Kami akan memproses data yang Anda masukkan.<br />
                            Jangan lupa untuk <b>MASUK</b> kembali untuk melihat <b>HASIL UKT</b> pada tanggal<br /><b style={{ fontSize: '20px' }}>{this.props.info?.pengumuman || "-"}</b>.
                        </p>
                        <Row>
                            <Col md="6">
                                <Button color="warning" onClick={this.unduhBuktiSelesai.bind(this)}><i className="fa fa-download"></i> {this.state.textBuktiSelesai}</Button>
                            </Col>
                            <Col md="6">
                                <Button color="success" onClick={this.logout.bind(this)}><i className="fa fa-check"></i> Keluar</Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col md={2}></Col>
            </Row>
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