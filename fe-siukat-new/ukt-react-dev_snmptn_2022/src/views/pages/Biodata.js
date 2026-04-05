import React from 'react';
import { Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import { Loading } from 'redux-global-loader';
import { Navigation, Footer, UktLoader } from '../components';
import { BiodataCMahasiswa, BiodataSelesaiIsi } from './';
// import BiodataCMahasiswa from "./BiodataCMahasiswa";

class Biodata extends React.Component {
    render() {
        return (
            <div>
                <Loading>
                    <UktLoader />
                </Loading>
                <div>
                    <Route
                        exact
                        path={this.props.match.path + '/'}
                        component={BiodataCMahasiswa}
                    />
                    <Route
                        path={this.props.match.path + '/selesai-isi-biodata'}
                        component={BiodataSelesaiIsi}
                    />
                </div>
            </div>
        );
    }
}

export default Biodata;
