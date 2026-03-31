import React from "react";
import Thx from "../dist/img/thx.jpg";
import { Row, Col, Button, Card, CardTitle } from "reactstrap";
import { notif, cookies, cookieName } from "../../global";
import { Redirect } from "react-router-dom";
import { cmahasiswa, bio_cmahasiswa, info } from "../../actions";
import { connect } from "react-redux";

class BiodataSelesaiIsi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textBuktiSelesai: "Unduh Bukti Selesai",
        };
    }
    UNSAFE_componentWillMount() {
        this.props.dispatch(info.fetchInfo());
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(bio_cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
    }
    logout(e) {
        e.preventDefault();
        cookies.remove(cookieName, { path: "/" });
        this.props.history.push("/");
        notif("Berhasil!", "Anda sudah keluar", "success");
    }
    // unduhBuktiSelesai = () => {
    //     this.setState({
    //         textBuktiSelesai: "Sedang Mengunduh..."
    //     })
    //     files.unduhBuktiSelesai(cookies.get(cookieName)).then((res) => {
    //         this.setState({
    //             textBuktiSelesai: "Unduh Bukti Selesai"
    //         })
    //     }).catch((err) => {
    //         this.setState({
    //             textBuktiSelesai: "Unduh Bukti Selesai"
    //         })
    //     })
    // }
    goToUkt = () => {
        this.props.history.push("/main/ukt");
    };
    render() {
        if (this.props.bio_cmahasiswa.flag_lengkap === "0") {
            return <Redirect to="/main/biodata" />;
        }
        return (
            <Row className="margin-top-20">
                <Col md={2}></Col>
                <Col md={8}>
                    <img src={Thx} alt="selesai-isi" width="100%" />
                    <Card body className="text-center margin-top-20 bg-grey">
                        <CardTitle>
                            Terima Kasih Telah Melengkapi Semua <br />
              Biodata Diri, Orang Tua dan Wali, serta Sekolah Asal
            </CardTitle>
                        <p>Anda dapat melanjutkan pengisian data UKT.</p>
                        <Row>
                            <Col md="12">
                                <Button color="primary" type="button" onClick={this.goToUkt}>
                                    Mulai Pengisian UKT
                </Button>
                                {/* <Button color="warning" onClick={this.unduhBuktiSelesai.bind(this)}><i className="fa fa-download"></i> {this.state.textBuktiSelesai}</Button> */}
                            </Col>
                            {/* <Col md="6">
                <Button color="success" onClick={this.logout.bind(this)}>
                  <i className="fa fa-check"></i> Keluar
                </Button>
              </Col> */}
                        </Row>
                    </Card>
                </Col>
                <Col md={2}></Col>
            </Row>
        );
    }
}

export default connect((store) => ({
    cmahasiswa: store.cmahasiswa.cmahasiswa,
    bio_cmahasiswa: store.bio_cmahasiswa.bio_cmahasiswa,
    info: store.info.info,
}))(BiodataSelesaiIsi);
