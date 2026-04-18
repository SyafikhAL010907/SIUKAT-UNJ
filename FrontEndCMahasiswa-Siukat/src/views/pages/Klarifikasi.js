import React from 'react';
import { Row, Col, Alert, Card, Badge } from 'reactstrap';
import { JadwalKlarifikasi, KetentuanKlarifikasi } from '../components';
import { cookies, cookieName } from '../../global';
import { cmahasiswa } from '../../actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class Klarifikasi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
    }
    render() {
        if (this.props.cmahasiswa.flag !== "sanggah_ukt") {
            return <Redirect to="/main/ukt" />;
        }
        return (
            <div className="p-0">
                <Row className="justify-content-center">
                    <Col md={10} lg={8} xs={12}>
                        <Card className="premium-card shadow-lg mt-4">
                            <div className="bg-emerald-soft p-4 p-md-5 text-center text-white position-relative">
                                <i className="fa fa-comments-o fa-2x fa-md-3x mb-3 text-white"></i>
                                <h3 className="font-weight-bold mb-0 text-white text-lg sm:text-2xl md:text-3xl" style={{ letterSpacing: '-0.5px' }}>
                                   Klarifikasi Data UKT
                                </h3>
                                <div className="d-inline-block mt-3 px-3 py-2" style={{ backgroundColor: '#ffcc00', color: '#0f6d3f', fontWeight: 'bold', fontSize: '0.75rem', borderRadius: '50px' }}>
                                    <i className="fa fa-clock-o mr-2"></i>Status: Menunggu Wawancara
                                </div>
                            </div>
                            
                            <div className="card-body p-4 p-md-5">
                                <div className="mb-5">
                                    <div className="d-flex align-items-center mb-3">
                                        <div style={{ height: '4px', width: '30px', background: '#ffcc00', marginRight: '10px', borderRadius: '2px' }}></div>
                                        <h5 className="font-weight-bold mb-0 color-emerald">Ketentuan Konfirmasi</h5>
                                    </div>
                                    <KetentuanKlarifikasi />
                                </div>

                                <div className="mb-5">
                                    <div className="d-flex align-items-center mb-3">
                                        <div style={{ height: '4px', width: '30px', background: '#ffcc00', marginRight: '10px', borderRadius: '2px' }}></div>
                                        <h5 className="font-weight-bold mb-0 color-emerald">Jadwal & Lokasi</h5>
                                    </div>
                                    <JadwalKlarifikasi />
                                </div>

                                <div className="pt-4 border-top">
                                    <Alert color="success" className="rounded-lg border-0 shadow-sm text-center py-3">
                                        <i className="fa fa-check-circle mr-2"></i>
                                        Anda telah berhasil memilih opsi Klarifikasi. Silakan datang sesuai jadwal di atas.
                                    </Alert>
                                    <p className="text-center text-muted small mt-2">
                                        Anda dapat keluar dari sistem sekarang. Informasi perubahan UKT akan muncul setelah proses validasi selesai.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </Col>
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