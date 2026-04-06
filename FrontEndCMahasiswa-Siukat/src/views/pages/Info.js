import React from "react";
import { Row, Col, Alert, Button, Card, CardText } from "reactstrap";
import WelcomeBanner from "../dist/img/welcome.jpg";
import { Loading } from "redux-global-loader";
import { TabMenu, UktLoader, Bantuan } from "../components";

class Info extends React.Component {
  goToUkt = () => {
    this.props.history.push("/main/ukt");
  };
  goToBiodata = () => {
    this.props.history.push("/main/biodata");
  };
  render() {
    return (
      <div key={this.props.location.key}>
        <Loading>
          <UktLoader />
        </Loading>
        <div className="container-fluid py-4">
          <div className="welcome-banner-container text-center">
            <img src={WelcomeBanner} width="100%" alt="welcome banner" />
          </div>
          
          <Card className="welcome-info-card text-center mb-4">
            <CardText>
              Sistem informasi berbasis daring (online) yang digunakan untuk
              menentukan kelompok UKT setiap Calon Mahasiswa yang diterima di
              Universitas Negeri Jakarta (UNJ). Sebelum menggunakan Sistem
              Informasi ini, setiap calon mahasiswa atau orang tua dihimbau
              untuk membaca informasi dan alur pengisian Sistem Informasi UKT
              dengan seksama terlebih dahulu.
            </CardText>
          </Card>

          <TabMenu />

          <Row className="mt-4">
            <Col md="3">
              <Bantuan />
            </Col>
            <Col md="9">
              <Alert className="modern-alert-danger shadow-sm mb-4">
                <h5 className="mb-3 font-weight-bold"><i className="fa fa-exclamation-triangle mr-2"></i> Perhatian Penting</h5>
                <ul>
                  <li>
                    Calon mahasiswa atau orang tua harus mengisi data dengan
                    jujur and sebenar-benarnya.
                  </li>
                  <li>
                    Pihak UNJ dapat melakukan verifikasi data dengan mengecek
                    pada setiap instansi terkait (PLN, Samsat, dll).
                  </li>
                  <li>
                    Jika calon mahasiswa belum lengkap atau belum menyelesaikan
                    pengisian data UKT dalam jangka waktu yang telah ditentukan,
                    maka calon mahasiswa akan ditetapkan ke dalam{" "}
                    <b>UKT Kelompok Atas</b>.
                  </li>
                  <li>
                    Jika berkas yang diunggah diketahui{" "}
                    <b>tidak valid dan/atau palsu</b>, maka calon mahasiswa akan
                    ditetapkan ke dalam <b>UKT Kelompok Atas</b> atau akan
                    dikenakan sanksi sesuai dengan ketentuan hukum yang berlaku.
                  </li>
                  <li>
                    Calon mahasiswa yang tidak mengisi data pada Sistem
                    Informasi UKT ini akan ditetapkan ke dalam{" "}
                    <b>UKT Kelompok Atas</b>.
                  </li>
                  <li>
                    Hasil UKT akhir adalah tetap pada setiap semester dan tidak
                    bisa diubah.
                  </li>
                </ul>
              </Alert>
            </Col>
          </Row>

          <Row className="mt-4 mb-5">
            <Col md="12" className="text-center">
              <Button className="modern-btn-primary px-5 py-3 mr-4" onClick={this.goToUkt}>
                <i className="fa fa-pencil-square-o mr-2"></i> Mulai Pengisian UKT
              </Button>
              <Button
                  className="modern-btn-primary px-5 py-3"
                  onClick={this.goToBiodata}
              >
                  <i className="fa fa-user-circle mr-2"></i> Mulai Pengisian Biodata
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Info;
