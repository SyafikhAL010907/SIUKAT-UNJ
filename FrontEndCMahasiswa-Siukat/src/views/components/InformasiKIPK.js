import React from 'react';
import { Card, Row, Col } from 'reactstrap';

class InformasiKIPK extends React.Component {
    render() {
        return (
            <div className="glass-notice-card p-4 mb-4 animate-fade-in"
                 style={{ borderLeft: '6px solid #0ea5e9' }}>
                <Row className="align-items-center">
                    <Col md={2} xs={12} className="text-center mb-3 mb-md-0">
                        <div className="p-4 rounded-circle bg-white shadow-sm d-inline-block text-info"
                             style={{ border: '1px solid #0ea5e940' }}>
                            <i className={`${this.props.icon} fa-2x`}></i>
                        </div>
                    </Col>
                    <Col md={10} xs={12} className="pl-md-4">
                        <div className="text-muted small text-uppercase font-weight-bold mb-1" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>
                            Pusat Informasi KIPK
                        </div>
                        <h4 className="font-weight-bold mb-2" style={{ color: '#1e293b', letterSpacing: '-0.5px' }}>{this.props.content}</h4>
                        <div className="text-muted mb-3" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
                            {this.props.message}
                        </div>
                        <a className="btn btn-premium-action px-4 py-2" href="/VerKIPK.pdf" target="_blank" rel="noopener noreferrer" style={{ borderRadius: '50px', fontSize: '0.9rem' }}>
                            <i className="fa fa-file-pdf-o mr-2"></i> Unduh Dokumen Pendukung KIPK
                        </a>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default InformasiKIPK;