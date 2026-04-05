import React from "react";
import { Container, Row, Col, Alert, Button, Card, CardText } from "reactstrap";
import WelcomeBanner from "../dist/img/welcome.jpg";
import { Loading } from "redux-global-loader";
import { Navigation, TabMenu, Footer, UktLoader } from "../components";

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
        <div>
          <div className="text-center">
            <img src={WelcomeBanner} width="100%" alt="welcome banner" />
          </div>
          <Card
            body
            color="success"
            inverse
            className="margin-top-20 text-center"
          >
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
          <Row>
            <Col md="12">
              <Alert color="danger" className="margin-top-20">
                <ul>
                  <li>
                    Calon mahasiswa atau orang tua harus mengisi data dengan
                    jujur dan sebenar-benarnya.
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
              <div className="text-center">
                <Button color="primary" type="button" onClick={this.goToUkt}>
                  Mulai Pengisian UKT
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button
                  color="primary"
                  type="button"
                  onClick={this.goToBiodata}
                >
                  Mulai Pengisian Biodata
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Info;
