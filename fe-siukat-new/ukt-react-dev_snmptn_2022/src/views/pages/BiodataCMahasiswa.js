import React from 'react';
import { cmahasiswa, info } from '../../actions';
import { cookies, cookieName } from '../../global';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class BiodataCMahasiswa extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(info.fetchInfo());
    }

    render() {
        // Since bio_ system is removed, redirect to UKT directly
        return <Redirect to="/main/ukt" />;
    }
}

export default connect((store) => ({
    cmahasiswa: store.cmahasiswa.cmahasiswa,
    info: store.info.info,
}))(BiodataCMahasiswa);
