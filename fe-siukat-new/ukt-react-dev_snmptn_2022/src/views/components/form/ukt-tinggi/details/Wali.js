import React from 'react';
import { Row, Col, Table } from 'reactstrap';
import { connect } from 'react-redux';
import { wali } from '../../../../../actions';
import { cookies, cookieName } from '../../../../../global';

class Wali extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(wali.getByLoggedIn(cookies.get(cookieName)));
    }
    render() {
        return (
            <Row>
                <Col md={12}>
                    <Table responsive striped bordered>
                        <tbody>
                            <tr>
                                <td>Status Wali</td>
                                <td>:</td>
                                <td>{this.props.wali.status_wali}</td>
                            </tr>
                        </tbody>

                        {this.props.wali.status_wali === 'ada' && (
                            <tbody>
                                <tr>
                                    <td width="30%">Nama</td>
                                    <td width="5%">:</td>
                                    <td>{this.props.wali.nama_wali}</td>
                                </tr>
                                <tr>
                                    <td>Alamat</td>
                                    <td>:</td>
                                    {this.props.wali.provinsi !== 0 &&
                                        <td>{this.props.wali.alamat_wali + ', ' + this.props.wali.kecamatan.kecam_nama + ', ' + this.props.wali.kabkot.kab_nama + ', ' + this.props.wali.provinsi.provinsi_nama}</td>
                                    }
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
        wali: store.wali.wali,
    })
)(Wali);