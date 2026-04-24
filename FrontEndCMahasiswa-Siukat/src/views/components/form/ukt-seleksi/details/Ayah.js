import React from 'react';
import { Row, Col, Table, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { ayah } from '../../../../../actions';
import { cookies, cookieName, storage, rupiah } from '../../../../../global';

class Ayah extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(ayah.getByLoggedIn(cookies.get(cookieName)));
    }
    render() {
        return (
            <Row>
                <Col md={12}>
                    <div className="modern-details-list">
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-user"></i> Nama Ayah
                            </div>
                            <div className="details-value">{this.props.ayah.nama_ayah || '-'}</div>
                        </div>
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-info-circle"></i> Status Ayah
                            </div>
                            <div className="details-value">
                                <span className={`badge badge-pill ${this.props.ayah.status_ayah === 'hidup' ? 'badge-success' : 'badge-secondary'} px-3 py-2`}>
                                    {this.props.ayah.status_ayah}
                                </span>
                            </div>
                        </div>

                        {this.props.ayah.status_ayah === 'hidup' && (
                            <React.Fragment>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-credit-card"></i> NIK Ayah
                                    </div>
                                    <div className="details-value">{this.props.ayah.nik_ayah || '-'}</div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-file-image-o"></i> Scan KTP
                                    </div>
                                    <div className="details-value">
                                        {this.props.ayah.scan_ktp_ayah ? (
                                            <a
                                                href={storage + '/' + this.props.ayah.scan_ktp_ayah + '?t=' + new Date(this.props.ayah?.updated_at || 1).getTime()}
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
                                        {this.props.ayah.tempat_lahir_ayah && this.props.ayah.tempat_lahir_ayah + ', '}
                                        {this.props.ayah.tanggal_lahir_ayah && !this.props.ayah.tanggal_lahir_ayah.includes('0001') ? 
                                            this.props.ayah.tanggal_lahir_ayah : '-'}
                                    </div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-home"></i> Alamat Ayah
                                    </div>
                                    <div className="details-value">
                                        {this.props.ayah.alamat_ayah || '-'}
                                        {this.props.ayah.kecamatan && this.props.ayah.kabkot && this.props.ayah.provinsi && (
                                            <span className="text-muted d-block mt-1" style={{fontSize: '0.9rem'}}>
                                                <i className="fa fa-map-signs mr-1"></i>
                                                {this.props.ayah.kecamatan.kecam_nama + ', ' + this.props.ayah.kabkot.kab_nama + ', ' + this.props.ayah.provinsi.provinsi_nama}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-briefcase"></i> Pekerjaan
                                    </div>
                                    <div className="details-value">{this.props.ayah.pekerjaan?.nama || '-'}</div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-money"></i> Penghasilan
                                    </div>
                                    <div className="details-value text-emerald">
                                        {rupiah(this.props.ayah.penghasilan_ayah)} <small className="text-muted">/ bulan</small>
                                    </div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-plus-circle"></i> Sampingan
                                    </div>
                                    <div className="details-value text-secondary">
                                        {rupiah(this.props.ayah.sampingan_ayah)} <small className="text-muted">/ bulan</small>
                                    </div>
                                </div>
                                <div className="details-row">
                                    <div className="details-label">
                                        <i className="fa fa-file-text-o"></i>
                                        {this.props.ayah.pekerjaan_ayah !== '11' ? ' Bukti Penghasilan' : ' Surat Keterangan'}
                                    </div>
                                    <div className="details-value">
                                        {this.props.ayah.scan_slip_ayah ? (
                                            <a
                                                href={storage + '/' + this.props.ayah.scan_slip_ayah + '?t=' + new Date(this.props.ayah?.updated_at || 1).getTime()}
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
                                    <div className="details-value text-emerald">{this.props.ayah.telepon_ayah || '-'}</div>
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
    ayah: store.ayah.ayah,
}))(Ayah);
