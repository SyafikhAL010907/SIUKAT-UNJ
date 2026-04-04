import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Info from './Info';
import Ukt from './Ukt';
import Biodata from './Biodata';
import Petunjuk from './Petunjuk';
import { withCookies } from 'react-cookie';
import { getToken, removeToken, notif } from '../../global';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: undefined,
        };
    }
    UNSAFE_componentWillMount() {
        this.setState({
            isLogin: getToken(),
        });
        // this.props.dispatch(cmahasiswa.getByLoggedIn(getToken()))
    }
    render() {
        if (getToken() === undefined || getToken() === null) {
            removeToken();
            notif('Sesi Telah Habis!', 'Silakan masuk kembali', 'error');
            return <Redirect to="/" />;
        }
        return (
            <div>
                <Route exact path={this.props.match.path} component={Info} />
                <Route path={this.props.match.path + '/biodata'} component={Biodata} />
                <Route path={this.props.match.path + '/ukt'} component={Ukt} />
                <Route
                    path={this.props.match.path + '/petunjuk'}
                    match={this.props.match}
                    component={Petunjuk}
                />
            </div>
        );
    }
}

export default withCookies(Layout);
