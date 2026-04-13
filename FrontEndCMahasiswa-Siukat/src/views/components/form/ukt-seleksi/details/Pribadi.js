import React from 'react';
import { Row, Col, Table } from 'reactstrap';
import { connect } from 'react-redux';
import { cmahasiswa } from '../../../../../actions';
import { cookies, cookieName, rupiah, storage } from '../../../../../global';

class Pribadi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
    }
    render() {
        return (
            <Row className="align-items-center">
                <Col md={3} className="text-center mb-4 mb-md-0">
                    {this.props.cmahasiswa.foto_cmahasiswa && (
                        <div className="position-relative d-inline-block">
                            <img 
                                src={`${storage}/${this.props.cmahasiswa.foto_cmahasiswa}?t=${new Date(this.props.cmahasiswa.updated_at || Date.now()).getTime()}`} 
                                className="details-image-preview shadow-lg" 
                                alt="foto-cmahasiswa" 
                                style={{ width: '180px', height: '240px', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                </Col>
                <Col md={9}>
                    <div className="modern-details-list">
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-user"></i> Nama Lengkap
                            </div>
                            <div className="details-value">{this.props.cmahasiswa.nama_cmahasiswa}</div>
                        </div>
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-venus-mars"></i> Jenis Kelamin
                            </div>
                            <div className="details-value">{this.props.cmahasiswa.gender_cmahasiswa}</div>
                        </div>
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-map-marker"></i> Tempat, Tgl Lahir
                            </div>
                            <div className="details-value">
                                {this.props.cmahasiswa.tempat_lahir_cmahasiswa && this.props.cmahasiswa.tempat_lahir_cmahasiswa + ', '} 
                                {this.props.cmahasiswa.tanggal_lahir_cmahasiswa && !this.props.cmahasiswa.tanggal_lahir_cmahasiswa.includes('0001') ? 
                                    this.props.cmahasiswa.tanggal_lahir_cmahasiswa : '-'}
                            </div>
                        </div>
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-home"></i> Alamat Domisili
                            </div>
                            <div className="details-value">
                                {this.props.cmahasiswa.alamat_cmahasiswa || '-'}
                                {this.props.cmahasiswa.kecamatan && this.props.cmahasiswa.kabkot && this.props.cmahasiswa.provinsi && (
                                    <span className="text-muted d-block mt-1" style={{fontSize: '0.9rem'}}>
                                        <i className="fa fa-map-signs mr-1"></i>
                                        {this.props.cmahasiswa.kecamatan.kecam_nama + ', ' + this.props.cmahasiswa.kabkot.kab_nama + ', ' + this.props.cmahasiswa.provinsi.provinsi_nama}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-phone"></i> Nomor Telepon
                            </div>
                            <div className="details-value text-emerald">{this.props.cmahasiswa.telepon_cmahasiswa}</div>
                        </div>
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-tint"></i> Golongan Darah
                            </div>
                            <div className="details-value">
                                <span className="badge badge-pill badge-danger px-3 py-2">{this.props.cmahasiswa.goldar_cmahasiswa || '-'}</span>
                            </div>
                        </div>
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-money"></i> Penghasilan Sendiri
                            </div>
                            <div className="details-value">
                                <span className="text-emerald font-weight-bold">{rupiah(this.props.cmahasiswa.penghasilan_cmahasiswa)}</span>
                                <small className="text-muted ml-1">/ bulan</small>
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
        cmahasiswa: store.cmahasiswa.cmahasiswa,
    })
)(Pribadi);