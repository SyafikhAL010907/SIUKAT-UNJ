import React from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { ukt } from '../../../actions';
import { rupiah, cookies, cookieName } from '../../../global';

class TabelUkt extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(ukt.getByLoggedIn(cookies.get(cookieName)));
    }

    renderUkt() {
        if (this.props.ukt !== undefined) {
            var uktObj = {}; // Saya ganti nama variabel lokal agar tidak bentrok dengan props
            uktObj.I = this.props.ukt.I;
            uktObj.II = this.props.ukt.II;
            uktObj.III = this.props.ukt.III;
            uktObj.IV = this.props.ukt.IV;
            uktObj.V = this.props.ukt.V;
            uktObj.VI = this.props.ukt.VI;
            uktObj.VII = this.props.ukt.VII;
            uktObj.VIII = this.props.ukt.VIII;
            return Object.entries(uktObj).map((data, key) =>
                data[1] === 0 ? null : (
                    <tr key={key}>
                        <td className="font-weight-bold text-emerald" style={{ fontSize: '1.1rem' }}>{data[0]}</td>
                        <td className="font-weight-bold text-emerald" style={{ fontSize: '1.2rem', letterSpacing: '0.5px' }}>{rupiah(data[1])}</td>
                    </tr>
                )
            );
        }
    }

    render() {
        return (
            <div className="p-1">
                <div className="welcome-info-card text-center mb-4 shadow-sm border-0 d-flex align-items-center justify-content-center" style={{ minHeight: '80px', background: '#f0fdf4' }}>
                    <p className="mb-0 font-weight-bold text-emerald" style={{ fontSize: '1.1rem' }}>
                        <i className="fa fa-info-circle mr-2"></i>
                        Uang Kuliah Tunggal (UKT) adalah biaya pendidikan per semester.
                    </p>
                </div>

                <div className="px-md-4">
                    {/* BUNGKUS DI SINI UNTUK RESPONSIVE */}
                    <div className="table-responsive-wrapper">
                        <table className="premium-table-modern text-center w-100">
                            <thead>
                                <tr>
                                    <th className="text-center">Kelompok UKT</th>
                                    <th className="text-center">Besar UKT</th>
                                </tr>
                            </thead>
                            <tbody>{this.renderUkt()}</tbody>
                        </table>
                    </div>
                </div>

                <div className="modern-alert-danger shadow-sm mt-4 border-0" style={{ background: '#fef2f2', borderRadius: '16px', padding: '20px' }}>
                    <h6 className="font-weight-bold mb-3 d-flex align-items-center">
                        <i className="fa fa-exclamation-circle mr-2" style={{ color: '#ef4444' }}></i>
                        Ketentuan Kelompok UKT
                    </h6>
                    <ul className="mb-0" style={{ paddingLeft: '20px', fontSize: '0.95rem' }}>
                        <li className="mb-2">
                            Kelompok 1 hanya diperuntukkan bagi <b>keluarga sangat miskin</b>,
                            dan mendapatkan subsidi dana dari kelompok lainnya.
                        </li>
                        <li>
                            Kelompok 2 hanya diperuntukkan bagi <b>keluarga miskin</b>, dan
                            mendapatkan subsidi dana dari kelompok lainnya.
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default connect((store) => {
    return {
        ukt: store.ukt.ukt,
    };
})(withCookies(TabelUkt));