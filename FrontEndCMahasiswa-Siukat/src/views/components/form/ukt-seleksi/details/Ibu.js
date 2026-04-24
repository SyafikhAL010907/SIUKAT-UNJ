import React from 'react';
import { Row, Col, Table, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { ibu } from '../../../../../actions';
import { cookies, cookieName, rupiah, storage } from '../../../../../global';

class Ibu extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(ibu.getByLoggedIn(cookies.get(cookieName)));
    }
    render() {
        return (
            <Row className="align-items-center">
                <Col md={12}>
                    <div className="modern-details-list">
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-user"></i> Nama Ibu
                            </div>
                            <div className="details-value">{this.props.ibu.nama_ibu || '-'}</div>
                        </div>
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-info-circle"></i> Status Ibu
                            </div>
                            <div className="details-value">
                                <span className={`badge badge-pill ${this.props.ibu.status_ibu === 'hidup' ? 'badge-success' : 'badge-secondary'} px-3 py-2`}>
                                    {this.props.ibu.status_ibu}
                                </span>
                            </div>
                        </div>

                        {this.props.ibu.status_ibu === 'hidup' && (
                            <React.Fragment>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-credit-card"></i> NIK Ibu
                                    </div>
                                    <div className="details-value">{this.props.ibu.nik_ibu || '-'}</div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-file-image-o"></i> Scan KTP
                                    </div>
                                    <div className="details-value">
                                        {this.props.ibu.scan_ktp_ibu ? (
                                            <a
                                                href={storage + '/' + this.props.ibu.scan_ktp_ibu + '?t=' + new Date(this.props.ibu?.updated_at || 1).getTime()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn details-btn-view"
                                            >
                                                <i className="fa fa-eye mr-2"></i> Lihat KTP
                                            </a>
                                        ) : '-'}
                                    </div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-map-marker"></i> Tempat, Tgl Lahir
                                    </div>
                                    <div className="details-value">
                                        {this.props.ibu.tempat_lahir_ibu && this.props.ibu.tempat_lahir_ibu + ', '}
                                        {this.props.ibu.tanggal_lahir_ibu && !this.props.ibu.tanggal_lahir_ibu.includes('0001') ? 
                                            this.props.ibu.tanggal_lahir_ibu : '-'}
                                    </div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-home"></i> Alamat Ibu
                                    </div>
                                    <div className="details-value">
                                        {this.props.ibu.alamat_ibu || '-'}
                                        {this.props.ibu.kecamatan && this.props.ibu.kabkot && this.props.ibu.provinsi && (
                                            <span className="text-muted d-block mt-1" style={{fontSize: '0.9rem'}}>
                                                <i className="fa fa-map-signs mr-1"></i>
                                                {this.props.ibu.kecamatan.kecam_nama + ', ' + this.props.ibu.kabkot.kab_nama + ', ' + this.props.ibu.provinsi.provinsi_nama}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-briefcase"></i> Pekerjaan
                                    </div>
                                    <div className="details-value">{this.props.ibu.pekerjaan?.nama || '-'}</div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-money"></i> Penghasilan
                                    </div>
                                    <div className="details-value text-emerald">
                                        {rupiah(this.props.ibu.penghasilan_ibu)} <small className="text-muted">/ bulan</small>
                                    </div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-plus-circle"></i> Sampingan
                                    </div>
                                    <div className="details-value text-secondary">
                                        {rupiah(this.props.ibu.sampingan_ibu)} <small className="text-muted">/ bulan</small>
                                    </div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-file-text-o"></i>
                                        {this.props.ibu.pekerjaan_ibu !== '11' ? ' Bukti Penghasilan' : ' Surat Keterangan'}
                                    </div>
                                    <div className="details-value">
                                        {this.props.ibu.scan_slip_ibu ? (
                                            <a
                                                href={storage + '/' + this.props.ibu.scan_slip_ibu + '?t=' + new Date(this.props.ibu?.updated_at || 1).getTime()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn details-btn-view"
                                            >
                                                <i className="fa fa-eye mr-2"></i> Lihat Bukti
                                            </a>
                                        ) : '-'}
                                    </div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-phone"></i> Nomor Telepon
                                    </div>
                                    <div className="details-value text-emerald">{this.props.ibu.telepon_ibu || '-'}</div>
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
    ibu: store.ibu.ibu,
}))(Ibu);
