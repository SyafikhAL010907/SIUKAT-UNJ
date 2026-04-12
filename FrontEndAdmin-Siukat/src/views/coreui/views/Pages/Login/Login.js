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
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        {/* Main Wrapper */}
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[500px]">
          
          {/* Card Kiri: Branding */}
          <div className="md:w-5/12 bg-[#006d32] p-8 flex flex-col justify-center items-center text-center text-white relative">
            {/* Dekorasi Aksen Kuning Atas */}
            <div className="absolute top-0 left-0 w-full h-2 bg-[#ffcc00]"></div>
            
            <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
              <img src={logoUnj} alt="logo-unj" className="w-32 md:w-40 drop-shadow-xl" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-widest">ADMINISTRATOR</h2>
              <div className="h-1 w-12 bg-[#ffcc00] mx-auto rounded-full"></div>
              <p className="text-sm font-light opacity-90 leading-relaxed px-4">
                Sistem Informasi Uang Kuliah Tunggal<br />
                <span className="font-semibold text-[#ffcc00]">Universitas Negeri Jakarta</span>
              </p>
            </div>

            <div className="mt-12 text-[10px] opacity-50 font-mono italic">
              &copy; {new Date().getFullYear()} Admisi UNJ. All rights reserved.
            </div>
          </div>

         {/* Card Kanan: Form */}
          <div className="flex-1 p-8 md:p-14 flex flex-col justify-center bg-white">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Portal Masuk</h1>
              <p className="text-gray-400 text-sm mt-2 font-medium italic">Masukkan identitas admin Anda</p>
            </div>

            {/* Form dibuat w-full untuk memastikan memenuhi ruang card */}
            <form onSubmit={this.login.bind(this)} className="w-full space-y-7">
              
              {/* Username Input */}
              <div className="relative group w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#006d32] transition-colors">
                  <i className="fa fa-user text-base"></i>
                </div>
                <input 
                  type="text" 
                  autoFocus
                  className="block w-full pl-12 pr-4 py-4 border-b-2 border-gray-100 focus:border-[#006d32] outline-none transition-all placeholder-gray-300 bg-gray-50/50 rounded-t-xl text-gray-700"
                  placeholder="Nama Pengguna"
                  onChange={this.handleNamaPengguna.bind(this)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative group w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#006d32] transition-colors">
                  <i className="fa fa-lock text-base"></i>
                </div>
                <input 
                  type="password" 
                  className="block w-full pl-12 pr-4 py-4 border-b-2 border-gray-100 focus:border-[#006d32] outline-none transition-all placeholder-gray-300 bg-gray-50/50 rounded-t-xl text-gray-700"
                  placeholder="Kata Sandi"
                  onChange={this.handleKataSandi.bind(this)}
                  required
                />
              </div>

              {/* Captcha Section - Minimalis & Full Width */}
              <div className="pt-2 w-full">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 flex items-center">
                    <i className="fa fa-shield-alt mr-2 text-amber-500 text-xs"></i> Keamanan
                  </span>
                  <div className="text-[11px] font-bold text-gray-500 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100 shadow-sm">
                    Berapakah <span className="text-[#006d32] text-sm mx-1">{this.props.captcha.pertanyaan}</span> ?
                  </div>
                </div>
                
                <div className="relative group w-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#006d32] transition-colors">
                    <i className="fa fa-key text-base"></i>
                  </div>
                  <input 
                    type="text" 
                    className="block w-full pl-12 pr-4 py-4 border-b-2 border-gray-100 focus:border-[#006d32] outline-none transition-all placeholder-gray-300 bg-gray-50/50 rounded-t-xl font-bold text-[#006d32] tracking-widest text-center md:text-left"
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
                  className="w-full bg-[#006d32] hover:bg-[#005226] text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-[#006d32]/40 active:scale-[0.97] transition-all flex items-center justify-center space-x-3 overflow-hidden relative group"
                >
                  <span className="relative z-10 tracking-widest uppercase text-xs">{this.state.tombolMasuk}</span>
                  {this.state.tombolMasuk === 'Masuk' && (
                    <i className="fa fa-arrow-right text-xs group-hover:translate-x-2 transition-transform relative z-10"></i>
                  )}
                  {/* Shine Animation Effect */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                </button>
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