import React from "react";
import { Row, Col, Table, Button } from "reactstrap";
import { connect } from "react-redux";
import { bio_sekolah_cmahasiswa } from "../../../../../actions";
import { cookies, cookieName, storage } from "../../../../../global";

class BioPribadi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(
            bio_sekolah_cmahasiswa.getByLoggedIn(cookies.get(cookieName))
        );
    }
    checkNPSN = () => {
        window.open(
            `https://referensi.data.kemdikbud.go.id/tabs.php?npsn=${this.props.bio_sekolah_cmahasiswa.npsn}`,
            "_blank"
        );
    };
    render() {
        return (
            <Row>
                <Col md={12}>
                    <Table responsive striped bordered>
                        <tbody>
                            <tr>
                                <td width="30%">NISN</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_sekolah_cmahasiswa.nisn}</td>
                            </tr>

                            <tr>
                                <td width="30%">NPSN Sekolah</td>
                                <td width="5%">:</td>
                                {/* <td> */}
                                {/* {this.props.bio_sekolah_cmahasiswa.data_sekolah !==
                  undefined && ( */}
                                <td>
                                    {this.props.bio_sekolah_cmahasiswa.npsn}{" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Button id="bt" onClick={this.checkNPSN} color="info">
                                        Cek NPSN Sekolah
                    {/* {this.props.bio_sekolah_cmahasiswa.npsn} */}
                                    </Button>
                                </td>
                                {/* )} */}
                            </tr>

                            {/* <tr>
                <td width="30%">Nama Sekolah</td>
                <td width="5%">:</td>
                {this.props.bio_sekolah_cmahasiswa.data_sekolah !==
                  undefined && (
                  <td>
                    {
                      this.props.bio_sekolah_cmahasiswa.data_sekolah
                        .nama_sekolah
                    }
                  </td>
                )}
              </tr> */}

                            <tr>
                                <td width="30%">Alamat Sekolah</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_sekolah_cmahasiswa.alamat_sekolah}</td>
                            </tr>

                            <tr>
                                <td width="30%">Jurusan</td>
                                <td width="5%">:</td>
                                {/* <td> */}
                                {this.props.bio_sekolah_cmahasiswa.jurusan !== undefined && (
                                    <td>
                                        {this.props.bio_sekolah_cmahasiswa.jurusan.jurusan_nama}
                                    </td>
                                )}
                            </tr>

                            <tr>
                                <td width="30%">Tahun Masuk</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_sekolah_cmahasiswa.tahun_masuk}</td>
                            </tr>

                            <tr>
                                <td width="30%">Tahun Lulus</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_sekolah_cmahasiswa.tahun_lulus}</td>
                            </tr>

                            <tr>
                                <td width="30%">Rata-rata Nilai UN</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_sekolah_cmahasiswa.rata_UN}</td>
                            </tr>

                            <tr>
                                <td width="30%">Jumlah Mata Pelajaran UN</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_sekolah_cmahasiswa.mapel_UN}</td>
                            </tr>

                            <tr>
                                <td width="30%">Nomor Peserta UN</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_sekolah_cmahasiswa.no_peserta_UN}</td>
                            </tr>

                            <tr>
                                <td width="30%">Rata-rata Ijazah</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_sekolah_cmahasiswa.rata_ijazah}</td>
                            </tr>

                            <tr>
                                <td width="30%">Jumlah Mata Pelajaran Ijazah</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_sekolah_cmahasiswa.mapel_ijazah}</td>
                            </tr>

                            <tr>
                                <td width="30%">Nomor Ijazah</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_sekolah_cmahasiswa.no_ijazah}</td>
                            </tr>

                            <tr>
                                <td>SKL/Ijazah</td>
                                <td>:</td>
                                <td>
                                    <a
                                        href={
                                            storage +
                                            "/" +
                                            this.props.bio_sekolah_cmahasiswa.no_peserta +
                                            "/" +
                                            this.props.bio_sekolah_cmahasiswa.scan_skl_ijazah
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button color="primary" size="sm">
                                            <i className="fa fa-download"></i> Lihat SKL/Ijazah
                    </Button>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        );
    }
}

export default connect((store) => ({
    bio_sekolah_cmahasiswa: store.bio_sekolah_cmahasiswa.bio_sekolah_cmahasiswa,
}))(BioPribadi);
