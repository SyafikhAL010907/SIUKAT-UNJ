import React from 'react';
import { Row, Col, Table } from 'reactstrap';
import { connect } from 'react-redux';
import { ayah } from '../../../../../actions';
import { cookies, cookieName } from '../../../../../global';

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
                                    <td>Tempat, Tanggal Lahir</td>
                                    <td>:</td>
                                    <td>{this.props.ayah.tempat_lahir_ayah + ', ' + this.props.ayah.tanggal_lahir_ayah}</td>
                                </tr>
                                <tr>
                                    <td>Alamat</td>
                                    <td>:</td>
                                {this.props.ayah.provinsi ? (
                                    <td>
                                        {this.props.ayah.alamat_ayah + ', ' + 
                                         (this.props.ayah.kecamatan?.kecam_nama || '-') + ', ' + 
                                         (this.props.ayah.kabkot?.kab_nama || '-') + ', ' + 
                                         (this.props.ayah.provinsi?.provinsi_nama || '-')}
                                    </td>
                                ) : (
                                    <td>-</td>
                                )}
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

export default connect(
    (store) => ({
        ayah: store.ayah.ayah,
    })
)(Ayah);