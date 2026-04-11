import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Button,
    Alert,
    Modal,
    ModalBody,
    Table,
    Card,
} from 'reactstrap';
import { DataDiri, NominalUKT } from '../components';
import { files } from '../../api';
import { cookies, cookieName } from '../../global';
import { cmahasiswa, verifikasi, info } from '../../actions';
import { connect } from 'react-redux';
import { notif } from '../../global';
import UNJ from '../dist/img/unj.png';

import ReactToPrint from 'react-to-print';

class ComponentToPrint extends React.Component {
    render() {
        return (
            <div
                style={{
                    margin: '20px',
                    border: '5px solid green',
                    textAlign: 'center',
                    padding: '10px',
                }}
            >
                <div
                    style={{
                        display: 'inline-block',
                        position: 'relative',
                        width: '150px',
                        height: '150px',
                        // overflow: "hidden",
                        // borderRadius: "25%",
                    }}
                >
                    {this.props.cmahasiswa.foto_cmahasiswa && (
                        <img
                            src={
                                UNJ
                                // storage +
                                // "/" +
                                // this.props.cmahasiswa.no_peserta +
                                // "/" +
                                // this.props.cmahasiswa.foto_cmahasiswa
                            }
                            style={{
                                width: 'auto',
                                height: '150px',
                            }}
                            alt="foto-cmahasiswa"
                        />
                    )}
                </div>
                <div style={{ margin: '20px' }}>
                    <h6 style={{ textAlign: 'left' }}>
                        Saudara/i {this.props.cmahasiswa.nama_cmahasiswa} dengan nomor
                        pendaftaran {this.props.cmahasiswa.no_peserta} mahasiswa baru UNJ.
                        Anda sudah melaksanakan pembayaran UKT di semester 119, dengan data
                        :
                    </h6>
                    <Table responsive>
                        <tr style={{ textAlign: 'left', paddingLeft: '20px' }}>
                            <td style={{ textAlign: 'left', paddingLeft: '40px' }}>
                                <h5>Nama</h5>
                            </td>
                            <td>|</td>
                            <td>
                                <h5>{this.props.cmahasiswa.nama_cmahasiswa}</h5>
                            </td>
                        </tr>
                        <tr style={{ textAlign: 'left', paddingLeft: '20px' }}>
                            <td style={{ textAlign: 'left', paddingLeft: '40px' }}>
                                <h5>Jalur Masuk</h5>
                            </td>
                            <td>|</td>
                            <td>
                                <h5>
                                    {this.props.cmahasiswa?.no_peserta?.charAt(0) === '8'
                                        ? 'JAPRES'
                                        : this.props.info?.stage?.toUpperCase() || '-'}
                                </h5>
                            </td>
                        </tr>
                        <tr style={{ textAlign: 'left', paddingLeft: '20px' }}>
                            <td style={{ textAlign: 'left', paddingLeft: '40px' }}>
                                <h5>Jenjang</h5>
                            </td>
                            <td>|</td>
                            <td>
                                <h5>{this.props.cmahasiswa?.prodi?.jenjang || '-'}</h5>
                            </td>
                        </tr>
                        <tr style={{ textAlign: 'left', paddingLeft: '20px' }}>
                            <td style={{ textAlign: 'left', paddingLeft: '40px' }}>
                                <h5>Program Studi</h5>
                            </td>
                            <td>|</td>
                            <td>
                                <h5>{this.props.cmahasiswa.prodi?.nama}</h5>
                            </td>
                        </tr>
                        <tr style={{ textAlign: 'left', paddingLeft: '20px' }}>
                            <td style={{ textAlign: 'left', paddingLeft: '40px' }}>
                                <h5>Nomor Induk Mahasiswa</h5>
                            </td>
                            <td>|</td>
                            <td>
                                <h5>{this.props.nim}</h5>
                            </td>
                        </tr>
                    </Table>
                    <h6 style={{ textAlign: 'left' }}>
                        Selanjutnya Anda telah memiliki akun siakad UNJ (siakad.unj.ac.id)
                        dengan akun :
                    </h6>
                    <Table responsive>
                        <tr style={{ textAlign: 'left', paddingLeft: '20px' }}>
                            <td style={{ textAlign: 'left', paddingLeft: '40px' }}>
                                <h5>Nomor Induk Mahasiswa</h5>
                            </td>
                            <td>|</td>
                            <td>
                                <h5>{this.props.nim}</h5>
                            </td>
                        </tr>
                        <tr style={{ textAlign: 'left', paddingLeft: '20px' }}>
                            <td style={{ textAlign: 'left', paddingLeft: '40px' }}>
                                <h5>Password</h5>
                            </td>
                            <td>|</td>
                            <td>
                                <h5>{this.props.nim}</h5>
                            </td>
                        </tr>
                    </Table>
                    <Alert color="warning">
                        <i className="fa fa-info-circle"></i> Silakan akses siakad UNJ pada
                        tautan http://siakad.unj.ac.id untuk mengisi Kartu Rencana Studi
                        (KRS) pada Akhir Agustus {new Date().getFullYear()} (setelah selesai proses PKKMB). Untuk
                        informasi detil silakan hubungi bagian akademik fakultas/program
                        studi masing-masing.
                    </Alert>
                </div>
            </div>
        );
    }
}

