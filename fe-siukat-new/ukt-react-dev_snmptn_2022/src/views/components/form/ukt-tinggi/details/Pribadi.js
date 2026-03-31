import React from 'react';
import { Row, Col, Table } from 'reactstrap';
import { connect } from 'react-redux';
import { cmahasiswa } from '../../../../../actions';
import { cookies, cookieName, storage } from '../../../../../global';

class Pribadi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
    }
    render() {
        return (
            <Row>
                <Col md={3}>
                    {this.props.cmahasiswa.foto_cmahasiswa && (
                        <img src={storage + '/' + this.props.cmahasiswa.no_peserta + '/' + this.props.cmahasiswa.foto_cmahasiswa} className="img-thumbnail img-responsive" alt="foto-cmahasiswa" />
                    )}
                </Col>
                <Col md={9}>
                    <Table responsive striped bordered>
                        <tbody>
                            <tr>
                                <td width="40%">Nama</td>
                                <td width="5%">:</td>
                                <td>{this.props.cmahasiswa.nama_cmahasiswa}</td>
                            </tr>
                            <tr>
                                <td>Jenis Kelamin</td>
                                <td>:</td>
                                <td>{this.props.cmahasiswa.gender_cmahasiswa}</td>
                            </tr>
                            <tr>
                                <td>Tempat, Tanggal Lahir</td>
                                <td>:</td>
                                <td>{this.props.cmahasiswa.tempat_lahir_cmahasiswa + ', ' + this.props.cmahasiswa.tanggal_lahir_cmahasiswa}</td>
                            </tr>
                            <tr>
                                <td>Alamat</td>
                                <td>:</td>
                                {this.props.cmahasiswa.provinsi !== 0 &&
                                    <td>{this.props.cmahasiswa.alamat_cmahasiswa + ', ' + this.props.cmahasiswa.kecamatan.kecam_nama + ', ' + this.props.cmahasiswa.kabkot.kab_nama + ', ' + this.props.cmahasiswa.provinsi.provinsi_nama}</td>
                                }
                            </tr>
                            <tr>
                                <td>Nomor Telepon</td>
                                <td>:</td>
                                <td>{this.props.cmahasiswa.telepon_cmahasiswa}</td>
                            </tr>
                            <tr>
                                <td>Golongan Darah</td>
                                <td>:</td>
                                <td>{this.props.cmahasiswa.goldar_cmahasiswa}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        );
    }
}

export default connect(
    (store) => ({
        cmahasiswa: store.cmahasiswa.cmahasiswa,
    })
)(Pribadi);