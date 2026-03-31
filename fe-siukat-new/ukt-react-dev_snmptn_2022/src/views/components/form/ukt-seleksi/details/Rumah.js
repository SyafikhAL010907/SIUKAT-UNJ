import React from 'react';
import { Row, Col, Table, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { rumah } from '../../../../../actions';
import { cookies, cookieName, rupiah, storage } from '../../../../../global';

class Rumah extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(rumah.getByLoggedIn(cookies.get(cookieName)));
    }
    render() {
        return (
            <Row>
                <Col md={12}>
                    <Table responsive striped bordered>
                        <tbody>
                            <tr>
                                <td width="30%">Status Rumah</td>
                                <td width="5%">:</td>
                                <td>{this.props.rumah.status_kepemilikan}</td>
                            </tr>
                            {this.props.rumah.status_kepemilikan !== 'menumpang' && (
                                <tr>
                                    <td>Jumlah Kepala Keluarga</td>
                                    <td>:</td>
                                    <td>{this.props.rumah.jumlah_kepala_keluarga} <b>Kepala Keluarga dalam 1 rumah</b></td>
                                </tr>
                            )}
                        </tbody>

                        {this.props.rumah.status_kepemilikan === 'milik_sendiri' && (
                            <tbody>
                                <tr>
                                    <td>Status Sertifikat</td>
                                    <td>:</td>
                                    <td>{this.props.rumah.status_sertifikat}</td>
                                </tr>
                            </tbody>
                        )}

                        {(this.props.rumah.status_kepemilikan === 'milik_sendiri' || this.props.rumah.status_kepemilikan === 'bersama_saudara') && (
                            <tbody>
                                <tr>
                                    <td>Luas Tanah</td>
                                    <td>:</td>
                                    <td>{this.props.rumah.luas_tanah} m<sup>2</sup></td>
                                </tr>
                                <tr>
                                    <td>Luas Bangunan</td>
                                    <td>:</td>
                                    <td>{this.props.rumah.luas_bangunan} m<sup>2</sup></td>
                                </tr>
                                <tr>
                                    <td>Biaya PBB</td>
                                    <td>:</td>
                                    <td>{rupiah(this.props.rumah.biaya_pbb)} <b>/ tahun</b></td>
                                </tr>
                                <tr>
                                    <td>Bukti Tagihan PBB</td>
                                    <td>:</td>
                                    <td>
                                        <a href={storage + '/' + this.props.rumah.no_peserta + '/' + this.props.rumah.scan_pbb} target="_blank" rel="noopener noreferrer">
                                            <Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat Bukti Tagihan PBB</Button>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        )}

                        {this.props.rumah.status_kepemilikan === 'kontrak' && (
                            <tbody>
                                <tr>
                                    <td>Biaya Kontrak</td>
                                    <td>:</td>
                                    <td>{rupiah(this.props.rumah.biaya_kontrak)} <b>/ tahun</b></td>
                                </tr>
                                <tr>
                                    <td>Surat Perjanjian Kontrak</td>
                                    <td>:</td>
                                    <td>
                                        <a href={storage + '/' + this.props.rumah.no_peserta + '/' + this.props.rumah.scan_kontrak} target="_blank" rel="noopener noreferrer">
                                            <Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat Surat Perjanjian Kontrak</Button>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </Table>
                </Col>
            </Row>
        );
    }
}

export default connect(
    (store) => ({
        rumah: store.rumah.rumah,
    })
)(Rumah);