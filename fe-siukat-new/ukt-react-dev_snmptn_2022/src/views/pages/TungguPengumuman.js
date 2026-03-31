import React from 'react';
import Thx from '../dist/img/thx.jpg';
import {
    Row, Col, Button,
    Card, CardTitle
} from 'reactstrap';
import { notif, cookies, cookieName } from '../../global';
import { Redirect } from 'react-router-dom';
import { cmahasiswa, info } from '../../actions';
import { connect } from 'react-redux';

class TungguPengumuman extends React.Component {
    constructor(props) {
        super(props);
    }
    UNSAFE_componentWillMount() {
        this.props.dispatch(info.fetchInfo());
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
    }
    logout(e) {
        e.preventDefault();
        cookies.remove(cookieName, { path: '/' });
        this.props.history.push('/');
        notif('Berhasil!', 'Anda sudah keluar', 'success');
    }
    render() {
        if (this.props.cmahasiswa.flag !== 'tunggu_pengumuman') {
            return <Redirect to="/main/ukt" />;
        }
        return (
            <Row className="margin-top-20">
                <Col md={2}></Col>
                <Col md={8}>
                    <img src={Thx} alt='tunggu-pengumuman' width="100%" />
                    <Card body className="text-center margin-top-20 bg-grey">
                        <CardTitle>Masa Pengisian Data SIUKAT Sudah Selesai</CardTitle>
                        <p>
                            Masa pengisian data SIUKAT sudah ditutup.<br />
                            Kami akan memproses data yang Anda masukkan.<br />
                            Jangan lupa untuk <b>MASUK</b> kembali untuk melihat <b>HASIL UKT</b> pada tanggal<br /><b style={{ fontSize: '20px' }}>{this.props.info.pengumuman}</b>.
                        </p>
                        <Row>
                            <Col md="12">
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

export default connect(
    (store) => ({
        cmahasiswa: store.cmahasiswa.cmahasiswa,
        info: store.info.info
    })
)(TungguPengumuman);