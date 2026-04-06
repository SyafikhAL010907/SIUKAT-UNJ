import React, {Component} from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { user } from '../../../../actions';
import { notif, cookies, cookieName } from '../../../../global';

import {
  // Badge,
  // Dropdown,
  // DropdownMenu,
  // DropdownItem,
  Nav,
  NavItem,
  NavLink,
  NavbarToggler,
  NavbarBrand,
  // DropdownToggle
} from 'reactstrap';

class Header extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  componentWillMount(){
    this.props.dispatch(user.getByLoggedIn(cookies.get(cookieName)))
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  logout(e){  
      e.preventDefault()
      cookies.remove(cookieName, {path: "/"})
      this.props.router.history.push('/')
      notif("Berhasil!", "Anda berhasil keluar", "success")
  }

  render() {
    if(cookies.get(cookieName) === undefined){
        notif("Sesi Telah Habis!", "Silakan masuk kembali", "error")
        return <Redirect to="/"/>
    }
    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>&#9776;</NavbarToggler>
        <NavbarBrand href="#">SIUKAT ADMIN</NavbarBrand>
        <NavbarToggler className="d-md-down-none" onClick={this.sidebarToggle}>&#9776;</NavbarToggler>
        <Nav className="d-md-down-none" navbar>
          {/* <NavItem className="px-3">
            <NavLink href="#"></NavLink>
          </NavItem> */}
        </Nav>
        <Nav className="ml-auto" navbar>
          {/* <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="fa fa-bell"></i><Badge pill color="danger"></Badge></NavLink>
          </NavItem> */}
          <NavItem className="d-md-down-none">
            <span className="d-md-down-none">Hi, {this.props.user.nama_lengkap}!</span>
          </NavItem>
          <NavItem className="d-md-down-none" style={{ padding: "0 20px" }}>
            <NavLink href="" onClick={this.logout.bind(this)}><i className="fa fa-sign-out"></i> <span>Keluar</span></NavLink>
          </NavItem>
          {/* <NavItem>
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle className="nav-link dropdown-toggle">
                <img src={Avatar} className="img-avatar" alt="admin@bootstrapmaster.com"/>
                <span className="d-md-down-none">Hi, Admin!</span>
              </DropdownToggle>
              <DropdownMenu right className={this.state.dropdownOpen ? 'show' : ''}>
                <DropdownItem header tag="div" className="text-center"><strong>Akun</strong></DropdownItem>
                <DropdownItem><i className="fa fa-user"></i> Profil<Badge color="info"></Badge></DropdownItem>
                <DropdownItem><i className="fa fa-lock"></i> Keluar</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavItem> */}
        </Nav>
        {/* <NavbarToggler className="d-md-down-none" type="button" onClick={this.asideToggle}>&#9776;</NavbarToggler> */}
      </header>
    )
  }
}

export default connect((store) => ({
  user: store.user.user
}))(Header)
