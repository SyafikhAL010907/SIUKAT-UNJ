import React from 'react';
import { NavLink } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { notif, removeToken, baseUrl, storage } from '../../global';

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.state = {
            listNav: [
                {
                    href: '/main',
                    icon: 'fa fa-home',
                    title: 'Informasi',
                },
                {
                    href: '/main/petunjuk',
                    icon: 'fa fa-book',
                    title: 'Petunjuk Khusus',
                },
                {
                    href: '/main/ukt',
                    icon: 'fa fa-file-text',
                    title: 'UKT',
                },
            ],
        };
    }

    logout(e) {
        e.preventDefault();
        removeToken();
        if (this.props.router && this.props.router.history) {
            this.props.router.history.push('/');
        } else {
            window.location.href = '/';
        }
        notif('Berhasil!', 'Anda berhasil keluar', 'success');
    }

    render() {
        const { collapsed, openMobile, toggleMobile, studentData } = this.props;
        const student = studentData || {};
        
        /* const photoUrl = student.foto_cmahasiswa 
            ? (student.foto_cmahasiswa.startsWith('http') ? student.foto_cmahasiswa : storage + '/' + student.foto_cmahasiswa + '?t=' + new Date(student?.updated_at || 1).getTime())
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(student.nama_cmahasiswa || 'User')}&background=0f6d3f&color=fff`; */

        return (
            <React.Fragment>
                {/* Mobile Overlay */}
                <div 
                    className={`sidebar-overlay ${openMobile ? 'open' : ''}`} 
                    onClick={toggleMobile}
                />

                <aside className={`sidebar-container ${collapsed ? 'collapsed' : ''} ${openMobile ? 'open-mobile' : ''}`}>
                    {/* Header: Logo + Title + Toggle */}
                    <div className="sidebar-header">
                        <div className="sidebar-header-main">
                            <img
                                src={baseUrl + '/public/img/unj.png'}
                                alt="Logo UNJ"
                                className="sidebar-logo-img"
                            />
                            {!collapsed && (
                                <div className="sidebar-brand-text">
                                    <h1 className="sidebar-brand-title">SIUKAT</h1>
                                    <p className="sidebar-brand-subtitle">Sistem Informasi UKT</p>
                                </div>
                            )}
                        </div>
                        
                        <button 
                            className="sidebar-toggle-btn" 
                            onClick={() => window.innerWidth > 768 ? this.props.toggleCollapse() : this.props.toggleMobile()}
                            title={collapsed ? "Buka Sidebar" : "Tutup Sidebar"}
                        >
                            <i className={`fa ${collapsed ? 'fa-angle-right' : 'fa-angle-left'}`}></i>
                        </button>
                    </div>

                    {/* Menu Body */}
                    <div className="sidebar-menu">
                        {this.state.listNav.map((item, index) => (
                            <NavLink 
                                key={index}
                                to={item.href} 
                                exact={item.href === '/main'}
                                className="nav-item-custom"
                                activeClassName="active"
                                onClick={openMobile ? toggleMobile : null}
                                title={collapsed ? item.title : ''}
                            >
                                <div className="nav-icon-wrapper">
                                    <i className={item.icon}></i>
                                </div>
                                {!collapsed && <span className="nav-label">{item.title}</span>}
                            </NavLink>
                        ))}
                    </div>

                    {/* Bottom: Logout */}
                    <div className="sidebar-footer">
                        <a href="#logout" className="logout-link-sidebar" onClick={this.logout} title={collapsed ? 'Keluar' : ''}>
                            <div className="nav-icon-wrapper">
                                <i className="fa fa-sign-out"></i>
                            </div>
                            {!collapsed && <span className="nav-label">Keluar</span>}
                        </a>
                    </div>
                </aside>
            </React.Fragment>
        );
    }
}

export default withCookies(Navigation);
