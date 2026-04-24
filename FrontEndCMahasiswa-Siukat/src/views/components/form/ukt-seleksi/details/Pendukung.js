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
            <Row className="align-items-center">
                <Col md={12}>
                    <div className="modern-details-list">
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-users"></i> Jumlah Tanggungan
                            </div>
                            <div className="details-value">{this.props.pendukung.tanggungan || '-'} <small className="text-muted">orang</small></div>
                        </div>
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-file-image-o"></i> Kartu Keluarga
                            </div>
                            <div className="details-value">
                                {this.props.pendukung.scan_kk ? (
                                    <a href={storage + '/' + this.props.pendukung.scan_kk + '?t=' + new Date(this.props.pendukung?.updated_at || 1).getTime()} target="_blank" rel="noopener noreferrer" className="btn details-btn-view">
                                        <i className="fa fa-eye mr-2"></i> Lihat Kartu Keluarga
                                    </a>
                                ) : '-'}
                            </div>
                        </div>
                    </div>
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