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
            <Row className="align-items-center">
                <Col md={12}>
                    <div className="modern-details-list">
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-id-card"></i> Nomor Pelanggan
                            </div>
                            <div className="details-value">{this.props.listrik.no_pelanggan || '-'}</div>
                        </div>
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-info-circle"></i> Jenis Pemakaian
                            </div>
                            <div className="details-value">
                                <span className={`badge badge-pill ${this.props.listrik.jenis_pemakaian === 'Pra Bayar' ? 'badge-info' : 'badge-primary'} px-3 py-2`}>
                                    {this.props.listrik.jenis_pemakaian}
                                </span>
                            </div>
                        </div>
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-money"></i> Biaya Listrik
                            </div>
                            <div className="details-value text-emerald">
                                {rupiah(this.props.listrik.pengeluaran)} <small className="text-muted">/ 3 bln terakhir</small>
                            </div>
                        </div>
                        <div className="details-row">
                            <div className="details-label">
                                <i className="fa fa-file-text-o"></i> Bukti Tagihan
                            </div>
                            <div className="details-value">
                                {this.props.listrik.scan_listrik ? (
                                    <a href={storage + '/' + this.props.listrik.scan_listrik} target="_blank" rel="noopener noreferrer" className="btn details-btn-view">
                                        <i className="fa fa-eye mr-2"></i> Lihat Bukti Listrik
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
        listrik: store.listrik.listrik,
    })
)(Listrik);