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
            <Row className="align-items-center">
                <Col md={12}>
                    <div className="modern-details-list">
                        {/* Motor Section */}
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-motorcycle"></i> Status Motor
                            </div>
                            <div className="details-value">
                                <span className={`badge badge-pill ${this.props.kendaraan.status_motor === 'ada' ? 'badge-success' : 'badge-secondary'} px-3 py-2`}>
                                    {this.props.kendaraan.status_motor}
                                </span>
                            </div>
                        </div>

                        {this.props.kendaraan.status_motor === 'ada' && (
                            <React.Fragment>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-plus-circle"></i> Jumlah Motor
                                    </div>
                                    <div className="details-value">{this.props.kendaraan.jumlah_motor} <small className="text-muted">unit dalam 1 KK</small></div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-money"></i> Pajak Motor
                                    </div>
                                    <div className="details-value text-emerald">
                                        {rupiah(this.props.kendaraan.pajak_motor)} <small className="text-muted">/ tahun</small>
                                    </div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-file-text-o"></i> Bukti STNK Motor
                                    </div>
                                    <div className="details-value">
                                        {this.props.kendaraan.scan_motor ? (
                                            <a href={storage + '/' + this.props.kendaraan.scan_motor + '?t=' + new Date(this.props.kendaraan?.updated_at || 1).getTime()} target="_blank" rel="noopener noreferrer" className="btn details-btn-view">
                                                <i className="fa fa-eye mr-2"></i> Lihat STNK Motor
                                            </a>
                                        ) : '-'}
                                    </div>
                                </div>
                            </React.Fragment>
                        )}

                        <hr className="my-4" style={{borderColor: '#e2e8f0'}} />

                        {/* Mobil Section */}
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-car"></i> Status Mobil
                            </div>
                            <div className="details-value">
                                <span className={`badge badge-pill ${this.props.kendaraan.status_mobil === 'ada' ? 'badge-success' : 'badge-secondary'} px-3 py-2`}>
                                    {this.props.kendaraan.status_mobil}
                                </span>
                            </div>
                        </div>

                        {this.props.kendaraan.status_mobil === 'ada' && (
                            <React.Fragment>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-plus-circle"></i> Jumlah Mobil
                                    </div>
                                    <div className="details-value">{this.props.kendaraan.jumlah_mobil} <small className="text-muted">unit dalam 1 KK</small></div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-money"></i> Pajak Mobil
                                    </div>
                                    <div className="details-value text-emerald">
                                        {rupiah(this.props.kendaraan.pajak_mobil)} <small className="text-muted">/ tahun</small>
                                    </div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-file-text-o"></i> Bukti STNK Mobil
                                    </div>
                                    <div className="details-value">
                                        {this.props.kendaraan.scan_mobil ? (
                                            <a href={storage + '/' + this.props.kendaraan.scan_mobil + '?t=' + new Date(this.props.kendaraan?.updated_at || 1).getTime()} target="_blank" rel="noopener noreferrer" className="btn details-btn-view">
                                                <i className="fa fa-eye mr-2"></i> Lihat STNK Mobil
                                            </a>
                                        ) : '-'}
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
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