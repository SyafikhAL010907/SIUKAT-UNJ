import React from 'react';
import { Row, Col, Table, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { ibu } from '../../../../../actions';
import { cookies, cookieName, rupiah, storage } from '../../../../../global';

class Ibu extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(ibu.getByLoggedIn(cookies.get(cookieName)));
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
                                <td>{this.props.ibu.nama_ibu}</td>
                            </tr>
                            <tr>
                                <td>Status Ibu</td>
                                <td>:</td>
                                <td>{this.props.ibu.status_ibu}</td>
                            </tr>
                        </tbody>

                        {this.props.ibu.status_ibu === 'hidup' && (
                            <tbody>
                                <tr>
                                    <td>NIK</td>
                                    <td>:</td>
                                    <td>{this.props.ibu.nik_ibu}</td>
                                </tr>
                                <tr>
                                    <td>KTP</td>
                                    <td>:</td>
                                    <td>
                                        <a
                                            href={
                                                storage +
                                                '/' +
                                                this.props.ibu.scan_ktp_ibu
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
                                        {this.props.ibu.tempat_lahir_ibu +
                                            ', ' +
                                            this.props.ibu.tanggal_lahir_ibu}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Alamat</td>
                                    <td>:</td>
                                    {this.props.ibu.provinsi != null && (
                                        <td>
                                            {this.props.ibu.alamat_ibu +
                                                ', ' +
                                                this.props.ibu.kecamatan?.kecam_nama +
                                                ', ' +
                                                this.props.ibu.kabkot?.kab_nama +
                                                ', ' +
                                                this.props.ibu.provinsi?.provinsi_nama}
                                        </td>
                                    )}
                                </tr>
                                <tr>
                                    <td>Pekerjaan</td>
                                    <td>:</td>
                                    {this.props.ibu.pekerjaan !== undefined && (
                                        <td>{this.props.ibu.pekerjaan.nama}</td>
                                    )}
                                </tr>
                                <tr>
                                    <td>Penghasilan</td>
                                    <td>:</td>
                                    <td>
                                        {rupiah(this.props.ibu.penghasilan_ibu)} <b>/ bulan</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Sampingan</td>
                                    <td>:</td>
                                    <td>
                                        {rupiah(this.props.ibu.sampingan_ibu)} <b>/ bulan</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        {this.props.ibu.pekerjaan_ibu !== '11' &&
                                            'Bukti Penghasilan'}
                                        {this.props.ibu.pekerjaan_ibu === '11' &&
                                            'Surat Keterangan'}
                                    </td>
                                    <td>:</td>
                                    <td>
                                        <a
                                            href={
                                                storage +
                                                '/' +
                                                this.props.ibu.scan_slip_ibu
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
                                    <td>{this.props.ibu.telepon_ibu} </td>
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
    ibu: store.ibu.ibu,
}))(Ibu);
