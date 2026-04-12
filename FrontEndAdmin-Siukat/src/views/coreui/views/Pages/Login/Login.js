import React, { Component } from "react";
import logoUnj from "../../../../dist/images/unj.png";
import { captcha } from '../../../../../actions';
import { user } from '../../../../../api';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { notif, cookies, cookieName, getToken, setToken } from '../../../../../global';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      no_peserta: '',
      password: '',
      kode_captcha: '',
      jawaban: '',
      authCookie: null,
      tombolMasuk: 'Masuk',
    };
  }

  componentWillMount() {
    this.props.dispatch(captcha.fetchCaptcha());
    this.setState({
      authCookie: getToken()
    });
  }

  handleNamaPengguna(e) { this.setState({ no_peserta: e.target.value }); }
  handleKataSandi(e) { this.setState({ password: e.target.value }); }
  handleCaptcha(e) {
    this.setState({
      jawaban: e.target.value,
      kode_captcha: this.props.captcha.kode
    });
  }

  login(e) {
    e.preventDefault();
    this.setState({ tombolMasuk: 'Mohon Menunggu...' });
    user.login(this.state).then(res => {
      setToken(res.token);
      notif("Berhasil!", "Anda berhasil masuk", "success");
      this.setState({ authCookie: getToken() });
    }, (err) => {
      notif("Gagal!", "Periksa kembali data Anda", "error");
      this.setState({ tombolMasuk: 'Masuk' });
    });
  }

  render() {
    // Jika token valid (ada dan bukan string "undefined"/"null"), baru redirect ke dashboard
    if (this.state.authCookie && this.state.authCookie !== 'undefined' && this.state.authCookie !== 'null') {
      return <Redirect to='/admin/dashboard' />;
    }

    return (
      <div
        className="min-h-screen flex items-center justify-center p-6 font-sans"
        /* PENGATURAN WARNA BACKGROUND UTAMA (LUAR) */
        style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #f0fdf4 50%, #ffffff 100%)' }}
      >
        {/* Main Wrapper */}
        <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px] relative z-10 border border-emerald-100">

          {/* Card Kiri: Branding */}
          <div
            className="md:w-[42%] p-12 flex flex-col justify-between items-center text-center text-white relative"
            style={{ backgroundColor: '#059669', backgroundImage: 'none' }}
          >
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <div className="mb-8 p-6 bg-white/10 rounded-2xl border border-white/20 select-none backdrop-blur-sm">
                <img src={logoUnj} alt="logo-unj" className="w-28 md:w-36" />
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-normal leading-none uppercase italic">
                  Administrator
                </h2>
                <div className="flex justify-center">
                  <div className="h-1.5 w-16 bg-white rounded-full"></div>
                </div>
                <p className="text-sm font-bold opacity-90 leading-relaxed px-4 tracking-wide uppercase">
                  Sistem Informasi <span className="text-white">UKT</span><br />
                  <span className="text-xs opacity-70">Universitas Negeri Jakarta</span>
                </p>
              </div>
            </div>
            <div className="relative z-10 mt-8 text-[10px] font-black uppercase tracking-[0.3em] opacity-60 italic text-white/80">
              &copy; {new Date().getFullYear()} Admisi UNJ
            </div>
          </div>

          {/* Card Kanan: Form */}
          <div className="flex-1 p-10 md:p-16 flex flex-col justify-center bg-white relative">
            <div className="mb-10">
              <span className="inline-block px-4 py-1.5 bg-emerald-50 text-[#059669] text-[10px] font-black uppercase tracking-widest rounded-full mb-4 border border-emerald-100">
                Secure Authentication
              </span>
              <h1 className="text-4xl font-black text-[#004d23] tracking-tight leading-none">
                Selamat Datang<span className="text-emerald-500">.</span>
              </h1>
              <p className="text-emerald-800/40 text-sm mt-3 font-bold uppercase tracking-wider italic">
                Masuk untuk mengelola Dashboard
              </p>
            </div>

            {/* Form Container dengan Vertical Stack yang Jelas */}
            <form onSubmit={this.login.bind(this)} className="flex flex-col space-y-7">

              {/* Username Input Group */}
              <div className="flex flex-col space-y-2">
                <label className="text-[11px] font-black text-[#004d23]/50 uppercase tracking-[0.2em] ml-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 w-[75px] flex items-center justify-center text-[#059669] z-20">
                    <i className="fa fa-user text-xl"></i>
                  </div>
                  <input
                    type="text"
                    autoFocus
                    className="w-full py-5 text-center bg-gray-50 border-2 border-gray-100 focus:border-[#059669] focus:bg-white outline-none transition-all rounded-2xl text-emerald-950 font-bold placeholder:text-gray-400/60 shadow-sm"
                    style={{ paddingRight: '75px', paddingLeft: '75px' }}
                    placeholder="ID Admin Anda"
                    onChange={this.handleNamaPengguna.bind(this)}
                    required
                  />
                </div>
              </div>

              {/* Password Input Group */}
              <div className="flex flex-col space-y-2">
                <label className="text-[11px] font-black text-[#004d23]/50 uppercase tracking-[0.2em] ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 w-[75px] flex items-center justify-center text-[#059669] z-20">
                    <i className="fa fa-lock text-xl"></i>
                  </div>
                  <input
                    type="password"
                    className="w-full py-5 text-center bg-gray-50 border-2 border-gray-100 focus:border-[#059669] focus:bg-white outline-none transition-all rounded-2xl text-emerald-950 font-bold placeholder:text-gray-400/60 shadow-sm"
                    style={{ paddingRight: '75px', paddingLeft: '75px' }}
                    placeholder="••••••••"
                    onChange={this.handleKataSandi.bind(this)}
                    required
                  />
                </div>
              </div>

              {/* Captcha Section */}
              <div className="flex flex-col space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#004d23]/50 flex items-center">
                    <i className="fa fa-shield mr-2 text-[#059669]"></i> Verification
                  </span>
                  <div
                    className="text-[13px] font-black text-white px-5 py-2.5 rounded-full shadow-lg flex items-center justify-center gap-2 min-w-[180px]"
                    style={{ backgroundColor: '#059669' }}
                  >
                    <span>Berapakah</span>
                    <span className="px-3 py-1 bg-white text-[#059669] rounded-lg text-sm">{this.props.captcha.pertanyaan}</span>
                    <span>?</span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 w-[75px] flex items-center justify-center text-[#059669] z-20">
                    <i className="fa fa-keyboard-o text-xl"></i>
                  </div>
                  <input
                    type="text"
                    className="w-full py-5 text-center bg-gray-50 border-2 border-gray-100 focus:border-[#059669] focus:bg-white outline-none transition-all rounded-2xl font-black text-[#059669] tracking-[0.5em] placeholder:tracking-normal placeholder:font-bold placeholder:text-gray-400/60 shadow-sm"
                    style={{ paddingRight: '75px', paddingLeft: '75px' }}
                    placeholder="Jawaban"
                    onChange={this.handleCaptcha.bind(this)}
                    required
                  />
                  <input type="hidden" defaultValue={this.props.captcha.kode} />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  style={{ backgroundColor: '#059669', backgroundImage: 'none', border: 'none' }}
                  className="w-full text-white font-black py-5 px-10 rounded-2xl shadow-xl hover:bg-[#004d23] active:scale-[0.97] transition-all flex items-center justify-center space-x-4 relative group"
                >
                  <span className="relative z-10 tracking-[0.2em] uppercase text-[12px]">{this.state.tombolMasuk}</span>
                  {this.state.tombolMasuk === 'Masuk' && (
                    <i className="fa fa-sign-in text-lg group-hover:translate-x-1.5 transition-transform duration-300 relative z-10"></i>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-[10px] font-bold text-[#004d23]/30 uppercase tracking-widest italic">
                  Protected by secure endpoint encryption
                </p>
              </div>
            </form>
          </div>

        </div>
      </div>

    );
  }
}

export default connect((store) => ({
  captcha: store.captcha.captcha,
}))(Login);