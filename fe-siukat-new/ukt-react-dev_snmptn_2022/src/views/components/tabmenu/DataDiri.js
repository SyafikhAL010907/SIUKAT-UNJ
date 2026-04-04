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
        return (
            <Row>
                <Col md={3} xs={12}>
                    {this.props.cmahasiswa.foto_cmahasiswa && (
                        <img
                            src={
                                storage +
                                '/' +
                                this.props.cmahasiswa.no_peserta +
                                '/' +
                                this.props.cmahasiswa.foto_cmahasiswa
                            }
                            className="img-thumbnail img-responsive"
                            alt="foto-cmahasiswa"
                        />
                    )}
                    {this.props.cmahasiswa.foto_cmahasiswa === '' && (
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
                                <td>{this.props.cmahasiswa.no_peserta}</td>
                            </tr>
                            <tr>
                                <td>Nama</td>
                                <td>{this.props.cmahasiswa.nama_cmahasiswa}</td>
                            </tr>
                            {/* {((this.props.cmahasiswa.flag === "pengumuman" || this.props.cmahasiswa.flag === "terima_ukt" || this.props.cmahasiswa.flag === "sanggah_ukt" || this.props.cmahasiswa.flag === "selesai_sanggah")
                                && this.props.cmahasiswa.bidik_misi_cmahasiswa === "Ya"
                                && (this.props.verifikasi.result_akademik === "lolos" || this.props.verifikasi.result_akademik === "belum_verifikasi")
                            ) &&
                                <tr>
                                    <td className={classNames({
                                        "bg-green": this.props.verifikasi.result_bidikmisi === "lolos",
                                        "bg-warning": this.props.verifikasi.result_bidikmisi === "belum_verifikasi",
                                        "bg-danger": this.props.verifikasi.result_bidikmisi === "tidak_lolos",
                                        "bg-danger": this.props.verifikasi.result_bidikmisi === ""
                                    })} width="40%">Hasil Verifikasi Bidik Misi</td>
                                    <td className={classNames({
                                        "bg-green h4": this.props.verifikasi.result_bidikmisi === "lolos",
                                        "bg-warning h4": this.props.verifikasi.result_bidikmisi === "belum_verifikasi",
                                        "bg-danger h4": this.props.verifikasi.result_bidikmisi === "tidak_lolos",
                                        "bg-danger h4": this.props.verifikasi.result_bidikmisi === "",
                                    })}>{classNames({
                                        "Lolos": this.props.verifikasi.result_bidikmisi === "lolos",
                                        "Belum Selesai Verifikasi": this.props.verifikasi.result_bidikmisi === "belum_verifikasi",
                                        "Tidak Lolos": this.props.verifikasi.result_bidikmisi === "tidak_lolos",
                                        "Belum Verifikasi": this.props.verifikasi.result_bidikmisi === "",
                                    })}
                                    </td>
                                </tr>
                            }
                            {(
                                (this.props.cmahasiswa.flag === "belum_isi"
                                    || this.props.cmahasiswa.flag === "pengisian"
                                    || this.props.cmahasiswa.flag === "selesai_isi")

                                || this.props.cmahasiswa.bidik_misi_cmahasiswa === "Tidak") &&
                                <tr>
                                    <td width="30%">Status Bidik Misi</td>
                                    <td>{this.props.cmahasiswa.bidik_misi_cmahasiswa}</td>
                                </tr>
                            } */}
                            <tr>
                                <td>Program Studi</td>
                                {this.props.cmahasiswa.prodi !== undefined && (
                                    <td>{this.props.cmahasiswa.prodi.nama}</td>
                                )}
                            </tr>
                            <tr>
                                <td>Fakultas</td>
                                {this.props.cmahasiswa.fakultas !== undefined && (
                                    <td>{this.props.cmahasiswa.fakultas.nama}</td>
                                )}
                            </tr>
                        </tbody>
                    </Table>
                </Col>
                {/* </Row> */}
                {/* <Row> */}
                {this.props.info.stage === 'snbp' && (
                    <Col md={12} xs={12}>
                        <h3>Hasil Verifikasi</h3>
                        <Table responsive striped bordered>
                            <tbody>
                                <tr>
                                    <td>Verifikasi Akademik</td>
                                    <td>{this.props.verifikasi.result_akademik}</td>
                                </tr>
                                <tr>
                                    <td>Status KIPK</td>
                                    <td>
                                        {this.props.verifikasi.result_kipk === null ||
                                            this.props.verifikasi.result_kipk === ''
                                            ? 'Tidak'
                                            : this.props.verifikasi.result_kipk}
                                    </td>
                                </tr>
                                {/* <tr>
                <td>Status KJMU</td>
                <td>
                  {this.props.verifikasi.result_kjmu == null ||
                  this.props.verifikasi.result_kjmu == ""
                    ? "Tidak"
                    : this.props.verifikasi.result_kjmu}
                </td>
              </tr> */}
                            </tbody>
                        </Table>
                        {this.props.verifikasi.result_akademik === 'belum_verifikasi' && (
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
                {this.props.info.stage_detail === 'sbmptn' && (
                    <Col md={12} xs={12}>
                        {!(
                            this.props.verifikasi.result_kipk === 'tidak_lolos' ||
                            this.props.verifikasi.result_kipk === null ||
                            this.props.verifikasi.result_kipk === ''
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
