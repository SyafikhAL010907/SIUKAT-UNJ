import React from "react";
import {
    Row,
    Col,
    Card,
    Button,
    Alert,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Badge
} from "reactstrap";
import {
    DataDiri,
    NominalUKT,
    VerifikasiSNMPTN,
} from "../components";
import { cookies, cookieName } from "../../global";
import { Redirect } from "react-router-dom";
import { cmahasiswa, verifikasi, info, keringanan } from "../../actions";
import { files } from "../../api";
import { connect } from "react-redux";

class TerimaSanggah extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalTerima: false,
            modalKlarifikasi: false,
            textSlipPembayaran: "Unduh Slip Pembayaran",
            keringanan: null,
        };

        this.toggleTerima = this.toggleTerima.bind(this);
        this.toggleKlarifikasi = this.toggleKlarifikasi.bind(this);
        this.klikTerima = this.klikTerima.bind(this);
        this.klikKlarifikasi = this.klikKlarifikasi.bind(this);
    }
    UNSAFE_componentWillMount() {
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(info.fetchInfo());
        this.props.dispatch(verifikasi.fetchVerifikasi(cookies.get(cookieName)));
        this.props.dispatch(keringanan.getData(cookies.get(cookieName)));
    }

    toggleTerima() {
        this.setState({
            modalTerima: !this.state.modalTerima,
        });
    }

    toggleKlarifikasi() {
        this.setState({
            modalKlarifikasi: !this.state.modalKlarifikasi,
        });
    }

    klikTerima() {
        this.props.dispatch(cmahasiswa.terimaUkt(cookies.get(cookieName)));
    }

    klikKlarifikasi() {
        this.props.dispatch(cmahasiswa.sanggahUkt(cookies.get(cookieName)));
    }

    unduhRegistrasi = () => {
        let param;
        if (this.props.cmahasiswa.no_peserta.substring(0, 1) === "8") {
            param = "japres";
        } else if (this.props.cmahasiswa.no_peserta.substring(0, 1) === "9") {
            param = "mandiri";
        } else if (this.props.cmahasiswa.no_peserta.substring(0, 1) === "4") {
            param = "snbp";
        } else {
            param = this.props.info.stage;
        }
        this.setState({
            textSlipPembayaran: "Sedang Mengunduh...",
        });
        files
            .unduhRegistrasi(param)
            .then((res) => {
                this.setState({
                    textSlipPembayaran: "Unduh Slip Pembayaran",
                });
            })
            .catch((err) => {
                this.setState({
                    textSlipPembayaran: "Unduh Slip Pembayaran",
                });
            });
    };

    render() {
        if (this.props.cmahasiswa.flag !== "pengumuman") {
            return <Redirect to="/main/ukt" />;
        }
        return (
            <div className="p-0 animate-fade-in">
                <Row className="justify-content-center">
                    <Col md={10} lg={8} xs={12}>
                        <Card className="premium-card shadow-lg mt-4 border-0 overflow-hidden">
                            {/* Branded Header Section */}
                            <div className="bg-emerald-soft p-4 p-md-5 text-center text-white position-relative">
                                <div className="position-absolute d-none d-md-block" style={{ top: '20px', right: '30px', opacity: 0.1 }}>
                                    <i className="fa fa-university fa-5x"></i>
                                </div>
                                <i className="fa fa-bullhorn fa-xl fa-md-3x mb-3 text-white"></i>
                                <h2 className="font-weight-bold mb-1 text-white text-base sm:text-2xl md:text-3xl" style={{ letterSpacing: '-0.5px', lineHeight: '1.2' }}>
                                    Pengumuman Hasil UKT
                                </h2>
                                <p className="mb-0 opacity-80 text-xs sm:text-base md:text-lg">
                                    Universitas Negeri Jakarta
                                </p>
                                <div className="d-inline-block mt-3 px-3 py-2" style={{ backgroundColor: '#ffcc00', color: '#0f6d3f', fontWeight: 'bold', fontSize: '0.7rem', borderRadius: '50px', maxWidth: '100%', whiteSpace: 'normal', lineHeight: '1.4' }}>
                                    <i className="fa fa-info-circle mr-2"></i>Status: Hasil Verifikasi Tersedia
                                </div>
                            </div>

                            <div className="card-body p-4 p-md-5">
                                {/* Data Diri Section */}
                                <div className="mb-5 overflow-hidden rounded-xl border">
                                    <DataDiri />
                                </div>

                                {/* Verification Results */}
                                {this.props.info.stage === "snbp" &&
                                    this.props.verifikasi.result_akademik === "lolos" && (
                                        <div className="mb-4">
                                            <VerifikasiSNMPTN
                                                cardStyles="text-center text-white border-0 shadow-sm rounded-xl py-4"
                                                content="Lolos Verifikasi Akademik SNBP"
                                                color="success"
                                                icon="fa fa-check-circle fa-2x mb-2"
                                            />
                                        </div>
                                    )}

                                {this.props.info.stage === "snbp" &&
                                    this.props.verifikasi.result_akademik === "tidak_lolos" && (
                                        <div className="mb-4">
                                            <VerifikasiSNMPTN
                                                cardStyles="text-center text-white border-0 shadow-sm rounded-xl py-4"
                                                content="Tidak Lolos Verifikasi Akademik SNBP"
                                                color="danger"
                                                icon="fa fa-times-circle fa-2x mb-2"
                                                message="Jangan patah semangat, tetap semangat untuk langkah selanjutnya! ✨"
                                            />
                                        </div>
                                    )}

                                {/* Nominal UKT Section */}
                                {((this.props.info.stage === "snbp" &&
                                    this.props.verifikasi.result_akademik === "lolos") ||
                                    this.props.info.stage !== "snbp") && (
                                        <div className="mb-5 rounded-xl overflow-hidden shadow-sm border" style={{ borderColor: '#10b981' }}>
                                            <div className="bg-light p-3 border-bottom d-flex align-items-center">
                                                <i className="fa fa-money text-success mr-3 fa-lg"></i>
                                                <h5 className="mb-0 font-weight-bold color-emerald text-uppercase text-sm sm:text-base md:text-lg" style={{ letterSpacing: '1.5px' }}>Besaran UKT Anda</h5>
                                            </div>
                                            <NominalUKT />
                                        </div>
                                    )}

                                {/* Status Info / Action */}
                                {this.props.keringanan?.flag !== null && (
                                    <div className="mb-5">
                                        {this.props.keringanan?.flag === 'diterima' &&
                                            <div className="p-4 rounded-xl shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #0f6d3f 0%, #16a34a 100%)' }}>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="fa fa-check-circle fa-2x mr-3"></i>
                                                    <h5 className="font-weight-bold mb-0">Sanggah UKT Diterima</h5>
                                                </div>
                                                <p className="mb-0 mt-3 opacity-90" style={{ lineHeight: '1.6' }}>
                                                    Selamat! Permohonan sanggah UKT Anda telah <strong>Diterima</strong>. Silakan lakukan pembayaran pada bank mitra (BNI, Mandiri, BTN) untuk proses registrasi resmi mahasiswa UNJ.
                                                </p>
                                            </div>
                                        }
                                        {this.props.keringanan?.flag === 'menunggu' &&
                                            <div className="p-4 rounded-xl shadow-sm border-left bg-light" style={{ borderLeft: '6px solid #ffcc00' }}>
                                                <div className="d-flex align-items-center mb-3">
                                                    <div className="p-3 rounded-circle bg-white shadow-sm mr-3 text-warning">
                                                        <i className="fa fa-calendar-check-o fa-lg"></i>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-weight-bold mb-0 text-dark">Jadwal Wawancara Klarifikasi</h5>
                                                        <span className="text-muted small">Status: Menunggu Validasi Lapangan</span>
                                                    </div>
                                                </div>
                                                <div className="pl-0 md:pl-2 mt-4">
                                                    <div className="row">
                                                        <div className="col-12 col-md-6 mb-3">
                                                            <div className="font-weight-bold text-muted small text-uppercase mb-1">Waktu:</div>
                                                            <div className="color-emerald font-weight-bold text-sm md:text-base"><i className="fa fa-clock-o mr-2"></i>16 - 17 Mei 2024 | 09:00 WIB</div>
                                                        </div>
                                                        <div className="col-12 col-md-6 mb-3">
                                                            <div className="font-weight-bold text-muted small text-uppercase mb-1">Tempat:</div>
                                                            <div className="color-emerald font-weight-bold text-sm md:text-base"><i className="fa fa-map-marker mr-2"></i>AULA Hatta Lantai 2</div>
                                                        </div>
                                                    </div>
                                                    <Alert color="warning" className="border-0 shadow-sm mt-3 py-2 px-3 rounded-lg text-xs md:text-sm">
                                                        <i className="fa fa-warning mr-2"></i>
                                                        <strong>PENTING:</strong> Camaba dan Orang tua <b>wajib hadir</b> (tidak bisa diwakilkan) dengan membawa dokumen pendukung asli.
                                                    </Alert>
                                                </div>
                                            </div>
                                        }
                                        {this.props.keringanan?.flag === 'ditolak' &&
                                            <div className="p-4 rounded-xl shadow-sm text-white bg-danger" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' }}>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="fa fa-times-circle fa-2x mr-3"></i>
                                                    <h5 className="font-weight-bold mb-0">Sanggah UKT Ditolak</h5>
                                                </div>
                                                <p className="mb-0 mt-3 opacity-90" style={{ lineHeight: '1.6' }}>
                                                    Mohon maaf permohonan sanggah UKT Anda ditolak. Silakan lakukan pembayaran sesuai besaran UKT yang tertera melalui bank mitra universitas.
                                                </p>
                                            </div>
                                        }
                                    </div>
                                )}

                                {/* Instruction for Acceptance */}
                                {/* {(!this.props.keringanan?.flag || this.props.keringanan?.flag === 'diterima' || this.props.keringanan?.flag === 'ditolak') && (
                                    <div className="text-center pt-5 border-top">
                                        <div className="mb-4">
                                            <i className="fa fa-info-circle text-primary mb-2 fa-lg"></i>
                                            <h5>Konfirmasi Persetujuan UKT</h5>
                                            <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>
                                                Jika data sudah sesuai, klik tombol di bawah untuk menyetujui hasil ketetapan UKT dan melanjutkan ke proses pembayaran.
                                            </p>
                                        </div>
                                        <Button
                                            color="success"
                                            size="lg"
                                            className="px-5 py-3 shadow-lg font-weight-bold modern-btn-primary"
                                            style={{ borderRadius: '50px' }}
                                            onClick={this.toggleTerima}
                                        >
                                            <i className="fa fa-check-circle mr-2"></i> TERIMA HASIL UKT
                                        </Button>
                                    </div>
                                )} */}
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Modals with enhanced UI */}
                <Modal isOpen={this.state.modalTerima} toggle={this.toggleTerima} centered>
                    <ModalHeader className="bg-success text-white border-0" toggle={this.toggleTerima}>
                        Konfirmasi Persetujuan
                    </ModalHeader>
                    <ModalBody className="p-4 text-center">
                        <i className="fa fa-question-circle fa-4x text-success mb-3"></i>
                        <h5>Apakah Anda yakin menerima hasil UKT ini?</h5>
                        <p className="text-muted">Dengan mengklik "Ya", Anda menyetujui besaran kelompok UKT yang telah ditetapkan.</p>
                    </ModalBody>
                    <ModalFooter className="border-0 justify-content-center pb-4">
                        <Button color="success" className="px-4 font-weight-bold" onClick={this.klikTerima}>Ya, Saya Setuju</Button>
                        <Button color="link" className="text-muted" onClick={this.toggleTerima}>Batalkan</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalKlarifikasi} toggle={this.toggleKlarifikasi} centered size="lg">
                    <ModalHeader className="bg-warning text-dark border-0" toggle={this.toggleKlarifikasi}>
                        Peringatan Klarifikasi Data
                    </ModalHeader>
                    <ModalBody className="p-4">
                        <Alert color="warning" className="border-0 shadow-sm">
                            <h6 className="font-weight-bold font-italic"><i className="fa fa-warning mr-2"></i>PENTING:</h6>
                            <ul className="mb-0">
                                <li>Hanya untuk kesalahan pengunggahan dokumen.</li>
                                <li>Tidak otomatis menurunkan kelompok UKT.</li>
                                <li>Kelompok UKT bisa tetap atau bahkan <b>naik</b>.</li>
                            </ul>
                        </Alert>
                    </ModalBody>
                    <ModalFooter className="border-0">
                        <Button color="success" onClick={this.klikKlarifikasi}>Lanjutkan Klarifikasi</Button>
                        <Button color="danger" outline onClick={this.toggleKlarifikasi}>Batal</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default connect((store) => ({
    cmahasiswa: store.cmahasiswa.cmahasiswa,
    verifikasi: store.verifikasi.verifikasi,
    info: store.info.info,
    keringanan: store.keringanan.keringanan,
}))(TerimaSanggah);