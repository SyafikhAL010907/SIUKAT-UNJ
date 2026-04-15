import React from 'react';
import { Table, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { cmahasiswa, verifikasi, info } from '../../../actions';
import { cookies, cookieName, storage, service } from '../../../global';
import { VerifikasiSNMPTN, InformasiKIPK } from '../../components';

class DataDiri extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(info.fetchInfo());
        this.props.dispatch(verifikasi.fetchVerifikasi(cookies.get(cookieName)));
    }
    render() {
        const { cmahasiswa, info, verifikasi } = this.props;

        if (!cmahasiswa || Object.keys(cmahasiswa).length === 0) {
            return (
                <div className="text-center p-5">
                    <i className="fa fa-spinner fa-spin fa-2x mb-3"></i>
                    <p>Memuat data diri mahasiswa...</p>
                </div>
            );
        }

        // Safe access to verifikasi and info with defaults
        const safeVerifikasi = verifikasi || {};
        const safeInfo = info || {};

        return (
            <Row className="align-items-center py-2">
                <Col md={4} xs={12} className="text-center mb-4 mb-md-0">
                    <div className="position-relative d-inline-block shadow-sm rounded-lg overflow-hidden" 
                         style={{ border: '4px solid #f8fafc', background: '#f8fafc' }}>
                        {cmahasiswa.foto_cmahasiswa ? (
                            <img
                                src={
                                    cmahasiswa.foto_cmahasiswa?.startsWith('http') 
                                    ? cmahasiswa.foto_cmahasiswa 
                                    : storage + '/' + cmahasiswa.foto_cmahasiswa
                                }
                                style={{ width: '100%', maxWidth: '200px', height: 'auto', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '8px' }}
                                alt="foto-cmahasiswa"
                                onError={(e) => {
                                    if (!e.target.dataset.triedFallback) {
                                        e.target.dataset.triedFallback = 'true';
                                        e.target.src = service + '/img/profile.png';
                                    } else {
                                        e.target.onerror = null;
                                        e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                                    }
                                }}
                            />
                        ) : (
                            <img
                                src={service + '/img/profile.png'}
                                style={{ width: '100%', maxWidth: '200px', height: 'auto', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '8px' }}
                                alt="belum-ada-foto"
                            />
                        )}
                    </div>
                </Col>
                <Col md={8} xs={12}>
                    <Table responsive className="modern-table-premium mb-0">
                        <tbody>
                            <tr>
                                <td>Nomor Peserta</td>
                                <td>{cmahasiswa.no_peserta || '-'}</td>
                            </tr>
                            <tr>
                                <td>Nama Lengkap</td>
                                <td style={{color: '#000'}}>{cmahasiswa.nama_cmahasiswa || '-'}</td>
                            </tr>
                            <tr>
                                <td>Program Studi</td>
                                <td>{cmahasiswa.prodi?.nama || cmahasiswa.prodi_cmahasiswa || '-'}</td>
                            </tr>
                            <tr>
                                <td>Fakultas</td>
                                <td>{cmahasiswa.fakultas?.nama || '-'}</td>
                            </tr>
                        </tbody>
                    </Table>

                    {/* HASIL VERIFIKASI: TAMPIL DI BAWAH FAKULTAS (MASIH DALAM COL-8) */}
                    {(cmahasiswa.jalur_cmahasiswa == 1) && (
                        <div className="mt-4 pt-3 border-top">
                            <h6 className="mb-3 font-weight-bold text-uppercase text-center" 
                                style={{ letterSpacing: '1.5px', fontSize: '0.8rem', color: '#64748b' }}>
                                <i className="fa fa-id-card-o mr-2"></i> Hasil Verifikasi
                            </h6>
                            <Row className="justify-content-center">
                                <Col md={6} xs={12} className="mb-3">
                                    <div className="verification-card-premium text-center h-100">
                                        <div className={`icon-wrapper-soft mx-auto ${safeVerifikasi.result_akademik === 'lolos' ? 'bg-success text-white' : 'bg-warning text-white'}`}
                                             style={{ boxShadow: safeVerifikasi.result_akademik === 'lolos' ? '0 4px 12px rgba(40, 167, 69, 0.2)' : '0 4px 12px rgba(255, 193, 7, 0.2)' }}>
                                            <i className={safeVerifikasi.result_akademik === 'lolos' ? 'fa fa-check' : 'fa fa-info'}></i>
                                        </div>
                                        <div className="text-muted small text-uppercase font-weight-bold" style={{ letterSpacing: '0.5px', fontSize: '0.65rem' }}>Verifikasi Akademik</div>
                                        <div className="mt-2">
                                            <span className={safeVerifikasi.result_akademik === 'lolos' ? 'badge-soft-success' : 'badge-soft-warning'}>
                                                {safeVerifikasi.result_akademik || 'PROSES'}
                                            </span>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6} xs={12} className="mb-3">
                                    <div className="verification-card-premium text-center h-100">
                                        <div className={`icon-wrapper-soft mx-auto ${safeVerifikasi.result_kipk === 'lolos' ? 'bg-success text-white' : 'bg-danger text-white'}`}
                                             style={{ boxShadow: safeVerifikasi.result_kipk === 'lolos' ? '0 4px 12px rgba(40, 167, 69, 0.2)' : '0 4px 12px rgba(220, 53, 69, 0.2)' }}>
                                            <i className={safeVerifikasi.result_kipk === 'lolos' ? 'fa fa-graduation-cap' : 'fa fa-times'}></i>
                                        </div>
                                        <div className="text-muted small text-uppercase font-weight-bold" style={{ letterSpacing: '0.5px', fontSize: '0.65rem' }}>Status KIPK</div>
                                        <div className="mt-2">
                                            <span className={safeVerifikasi.result_kipk === 'lolos' ? 'badge-soft-success' : 'badge-soft-danger'}>
                                                {!safeVerifikasi.result_kipk ? 'TIDAK TERDAFTAR' : safeVerifikasi.result_kipk}
                                            </span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Col>

                {/* ALERT KHUSUS JALUR 1 (BELUM VERIFIKASI) */}
                {(cmahasiswa.jalur_cmahasiswa == 1 && safeVerifikasi.result_akademik === 'belum_verifikasi') && (
                    <Col md={12} xs={12} className="mt-3">
                        <VerifikasiSNMPTN
                            cardStyles="text-center"
                            content="Belum Melakukan Verifikasi SNBP"
                            color="warning"
                            icon="fa fa-info-circle"
                            message="Segera hubungi Fakultas sesuai dengan Program Studi yang Anda pilih"
                        />
                    </Col>
                )}

                {/* INFORMASI KIPK JALUR 2 */}
                {(cmahasiswa.jalur_cmahasiswa == 2 && safeVerifikasi.result_kipk !== 'tidak_lolos' && safeVerifikasi.result_kipk) && (
                    <Col md={12} xs={12}>
                        <InformasiKIPK
                            cardStyles="text-center"
                            content="Informasi Peserta KIPK"
                            color="warning"
                            icon="fa fa-info-circle"
                            message="Semua Peserta KIPK Wajib Mengunduh File di bawah ini!!"
                        />
                    </Col>
                )}
            </Row>
        );
    }
}

export default connect((store) => {
    return {
        cmahasiswa: store.cmahasiswa.cmahasiswa,
        info: store.info.info,
        verifikasi: store.cmahasiswa.verifikasi,
    };
})(withCookies(DataDiri));
