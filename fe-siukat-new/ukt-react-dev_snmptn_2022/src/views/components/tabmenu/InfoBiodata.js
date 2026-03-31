import React from "react";
import { Row, Col, Button, Alert } from "reactstrap";
import { Link } from "react-router-dom";

class InfoBiodata extends React.Component {
  goToBiodata = () => {
    this.props.history.push("/main/biodata");
  };
  render() {
    return (
      <div>
        <Alert color="info">
          Biodata Calon Mahasiswa Baru Universitas Negeri Jakarta akan digunakan
          sebagai data dasar pembuatan akun Sistem Informasi Akademik
          Universitas Negeri Jakarta, pengisian biodata terdiri atas 3 kategori:
          <ul>
            <li>
              <b>Biodata Diri</b>
            </li>
            <p>
              Form biodata diri berisi biodata diri dari calon mahasiswa
              Universitas, seperti tempat & tanggal lahir, NIK, NPWP, alamat
              tinggal nantinya selama menempuh pendidikan di Universitas Negeri
              Jakarta
            </p>
            <li>
              <b>Biodata Orang Tua dan Wali</b>
            </li>
            <p>
              Form biodata orang tua dan wali berisi biodata orang tua dan wali
              dari calon mahasiswa Universitas, sebagai penanggung jawab dari
              calon mahasiswa selama menempuh pendidikan di Universitas Negeri
              Jakarta
            </p>
            <li>
              <b>Data Sekolah Asal</b>
            </li>
            <p>
              Form data sekolah asal Berisi data sekolah asal dari calon
              mahasiswa Universitas, seperti asal sekolah, jurusan, nilai Ujian
              Nasional, nomor peserta Ujian Nasional, Nilai Ijazah, nomor Ijazah
            </p>
          </ul>
          <Row>
            <Col md="12">
              <Link to="/main/biodata">
                <Button color="primary" type="button">
                  Mulai Pengisian Biodata
                </Button>
              </Link>
            </Col>
          </Row>
        </Alert>

        {/* <Table responsive striped bordered className="login-schedule text-center">
                    <thead>
                        <tr className="table-head-green">
                            <th width="30%" className="text-center">Kelompok UKT</th>
                            <th width="70%" className="text-center">Besar UKT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderUkt()}
                    </tbody>
                </Table> */}
        {/* <Alert color="warning">
          <ul>
            <li>
              Kelompok 1 hanya diperuntukkan bagi <b>keluarga sangat miskin</b>,
              dan mendapatkan subsidi dana dari kelompok lainnya.
            </li>
            <li>
              Kelompok 2 hanya diperuntukkan bagi <b>keluarga miskin</b>, dan
              mendapatkan subsidi dana dari kelompok lainnya.
            </li>
          </ul>
        </Alert> */}
      </div>
    );
  }
}

export default InfoBiodata;