class Terima extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textSlipPembayaran: 'Unduh Slip Pembayaran',
            textCetakNIM: 'Cetak Nomor Induk Mahasiswa',
            modal: false,
            NIM: '-',
        };

        this.handleLamanBiodata = this.handleLamanBiodata.bind(this);
        this.unduhRegistrasi = this.unduhRegistrasi.bind(this);
        this.unduhSlipPembayaran = this.unduhSlipPembayaran.bind(this);
        this.cekPembayanUKT = this.cekPembayanUKT.bind(this);
        this.modalClose = this.modalClose.bind(this);
    }
    UNSAFE_componentWillMount() {
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(info.fetchInfo());
        this.props.dispatch(verifikasi.fetchVerifikasi(cookies.get(cookieName)));
    }
    unduhSlipPembayaran() {
        this.setState({
            textSlipPembayaran: 'Sedang Mengunduh...',
        });
        files
            .unduhSlipPembayaran(cookies.get(cookieName))
            .then(() => {
                this.setState({
                    textSlipPembayaran: 'Unduh Slip Pembayaran',
                });
            })
            .catch(() => {
                this.setState({
                    textSlipPembayaran: 'Unduh Slip Pembayaran',
                });
            });
    }

    modalClose() {
        this.setState({
            // modalInputName: "",
            modal: false,
        });
    }

    cekPembayanUKT() {
        console.log(this.props.verifikasi.result_kipk);
        let requestBody = {
            nomor_pendaftaran: this.props.cmahasiswa?.no_peserta,
            nomor_tagihan: this.props.cmahasiswa?.no_peserta,
            // nomor_tagihan:
            //     this.props.info.stage_detail == 'sbmptn'
            //         ? this.props.cmahasiswa.no_peserta
            //         : this.props.cmahasiswa.tagihan,
            kode_prodi: this.props.cmahasiswa?.prodi_cmahasiswa,
            jenjang:
                (this.props.cmahasiswa?.prodi?.jenjang?.slice(0, 1) || '') +
                '-' +
                (this.props.cmahasiswa?.prodi?.jenjang?.slice(-1) || ''),
            stage:
                this.props.cmahasiswa?.no_peserta?.charAt(0) === '8'
                    ? 'JAPRES'
                    : (this.props.info?.stage_detail?.toUpperCase() || 'MANDIRI'),
            beasiswa: this.props.verifikasi?.result_kipk === 'lolos' ? 'YA' : 'TIDAK',
            keterangan: '-',
            keterangan_beasiswa:
                this.props.verifikasi?.result_kipk === 'lolos' ? 'KIPK' : '-',
            nama_lengkap: this.props.cmahasiswa?.nama_cmahasiswa
        };
        console.log(requestBody, this.props.verifikasi);
        const url = 'http://103.8.12.212:38080/penmaba/registrasi';
        // const url = `http://192.168.9.113:4004/penmaba/registrasi`;

        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => {
                return response.json();
                // this.setState({ modal: true });
            })
            .then((json) => {
                console.log(json.code, this.props.verifikasi);
                if (json.code === 200) {
                    this.setState({ modal: true, NIM: json.data.nim });
                    console.log(this.props.cmahasiswa);
                    // } else if (
                    //   json.code === 400 &&
                    //   this.props.verifikasi.result_kipk != "lolos" &&
                    //   this.props.verifikasi.result_kipk != ""
                    // ) {
                    //   notif(
                    //     "KIPK anda belum disetujui",
                    //     "Tunggu informasi selanjutnya",
                    //     "warning"
                    //   );
                } else if (json.code === 400) {
                    notif(json.message, 'Silakan melakukan pembayaran', 'warning');
                } else if (json.code === 401) {
                    notif(json.message, 'Pastikan kamu melakukan registrasi di waktu yang tepat, silakan hubungi kami di cs.pendaftaran.unj.ac.id')
                }
                // console.log(this.state.NIM);
            })
            .catch((err) => {
                console.log(err);
                notif(
                    'Terjadi kesalahan!',
                    'Hubungi panitia penerimaan mahasiswa baru',
                    'error'
                );
            });
    }

    unduhRegistrasi() {
        // const param = "snmptn"
        // const param = this.props.cmahasiswa.no_peserta.substring(0, 1) === '8' ? 'japres' : 'sbmptn'
        let param;
        if (this.props.cmahasiswa.no_peserta.substring(0, 1) === '8') {
            param = 'japres';
        } else if (this.props.cmahasiswa.no_peserta.substring(0, 1) === '9') {
            param = 'mandiri';
        } else if (this.props.cmahasiswa.no_peserta.substring(0, 1) === '4') {
            param = 'snbp';
        } else {
            param = 'sbmptn';
        }
        this.setState({
            textSlipPembayaran: 'Sedang Mengunduh...',
        });
        files
            .unduhRegistrasi(param)
            .then(() => {
                this.setState({
                    textSlipPembayaran: 'Unduh Slip Pembayaran',
                });
            })
            .catch(() => {
                this.setState({
                    textSlipPembayaran: 'Unduh Slip Pembayaran',
                });
            });
    }

    handleLamanBiodata() {
        this.props.history.push('/main/biodata');
    }

    render() {
        if (
            this.props.cmahasiswa.flag !== 'terima_ukt' &&
            this.props.cmahasiswa.flag !== 'selesai_sanggah'
        ) {
            return <Redirect to="/main/ukt" />;
        }
        // console.log(this.state.modal);

        // bio_ system removed — biodata gating no longer applies
        const biodataIsBelumLengkap = false;

        return (
            <div>
                <Row className="margin-top-20">
                    <Col md={2} xs={12}></Col>
                    <Col md={8} xs={12}>
                        <h4 className="text-center">
                            {!biodataIsBelumLengkap && <>
                                <i className="fa fa-check"></i> Proses Pengisian UKT Telah Selesai{' '}
                                <i className="fa fa-check"></i>
                            </>}
                            {biodataIsBelumLengkap && <>
                                <i className="fa fa-exclamation-circle"></i> Ups, anda belum dapat melihat hasil UKT!{' '}
                                <i className="fa fa-exclamation-circle"></i>
                            </>}
                        </h4>
                        <hr />
                        <DataDiri />
                        {!biodataIsBelumLengkap &&
                            <>
                                <NominalUKT />
                                {/* <div>
                                    <Button
                                        color="primary"
                                        size="lg"
                                        block
                                        className="margin-top-20"
                                        onClick={this.unduhRegistrasi}
                                    >
                                        <i className="fa fa-info-circle"></i> Unduh Dokumen ketentuan
                                        Registrasi <i className="fa fa-info-circle"></i>
                                    </Button>
                                </div> */}

                                <div>
                                    <Button
                                        color="primary"
                                        size="lg"
                                        block
                                        className="margin-top-20"
                                        onClick={this.unduhSlipPembayaran}
                                    >
                                        <i className="fa fa-info-circle"></i>{' '}
                                        {this.state.textSlipPembayaran}{' '}
                                        <i className="fa fa-info-circle"></i>
                                    </Button>
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <Button
                                        color="success"
                                        size="lg"
                                        block
                                        className="margin-top-20"
                                        onClick={this.cekPembayanUKT}
                                    // disabled
                                    >
                                        <i className="fa fa-info-circle"></i> {this.state.textCetakNIM}{' '}
                                        <i className="fa fa-info-circle"></i>
                                        <br />
                                        <span>
                                            (Silakan login kembali pada tanggal{" "}
                                            {this.props.info?.lapor_diri || "-"})
                                        </span>
                                    </Button>
                                </div>
                                {/* <Button color="success" size="lg" block className="margin-top-20"><i className="fa fa-info-circle"></i> Lihat Informasi Tentang Lapor Diri <i className="fa fa-info-circle"></i></Button> */}

                                {/* <Card body className="margin-top-20" color="danger" inverse>
              <CardTitle>
                <i className="fa fa-info-circle"></i> Catatan
              </CardTitle>
              <div className="card-body">
                <ul className="list-reset">
                  <li>
                    LAPOR DIRI dilakukan di BAKHUM UNJ pada tanggal{" "}
                    {this.props.info.lapor_diri} dan tidak boleh diwakilkan.
                    Wajib membawa berkas-berkas yang tertera pada Dokumen yang
                    dapat diunduh di atas.
                  </li>
                  <li>
                    Calon Mahasiswa yang tidak melakukan Registrasi ke BAKHUM
                    UNJ, tidak bisa melakukan pembayaran dan dianggap
                    mengundurkan diri
                  </li>
                  <li>
                    Slip pembayaran yang sudah diunduh harap dicetak dan dibawa
                    pada saat lapor diri
                  </li>
                  <li>
                    PESERTA BIDIKMISI YANG LOLOS VERIFIKASI TIDAK PERLU
                    MELAKUKAN PEMBAYARAN.
                  </li>
                </ul>
              </div>
            </Card> */}

                                <Modal
                                    id="modal-cetak-nim"
                                    isOpen={this.state.modal}
                                    size="lg"
                                    toggle={(e) => this.modalClose(e)}
                                >
                                    {/* <ModalHeader toggle={(e) => this.modalClose(e)}>
                Cetak Nomor Induk Mahasiswa Universitas Negeri Jakarta 2020
              </ModalHeader> */}
                                    <ModalBody toggle={(e) => this.modalClose(e)}>
                                        <ComponentToPrint
                                            ref={(el) => (this.componentRef = el)}
                                            cmahasiswa={this.props.cmahasiswa}
                                            nim={this.state.NIM}
                                            info={this.props.info}
                                        />
                                        <Button
                                            onClick={(e) => this.modalClose(e)}
                                            style={{ margin: '0px 20px', float: 'right' }}
                                        >
                                            Cancel
                                        </Button>
                                        <ReactToPrint
                                            trigger={() => {
                                                return (
                                                    <Button
                                                        color="success"
                                                        style={{ marginRight: '20px', float: 'right' }}
                                                    >
                                                        <i className="fa fa-print"></i> Cetak Bukti NIM
                                                    </Button>
                                                );
                                            }}
                                            content={() => this.componentRef}
                                        />
                                    </ModalBody>
                                </Modal>
                                <Alert color="success" className="margin-top-20 text-center">
                                    <i className="fa fa-check"></i>
                                    Anda bisa keluar dari sistem ini sekarang.
                                    <i className="fa fa-check"></i>
                                </Alert>
                            </>
                        }

                        {biodataIsBelumLengkap && <>
                            <Card body className="text-center" color="warning">
                                <h4 className="text-center">Anda belum melengkapi biodata pada laman biodata</h4>
                                <hr />
                                <h5>
                                    Silahkan untuk melengkapi biodata anda pada laman biodata{" "}
                                </h5>
                                <br />
                                <Button className="btn btn-success" onClick={this.handleLamanBiodata}>
                                    <i className="fa fa-arrow-circle-left"></i> Menuju ke laman Biodata
                                </Button>
                            </Card>
                        </>}
                    </Col>
                    <Col md={2} xs={12}></Col>
                </Row>
            </div>
        );
    }
}

Terima.propTypes = {
    cmahasiswa: PropTypes.object,
    info: PropTypes.object,
    verifikasi: PropTypes.object,
    dispatch: PropTypes.func,
};

ComponentToPrint.propTypes = {

};

export default connect((store) => ({
    cmahasiswa: store.cmahasiswa.cmahasiswa,
    info: store.info.info,
    verifikasi: store.cmahasiswa.verifikasi,
}))(Terima);
