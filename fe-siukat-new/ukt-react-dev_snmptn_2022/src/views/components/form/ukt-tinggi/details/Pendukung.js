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
                                <td>Surat Pernyataan</td>
                                <td>:</td>
                                <td>
                                    {this.props.pendukung && this.props.pendukung.no_peserta ? (
                                        <a href={storage + '/' + ((this.props.pendukung.scan_pernyataan_ukt_tinggi !== '') ? this.props.pendukung.scan_pernyataan_ukt_tinggi : '')} target="_blank" rel="noopener noreferrer">
                                            <Button color="primary" size="sm"><i className="fa fa-download"></i> Lihat Surat Pernyataan Kebenaran</Button>
                                        </a>
                                    ) : (
                                        <span>-</span>
                                    )}
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