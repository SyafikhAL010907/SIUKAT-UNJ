import React from 'react';
import { connect } from 'react-redux';
import { info } from '../../actions';

class JadwalKlarifikasi extends React.Component {
    UNSAFE_componentWillMount() {
        const kode = this.props.cmahasiswa?.jalur_cmahasiswa;
        this.props.dispatch(info.fetchInfo(kode));
    }
    render() {
        if (!this.props.info || !this.props.info.kode) {
            return null;
        }
        return (
            <div className="mt-2">
                <div className="row">
                    <div className="col-12 col-lg-6 mb-3">
                        <div className="p-2 p-sm-4 rounded-xl h-100 shadow-sm" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-center mb-3 text-center text-sm-left">
                                <div className="p-2 rounded-lg bg-white shadow-sm mb-2 mb-sm-0 mr-sm-3" style={{ color: '#0f6d3f' }}>
                                    <i className="fa fa-map-marker" style={{ fontSize: '1.4rem', width: '25px', textAlign: 'center' }}></i>
                                </div>
                                <div className="font-weight-bold text-muted text-[10px] sm:text-xs text-uppercase" style={{ letterSpacing: '0.5px' }}>Tempat Pelaksanaan</div>
                            </div>
                            <div className="px-2 px-sm-0 pl-sm-5 ml-sm-2 font-weight-bold color-emerald text-sm sm:text-base md:text-lg text-center text-sm-left">
                                {this.props.info.klarifikasi_lokasi}
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 mb-3">
                        <div className="p-2 p-sm-4 rounded-xl h-100 shadow-sm" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-center mb-3 text-center text-sm-left">
                                <div className="p-2 rounded-lg bg-white shadow-sm mb-2 mb-sm-0 mr-sm-3" style={{ color: '#0f6d3f' }}>
                                    <i className="fa fa-calendar" style={{ fontSize: '1.2rem', width: '25px', textAlign: 'center' }}></i>
                                </div>
                                <div className="font-weight-bold text-muted text-[10px] sm:text-xs text-uppercase" style={{ letterSpacing: '0.5px' }}>Waktu & Tanggal</div>
                            </div>
                            <div className="px-2 px-sm-0 pl-sm-5 ml-sm-2 font-weight-bold color-emerald text-sm sm:text-base md:text-lg text-center text-sm-left">
                                {this.props.info.klarifikasi_tanggal}
                            </div>
                            <div className="px-2 px-sm-0 pl-sm-5 ml-sm-2 text-muted text-[11px] sm:text-xs mt-1 italic text-center text-sm-left">
                                Sesi: 09.00 - 15.30 WIB
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-light-yellow p-3 px-3 px-sm-4 rounded-xl mt-3 border shadow-sm" style={{ borderColor: '#fef3c7', background: '#fffbeb' }}>
                    <h6 className="font-weight-bold mb-2 text-xs sm:text-sm" style={{ color: '#92400e' }}>
                        <i className="fa fa-info-circle mr-2"></i>Catatan Penting:
                    </h6>
                    <ul className="list-reset mb-0" style={{ color: '#92400e', fontSize: '0.85rem', paddingLeft: '1.2rem' }}>
                        <li className="mb-1">• Setelah wawancara, Anda akan mendapat hasil UKT baru yang bersifat final.</li>
                        <li>• Silakan lakukan pembayaran sesuai jadwal yang ditetapkan panitia.</li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default connect((store) => {
    return {
        info: store.info.info,
        cmahasiswa: store.cmahasiswa.cmahasiswa,
    };
})(JadwalKlarifikasi);