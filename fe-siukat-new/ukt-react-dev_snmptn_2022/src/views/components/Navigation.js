import React from 'react';
import UNJ from '../dist/img/unj.png';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Container,
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { notif, cookies, cookieName } from '../../global';

class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.renderMenus = this.renderMenus.bind(this);
        this.logout = this.logout.bind(this);

        this.state = {
            isOpen: false,
            listNav: [
                {
                    href: '/main',
                    icon: 'fa fa-info-circle',
                    title: 'Informasi',
                },
                {
                    href: '/main/petunjuk',
                    icon: 'fa fa-arrow-right',
                    title: 'Petunjuk Khusus',
                },
                {
                    href: '/main/biodata',
                    icon: 'fa fa-user',
                    title: 'Biodata',
                },
                {
                    href: '/main/ukt',
                    icon: 'fa fa-file',
                    title: 'UKT',
                },
            ],
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }
    renderMenus() {
        return this.state.listNav.map((data, key) => (
            <NavItem key={key}>
                <a
                    href={data.href}
                    className={
                        this.props.router.match.path === data.href
                            ? 'nav-link-active nav-link'
                            : 'nav-link'
                    }
                >
                    <i className={data.icon}></i> {data.title}
                </a>
            </NavItem>
        ));
    }
    logout(e) {
        e.preventDefault();
        cookies.remove(cookieName, { path: '/' });
        this.props.router.history.push('/');
        notif('Berhasil!', 'Anda berhasil keluar', 'success');
    }
    render() {
        if (cookies.get(cookieName) === undefined) {
            notif('Sesi Telah Habis!', 'Silakan masuk kembali', 'error');
            return <Redirect to="/" />;
        }
        return (
            <Navbar color="green" dark fixed="true" expand="md" className="nav-fixed">
                <Container>
                    <NavbarBrand href="/">
                        <img
                            src={UNJ}
                            alt="Logo UNJ"
                            style={{ width: '40px', verticalAlign: 'middle' }}
                        />{' '}
            Sistem Informasi UKT
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            {this.renderMenus()}
                            <NavItem>
                                <Link to="#" className="nav-link" onClick={this.logout}>
                                    <i className="fa fa-sign-out"></i> Keluar
                                </Link>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        );
    }
}

export default withCookies(Navigation);
