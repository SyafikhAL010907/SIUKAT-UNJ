import React, { Component } from "react";
import { Card, CardTitle, Collapse, Button, Table } from "reactstrap";
import { files } from "../../../api";
// import PasFoto from '../../dist/img/pas_foto.jpg'
import PasFoto from "../../dist/img/PasPhoto.jpg";
import { Link } from "react-router-dom";

class UktRendah extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      collapse: false,
      textUnduhWali: "Unduh",
      textUnduhKontrak: "Unduh",
    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  unduhWali = () => {
    this.setState({
      textUnduhWali: "Sedang mengunduh...",
    });
    files
      .unduhWali()
      .then((res) => {
        this.setState({
          textUnduhWali: "Unduh",
        });
      })
      .catch((err) => {
        this.setState({
          textUnduhWali: "Unduh",
        });
      });
  };
  unduhKontrak = () => {
    this.setState({
      textUnduhKontrak: "Sedang mengunduh...",
    });
    files
      .unduhKontrak()
      .then((res) => {
        this.setState({
          textUnduhKontrak: "Unduh",
        });
      })
      .catch((err) => {
        this.setState({
          textUnduhKontrak: "Unduh",
        });
      });
  };

  render() {
    return (
      <Card body>
        <CardTitle className="clearfix">
          <div className="pull-left">
            <i className="fa fa-close"></i> Tidak Bersedia di UKT Kelompok Atas
            (Perhitungan Data Ekonomi).
          </div>
          <div className="pull-right">
            <Button color="success" size="xs" onClick={this.toggle}>
              <i className="fa fa-search"></i> Lihat
            </Button>
          </div>
        </CardTitle>
        <b>
          Jika anda tidak bersedia masuk kelompok UKT VI / VII / VIII, maka:
        </b>
        <ul>
          <li>
            Proses penetapan UKT dilakukan melalui perhitungan berdasarkan data
            kondisi ekonomi yang diunggah;
          </li>
          <li>
            Anda tetap mempunyai kemungkinan untuk mendapatkan salah satu
            kelompok dari seluruh kelompok UKT yang ada{" "}
            <b>(Kelompok I s.d. VIII)</b> bergantung kepada kondisi ekonomi
            orang tua/wali calon mahasiswa baru.
          </li>
        </ul>
        <Collapse isOpen={this.state.collapse}>
          <Table responsive striped bordered className="login-schedule">
            <thead>
              <tr className="table-head-green">
                <th width="5%" className="text-center">
                  No.
                </th>
                <th width="60%" className="text-center">
                  Nama Berkas
                </th>
                <th width="35%" className="text-center">
                  Keterangan
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">1</td>
                <td>
                  <b>Pas foto calon mahasiswa.</b>
                  <ul className="list-reset">
                    <li>Wajah tampak jelas;</li>
                    <li>Posisi badan menghadap ke depan;</li>
                    <li>Memakai pakaian bebas, rapi, dan sopan;</li>
                    <li>Rasio 3:4 atau 4:6;</li>
                    <li>Warna latar merah.</li>
                    <li>Ekstensi gambar berupa JPG/JPEG/PNG;</li>
                    <li>Ukuran gambar tidak lebih dari 500KB.</li>
                  </ul>
                </td>
                <td className="text-center">
                  <img src={PasFoto} width="50%" alt="Contoh Foto" />
                </td>
              </tr>
              <tr>
                <td className="text-center">2</td>
                <td>
                  <b>Scan KTP Ayah dan KTP Ibu</b> (jika Ayah dan/atau Ibu masih
                  hidup).
                </td>
                <td>
                  <ul className="list-reset">
                    <li>
                      Ekstensi berkas berupa <b>PDF</b>;
                    </li>
                    <li>
                      Ukuran berkas tidak lebih dari <b>500KB</b>.
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="text-center">3</td>
                <td>
                  <b>Scan slip gaji Ayah dan slip gaji Ibu.</b>
                </td>
                <td className="text-center">
                  Apabila tidak memiliki slip gaji, scan{" "}
                  <b>SURAT KETERANGAN PENGHASILAN</b> Ayah dan Ibu dari RT/RW.
                </td>
              </tr>
              <tr>
                <td className="text-center">4</td>
                <td>
                  <b>Scan Kartu Keluarga (KK).</b>
                </td>
                <td>
                  <ul className="list-reset">
                    <li>
                      Ekstensi berkas berupa <b>PDF</b>;
                    </li>
                    <li>
                      Ukuran berkas tidak lebih dari <b>500KB</b>.
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="text-center">5</td>
                <td>
                  <b>Scan tagihan PBB terbaru</b> atau{" "}
                  <b>Surat Perjanjian Kontrak</b> (jika rumah mengontrak).
                </td>
                <td>
                  <ul className="list-reset">
                    <li>
                      Ekstensi berkas berupa <b>PDF</b>;
                    </li>
                    <li>
                      Ukuran berkas tidak lebih dari <b>500KB</b>.
                    </li>
                    <li>
                      Surat Perjanjian Kontrak{" "}
                      <Button
                        className="btn btn-primary btn-sm"
                        onClick={this.unduhKontrak.bind(this)}
                      >
                        <i className="fa fa-download"></i>{" "}
                        {this.state.textUnduhKontrak}
                      </Button>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="text-center">6</td>
                <td>
                  <b>Scan tagihan Listrik 3 bulan terakhir.</b>
                </td>
                <td className="text-center">
                  Cara memeriksa tagihan listrik dapat dilihat{" "}
                  <Link to="main/petunjuk" className="btn btn-primary btn-sm">
                    Disini
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="text-center">7</td>
                <td>
                  <b>Scan STNK Motor dan mobil</b> (jika memiliki motor dan/atau
                  mobil).
                </td>
                <td>
                  <ul className="list-reset">
                    <li>
                      Ekstensi berkas berupa <b>PDF</b>;
                    </li>
                    <li>
                      Ukuran berkas tidak lebih dari <b>500KB</b>.
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="text-center">8</td>
                <td>
                  Surat pernyataan komitmen pembiayaan wali (jika mempunyai
                  Wali)
                </td>
                <td className="text-center">
                  <Button
                    className="btn btn-primary btn-sm"
                    onClick={this.unduhWali.bind(this)}
                  >
                    <i className="fa fa-download"></i>{" "}
                    {this.state.textUnduhWali}
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="text-center">9</td>
                <td>
                  <b>Jika tidak bersedia di UKT Kelompok Atas.</b>
                  <br />
                  Surat pernyataan kebenaran data dengan tanda tangan 2 Tetangga
                  serta RT dan RW.
                </td>
                <td className="text-center">
                  Surat ini dapat diunduh pada tab VERIFIKASI{" "}
                  <b>setelah mengisi data</b>.
                </td>
              </tr>
            </tbody>
          </Table>
        </Collapse>
      </Card>
    );
  }
}

export default UktRendah;
