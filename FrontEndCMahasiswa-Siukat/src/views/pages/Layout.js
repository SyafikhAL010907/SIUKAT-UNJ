import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Info from './Info';
import Ukt from './Ukt';
import Biodata from './Biodata';
import Petunjuk from './Petunjuk';
import { withCookies } from 'react-cookie';
import { getToken, removeToken, notif } from '../../global';
import { Navigation, TopHeader } from '../components';
import { cmahasiswa } from '../../actions';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: undefined,
            collapsed: false,
            openMobile: false,
        };
    }

    componentDidMount() {
        const token = getToken();
        this.setState({
            isLogin: token,
        });

        // Fetch student data on mount
        if (token) {
            this.props.dispatch(cmahasiswa.getByLoggedIn(token));

            // Real-time Update: Polling setiap 15 detik agar status mahasiswa selalu sinkron
            this.pollingStudent = setInterval(() => {
                this.props.dispatch(cmahasiswa.getByLoggedIn(token));
            }, 60000);
        }
    }

    componentWillUnmount() {
        // Hentikan polling saat logout atau pindah halaman
        if (this.pollingStudent) clearInterval(this.pollingStudent);
    }

    toggleCollapse = () => {
        this.setState({ collapsed: !this.state.collapsed });
    }

    toggleMobile = () => {
        this.setState({ openMobile: !this.state.openMobile });
    }

    render() {
        if (getToken() === undefined || getToken() === null) {
            removeToken();
            notif('Sesi Telah Habis!', 'Silakan masuk kembali', 'error');
            return <Redirect to="/" />;
        }

        const { collapsed, openMobile } = this.state;
        const { studentData } = this.props;

        return (
            <div className="app-wrapper">
                {/* Sidebar Component (formerly Navigation) */}
                <Navigation 
                    collapsed={collapsed} 
                    openMobile={openMobile} 
                    toggleCollapse={this.toggleCollapse}
                    toggleMobile={this.toggleMobile}
                    router={this.props}
                    studentData={studentData}
                />

                {/* Main Content Area */}
                <main className={`main-area ${collapsed ? 'collapsed' : ''}`}>
                    <TopHeader 
                        collapsed={collapsed}
                        toggleCollapse={this.toggleCollapse}
                        toggleMobile={this.toggleMobile}
                        studentData={studentData}
                    />

                    <div className="content-panel">
                        <Switch>
                            <Route exact path={this.props.match.path} component={Info} />
                            <Route path={this.props.match.path + '/biodata'} component={Biodata} />
                            <Route path={this.props.match.path + '/ukt'} component={Ukt} />
                            <Route
                                path={this.props.match.path + '/petunjuk'}
                                component={Petunjuk}
                            />
                        </Switch>
                    </div>
                </main>
            </div>
        );
    }
}

export default connect((store) => ({
    studentData: store.cmahasiswa.cmahasiswa,
}))(withCookies(Layout));
