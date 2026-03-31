import React from "react";
import {
    Card,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Form,
    FormGroup,
    Label,
    FormText,
} from "reactstrap";
import { InputFileBs, SyaratScan } from '../components/form'
import { rupiah, cookies, cookieName, storage } from "../../global";
import { cmahasiswa, ukt, verifikasi, keringanan } from "../../actions";
import { connect } from "react-redux";
import { Field } from 'redux-form';
import unggahSanggah from './form/sanggah/unggahSanggah';
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
            <span>
                <b>Kelompok {ukt_now.kategori}</b>
                <br /> Dengan besaran {rupiah(ukt_now.besar_ukt)}
            </span>
        );
    };
    render() {
        return (
            <div className="margin-top-20">
                <Card body className="text-center" color="warning">
                    <Row>
                        <Col md={2} xs={12}>
                            <h2 className="margin-top-10">
                                <i className="fa fa-money"></i>
                            </h2>
                        </Col>
                        <Col md={8} xs={12}>
                            {this.props.cmahasiswa.bidik_misi_cmahasiswa === "Ya" &&
                                this.props.verifikasi.result_bidikmisi === "lolos" ? (
                                <React.Fragment>
                                    <b>
                                        Anda peserta bidikmisi, jika bidikmisi anda <br />
                                        dicabut maka besar UKT anda:
                                    </b>
                                </React.Fragment>
                            ) : this.props.verifikasi.result_kipk === "lolos" ? (
                                <React.Fragment>
                                    <b>
                                        Anda peserta KIPK, jika usulan KIPK anda <br />
                                        tidak diterima oleh Kementrian Pendidikan dan Kebudayaan,
                                        maka besar UKT berdasarkan data yang anda unggah adalah:
                                    </b>
                                </React.Fragment>
                            ) : (
                                // : this.props.verifikasi.result_kjmu === "lolos" ? (
                                //   <React.Fragment>
                                //     <b>
                                //       Anda peserta KJMU, jika KJMU anda <br />
                                //       dicabut maka besar UKT anda:
                                //     </b>
                                //   </React.Fragment>
                                // )
                                <React.Fragment>
                                    <h5>
                                        Berdasarkan data yang anda unggah, <br />
                                        anda Mendapatkan UKT:{" "}
                                    </h5>
                                </React.Fragment>
                            )}
                            <hr />
                            <h4>
                                {this.props.ukt !== undefined
                                    ? this.renderUktTinggi()
                                    : // : "Memuat data..."}
                                    "UKT anda saat ini belum ditetapkan, silakan cek kembali pada tanggal 8 September 2020"}
                            </h4>
                            <br />
                            <p>
                                Biaya di atas adalah biaya pendidikan <b>per-semester</b>
                            </p>
                        </Col>
                        <Col md={2} xs={12}>
                            <h2 className="margin-top-10">
                                <i className="fa fa-money"></i>
                            </h2>
                        </Col>
                    </Row>
                </Card>
                {this.props.keringanan?.flag == '' ? (
                    this.props.verifikasi.result_kipk === "lolos" ? (
                        <React.Fragment>
                            <Card body className="margin-top-20">
                                <b>
                                    Besaran tersebut adalah besaran yang wajib anda bayarkan
                                    apabila usulan KIPK anda tidak diterima.
                                    <br />
                                    Apabila ada perubahan data yang disebabkan adanya kondisi luar biasa setelah pengunggahan data maka
                                    bagi calon mahasiswa baru yng memiliki perbedaan data yang menimbulkan hasil berbeda maka di berikan
                                    kesempatan untuk malakukan penyesuaian data baru. jika tidak ada perubahan data apapun.
                                    maka golongan dan besaran ukt tersebut bersifat final
                                    silakan unggah perubahan data dengan menekan tombol dibawah
                                    <br /><br />
                                </b>
                            </Card>
                        </React.Fragment>
                    ) : null
                ) : null}
                <Modal isOpen={this.state.modalSanggah} >
                    <ModalHeader toggle={this.toggleSanggah}>
                        Unggah Perubahan Data
                    </ModalHeader>
                    <ModalBody>
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
