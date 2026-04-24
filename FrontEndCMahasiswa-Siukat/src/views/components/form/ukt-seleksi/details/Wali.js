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
        return (
            <Row className="align-items-center">
                <Col md={12}>
                    <div className="modern-details-list">
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-info-circle"></i> Status Wali
                            </div>
                            <div className="details-value">
                                <span className={`badge badge-pill ${this.props.wali.status_wali === 'ada' ? 'badge-success' : 'badge-secondary'} px-3 py-2`}>
                                    {this.props.wali.status_wali}
                                </span>
                            </div>
                        </div>

                        {this.props.wali.status_wali === 'ada' && (
                            <React.Fragment>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-user"></i> Nama Wali
                                    </div>
                                    <div className="details-value">{this.props.wali.nama_wali || '-'}</div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-map-marker"></i> Alamat Wali
                                    </div>
                                    <div className="details-value">
                                        {this.props.wali.alamat_wali || '-'}
                                        {this.props.wali.kecamatan && this.props.wali.kabkot && this.props.wali.provinsi && (
                                            <span className="text-muted d-block mt-1" style={{fontSize: '0.9rem'}}>
                                                <i className="fa fa-map-signs mr-1"></i>
                                                {this.props.wali.kecamatan.kecam_nama + ', ' + this.props.wali.kabkot.kab_nama + ', ' + this.props.wali.provinsi.provinsi_nama}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-money"></i> Komitmen Pembiayaan
                                    </div>
                                    <div className="details-value text-emerald">
                                        {rupiah(this.props.wali.kesanggupan_wali)} <small className="text-muted">/ bulan</small>
                                    </div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-file-text-o"></i> Surat Komitmen
                                    </div>
                                    <div className="details-value">
                                        {this.props.wali.scan_wali ? (
                                            <a
                                                href={storage + '/' + this.props.wali.scan_wali + '?t=' + new Date(this.props.wali?.updated_at || 1).getTime()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn details-btn-view"
                                            >
                                                <i className="fa fa-eye mr-2"></i> Lihat Surat Komitmen
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

export default connect((store) => ({
    wali: store.wali.wali,
}))(Wali);
