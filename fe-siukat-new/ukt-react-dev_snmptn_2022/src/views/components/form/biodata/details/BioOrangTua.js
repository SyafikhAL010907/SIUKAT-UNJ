import React from 'react';
import { Row, Col, Table } from 'reactstrap';
import { connect } from 'react-redux';
import { bio_ortu_cmahasiswa } from '../../../../../actions';
import { cookies, cookieName } from '../../../../../global';

class BioPribadi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(
            bio_ortu_cmahasiswa.getByLoggedIn(cookies.get(cookieName))
        );
    }

    render() {
        return (
            <Row>
                <Col md={12}>
                    <h5>Data Ayah</h5>
                    <Table responsive striped bordered>
                        <tbody>
                            <tr>
                                <td width="30%">Nama Ayah</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_ortu_cmahasiswa.nama_ayah}</td>
                            </tr>

                            <tr>
                                <td width="30%">NIK Ayah</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_ortu_cmahasiswa.nik_ayah}</td>
                            </tr>

                            <tr>
                                <td width="30%">Tanggal Lahir Ayah</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_ortu_cmahasiswa.tanggal_lahir_ayah}</td>
                            </tr>

                            <tr>
                                <td width="30%">Pendidikan Ayah</td>
                                <td width="5%">:</td>
                                {this.props.bio_ortu_cmahasiswa.detail_pendidikan_ayah !==
                                    undefined && (
                                        <td>
                                            {
                                                this.props.bio_ortu_cmahasiswa.detail_pendidikan_ayah
                                                    .pendidikan_nama
                                            }
                                        </td>
                                    )}
                            </tr>

                            <tr>
                                <td width="30%">Pekerjaan Ayah</td>
                                <td width="5%">:</td>
                                {this.props.bio_ortu_cmahasiswa.detail_pekerjaan_ayah !==
                                    undefined && (
                                        <td>
                                            {
                                                this.props.bio_ortu_cmahasiswa.detail_pekerjaan_ayah
                                                    .pekerjaan_nama
                                            }
                                        </td>
                                    )}
                            </tr>

                            <tr>
                                <td width="30%">Penghasilan Ayah</td>
                                <td width="5%">:</td>
                                {this.props.bio_ortu_cmahasiswa.detail_penghasilan_ayah !==
                                    undefined && (
                                        <td>
                                            {
                                                this.props.bio_ortu_cmahasiswa.detail_penghasilan_ayah
                                                    .penghasilan_nama
                                            }
                                        </td>
                                    )}
                            </tr>
                        </tbody>
                    </Table>
                </Col>

                <Col md={12}>
                    <h5>Data Ibu</h5>
                    <Table responsive striped bordered>
                        <tbody>
                            <tr>
                                <td width="30%">Nama Ibu</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_ortu_cmahasiswa.nama_ibu}</td>
                            </tr>

                            <tr>
                                <td width="30%">NIK Ibu</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_ortu_cmahasiswa.nik_ibu}</td>
                            </tr>

                            <tr>
                                <td width="30%">Tanggal Lahir Ibu</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_ortu_cmahasiswa.tanggal_lahir_ibu}</td>
                            </tr>

                            <tr>
                                <td width="30%">Pendidikan Ibu</td>
                                <td width="5%">:</td>
                                {this.props.bio_ortu_cmahasiswa.detail_pendidikan_ibu !==
                                    undefined && (
                                        <td>
                                            {
                                                this.props.bio_ortu_cmahasiswa.detail_pendidikan_ibu
                                                    .pendidikan_nama
                                            }
                                        </td>
                                    )}
                            </tr>

                            <tr>
                                <td width="30%">Pekerjaan Ibu</td>
                                <td width="5%">:</td>
                                {this.props.bio_ortu_cmahasiswa.detail_pekerjaan_ibu !==
                                    undefined && (
                                        <td>
                                            {
                                                this.props.bio_ortu_cmahasiswa.detail_pekerjaan_ibu
                                                    .pekerjaan_nama
                                            }
                                        </td>
                                    )}
                            </tr>

                            <tr>
                                <td width="30%">Penghasilan Ibu</td>
                                <td width="5%">:</td>
                                {this.props.bio_ortu_cmahasiswa.detail_penghasilan_ibu !==
                                    undefined && (
                                        <td>
                                            {
                                                this.props.bio_ortu_cmahasiswa.detail_penghasilan_ibu
                                                    .penghasilan_nama
                                            }
                                        </td>
                                    )}
                            </tr>
                        </tbody>
                    </Table>
                </Col>

                {this.props.bio_ortu_cmahasiswa.pilih_wali !== 'lainnya' ? (
                    <Col md={12}>
                        <h5>Data Wali</h5>
                        <Table responsive striped bordered>
                            <tbody>
                                <tr>
                                    <td width="30%">Wali</td>
                                    <td width="5%">:</td>
                                    <td>
                                        {this.props.bio_ortu_cmahasiswa.pilih_wali == null
                                            ? '-'
                                            : this.props.bio_ortu_cmahasiswa.pilih_wali}
                                    </td>
                                </tr>
                                <tr>
                                    <td width="30%">Hubungan Dengan Wali</td>
                                    <td width="5%">:</td>
                                    <td>
                                        {this.props.bio_ortu_cmahasiswa.hubungan_wali == null
                                            ? '-'
                                            : this.props.bio_ortu_cmahasiswa.hubungan_wali}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                ) : (
                    <Col md={12}>
                        <h5>Data Wali</h5>
                        <Table responsive striped bordered>
                            <tbody>
                                <tr>
                                    <td width="30%">Wali</td>
                                    <td width="5%">:</td>
                                    <td>
                                        {this.props.bio_ortu_cmahasiswa.pilih_wali == null
                                            ? '-'
                                            : this.props.bio_ortu_cmahasiswa.pilih_wali}
                                    </td>
                                </tr>

                                <tr>
                                    <td width="30%">Hubungan Dengan Wali</td>
                                    <td width="5%">:</td>
                                    <td>
                                        {this.props.bio_ortu_cmahasiswa.hubungan_wali == null
                                            ? '-'
                                            : this.props.bio_ortu_cmahasiswa.hubungan_wali}
                                    </td>
                                </tr>

                                <tr>
                                    <td width="30%">Nama Wali</td>
                                    <td width="5%">:</td>
                                    <td>
                                        {this.props.bio_ortu_cmahasiswa.nama_wali == null
                                            ? '-'
                                            : this.props.bio_ortu_cmahasiswa.nama_wali}
                                    </td>
                                </tr>

                                <tr>
                                    <td width="30%">NIK Wali</td>
                                    <td width="5%">:</td>
                                    <td>
                                        {this.props.bio_ortu_cmahasiswa.nik_wali == null
                                            ? '-'
                                            : this.props.bio_ortu_cmahasiswa.nik_wali}
                                    </td>
                                </tr>

                                <tr>
                                    <td width="30%">Tanggal Lahir Wali</td>
                                    <td width="5%">:</td>
                                    <td>
                                        {this.props.bio_ortu_cmahasiswa.tanggal_lahir_wali == null
                                            ? '-'
                                            : this.props.bio_ortu_cmahasiswa.tanggal_lahir_wali}
                                    </td>
                                </tr>

                                <tr>
                                    <td width="30%">Pendidikan Wali</td>
                                    <td width="5%">:</td>
                                    {this.props.bio_ortu_cmahasiswa.detail_pendidikan_wali !==
                                        undefined && (
                                            <td>
                                                {this.props.bio_ortu_cmahasiswa.detail_pendidikan_wali ==
                                                    null
                                                    ? '-'
                                                    : this.props.bio_ortu_cmahasiswa.detail_pendidikan_wali
                                                        .pendidikan_nama}
                                            </td>
                                        )}
                                </tr>

                                <tr>
                                    <td width="30%">Pekerjaan Wali</td>
                                    <td width="5%">:</td>
                                    {this.props.bio_ortu_cmahasiswa.detail_pekerjaan_wali !==
                                        undefined && (
                                            <td>
                                                {this.props.bio_ortu_cmahasiswa.detail_pekerjaan_wali ==
                                                    null
                                                    ? '-'
                                                    : this.props.bio_ortu_cmahasiswa.detail_pekerjaan_wali
                                                        .pekerjaan_nama}
                                            </td>
                                        )}
                                </tr>

                                <tr>
                                    <td width="30%">Penghasilan Wali</td>
                                    <td width="5%">:</td>
                                    {this.props.bio_ortu_cmahasiswa.detail_penghasilan_wali !==
                                        undefined && (
                                            <td>
                                                {this.props.bio_ortu_cmahasiswa.detail_penghasilan_wali ==
                                                    null
                                                    ? '-'
                                                    : this.props.bio_ortu_cmahasiswa.detail_penghasilan_wali
                                                        .penghasilan_nama}
                                            </td>
                                        )}
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                )}

                <Col md={12}>
                    <h5>Alamat dan Kontak Wali</h5>
                    <Table responsive striped bordered>
                        <tbody>
                            <tr>
                                <td width="30%">Provinsi</td>
                                <td width="5%">:</td>
                                {this.props.bio_ortu_cmahasiswa.provinsi !== undefined && (
                                    <td>{this.props.bio_ortu_cmahasiswa.provinsi.nama}</td>
                                )}
                            </tr>

                            <tr>
                                <td width="30%">Kabupaten/Kota</td>
                                <td width="5%">:</td>
                                {this.props.bio_ortu_cmahasiswa.kabkot !== undefined && (
                                    <td>{this.props.bio_ortu_cmahasiswa.kabkot.nama}</td>
                                )}
                            </tr>

                            <tr>
                                <td width="30%">Kecamatan</td>
                                <td width="5%">:</td>
                                {this.props.bio_ortu_cmahasiswa.kecamatan !== undefined && (
                                    <td>{this.props.bio_ortu_cmahasiswa.kecamatan.nama}</td>
                                )}
                            </tr>

                            <tr>
                                <td width="30%">Kelurahan/Desa</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_ortu_cmahasiswa.kelurahan}</td>
                            </tr>

                            <tr>
                                <td width="30%">Alamat Lengkap</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_ortu_cmahasiswa.alamat}</td>
                            </tr>

                            <tr>
                                <td width="30%">RT</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_ortu_cmahasiswa.rt}</td>
                            </tr>

                            <tr>
                                <td width="30%">RW</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_ortu_cmahasiswa.rw}</td>
                            </tr>

                            <tr>
                                <td width="30%">Kode POS</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_ortu_cmahasiswa.kode_pos}</td>
                            </tr>

                            <tr>
                                <td width="30%">Kontak</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_ortu_cmahasiswa.kontak}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        );
    }
}

export default connect((store) => ({
    bio_ortu_cmahasiswa: store.bio_ortu_cmahasiswa.bio_ortu_cmahasiswa,
}))(BioPribadi);
