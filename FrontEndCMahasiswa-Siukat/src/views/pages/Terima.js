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
            <div className="p-0 animate-fade-in">
                <Row className="justify-content-center">
                    <Col md={10} lg={8} xs={12}>
                        <Card className="premium-card shadow-lg mt-4 border-0 overflow-hidden">
                            {!biodataIsBelumLengkap && (
                                <div className="bg-emerald-soft p-4 p-md-5 text-center text-white position-relative">
                                    <div className="position-absolute d-none d-md-block" style={{ top: '20px', right: '30px', opacity: 0.1 }}>
                                        <i className="fa fa-university fa-5x"></i>
                                    </div>
                                    <div className="d-inline-block p-2 p-sm-3 rounded-circle bg-white shadow-sm mb-3">
                                        <i className="fa fa-check fa-lg fa-md-2x text-emerald"></i>
                                    </div>
                                    <h2 className="font-weight-bold mb-1 text-white text-base sm:text-2xl md:text-3xl" style={{ letterSpacing: '-0.5px' }}>
                                        Proses Pengisian UKT Selesai
                                    </h2>
                                    <p className="mb-0 opacity-80 text-xs sm:text-base md:text-lg">
                                        Selamat! Anda telah menyelesaikan seluruh tahapan penentuan UKT.
                                    </p>
                                </div>
                            )}

                            {biodataIsBelumLengkap && (
                                <div className="bg-danger p-4 p-md-5 text-center text-white">
                                    <i className="fa fa-exclamation-triangle fa-3x mb-3 text-white"></i>
                                    <h2 className="font-weight-bold mb-1 text-white">
                                        Lengkapi Biodata Anda
                                    </h2>
                                    <p className="mb-0 opacity-80">
                                        Anda belum dapat melihat hasil UKT sebelum melengkapi biodata.
                                    </p>
                                </div>
                            )}

                            <div className="card-body p-3 p-sm-4 p-md-5">
                                <div className="mb-4 mb-md-5 overflow-hidden rounded-xl border shadow-sm bg-white">
                                    <DataDiri />
                                </div>
 
                                {!biodataIsBelumLengkap && (
                                    <>
                                        <div className="mb-4 mb-md-5 rounded-xl overflow-hidden shadow-sm border" style={{ borderColor: '#10b981' }}>
                                            <div className="bg-light p-3 border-bottom d-flex align-items-center">
                                                <i className="fa fa-money text-success mr-2 mr-sm-3 fa-lg"></i>
                                                <h6 className="mb-0 font-weight-bold color-emerald text-uppercase text-[10px] sm:text-xs md:text-sm" style={{ letterSpacing: '1px' }}>Ketetapan Hasil UKT</h6>
                                            </div>
                                            <div className="px-2 px-sm-3">
                                                <NominalUKT />
                                            </div>
                                        </div>
 
                                        <div className="bg-light p-3 p-sm-4 rounded-xl mb-4 border text-center shadow-sm">
                                            <i className="fa fa-info-circle text-primary mb-2 fa-2x"></i>
                                            <h6 className="font-weight-bold text-sm sm:text-base">Tahap Selanjutnya</h6>
                                            <p className="text-muted text-[11px] sm:text-xs md:text-sm mb-3 mx-auto" style={{ maxWidth: '500px', lineHeight: '1.6' }}>
                                                Silakan unduh slip pembayaran Anda dan lakukan pembayaran melalui bank mitra UNJ untuk mendapatkan Nomor Induk Mahasiswa (NIM).
                                            </p>
                                            <Button 
                                                className="modern-btn-primary px-4 py-2 shadow-sm w-100 w-sm-auto" 
                                                style={{ borderRadius: '50px' }}
                                                onClick={this.unduhSlipPembayaran}
                                            >
                                                <i className="fa fa-download mr-2"></i> {this.state.textSlipPembayaran}
                                            </Button>
                                        </div>
 
                                        <div className="text-center pt-4 border-top">
                                            <Alert color="success" className="rounded-xl border-0 shadow-sm py-3 mb-0 text-xs sm:text-sm">
                                                <i className="fa fa-check-circle mr-2"></i>
                                                Anda bisa keluar dari sistem ini sekarang. Silakan login kembali secara berkala untuk info terbaru.
                                            </Alert>
                                        </div>
                                    </>
                                )}
 
                                {biodataIsBelumLengkap && (
                                    <div className="text-center py-4 px-2">
                                        <p className="text-muted mb-4 text-xs sm:text-sm">
                                            Silakan lengkapi biodata Anda terlebih dahulu pada menu yang telah disediakan.
                                        </p>
                                        <Button 
                                            className="modern-btn-primary px-4 px-sm-5 py-2 py-sm-3 shadow-lg w-100 w-sm-auto" 
                                            style={{ borderRadius: '50px' }}
                                            onClick={this.handleLamanBiodata}
                                        >
                                            <i className="fa fa-arrow-circle-left mr-2"></i> Menuju Laman Biodata
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Modals remains unchanged for logic */}
                <Modal
                    id="modal-cetak-nim"
                    isOpen={this.state.modal}
                    size="lg"
                    toggle={(e) => this.modalClose(e)}
                >
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
