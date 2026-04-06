import React from 'react';
import { Row, Col, Table, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { listrik } from '../../../../../actions';
import { cookies, cookieName, rupiah, storage } from '../../../../../global';

class Listrik extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(listrik.getByLoggedIn(cookies.get(cookieName)));
    }
    render() {
        return (
            <Row>
                <Col md={12}>
                    <Table responsive striped bordered>
                        <tbody>
                            <tr>
                                <td width="30%">Nomor Pelanggan</td>
                                <td width="5%">:</td>
                                <td>{this.props.listrik.no_pelanggan}</td>
                            </tr>
                            <tr>
                                <td>Jenis Pemakaian</td>
                                <td>:</td>
                                <td>{this.props.listrik.jenis_pemakaian}</td>
                            </tr>
                            <tr>
                                <td>Biaya Listrik</td>
                                <td>:</td>
                                <td>{rupiah(this.props.listrik.pengeluaran)} <b>/ 3 bulan terakhir</b></td>
                            </tr>
                            <tr>
                                <td>Bukti Tagihan Listrik</td>
                                <td>:</td>
                                <td>
                                    <a href={storage + '/' + this.props.listrik.scan_listrik} target="_blank" rel="noopener noreferrer">
                                        <Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat Bukti Tagihan Listrik</Button>
                                    </a>
                                </td>
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
        listrik: store.listrik.listrik,
    })
)(Listrik);