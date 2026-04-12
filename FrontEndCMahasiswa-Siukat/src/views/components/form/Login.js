import React from 'react'
import { Form } from 'reactstrap'
import { captcha } from '../../../actions'
import { auth } from '../../../api'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { notif, setToken, cookies, cookieName, errLog } from '../../../global';

class FormLogin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            no_peserta: '',
            password: '',
            kode_captcha: '',
            jawaban: '',
            authCookie: null,
            tombolMasuk: 'Masuk',
            showPassword: false,
        }
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(captcha.fetchCaptcha())
        this.setState({ authCookie: cookies.get(cookieName) })
    }

    handleNomorPendaftaran(e) { this.setState({ no_peserta: e.target.value }) }
    handleTanggalLahir(e) { this.setState({ password: e.target.value }) }
    handleCaptcha(e) {
        this.setState({
            jawaban: e.target.value,
            kode_captcha: this.props.captcha.kode
        })
    }

    getStageName(code) {
        switch (Number(code)) {
            case 1: return 'SNBP';
            case 2: return 'SNBT';
            case 3: return 'MANDIRI';
            default: return 'Siukat';
        }
    }

    login = (e) => {
        e.preventDefault()
        this.setState({ tombolMasuk: 'Mohon Menunggu' })
        auth.login(this.state).then(res => {
            // Kirim data ke parent (Login.js) untuk divalidasi modalnya
            if (this.props.onLoginAttempt) {
                this.props.onLoginAttempt(res, false);
            } else {
                setToken(res.token);
                notif("Berhasil!", "Anda berhasil masuk", "success")
                this.setState({ authCookie: cookies.get(cookieName) })
            }
        }, (err) => {
            const errorMsg = errLog({ response: err });
            // Jika status 403 (Forbidden) dan ada data info jalur
            if (err && err.status === 403 && err.data && err.data.info && this.props.onLoginAttempt) {
                this.props.onLoginAttempt(err.data, true);
            } else {
                notif("Gagal Masuk!", errorMsg || "Periksa kembali data Anda", "error")
            }
        }).finally(() => {
            this.setState({ tombolMasuk: 'Masuk' })
        })
    }

    // Helper untuk warna badge status (pindah ke CSS Luxury)
    getBadgeClass(stage) {
        const s = stage?.toLowerCase() || '';
        if (s.includes('snbp')) return 'lux-badge-snbp';
        if (s.includes('snbt')) return 'lux-badge-snbt';
        if (s.includes('mandiri')) return 'lux-badge-mandiri';
        return 'lux-badge-soft';
    }

    render() {
        const flag = this.props.cmahasiswa.flag
        // Jika token valid (ada dan bukan string "undefined"/"null"), baru redirect ke dashboard
        if (this.state.authCookie && this.state.authCookie !== 'undefined' && this.state.authCookie !== 'null') {
            const to = ['terima_ukt', 'pengumuman', 'sanggah_ukt', 'pengisian', 'selesai_sanggah', 'selesai_isi', 'tunggu_pengumuman'].includes(flag) 
                ? '/main/ukt' : '/main';
            return <Redirect to={to} />
        }

        const online = this.props.captcha.pertanyaan !== undefined;
        const stage_detail = this.props.stage;
        const open_login = this.props.open_login;

        return (
            <Form onSubmit={this.login} className="lux-login-form">
                
                <div className="lux-form-body">

                    {/* Field Nomor Peserta */}
                    <div className="lux-input-group">
                        <div className="lux-label-row">
                            <label className="lux-label">Nomor Peserta</label>
                        </div>
                        <input 
                            type="text" 
                            className="lux-input"
                            placeholder="Masukkan nomor pendaftaran"
                            onChange={this.handleNomorPendaftaran.bind(this)}
                            disabled={!online}
                            required
                        />
                    </div>

                    {/* Field Tanggal Lahir */}
                    <div className="lux-input-group">
                        <label className="lux-label px-1">Tanggal Lahir</label>
                        <div className="lux-password-wrapper">
                            <input 
                                type={this.state.showPassword ? "text" : "password"} 
                                className="lux-input"
                                placeholder="ddmmyyyy"
                                onChange={this.handleTanggalLahir.bind(this)}
                                disabled={!online}
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => this.setState({ showPassword: !this.state.showPassword })}
                                className="lux-password-toggle"
                            >
                                <i className={`fa ${this.state.showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                        <p className="text-white small italic px-1 mt-1" style={{ opacity: 0.6, fontSize: '10px' }}>Contoh: 17081945</p>
                    </div>

                    {/* Captcha Section */}
                    <div className="lux-captcha-box">
                        <div className="lux-captcha-header">
                            <span className="lux-captcha-text">Verifikasi Keamanan</span>
                            <div className="lux-captcha-q-row">
                                <span className="lux-captcha-q-label">Hitung:</span>
                                <span className="lux-captcha-q-badge">
                                    {online ? this.props.captcha.pertanyaan : '...'}
                                </span>
                            </div>
                        </div>
                        <input 
                            type="text" 
                            className="lux-input text-center font-weight-bold"
                            placeholder="Jawaban"
                            onChange={this.handleCaptcha.bind(this)}
                            disabled={!online}
                            required
                        />
                    </div>
                </div>

                {/* Tombol Masuk */}
                <div className="mt-4">
                    {open_login ? (
                        <button 
                            type="submit" 
                            disabled={!online}
                            className="lux-btn-submit"
                        >
                            <span>{this.state.tombolMasuk}</span>
                            <i className="fa fa-sign-in"></i>
                        </button>
                    ) : (
                        <div className="bg-danger text-white text-center p-3 rounded-lg font-weight-bold small shadow-sm">
                            PENGISIAN DATA BELUM DIBUKA
                        </div>
                    )}
                    
                    <div className="text-center mt-3">
                         <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px' }}>SIUKAT UNJ</span>
                    </div>
                </div>
            </Form>
        )
    }
}

export default connect((store) => ({
    captcha: store.captcha.captcha,
    cmahasiswa: store.cmahasiswa.cmahasiswa,
}))(FormLogin)
