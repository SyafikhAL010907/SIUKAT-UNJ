import React from 'react';
import {
    TabContent, TabPane,
    Row, Col,
    ListGroup, ListGroupItem,
} from 'reactstrap';
import classnames from 'classnames';
import { DataPribadi, DataAyah, DataIbu, DataWali, DataPendukung, Verifikasi, InfoUktTinggi, BatalUktTinggi } from '../components';
import { cmahasiswa } from '../../actions';
import { cookies, cookieName } from '../../global';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class UktTinggi extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.updateVerifikasi = this.updateVerifikasi.bind(this);

        this.state = {
            activeTab: '1',
        };
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(cmahasiswa.checkDataComplete(cookies.get(cookieName)));
    }

    updateVerifikasi() {
        // delay mencegah flag verifikasi gagal terupdate akibat promise.
        setTimeout(() => {
            this.props.dispatch(cmahasiswa.checkDataComplete(cookies.get(cookieName)));
        }, 3000);
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    render() {
        if (this.props.cmahasiswa.flag !== 'pengisian' && this.props.cmahasiswa.ukt_tinggi === 'ya') {
            return <Redirect to="/main/ukt" />;
        }
        return (
            <div className="margin-top-20">
                <Row>
                    <Col md="3" xs="12">
                        <InfoUktTinggi />
                        
                        <ListGroup className="modern-sidebar-menu mb-4">
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={(e) => { e.preventDefault(); this.toggle('1'); }}
                                tag="a"
                                href="">
                                <i className="fa fa-user"></i> Data Pribadi
                                {this.props.verifikasi.cmahasiswa === 1 && (
                                    <div className="sidebar-check-icon ml-auto">
                                        <i className="fa fa-check"></i>
                                    </div>
                                )}
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={(e) => { e.preventDefault(); this.toggle('2'); }}
                                tag="a"
                                href="">
                                <i className="fa fa-male"></i> Data Ayah
                                {this.props.verifikasi.ayah === 1 && (
                                    <div className="sidebar-check-icon ml-auto">
                                        <i className="fa fa-check"></i>
                                    </div>
                                )}
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={(e) => { e.preventDefault(); this.toggle('3'); }}
                                tag="a"
                                href="">
                                <i className="fa fa-female"></i> Data Ibu
                                {this.props.verifikasi.ibu === 1 && (
                                    <div className="sidebar-check-icon ml-auto">
                                        <i className="fa fa-check"></i>
                                    </div>
                                )}
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '4' })}
                                onClick={(e) => { e.preventDefault(); this.toggle('4'); }}
                                tag="a"
                                href="">
                                <i className="fa fa-users"></i> Data Wali
                                {this.props.verifikasi.wali === 1 && (
                                    <div className="sidebar-check-icon ml-auto">
                                        <i className="fa fa-check"></i>
                                    </div>
                                )}
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '5' })}
                                onClick={(e) => { e.preventDefault(); this.toggle('5'); }}
                                tag="a"
                                href="">
                                <i className="fa fa-file-text"></i> Surat Pernyataan
                                {this.props.verifikasi.pendukung === 1 && (
                                    <div className="sidebar-check-icon ml-auto">
                                        <i className="fa fa-check"></i>
                                    </div>
                                )}
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '6' })}
                                onClick={(e) => { e.preventDefault(); this.toggle('6'); }}
                                tag="a"
                                href="">
                                <i className="fa fa-check-square"></i> Verifikasi
                            </ListGroupItem>
                        </ListGroup>

                        <BatalUktTinggi />
                    </Col>
                    <Col md="9" xs="12">
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <DataPribadi updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.cmahasiswa} />
                            </TabPane>
                            <TabPane tabId="2">
                                <DataAyah updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.ayah} />
                            </TabPane>
                            <TabPane tabId="3">
                                <DataIbu updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.ibu} />
                            </TabPane>
                            <TabPane tabId="4">
                                <DataWali updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.wali} />
                            </TabPane>
                            <TabPane tabId="5">
                                <DataPendukung updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.pendukung} />
                            </TabPane>
                            <TabPane tabId="6">
                                <Verifikasi
                                    updateVerifikasi={this.updateVerifikasi}
                                    router={this.props}
                                    allow={
                                        (this.props.verifikasi.cmahasiswa
                                            && this.props.verifikasi.ayah
                                            && this.props.verifikasi.ibu
                                            && this.props.verifikasi.wali
                                            && this.props.verifikasi.pendukung)
                                    }
                                />
                            </TabPane>
                        </TabContent>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(
    (store) => ({
        verifikasi: store.cmahasiswa.verifikasi,
        cmahasiswa: store.cmahasiswa.cmahasiswa,
    })
)(UktTinggi);