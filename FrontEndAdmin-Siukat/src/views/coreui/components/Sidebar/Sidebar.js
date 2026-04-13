import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Badge, Nav, NavItem} from 'reactstrap';
import classNames from 'classnames';
import nav from './_nav'
import { connect } from 'react-redux';
import { filterNavigation } from '../../../../utils/rbac';

class Sidebar extends Component {

  handleClick(e) {
    e.preventDefault();
    // Menggunakan closest untuk memastikan yang di-toggle adalah <li> meskipun yang diklik adalah <span> atau <br>
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
        const classes = classNames( badge.class );
        return (<Badge className={ classes } color={ badge.variant }>{ badge.text }</Badge>)
      }
    };

    const wrapper = item => { return (!item.wrapper ? item.name : (React.createElement(item.wrapper.element, item.wrapper.attributes, item.name))) };

    const title =  (title, key) => {
      const classes = classNames( "nav-title", title.class);
      return (<li key={key} className={ classes }>{wrapper(title)} </li>);
    };

    const divider = (divider, key) => (<li key={key} className="divider"></li>);

    const navItem = (item, key) => {
      const classes = classNames( "nav-link", item.class);
      return (
        <NavItem key={key}>
          <NavLink to={item.url} className={ classes } activeClassName="active">
            <i className={item.icon}></i>{item.name}{badge(item.badge)}
          </NavLink>
        </NavItem>
      )
    };

    // nav dropdown
    const navDropdown = (item, key) => {
      const isCalonMahasiswa = item.name === "Calon Mahasiswa";
      
      return (
        <li key={key} className={activeRoute(item.url, props)}>
          {/* onClick dipasang pada tag <a> yang membungkus seluruh konten title */}
          <a 
            className="nav-link nav-dropdown-toggle" 
            onClick={handleClick.bind(this)} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', whiteSpace: 'normal' }}
          >
            <i className={item.icon}></i> 
            
            <span style={{ flex: '1', marginLeft: '10px', lineHeight: '1.2' }}>
              {isCalonMahasiswa ? (
                <span>Calon<br/>Mahasiswa</span>
              ) : (
                item.name
              )}
            </span>

            {/* Indikator panah manual */}
            <span style={{ fontWeight: 'bold', fontSize: '14px', marginLeft: '5px' }}>
              {""}
            </span>
            
            {badge(item.badge)}
          </a>
          <ul className="nav-dropdown-items">
            {navList(item.children)}
          </ul>
        </li>)
    };

    const navLink = (item, idx) =>
      item.title ? title(item, idx) :
      item.divider ? divider(item, idx) :
      item.children ? navDropdown(item, idx)
                    : navItem(item, idx) ;

    const navList = (items) => {
      return items.map( (item, index) => navLink(item, index) );
    };

    const filteredNavItems = filterNavigation(nav.items, props.user?.role);

    return (
      <div className="sidebar" style={{ width: '250px' }}>
        <nav className="sidebar-nav">
          <Nav>
            {navList(filteredNavItems)}
          </Nav>
        </nav>
      </div>
    )
  }
}

export default connect((store) => ({
  user: store.user.user
}))(Sidebar);