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
            <Row>
                <Col md={3} xs={12}>
                    {cmahasiswa.foto_cmahasiswa ? (
                        <img
                            src={
                                cmahasiswa.foto_cmahasiswa?.startsWith('http') 
                                ? cmahasiswa.foto_cmahasiswa 
                                : storage + '/' + cmahasiswa.foto_cmahasiswa
                            }
                            className="img-thumbnail img-responsive"
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
                            className="img-thumbnail img-responsive"
                            alt="belum-ada-foto"
                        />
                    )}
                </Col>
                <Col md={9} xs={12}>
                    <Table responsive striped bordered>
                        <tbody>
                            <tr>
                                <td>Nomor Peserta</td>
                                <td>{cmahasiswa.no_peserta || '-'}</td>
                            </tr>
                            <tr>
                                <td>Nama</td>
                                <td>{cmahasiswa.nama_cmahasiswa || '-'}</td>
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
                </Col>
                {safeInfo.stage === 'snbp' && (
                    <Col md={12} xs={12}>
                        <h3>Hasil Verifikasi</h3>
                        <Table responsive striped bordered>
                            <tbody>
                                <tr>
                                    <td>Verifikasi Akademik</td>
                                    <td>{safeVerifikasi.result_akademik || '-'}</td>
                                </tr>
                                <tr>
                                    <td>Status KIPK</td>
                                    <td>
                                        {!safeVerifikasi.result_kipk
                                            ? 'Tidak'
                                            : safeVerifikasi.result_kipk}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        {safeVerifikasi.result_akademik === 'belum_verifikasi' && (
                            <VerifikasiSNMPTN
                                cardStyles="text-center"
                                content="Belum Melakukan Verifikasi SNBP"
                                color="warning"
                                icon="fa fa-info-circle"
                                message="Segera hubungi Fakultas sesuai dengan Program Studi yang Anda pilih"
                            />
                        )}
                    </Col>
                )}
                {safeInfo.stage_detail === 'sbmptn' && (
                    <Col md={12} xs={12}>
                        {!(
                            safeVerifikasi.result_kipk === 'tidak_lolos' ||
                            !safeVerifikasi.result_kipk
                        ) && (
                                <InformasiKIPK
                                    cardStyles="text-center"
                                    content="Informasi Peserta KIPK"
                                    color="warning"
                                    icon="fa fa-info-circle"
                                    message="Semua Peserta KIPK Wajib Mengunduh File di bawah ini!!"
                                />
                            )}
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
