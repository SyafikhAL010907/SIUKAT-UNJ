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
            <div className="p-3">
                <Row className="justify-content-center">
                    <Col md={10} lg={8} xs={12}>
                        {/* Header Section */}
                        <div className="text-center mb-5 mt-4">
                            <h2 className="font-weight-bold" style={{ color: '#008d4c' }}>
                                <i className="fa fa-bullhorn mr-3"></i>
                                Pengumuman Hasil UKT
                            </h2>
                            <p className="text-muted">Universitas Negeri Jakarta</p>
                            <div style={{ height: '4px', width: '60px', background: '#ffcc00', margin: '10px auto', borderRadius: '2px' }}></div>
                        </div>

                        {/* Data Diri Card Styling */}
                        <div className="shadow-sm rounded-lg mb-4 bg-white p-2">
                            <DataDiri />
                        </div>

                        {/* Verification Results */}
                        {this.props.info.stage === "snbp" &&
                            this.props.verifikasi.result_akademik === "lolos" && (
                                <div className="mb-4 transform-hover">
                                    <VerifikasiSNMPTN
                                        cardStyles="text-center text-white border-0 shadow"
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
                                        cardStyles="text-center text-white border-0 shadow"
                                        content="Tidak Lolos Verifikasi Akademik SNBP"
                                        color="danger"
                                        icon="fa fa-times-circle fa-2x mb-2"
                                        message="Jangan patah semangat, semoga sukses di jalur lain! 😊"
                                    />
                                </div>
                            )}

                        {/* Nominal UKT Section */}
                        {((this.props.info.stage === "snbp" &&
                            this.props.verifikasi.result_akademik === "lolos") ||
                            this.props.info.stage !== "snbp") && (
                                <div className="shadow-sm rounded-lg border-top border-success" style={{ borderWidth: '5px !important' }}>
                                    <NominalUKT />
                                </div>
                            )}
                    </Col>
                </Row>

                <div className="my-5 py-3">
                    <hr className="w-75" />
                </div>

                {/* Sanggah / Action Section */}
                {((this.props.info.stage === "snbp" &&
                    this.props.verifikasi.result_akademik === "lolos") ||
                    this.props.info.stage !== "snbp") && (
                        <Row className="justify-content-center pb-5">
                            <Col md={10} lg={8} xs={12}>
                                {this.props.keringanan?.flag === null ? null :
                                    <div className="mb-4">
                                        {this.props.keringanan?.flag === 'diterima' &&
                                            <Card body className="border-0 shadow-sm text-white" style={{ background: '#008d4c' }}>
                                                <h5 className="font-weight-bold"><i className="fa fa-check-circle mr-2"></i>Sanggah UKT Diterima</h5>
                                                <p className="mb-0">Permohonan sanggah UKT Anda diterima. Silakan lakukan pembayaran pada bank mitra (BNI, Mandiri, BTN) untuk proses registrasi resmi mahasiswa UNJ.</p>
                                            </Card>
                                        }
                                        {this.props.keringanan?.flag === 'menunggu' &&
                                            <Card body className="border-success shadow-sm bg-light" style={{ borderLeft: '5px solid #008d4c' }}>
                                                <h5 className="font-weight-bold text-success"><i className="fa fa-calendar-check-o mr-2"></i>Jadwal Wawancara & Validasi</h5>
                                                <div className="pl-4 border-left ml-2 mt-2">
                                                    <p className="mb-1"><strong><i className="fa fa-clock-o mr-2"></i>Waktu:</strong> 16 - 17 Mei 2024 | 09:00 WIB</p>
                                                    <p className="mb-1"><strong><i className="fa fa-map-marker mr-2"></i>Tempat:</strong> AULA Hatta Lantai 2</p>
                                                    <p className="text-danger mt-2 mb-0" style={{fontSize: '0.85rem'}}>* Camaba dan Orang tua wajib hadir (tidak bisa diwakilkan) membawa dokumen pendukung.</p>
                                                </div>
                                            </Card>
                                        }
                                        {this.props.keringanan?.flag === 'ditolak' &&
                                            <Card body className="border-0 shadow-sm text-white bg-danger">
                                                <h5 className="font-weight-bold"><i className="fa fa-times-circle mr-2"></i>Sanggah UKT Ditolak</h5>
                                                <p className="mb-0">Mohon maaf permohonan sanggah UKT Anda ditolak. Silakan lakukan pembayaran sesuai besaran UKT yang tertera melalui bank mitra.</p>
                                            </Card>
                                        }
                                    </div>
                                }

                                {!this.props.keringanan?.flag || this.props.keringanan?.flag === 'diterima' || this.props.keringanan?.flag === 'ditolak' ?
                                    <Card body className="shadow-lg border-0 bg-white" style={{ borderRadius: '15px' }}>
                                        <div className="p-2">
                                            <h5 className="font-weight-bold mb-3"><i className="fa fa-info-circle text-primary mr-2"></i>Instruksi Lanjutan</h5>
                                            <p className="text-muted" style={{ lineHeight: '1.6' }}>
                                                Jika data sudah sesuai, klik tombol <strong>TERIMA</strong> untuk melanjutkan pembayaran. 
                                                silahkan lanjut kepada halaman berikut ini <a href="/main/ukt" className="text-success font-weight-bold">Klik Disini</a>.
                                            </p>
                                            
                                            <div className="mt-4 pt-3 border-top text-center">
                                                <Button
                                                    color="success"
                                                    size="lg"
                                                    className="px-5 shadow-sm font-weight-bold"
                                                    style={{ borderRadius: '50px', backgroundColor: '#008d4c' }}
                                                    onClick={this.toggleTerima}
                                                >
                                                    <i className="fa fa-check-circle mr-2"></i> TERIMA HASIL UKT
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                    : null
                                }
                            </Col>
                        </Row>
                    )}

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