import React from 'react';
import { connect } from 'react-redux';
import { info } from '../../actions';

class Bantuan extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(info.fetchInfo());
    }
    render() {
        return (
            <div className="premium-card shadow-sm border-0 p-0 overflow-hidden">
                <div className="bg-emerald-soft p-3 text-white font-weight-bold d-flex align-items-center">
                    <i className="fa fa-phone-square mr-2"></i> Pusat Bantuan
                </div>
                <div className="p-4 bg-white">
                    <div className="mb-3 d-flex align-items-center">
                        <div className="bg-light rounded-circle p-2 mr-3 text-primary shadow-sm" style={{width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="fa fa-envelope-o"></i>
                        </div>
                        <a href="-" className="text-dark font-weight-bold" style={{fontSize: '0.9rem'}}>-</a>
                    </div>
                    <div className="mb-3 d-flex align-items-center">
                        <div className="bg-light rounded-circle p-2 mr-3 text-info shadow-sm" style={{width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="fa fa-telegram"></i>
                        </div>
                        <a href={this.props.info.kontak} target="_blank" rel="noopener noreferrer" className="text-dark font-weight-bold" style={{fontSize: '0.9rem'}}>
                            -
                        </a>
                    </div>
                    <div className="mb-3 d-flex align-items-center">
                        <div className="bg-light rounded-circle p-2 mr-3 text-danger shadow-sm" style={{width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="fa fa-instagram"></i>
                        </div>
                        <a href={this.props.info.instagram} target="_blank" rel="noopener noreferrer" className="text-dark font-weight-bold" style={{fontSize: '0.9rem'}}>
                            -
                        </a>
                    </div>
                    <div className="mt-4 pt-3 border-top d-flex align-items-center">
                        <div className="bg-emerald-soft rounded-circle p-2 mr-3 text-white shadow-sm" style={{width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="fa fa-phone"></i>
                        </div>
                        <div>
                            <div className="text-dark font-weight-bold" style={{fontSize: '1rem'}}>-</div>
                            <div className="text-muted small">-</div>
                        </div>
                    </div>
                </div>
            </div>  
        );
    }
}

export default connect((store) => {
    return {
        info: store.info.info,
    };
})(Bantuan);
