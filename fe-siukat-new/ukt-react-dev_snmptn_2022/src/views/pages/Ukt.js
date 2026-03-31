import React from 'react';
import { Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import { Loading } from 'redux-global-loader';
import { Navigation, Footer, UktLoader } from '../components';
import { PilihanUktTinggi, UktTinggi, Seleksi, SelesaiIsi, TungguPengumuman, TerimaSanggah, Terima, Klarifikasi } from './';

class Ukt extends React.Component {
    render() {
        return (
            <div>
                <Navigation router={this.props} />
                <Loading>
                    <UktLoader />
                </Loading>
                <Container className="margin-top-90">
                    <Route exact path={this.props.match.path} component={PilihanUktTinggi} />
                    <Route path={this.props.match.path + '/tinggi'} component={UktTinggi} />
                    <Route path={this.props.match.path + '/seleksi'} component={Seleksi} />
                    <Route path={this.props.match.path + '/selesai-isi'} component={SelesaiIsi} />
                    <Route path={this.props.match.path + '/tunggu-pengumuman'} component={TungguPengumuman} />
                    <Route path={this.props.match.path + '/terima-sanggah'} component={TerimaSanggah} />
                    <Route path={this.props.match.path + '/terima'} component={Terima} />
                    <Route path={this.props.match.path + '/sanggah'} component={Klarifikasi} />
                    <Footer />
                </Container>
            </div>
        );
    }
}

export default Ukt;