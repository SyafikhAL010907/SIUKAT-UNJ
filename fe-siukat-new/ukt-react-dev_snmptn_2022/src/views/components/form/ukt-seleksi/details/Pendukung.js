import React from 'react';
import { Row, Col, Table, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { pendukung } from '../../../../../actions';
import { cookies, cookieName, storage } from '../../../../../global';

class Pendukung extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(pendukung.getByLoggedIn(cookies.get(cookieName)));
    }
    render() {
        return (
            <Row>
                <Col md={12}>
                    <Table responsive striped bordered>
                        <tbody>
                            <tr>
                                <td width="30%">Jumlah Tanggungan</td>
                                <td width="5%">:</td>
                                <td>{this.props.pendukung.tanggungan}</td>
                            </tr>
                            <tr>
                                <td>Kartu Keluarga</td>
                                <td>:</td>
                                <td>
                                    <a href={storage + '/' + this.props.pendukung.no_peserta + '/' + this.props.pendukung.scan_kk} target="_blank" rel="noopener noreferrer">
                                        <Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat Kartu Keluarga</Button>
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
        pendukung: store.pendukung.pendukung,
    })
)(Pendukung);