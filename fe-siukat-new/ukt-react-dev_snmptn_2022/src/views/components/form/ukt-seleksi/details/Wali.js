import React from 'react';
import { Row, Col, Table, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { wali } from '../../../../../actions';
import { cookies, cookieName, rupiah, storage } from '../../../../../global';

class Wali extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(wali.getByLoggedIn(cookies.get(cookieName)));
    }
    render() {
        console.log(this.props.wali);
        return (
            <Row>
                <Col md={12}>
                    <Table responsive striped bordered>
                        <tbody>
                            <tr>
                                <td width="30%">Status Wali</td>
                                <td width="5%">:</td>
                                <td>{this.props.wali.status_wali}</td>
                            </tr>
                        </tbody>

                        {this.props.wali.status_wali === 'ada' && (
                            <tbody>
                                <tr>
                                    <td>Nama</td>
                                    <td>:</td>
                                    <td>{this.props.wali.nama_wali}</td>
                                </tr>
                                <tr>
                                    <td>Alamat</td>
                                    <td>:</td>
                                    {this.props.wali.provinsi !== null && (
                                        <td>
                                            {this.props.wali.alamat_wali +
                                                ', ' +
                                                this.props.wali.kecamatan.kecam_nama +
                                                ', ' +
                                                this.props.wali.kabkot.kab_nama +
                                                ', ' +
                                                this.props.wali.provinsi.provinsi_nama}
                                        </td>
                                    )}
                                </tr>
                                <tr>
                                    <td>Komitmen Pembiayaan</td>
                                    <td>:</td>
                                    <td>
                                        {rupiah(this.props.wali.kesanggupan_wali)} <b>/ bulan</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Surat Komitmen Pembiayaan Pendukung</td>
                                    <td>:</td>
                                    <td>
                                        <a
                                            href={
                                                storage +
                                                '/' +
                                                this.props.wali.no_peserta +
                                                '/' +
                                                this.props.wali.scan_wali
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button color="primary" size="sm">
                                                <i className="fa fa-download"></i> Lihat Surat Komitmen
                        Pembiayaan Pendukung
                                            </Button>
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

export default connect((store) => ({
    wali: store.wali.wali,
}))(Wali);
