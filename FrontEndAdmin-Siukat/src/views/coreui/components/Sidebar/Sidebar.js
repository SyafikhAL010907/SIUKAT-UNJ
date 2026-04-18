import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Badge, Nav, NavItem } from 'reactstrap';
import classNames from 'classnames';
import nav from './_nav'
import { connect } from 'react-redux';
import { filterNavigation } from '../../../../utils/rbac';

class Sidebar extends Component {

  handleClick(e) {
    e.preventDefault();
    e.currentTarget.parentElement.classList.toggle('open');
  }

  activeRoute(routeName, props) {
    return props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  }

  render() {
    const props = this.props;
    const activeRoute = this.activeRoute;
    const handleClick = this.handleClick;

    const badge = (badge) => {
      if (badge) {
        const classes = classNames("ml-auto px-2 py-0.5 text-[10px] rounded-full", badge.class);
        return (<Badge className={classes} color={badge.variant}>{badge.text}</Badge>)
      }
    };

    const wrapper = item => (!item.wrapper ? item.name : (React.createElement(item.wrapper.element, item.wrapper.attributes, item.name)));

    const title = (title, key) => {
      const classes = classNames("nav-title px-5 py-3 text-[10px] font-black uppercase text-gray-400 tracking-[0.15em]", title.class);
      return (<li key={key} className={classes}>{wrapper(title)} </li>);
    };

    const divider = (divider, key) => (<li key={key} className="divider h-[1px] bg-gray-50 my-1 mx-4"></li>);

    const navItem = (item, key) => {
      const classes = classNames("nav-link flex items-center px-5 py-3 text-sm transition-all duration-200 hover:bg-white hover:text-green-600", item.class);
      return (
        <NavItem key={key} className="list-none">
          <NavLink to={item.url} className={classes} activeClassName="bg-green-50 text-green-600  font-bold">
            <i className={`${item.icon} mr-3 w-5 text-center text-lg`}></i>
            <span className="flex-1">{item.name}</span>
            {badge(item.badge)}
          </NavLink>
        </NavItem>
      )
    };

    const navDropdown = (item, key) => {
      const isCalonMahasiswa = item.name === "Calon Mahasiswa";
      return (
        <li key={key} className={`${activeRoute(item.url, props)} list-none`}>
          <a 
            className="nav-link nav-dropdown-toggle flex items-center px-5 py-3 text-sm cursor-pointer hover:bg-gray-50/80 transition-colors text-gray-600" 
            onClick={handleClick.bind(this)} 
          >
            <i className={`${item.icon} mr-3 w-5 text-center text-lg`}></i> 
            <span className="flex-1 leading-tight font-medium">
              {isCalonMahasiswa ? (
                <span>Calon<br/>Mahasiswa</span>
              ) : (
                item.name
              )}
            </span>
            {badge(item.badge)}
          </a>
          <ul className="nav-dropdown-items bg-gray-50/30">
            {navList(item.children)}
          </ul>
        </li>)
    };

    const navLink = (item, idx) =>
      item.title ? title(item, idx) :
      item.divider ? divider(item, idx) :
      item.children ? navDropdown(item, idx) : navItem(item, idx);

    const navList = (items) => items.map((item, index) => navLink(item, index));

    const filteredNavItems = filterNavigation(nav.items, props.user?.role);

    return (
      <>
        {/* OVERLAY HANYA UNTUK MOBILE */}
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden sidebar-overlay transition-opacity"
          onClick={() => document.body.classList.remove('sidebar-mobile-show')}
        ></div>

        <div className="sidebar" style={{ width: '250px' }}>
          <nav className="sidebar-nav h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200">
            <Nav className="flex-col italic-none py-2">
              {navList(filteredNavItems)}
            </Nav>
          </nav>
        </div>

        <style>{`
          /* CSS KHUSUS MOBILE: Tidak akan mengganggu desktop karena dibungkus Media Query */
          @media (max-width: 1023px) {
            .sidebar {
              position: fixed !important;
              top: 64px !important; /* Pas di bawah header */
              left: 0 !important;
              z-index: 1040 !important;
              colour: white !important;
              height: calc(100vh - 64px) !important;
              background: white !important;
              transition: transform 0.3s ease-in-out !important;
              transform: translateX(-100%); /* Sembunyi */
              box-shadow: 4px 0 10px rgba(0,0,0,0.1);
            }

            body.sidebar-mobile-show .sidebar {
              transform: translateX(0) !important; /* Muncul */
            }

            body:not(.sidebar-mobile-show) .sidebar-overlay {
              display: none;
            }
          }

          /* Aturan Dropdown (Desktop & Mobile) */
          .nav-dropdown.open > .nav-dropdown-items {
            display: block;
          }
          .nav-dropdown:not(.open) > .nav-dropdown-items {
            display: none;
          }

          /* Menghilangkan panah bawaan CoreUI jika ada */
          .nav-dropdown-toggle::after {
            display: none !important;
          }
        `}</style>
      </>
    )
  }
}

export default connect((store) => ({
  user: store.user.user
}))(Sidebar);