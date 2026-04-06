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
        // const param = "snmptn"
        // const param = this.props.cmahasiswa.no_peserta.substring(0, 1) === '8' ? 'japres' : 'sbmptn'
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
            <div>
                <Row className="margin-top-20">
                    <Col md={2} xs={12}></Col>
                    <Col md={8} xs={12}>
                        <h4 className="text-center">Pengumuman Hasil UKT</h4>
                        <hr />

                        <DataDiri />
                        {this.props.info.stage === "snbp" &&
                            this.props.verifikasi.result_akademik === "lolos" && (
                                <div>
                                    <VerifikasiSNMPTN
                                        cardStyles="text-center text-white"
                                        content="Lolos Verifikasi SNBP"
                                        color="success"
                                        icon="fa fa-graduation-cap"
                                    />
                                </div>
                            )}
                        {this.props.info.stage === "snbp" &&
                            this.props.verifikasi.result_akademik === "tidak_lolos" && (
                                <VerifikasiSNMPTN
                                    cardStyles="text-center text-white"
                                    content="Tidak Lolos Verifikasi SNBP"
                                    color="danger"
                                    icon="fa fa-close"
                                    message="Semoga berhasil di kesempatan lainnya 😊"
                                />
                            )}
                        {/* {this.props.info.stage === "snmptn" &&
              this.props.verifikasi.result_akademik === "belum_verifikasi" && (
                <VerifikasiSNMPTN
                  cardStyles="text-center"
                  content="Belum Melakukan Verifikasi SNMPTN"
                  color="warning"
                  icon="fa fa-info-circle"
                  message="Segera hubungi Fakultas sesuai dengan Program Studi yang Anda pilih"
                />
              )} */}
                        {((this.props.info.stage === "snbp" &&
                            this.props.verifikasi.result_akademik === "lolos") ||
                            this.props.info.stage !== "snbp") && (
                                <React.Fragment>
                                    <NominalUKT />
                                </React.Fragment>
                            )}
                    </Col>
                    <Col md={2} xs={12}></Col>
                </Row>
                <hr />
                {((this.props.info.stage === "snbp" &&
                    this.props.verifikasi.result_akademik === "lolos") ||
                    this.props.info.stage !== "snbp") && (
                        <div>
                            {this.props.keringanan?.flag === null ? null :
                                <Row>
                                    <Col md={2} xs={12}></Col>
                                    <Col md={8} xs={12}>
                                        {this.props.keringanan?.flag === 'diterima' &&
                                            <Card body color="green" inverse >
                                                <div>
                                                    Permohonan sanggah UKT Anda diterima.
                                                    <br />
                                                    Silakan lakukan pembayaran UKT pada bank mitra yang telah ditetapkan (Bank BNI, Mandiri, dan BTN) sebagai dasar untuk registrasi secara resmi sebagai mahasiswa Universitas Negeri Jakarta (UNJ)
                                                </div>
                                            </Card>
                                        }
                                        {this.props.keringanan?.flag === 'menunggu' &&
                                            <Card body color="green" outlined >
                                                <div>
                                                    Camaba dan Orang tua camaba (tidak bisa di wakilkan) di wajibkan untuk datang untuk melakukan wawancara dan Validasi data di Kampus UNJ dengan membawa data pendukung pada :
                                                    <br />
                                                    tanggal : 16- 17 mei 2024
                                                    <br />
                                                    Pukul : 09:00 WIB
                                                    <br />
                                                    Tempat : AULA Hatta Lantai 2
                                                </div>
                                            </Card>
                                        }
                                        {this.props.keringanan?.flag === 'ditolak' &&
                                            <Card body color="danger" inverse >
                                                <div>
                                                    Mohon maaf permohonan sanggah UKT Anda ditolak.
                                                    <br />
                                                    Silakan lakukan pembayaran UKT pada bank mitra yang telah ditetapkan (Bank BNI, Mandiri, dan BTN) sebagai dasar untuk registrasi secara resmi sebagai mahasiswa Universitas Negeri Jakarta (UNJ)
                                                </div>
                                            </Card>
                                        }
                                        <br />
                                        {!this.props.keringanan?.flag || this.props.keringanan?.flag === 'diterima' || this.props.keringanan?.flag === 'ditolak' ?
                                            <Card body color="green" outline >
                                                <div>
                                                    Bagi yang tidak ada perubahan data yang disebabkan kondisi luar biasa, maka proses selanjutnya Mengklik tombol <b>TERIMA</b> dan silahkan
                                                    melakukan pembayaran UKT pada bank mitra yang telah ditetapkan (Bank BNI, Mandiri, dan BTN) sebagai dasar untuk registrasi secara resmi
                                                    sebagai mahasiswa Universitas Negeri Jakarta (UNJ). <br />
                                                    Apabila ada perubahan data yang disebabkan adanya kondisi luar biasa setelah pengumuman hasil maka  di berikan kesempatan untuk malakukan penyesuaian data baru Silahkan Klik Tombol
                                                    <b>KLARIFIKASI</b> dan datang membawa bukti perubahan data
                                                </div>
                                                <Row className="margin-top-20">
                                                    <Col md={4} xs={12}></Col>
                                                    <Col md={4} xs={12}>
                                                        <Button
                                                            color="success"
                                                            size="lg"
                                                            block
                                                            onClick={this.toggleTerima}
                                                        >
                                                            <i className="fa fa-check"></i> TERIMA
                                                        </Button>
                                                    </Col>
                                                    <Col md={2} xs={12}></Col>
                                                </Row>
                                                <Row className="margin-top-20">
                                                    <Col md={4} xs={12}></Col>
                                                    <Col md={4} xs={12}>
                                                        <Button
                                                            color="success"
                                                            size="lg"
                                                            block
                                                            onClick={this.toggleKlarifikasi}
                                                        >
                                                            <i className="fa fa-check"></i> KLARIFIKASI
                                                        </Button>
                                                    </Col>
                                                    <Col md={2} xs={12}></Col>
                                                </Row>
                                            </Card>
                                            : null
                                        }
                                    </Col>
                                    <Col md={2} xs={12}></Col>
                                </Row>
                            }
                            <Modal isOpen={this.state.modalTerima} toggle={this.toggleTerima}>
                                <ModalHeader toggle={this.toggleTerima}>
                                    Apakah Anda yakin?
                                </ModalHeader>
                                <ModalBody>
                                    <Alert color="success">
                                        <i className="fa fa-info-circle"></i> Anda menyetujui
                                        keputusan penentuan kelompok UKT.
                                    </Alert>
                                </ModalBody>
                                <ModalFooter className="text-right">
                                    <Button color="success" onClick={this.klikTerima}>
                                        Ya, Saya Yakin
                                    </Button>{" "}
                                    <Button color="danger" onClick={this.toggleTerima}>
                                        Batalkan
                                    </Button>
                                </ModalFooter>
                            </Modal>

                            <Modal
                                isOpen={this.state.modalKlarifikasi}
                                toggle={this.toggleKlarifikasi}
                            >
                                <ModalHeader toggle={this.toggleKlarifikasi}>
                                    Apakah Anda yakin?
                                </ModalHeader>
                                <ModalBody>
                                    <Alert color="danger">
                                        <i className="fa fa-info-circle"></i> Verifikasi data UKT
                                        digunakan untuk memverifikasi dokumen yang salah unggah.
                                        Apabila tidak ada kesalahan pengunggahan dokumen maka Anda
                                        tidak diperkenankan untuk melakukan verifikasi data UKT.
                                        Verifikasi data UKT tidak otomatis menurunkan kelompok UKT
                                        yang sudah ditentukan, bisa juga tetap atau bahkan naik dari
                                        kelompok UKT sebelumnya.
                                    </Alert>
                                </ModalBody>
                                <ModalFooter className="text-right">
                                    <Button color="success" onClick={this.klikKlarifikasi}>
                                        Ya, Saya Yakin
                                    </Button>{" "}
                                    <Button color="danger" onClick={this.toggleKlarifikasi}>
                                        Batalkan
                                    </Button>
                                </ModalFooter>
                            </Modal>
                            {/* <hr />
            <Row className="margin-top-20">
              <Col md={3} xs={12}></Col>
              <Col md={6} xs={12}>
                <Card body color="green" inverse>
                  <div>
                    <i className="fa fa-info-circle"></i> Apa maksud dari
                    pilihan TERIMA UKT?
                  </div>
                </Card>
                <Card body className="card-body-terimasanggah">
                  <ul className="list-reset">
                    <li>
                      <b>MENERIMA</b> adalah menyetujui besaran UKT per semester
                      yang telah ditetapkan melalui pengisian UKT daring
                    </li>
                    <li>
                      <b>Verifikasi data UKT</b> adalah proses memperbaiki
                      dokumen yang salah diunggah pada saat pengisian UKT daring
                      <br />
                      &nbsp;
                    </li>
                    <li>
                      <KetentuanKlarifikasi />
                    </li>
                  </ul>
                </Card>
              </Col>
              <Col md={3} xs={12}>
                <Card body color="green" inverse>
                  <div>
                    <i className="fa fa-info-circle"></i> Kapan proses
                    VERIFIKASI DATA UKT dilaksanakan?
                  </div>
                </Card>
                <Card body className="card-body-terimasanggah">
                  <JadwalKlarifikasi />
                </Card>
              </Col>
            </Row> */}
                        </div>
                    )}
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
