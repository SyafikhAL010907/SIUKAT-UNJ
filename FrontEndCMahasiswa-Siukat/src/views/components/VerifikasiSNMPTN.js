import React from 'react';
import { Card, Row, Col } from 'reactstrap';

class VerifikasiSNMPTN extends React.Component {
    render() {
        const statusColor = this.props.color === 'success' ? '#10b981' : this.props.color === 'warning' ? '#f59e0b' : '#ef4444';
        
        return (
            <div className={`glass-notice-card p-4 mb-4 animate-fade-in`} 
                 style={{ borderLeft: `6px solid ${statusColor}` }}>
                <Row className="align-items-center">
                    <Col md={2} xs={12} className="text-center mb-3 mb-md-0">
                        <div className={`p-3 p-md-4 rounded-circle bg-white shadow-sm d-inline-block text-${this.props.color || 'primary'}`}
                             style={{ border: `1px solid ${statusColor}40` }}>
                            <i className={`${this.props.icon} fa-lg fa-md-2x`}></i>
                        </div>
                    </Col>
                    <Col md={10} xs={12} className="pl-md-4 text-center text-md-left">
                        <div className="text-muted text-[10px] sm:text-xs text-uppercase font-weight-bold mb-1" style={{ letterSpacing: '1px' }}>
                            Update Informasi Verifikasi
                        </div>
                        <h5 className="font-weight-bold mb-1 text-sm sm:text-lg md:text-xl" style={{ color: '#1e293b', letterSpacing: '-0.5px' }}>{this.props.content}</h5>
                        <p className="mb-0 text-muted text-xs sm:text-sm md:text-base" style={{ lineHeight: '1.6' }}>{this.props.message}</p>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default VerifikasiSNMPTN;