import React from 'react';
import { Row, Col, Table, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { kendaraan } from '../../../../../actions';
import { cookies, cookieName, rupiah, storage } from '../../../../../global';

class Kendaraan extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(kendaraan.getByLoggedIn(cookies.get(cookieName)));
    }
    render() {
        return (
            <Row>
                <Col md={12}>
                    <Table responsive striped bordered>
                        <tbody>
                            <tr>
                                <td width="30%">Status Motor</td>
                                <td width="5%">:</td>
                                <td>{this.props.kendaraan.status_motor}</td>
                            </tr>
                        </tbody>

                        {this.props.kendaraan.status_motor === 'ada' && (
                            <tbody>
                                <tr>
                                    <td>Jumlah Motor</td>
                                    <td>:</td>
                                    <td>{this.props.kendaraan.jumlah_motor} <b>dalam 1 Kartu Keluarga</b></td>
                                </tr>
                                <tr>
                                    <td>Pajak Motor</td>
                                    <td>:</td>
                                    <td>{rupiah(this.props.kendaraan.pajak_motor)} <b>/ tahun</b></td>
                                </tr>
                                <tr>
                                    <td>STNK Motor</td>
                                    <td>:</td>
                                    <td>
                                        <a href={storage + '/' + this.props.kendaraan.scan_motor} target="_blank" rel="noopener noreferrer">
                                            <Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat STNK Motor</Button>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        )}

                        <tbody>
                            <tr>
                                <td width="30%">Status Mobil</td>
                                <td width="5%">:</td>
                                <td>{this.props.kendaraan.status_mobil}</td>
                            </tr>
                        </tbody>

                        {this.props.kendaraan.status_mobil === 'ada' && (
                            <tbody>
                                <tr>
                                    <td>Jumlah Mobil</td>
                                    <td>:</td>
                                    <td>{this.props.kendaraan.jumlah_mobil} <b>dalam 1 Kartu Keluarga</b></td>
                                </tr>
                                <tr>
                                    <td>Pajak Mobil</td>
                                    <td>:</td>
                                    <td>{rupiah(this.props.kendaraan.pajak_mobil)} <b>/ tahun</b></td>
                                </tr>
                                <tr>
                                    <td>STNK Mobil</td>
                                    <td>:</td>
                                    <td>
                                        <a href={storage + '/' + this.props.kendaraan.scan_mobil} target="_blank" rel="noopener noreferrer">
                                            <Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat STNK Mobil</Button>
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
        kendaraan: store.kendaraan.kendaraan,
    })
)(Kendaraan);