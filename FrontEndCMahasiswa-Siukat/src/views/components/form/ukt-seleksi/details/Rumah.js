import React from 'react';
import { Row, Col, Table, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { rumah } from '../../../../../actions';
import { cookies, cookieName, rupiah, storage } from '../../../../../global';

class Rumah extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(rumah.getByLoggedIn(cookies.get(cookieName)));
    }
    render() {
        if (!this.props.rumah || !this.props.rumah.status_kepemilikan) {
            return (
                <div className="text-center p-5">
                    <i className="fa fa-spinner fa-spin fa-2x text-muted mb-3"></i>
                    <p className="text-muted">Memuat data rumah...</p>
                </div>
            );
        }

        const { rumah } = this.props;

        return (
            <Row className="align-items-center">
                <Col md={12}>
                    <div className="modern-details-list">
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-info-circle"></i> Status Rumah
                            </div>
                            <div className="details-value">
                                <span className="badge badge-pill badge-primary px-3 py-2">
                                    {rumah.status_kepemilikan.replace('_', ' ')}
                                </span>
                            </div>
                        </div>

                        {rumah.status_kepemilikan !== 'menumpang' && (
                            <div className="details-row">
                                <div className="details-label">
                                    <i className="fa fa-users"></i> Jml Kepala Keluarga
                                </div>
                                <div className="details-value">{rumah.jumlah_kepala_keluarga} <small className="text-muted">dalam 1 rumah</small></div>
                            </div>
                        )}

                        {rumah.status_kepemilikan === 'milik_sendiri' && (
                            <div className="details-row">
                                <div className="details-label">
                                    <i className="fa fa-certificate"></i> Status Sertifikat
                                </div>
                                <div className="details-value">{rumah.status_sertifikat}</div>
                            </div>
                        )}

                        {(rumah.status_kepemilikan === 'milik_sendiri' || rumah.status_kepemilikan === 'bersama_saudara') && (
                            <React.Fragment>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-expand"></i> Luas Tanah
                                    </div>
                                    <div className="details-value">{rumah.luas_tanah} m<sup>2</sup></div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-building"></i> Luas Bangunan
                                    </div>
                                    <div className="details-value">{rumah.luas_bangunan} m<sup>2</sup></div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-money"></i> Biaya PBB
                                    </div>
                                    <div className="details-value text-emerald">
                                        {rupiah(rumah.biaya_pbb)} <small className="text-muted">/ tahun</small>
                                    </div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-file-text-o"></i> Bukti Tagihan PBB
                                    </div>
                                    <div className="details-value">
                                        {rumah.scan_pbb ? (
                                            <a href={storage + '/' + rumah.scan_pbb + '?t=' + new Date(rumah?.updated_at || 1).getTime()} target="_blank" rel="noopener noreferrer" className="btn details-btn-view">
                                                <i className="fa fa-eye mr-2"></i> Lihat Bukti PBB
                                            </a>
                                        ) : '-'}
                                    </div>
                                </div>
                            </React.Fragment>
                        )}

                        {rumah.status_kepemilikan === 'kontrak' && (
                            <React.Fragment>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-money"></i> Biaya Kontrak
                                    </div>
                                    <div className="details-value text-emerald">
                                        {rupiah(rumah.biaya_kontrak)} <small className="text-muted">/ tahun</small>
                                    </div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-file-text-o"></i> Perjanjian Kontrak
                                    </div>
                                    <div className="details-value">
                                        {rumah.scan_kontrak ? (
                                            <a href={storage + '/' + rumah.scan_kontrak + '?t=' + new Date(rumah?.updated_at || 1).getTime()} target="_blank" rel="noopener noreferrer" className="btn details-btn-view">
                                                <i className="fa fa-eye mr-2"></i> Lihat Surat Kontrak
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
        rumah: store.rumah.rumah,
    })
)(Rumah);