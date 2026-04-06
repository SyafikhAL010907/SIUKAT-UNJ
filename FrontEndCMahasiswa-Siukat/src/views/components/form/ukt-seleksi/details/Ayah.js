import React from 'react';
import { Row, Col, Table, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { ayah } from '../../../../../actions';
import { cookies, cookieName, storage, rupiah } from '../../../../../global';

class Ayah extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(ayah.getByLoggedIn(cookies.get(cookieName)));
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
                                <td>{this.props.ayah.nama_ayah}</td>
                            </tr>
                            <tr>
                                <td>Status Ayah</td>
                                <td>:</td>
                                <td>{this.props.ayah.status_ayah}</td>
                            </tr>
                        </tbody>

                        {this.props.ayah.status_ayah === 'hidup' && (
                            <tbody>
                                <tr>
                                    <td>NIK</td>
                                    <td>:</td>
                                    <td>{this.props.ayah.nik_ayah}</td>
                                </tr>
                                <tr>
                                    <td>KTP</td>
                                    <td>:</td>
                                    <td>
                                        <a
                                            href={
                                                storage +
                                                '/' +
                                                this.props.ayah.scan_ktp_ayah
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button color="primary" size="sm">
                                                <i className="fa fa-download"></i> Lihat KTP
                                            </Button>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Tempat, Tanggal Lahir</td>
                                    <td>:</td>
                                    <td>
                                        {this.props.ayah.tempat_lahir_ayah +
                                            ', ' +
                                            this.props.ayah.tanggal_lahir_ayah}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Alamat</td>
                                    <td>:</td>
                                    {this.props.ayah.provinsi != null && (
                                        <td>
                                            {this.props.ayah.alamat_ayah +
                                                ', ' +
                                                this.props.ayah.kecamatan?.kecam_nama +
                                                ', ' +
                                                this.props.ayah.kabkot?.kab_nama +
                                                ', ' +
                                                this.props.ayah.provinsi?.provinsi_nama}
                                        </td>
                                    )}
                                </tr>
                                <tr>
                                    <td>Pekerjaan</td>
                                    <td>:</td>
                                    {this.props.ayah.pekerjaan !== undefined && (
                                        <td>{this.props.ayah.pekerjaan?.nama}</td>
                                    )}
                                </tr>
                                <tr>
                                    <td>Penghasilan</td>
                                    <td>:</td>
                                    <td>
                                        {rupiah(this.props.ayah.penghasilan_ayah)} <b>/ bulan</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Sampingan</td>
                                    <td>:</td>
                                    <td>
                                        {rupiah(this.props.ayah.sampingan_ayah)} <b>/ bulan</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        {this.props.ayah.pekerjaan_ayah !== '11' &&
                                            'Bukti Penghasilan'}
                                        {this.props.ayah.pekerjaan_ayah === '11' &&
                                            'Surat Keterangan'}
                                    </td>
                                    <td>:</td>
                                    <td>
                                        <a
                                            href={
                                                storage +
                                                '/' +
                                                this.props.ayah.scan_slip_ayah
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button color="primary" size="sm">
                                                <i className="fa fa-download"></i> Lihat Bukti
                        Penghasilan
                                            </Button>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Nomor Telepon</td>
                                    <td>:</td>
                                    <td>{this.props.ayah.telepon_ayah} </td>
                                </tr>
                            </tbody>
                        )}
                    </Table>
                </Col>
            </Row>
        );
    }
}

export default connect((store) => ({
    ayah: store.ayah.ayah,
}))(Ayah);
