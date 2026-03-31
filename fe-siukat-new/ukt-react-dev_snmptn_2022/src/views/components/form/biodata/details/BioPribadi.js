import React from 'react';
import { Row, Col, Table } from 'reactstrap';
import { connect } from 'react-redux';
import { bio_cmahasiswa } from '../../../../../actions';
import { cookies, cookieName } from '../../../../../global';

class BioPribadi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(bio_cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
    }
    render() {
        return (
            <Row>
                <Col md={12}>
                    <Table responsive striped bordered>
                        <tbody>
                            <tr>
                                <td width="30%">Nama</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_cmahasiswa.nama}</td>
                            </tr>

                            <tr>
                                <td width="30%">Jenis Kelamin</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_cmahasiswa.jenis_kelamin}</td>
                            </tr>

                            <tr>
                                <td width="30%">Agama</td>
                                <td width="5%">:</td>
                                {this.props.bio_cmahasiswa.agama !== undefined && (
                                    <td>{this.props.bio_cmahasiswa.agama.agama_nama}</td>
                                )}
                            </tr>

                            <tr>
                                <td width="30%">Tempat Lahir</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_cmahasiswa.tempat_lahir_cmahasiswa}</td>
                            </tr>

                            <tr>
                                <td width="30%">Tanggal Lahir</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_cmahasiswa.tanggal_lahir_cmahasiswa}</td>
                            </tr>

                            <tr>
                                <td width="30%">Kewarganegaraan</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_cmahasiswa.kewarganegaraan}</td>
                            </tr>

                            <tr>
                                <td width="30%">Jenis Tempat Tinggal</td>
                                <td width="5%">:</td>
                                {this.props.bio_cmahasiswa.tinggal !== undefined && (
                                    <td>{this.props.bio_cmahasiswa.tinggal.jenis_tinggal}</td>
                                )}
                            </tr>

                            <tr>
                                <td width="30%">Transportasi</td>
                                <td width="5%">:</td>
                                {this.props.bio_cmahasiswa.transportasi !== undefined && (
                                    <td>
                                        {this.props.bio_cmahasiswa.transportasi.transportasi_nama}
                                    </td>
                                )}
                            </tr>

                            <tr>
                                <td width="30%">Provinsi</td>
                                <td width="5%">:</td>
                                {this.props.bio_cmahasiswa.Provinsi !== undefined && (
                                    <td>{this.props.bio_cmahasiswa.Provinsi.nama}</td>
                                )}
                            </tr>

                            <tr>
                                <td width="30%">Kabupaten/Kota</td>
                                <td width="5%">:</td>
                                {this.props.bio_cmahasiswa.Kabkot !== undefined && (
                                    <td>{this.props.bio_cmahasiswa.Kabkot.nama}</td>
                                )}
                            </tr>

                            <tr>
                                <td width="30%">Kecamatan</td>
                                <td width="5%">:</td>
                                {this.props.bio_cmahasiswa.Kecamatan !== undefined && (
                                    <td>{this.props.bio_cmahasiswa.Kecamatan.nama}</td>
                                )}
                            </tr>

                            <tr>
                                <td width="30%">Kelurahan/Desa</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_cmahasiswa.kelurahan}</td>
                            </tr>

                            <tr>
                                <td width="30%">Dusun</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_cmahasiswa.dusun}</td>
                            </tr>

                            <tr>
                                <td width="30%">Alamat Lengkap</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_cmahasiswa.alamat}</td>
                            </tr>

                            <tr>
                                <td width="30%">RT</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_cmahasiswa.rt}</td>
                            </tr>

                            <tr>
                                <td width="30%">RW</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_cmahasiswa.rw}</td>
                            </tr>

                            <tr>
                                <td width="30%">Kode POS</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_cmahasiswa.kode_pos}</td>
                            </tr>

                            <tr>
                                <td width="30%">NIK</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_cmahasiswa.nik}</td>
                            </tr>

                            <tr>
                                <td width="30%">NPWP</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_cmahasiswa.npwp}</td>
                            </tr>

                            <tr>
                                <td width="30%">Nomor Telepon</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_cmahasiswa.telp}</td>
                            </tr>

                            <tr>
                                <td width="30%">Nomor Handphone</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_cmahasiswa.hp}</td>
                            </tr>

                            <tr>
                                <td width="30%">Email</td>
                                <td width="5%">:</td>
                                <td>{this.props.bio_cmahasiswa.email}</td>
                            </tr>

                            <tr>
                                <td width="30%">KPS/KKS</td>
                                <td width="5%">:</td>
                                <td>
                                    {this.props.bio_cmahasiswa.terima_kps === '1'
                                        ? this.props.bio_cmahasiswa.no_kps
                                        : 'tidak menerima KPS/KKS/KIS'}
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
    bio_cmahasiswa: store.bio_cmahasiswa.bio_cmahasiswa,
}))(BioPribadi);
