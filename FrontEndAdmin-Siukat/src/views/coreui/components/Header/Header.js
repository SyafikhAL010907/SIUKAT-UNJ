import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { user } from '../../../../actions';
import { notif, cookies, cookieName, removeToken } from '../../../../global';


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { isMobileMenuOpen: false };
  }

  componentDidMount() {
    const token = cookies.get(cookieName);
    if (token) {
      this.props.dispatch(user.getByLoggedIn(token));
    }
  }

  toggleSidebar = (e, type) => {
    if (e) e.preventDefault();
    const classes = {
      mobile: 'sidebar-mobile-show',
      hidden: 'sidebar-hidden',
      minimize: 'sidebar-minimized'
    };
    if (document.body) document.body.classList.toggle(classes[type]);
  };

  logout = (e) => {
    if (e) e.preventDefault();
    
    // Gunakan helper removeToken agar menghapus di Cookie & SessionStorage
    removeToken();
    
    notif("Berhasil!", "Anda berhasil keluar", "success");
    
    // Paksa redirect ke halaman login utama
    setTimeout(() => {
        window.location.href = "/";
    }, 500); // Kasih jeda dikit biar notif kelihatan
  };

  render() {
    const token = cookies.get(cookieName);
    if (!token) return <Redirect to="/" />;

    const userData = this.props.user || {};
    const nama_lengkap = userData.nama_lengkap || 'Administrator';

    return (
      <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 md:px-8">
          
          {/* SISI KIRI: BRANDING & TOGGLER */}
          <div className="flex items-center gap-5">
            <button 
              onClick={(e) => this.toggleSidebar(e, 'mobile')}
              className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-green-50 hover:text-green-600 lg:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white p-1.5 shadow-sm border border-gray-100">
                <img src="/unj.png" alt="Logo UNJ" className="h-full w-auto object-contain" />
              </div>
              
              <div className="flex flex-col leading-tight">

                <span className="text-xl font-black italic tracking-tighter text-gray-800 uppercase">
                  SIUKAT <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">ADMIN</span>
                </span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase">Universitas Negeri Jakarta</span>
              </div>
            </div>

            <button 
              onClick={(e) => this.toggleSidebar(e, 'hidden')}
              className="ml-2 hidden rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-green-600 md:block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>
          </div>

          {/* SISI KANAN: USER PROFILE & ACTIONS */}
          <div className="flex items-center gap-4">
            
            {/* USER PROFILE BOX */}
            <div className="flex items-center gap-3 rounded-2xl bg-gray-50/50 p-1.5 pr-4 border border-gray-100 transition-all hover:bg-gray-50">
              <div className="relative">
                <div className="h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-0.5 shadow-md">
                  <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white text-green-600 font-black text-sm uppercase">
                    {nama_lengkap.charAt(0)}
                  </div>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-green-600/70">Authenticated User</span>
                <span className="text-xs font-bold text-gray-800 line-clamp-1 truncate max-w-[120px]">
                  {nama_lengkap}
                </span>
              </div>
            </div>

            {/* SEPARATOR */}
            <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>

            {/* LOGOUT */}
            <button 
              onClick={this.logout}
              className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-red-100 text-red-500 transition-all hover:bg-red-500 hover:text-red-500 hover:shadow-lg hover:shadow-red-200 active:scale-95"
              title="Keluar Aplikasi"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

        </div>
      </header>
    );
  }
}

export default withRouter(connect((store) => ({
  user: store.user.user
}))(Header));