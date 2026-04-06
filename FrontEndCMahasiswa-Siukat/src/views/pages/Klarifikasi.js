import React from 'react';
import { Row, Col, Alert } from 'reactstrap';
import { JadwalKlarifikasi, KetentuanKlarifikasi } from '../components';
import { cookies, cookieName } from '../../global';
import { cmahasiswa } from '../../actions';
import { connect } from 'react-redux';

class Klarifikasi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
    }
    render() {
        // if(this.props.cmahasiswa.flag !== "sanggah_ukt"){
        //     return <Redirect to="/main/ukt"/>
        // }
        return (
            <div>
                <Row className="margin-top-20">
                    <Col md={2} xs={12}></Col>
                    <Col md={8} xs={12}>
                        <h4 className="text-center"><i className="fa fa-info-circle"></i> Anda Telah Memilih Klarifikasi UKT <i className="fa fa-info-circle"></i></h4><hr />
                        <Alert color="warning">
                            <KetentuanKlarifikasi />
                        </Alert>
                        <JadwalKlarifikasi />
                        <hr />
                        <Alert color="success" className="text-center">
                            <i className="fa fa-check"></i>
                                Anda bisa keluar dari sistem ini sekarang.
                            <i className="fa fa-check"></i>
                        </Alert>
                    </Col>
                    <Col md={2} xs={12}></Col>
                </Row>
            </div>
        );
    }
}

export default connect(
    (store) => ({
        cmahasiswa: store.cmahasiswa.cmahasiswa,
    })
)(Klarifikasi);