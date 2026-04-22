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
            <div>
                <Row className="align-items-center py-2 px-1 sm:px-3">
                    <Col md={4} xs={12} className="text-center mb-4 mb-md-0">
                        <div className="position-relative d-inline-block shadow-sm rounded-lg overflow-hidden" 
                              style={{ border: '3px solid #f8fafc', background: '#f8fafc' }}>
                            {cmahasiswa.foto_cmahasiswa ? (
                                <img
                                    src={
                                        cmahasiswa.foto_cmahasiswa?.startsWith('http') 
                                        ? cmahasiswa.foto_cmahasiswa 
                                        : storage + '/' + cmahasiswa.foto_cmahasiswa
                                    }
                                    style={{ width: '100%', maxWidth: '220px', height: 'auto', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '12px' }}
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
                                    style={{ width: '100%', maxWidth: '220px', height: 'auto', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '12px' }}
                                    alt="belum-ada-foto"
                                />
                            )}
                        </div>
                    </Col>
                    <Col md={8} xs={12} className="px-0 px-md-3">
                        <div className="table-responsive-sm">
                            <Table className="modern-table-premium mb-0 border-0">
                                <tbody>
                                    <tr>
                                        <td className="text-sm sm:text-base md:text-lg py-3" style={{ width: '35%' }}>No. Peserta</td>
                                        <td className="text-sm sm:text-base md:text-lg py-3 font-weight-bold">{cmahasiswa.no_peserta || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-sm sm:text-base md:text-lg py-3">Nama Lengkap</td>
                                        <td className="text-sm sm:text-base md:text-lg py-3 font-weight-bold" style={{color: '#000'}}>{cmahasiswa.nama_cmahasiswa || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-sm sm:text-base md:text-lg py-3">Program Studi</td>
                                        <td className="text-sm sm:text-base md:text-lg py-3 font-weight-bold">{cmahasiswa.prodi?.nama || cmahasiswa.prodi_cmahasiswa || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-sm sm:text-base md:text-lg py-3">Fakultas</td>
                                        <td className="text-sm sm:text-base md:text-lg py-3 font-weight-bold">{cmahasiswa.fakultas?.nama || '-'}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>

                {/* HASIL VERIFIKASI: DIPINDAH KE LUAR BIAR BISA DI TENGAH KARTU */}
                {(cmahasiswa.jalur_cmahasiswa == 1) && (
                    <div className="mt-4 pt-4 border-top">
                        <h6 className="mb-4 font-weight-bold text-uppercase text-center text-xs md:text-sm" 
                            style={{ letterSpacing: '1.5px', color: '#64748b' }}>
                            <i className="fa fa-id-card-o mr-2"></i> Hasil Verifikasi
                        </h6>
                        <Row className="justify-content-center px-2">
                            <Col xl={5} lg={6} md={12} xs={12} className="px-1 mb-3">
                                <div className="verification-card-premium text-center h-100 p-3 sm:p-4">
                                    <div className={`icon-wrapper-soft mx-auto mb-2 ${
                                            safeVerifikasi.result_akademik === 'lolos' ? 'bg-success text-white' : 
                                            safeVerifikasi.result_akademik === 'tidak_lolos' ? 'bg-danger text-white' : 'bg-warning text-white'
                                         }`}
                                         style={{ width: '45px', height: '45px', lineHeight: '45px', fontSize: '1rem' }}>
                                        <i className={
                                            safeVerifikasi.result_akademik === 'lolos' ? 'fa fa-check' : 
                                            safeVerifikasi.result_akademik === 'tidak_lolos' ? 'fa fa-times' : 'fa fa-info'
                                        }></i>
                                    </div>
                                    <div className="text-muted text-[10px] sm:text-xs text-uppercase font-weight-bold" style={{ letterSpacing: '0.5px' }}>Akademik</div>
                                    <div className="mt-1">
                                        <span className={`badge ${
                                            safeVerifikasi.result_akademik === 'lolos' ? 'badge-success' : 
                                            safeVerifikasi.result_akademik === 'tidak_lolos' ? 'badge-danger' : 'badge-warning'
                                        } text-[10px] sm:text-xs text-wrap px-2`}>
                                            {
                                                safeVerifikasi.result_akademik === 'lolos' ? 'Lolos' :
                                                safeVerifikasi.result_akademik === 'tidak_lolos' ? 'Tidak Lolos' :
                                                safeVerifikasi.result_akademik === 'belum_verifikasi' ? 'Belum Verifikasi' :
                                                safeVerifikasi.result_akademik || 'PROSES'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </Col>
                            <Col xl={5} lg={6} md={12} xs={12} className="px-1 mb-3">
                                <div className="verification-card-premium text-center h-100 p-3 sm:p-4">
                                    <div className={`icon-wrapper-soft mx-auto mb-2 ${
                                            safeVerifikasi.result_kipk === 'lolos' ? 'bg-success text-white' : 
                                            (safeVerifikasi.result_kipk === 'tidak_lolos' || safeVerifikasi.result_kipk === 'non_eligible') ? 'bg-danger text-white' : 
                                            'bg-warning text-white'
                                         }`}
                                         style={{ width: '45px', height: '45px', lineHeight: '45px', fontSize: '1rem' }}>
                                        <i className={
                                            safeVerifikasi.result_kipk === 'lolos' ? 'fa fa-graduation-cap' : 
                                            (safeVerifikasi.result_kipk === 'tidak_lolos' || safeVerifikasi.result_kipk === 'non_eligible') ? 'fa fa-times' : 
                                            safeVerifikasi.result_kipk === 'verifikasi_lanjutan' ? 'fa fa-exclamation' : 'fa fa-info'
                                        }></i>
                                    </div>
                                    <div className="text-muted text-[10px] sm:text-xs text-uppercase font-weight-bold" style={{ letterSpacing: '0.5px' }}>Status KIPK</div>
                                    <div className="mt-1">
                                        <span className={`badge ${
                                            safeVerifikasi.result_kipk === 'lolos' ? 'badge-success' : 
                                            (safeVerifikasi.result_kipk === 'tidak_lolos' || safeVerifikasi.result_kipk === 'non_eligible') ? 'badge-danger' : 
                                            'badge-warning'
                                        } text-[10px] sm:text-xs text-wrap px-2`}>
                                            {
                                                !safeVerifikasi.result_kipk ? 'TIDAK TERDAFTAR' :
                                                safeVerifikasi.result_kipk === 'lolos' ? 'Lolos' :
                                                safeVerifikasi.result_kipk === 'tidak_lolos' ? 'Tidak Lolos' :
                                                safeVerifikasi.result_kipk === 'belum_verifikasi' ? 'Belum Verifikasi' :
                                                safeVerifikasi.result_kipk === 'non_eligible' ? 'Non Eligible' :
                                                safeVerifikasi.result_kipk === 'verifikasi_lanjutan' ? 'Verifikasi Lanjutan' :
                                                safeVerifikasi.result_kipk
                                            }
                                        </span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}

                {/* ALERT KHUSUS JALUR 1 (BELUM VERIFIKASI) */}
                {(cmahasiswa.jalur_cmahasiswa == 1 && safeVerifikasi.result_akademik === 'belum_verifikasi') && (
                    <Row className="mt-4 mt-md-5">
                        <Col md={12} xs={12}>
                            <VerifikasiSNMPTN
                                cardStyles="text-center shadow-sm"
                                content="Belum Melakukan Verifikasi SNBP"
                                color="warning"
                                icon="fa fa-info-circle"
                                message="Segera hubungi Fakultas sesuai dengan Program Studi yang Anda pilih"
                            />
                        </Col>
                    </Row>
                )}

                {/* INFORMASI KIPK JALUR 2 */}
                {(cmahasiswa.jalur_cmahasiswa == 2 && safeVerifikasi.result_kipk !== 'tidak_lolos' && safeVerifikasi.result_kipk) && (
                    <Row className="mt-4">
                        <Col md={12} xs={12}>
                            <InformasiKIPK
                                cardStyles="text-center shadow-sm"
                                content="Informasi Peserta KIPK"
                                color="warning"
                                icon="fa fa-info-circle"
                                message="Semua Peserta KIPK Wajib Mengunduh File di bawah ini!!"
                            />
                        </Col>
                    </Row>
                )}
            </div>
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
