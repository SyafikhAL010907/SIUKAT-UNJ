import React from "react";
import {
    Card,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    Button,
} from "reactstrap";
import { rupiah, cookies, cookieName } from "../../global";
import { cmahasiswa, ukt, verifikasi, keringanan } from "../../actions";
import { connect } from "react-redux";
import UnggahSanggah from './form/sanggah/unggahSanggah';

class NominalUKT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalSanggah: false,
        };
        this.toggleSanggah = this.toggleSanggah.bind(this);
    }

    toggleSanggah() {
        this.setState({
            modalSanggah: !this.state.modalSanggah,
        });
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(ukt.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(verifikasi.fetchVerifikasi(cookies.get(cookieName)));
        this.props.dispatch(keringanan.getData(cookies.get(cookieName)));
    }

    renderUktTinggi = () => {
        var ukt_now = {
            kategori: [this.props.cmahasiswa.golongan_id],
            besar_ukt: this.props.ukt[this.props.cmahasiswa.golongan_id],
        };
        return (
            <div className="py-2">
                <div className="text-uppercase small font-weight-bold text-muted mb-1">Besaran UKT Anda:</div>
                <div className="h1 font-weight-bold mb-2" style={{ color: '#008d4c', letterSpacing: '-1px' }}>
                    {rupiah(ukt_now.besar_ukt)}
                </div>
                <div className="d-inline-block px-3 py-1 rounded-pill" style={{ backgroundColor: '#ffcc00', color: '#000', fontWeight: '600', fontSize: '0.9rem' }}>
                    Kelompok {ukt_now.kategori}
                </div>
            </div>
        );
    };

    render() {
        const { cmahasiswa, verifikasi, ukt, keringanan } = this.props;

        return (
            <div className="margin-top-20">
                <Card className="border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff' }}>
                    {/* Top Bar Aksentuasi Hijau UNJ */}
                    <div style={{ background: '#008d4c', height: '6px' }}></div>
                    
                    <div className="p-4 p-md-5">
                        <Row className="justify-content-center text-center">
                            <Col md={10}>
                                <div className="mb-4">
                                    {cmahasiswa.bidik_misi_cmahasiswa === "Ya" &&
                                    verifikasi.result_bidikmisi === "lolos" ? (
                                        <div className="mb-3">
                                            <span className="badge badge-success p-2 mb-2">Peserta Bidikmisi</span>
                                            <p className="text-muted small">Jika status Bidikmisi dicabut, maka nominal UKT Anda:</p>
                                        </div>
                                    ) : verifikasi.result_kipk === "lolos" ? (
                                        <div className="mb-3">
                                            <span className="badge badge-success p-2 mb-2">Peserta KIP-Kuliah</span>
                                            <p className="text-muted small">Jika usulan KIPK tidak diterima, maka nominal UKT Anda berdasarkan data unggahan:</p>
                                        </div>
                                    ) : (
                                        <h5 className="font-weight-normal text-secondary mb-4">
                                            Berdasarkan hasil verifikasi data, penetapan UKT Anda adalah:
                                        </h5>
                                    )}
                                </div>

                                {/* Box Nominal Utama */}
                                <div className="py-4 mb-4" style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
                                    {ukt !== undefined
                                        ? this.renderUktTinggi()
                                        : <div className="p-3 text-warning border rounded" style={{ backgroundColor: '#fffdf0' }}>
                                            <i className="fa fa-clock-o mr-2"></i>
                                            UKT Anda belum ditetapkan. Silakan cek kembali secara berkala.
                                          </div>
                                    }
                                </div>

                                <div className="d-flex align-items-center justify-content-center text-muted small mt-2">
                                    <div className="px-3 py-1 border rounded-pill bg-light">
                                        <i className="fa fa-calendar mr-2"></i> Per Semester
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Card>

                {/* Notifikasi Perubahan Data (KIPK) */}
                {keringanan?.flag === '' && verifikasi.result_kipk === "lolos" && (
                    <Card className="mt-4 border-0 shadow-sm" style={{ backgroundColor: '#f0f9f4', borderLeft: '5px solid #008d4c', borderRadius: '8px' }}>
                        <div className="p-4">
                            <div className="d-flex align-items-start">
                                <div className="mr-3" style={{ color: '#008d4c' }}>
                                    <i className="fa fa-info-circle fa-2x"></i>
                                </div>
                                <div>
                                    <h6 className="font-weight-bold text-dark mb-1">Informasi Penyesuaian Data</h6>
                                    <p className="small text-secondary mb-3" style={{ lineHeight: '1.6' }}>
                                        Besaran di atas bersifat final jika tidak ada perubahan data. Namun, jika terdapat <strong>kondisi luar biasa</strong> setelah pengunggahan, Anda diberikan kesempatan untuk menyesuaikan data.
                                    </p>
                                    <Button 
                                        size="sm" 
                                        onClick={this.toggleSanggah}
                                        style={{ backgroundColor: '#008d4c', border: 'none', borderRadius: '20px', padding: '5px 20px' }}
                                    >
                                        Unggah Perubahan
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                <Modal isOpen={this.state.modalSanggah} centered size="lg" contentClassName="border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                    <ModalHeader toggle={this.toggleSanggah} className="border-0 pb-0">
                        <span className="font-weight-bold">Form Perubahan Data</span>
                    </ModalHeader>
                    <ModalBody className="pt-0">
                        <hr />
                        <UnggahSanggah />
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default connect((store) => ({
    ukt: store.ukt.ukt,
    cmahasiswa: store.cmahasiswa.cmahasiswa,
    verifikasi: store.verifikasi.verifikasi,
    keringanan: store.keringanan.keringanan,
}))(NominalUKT);