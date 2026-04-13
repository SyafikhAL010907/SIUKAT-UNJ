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
                    <div className="col-md-6 mb-3">
                        <div className="p-4 rounded-lg h-100" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <div className="d-flex align-items-center mb-2">
                                <div className="p-2 rounded bg-white shadow-sm mr-3" style={{ color: '#0f6d3f' }}>
                                    <i className="fa fa-map-marker" style={{ fontSize: '1.5rem', width: '25px', textAlign: 'center' }}></i>
                                </div>
                                <div className="font-weight-bold text-muted small text-uppercase">Tempat Pelaksanaan</div>
                            </div>
                            <div className="pl-5 ml-2 font-weight-bold color-emerald" style={{ fontSize: '1.1rem' }}>
                                {this.props.info.klarifikasi_lokasi}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="p-4 rounded-lg h-100" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <div className="d-flex align-items-center mb-2">
                                <div className="p-2 rounded bg-white shadow-sm mr-3" style={{ color: '#0f6d3f' }}>
                                    <i className="fa fa-calendar" style={{ fontSize: '1.4rem', width: '25px', textAlign: 'center' }}></i>
                                </div>
                                <div className="font-weight-bold text-muted small text-uppercase">Waktu & Tanggal</div>
                            </div>
                            <div className="pl-5 ml-2 font-weight-bold color-emerald" style={{ fontSize: '1.1rem' }}>
                                {this.props.info.klarifikasi_tanggal}
                            </div>
                            <div className="pl-5 ml-2 text-muted small mt-1 italic">
                                Sesi: 09.00 - 15.30 WIB
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-light-yellow p-3 px-4 rounded-lg mt-3 border" style={{ borderColor: '#fef3c7', background: '#fffbeb' }}>
                    <h6 className="font-weight-bold mb-2" style={{ color: '#92400e' }}>
                        <i className="fa fa-info-circle mr-2"></i>Catatan Penting:
                    </h6>
                    <ul className="list-reset mb-0" style={{ color: '#92400e', fontSize: '0.9rem' }}>
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