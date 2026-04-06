import React from 'react';
import {
    TabContent, TabPane,
    Row, Col,
    ListGroup, ListGroupItem, Card
} from 'reactstrap';
import classnames from 'classnames';
import {
    DataPribadiSeleksi, DataAyahSeleksi, DataIbuSeleksi, DataWaliSeleksi,
    DataRumahSeleksi, DataListrikSeleksi, DataKendaraanSeleksi, DataPendukungSeleksi, VerifikasiSeleksi,
    BatalUktRendah, Bantuan
} from '../components';
import { cmahasiswa } from '../../actions';
import { cookies, cookieName } from '../../global';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// CheckIcon placeholder removed as it was unused

class Seleksi extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1'
        };

        this.toggle = this.toggle.bind(this);
        this.updateVerifikasi = this.updateVerifikasi.bind(this);
        this.handleClickTab = this.handleClickTab.bind(this);
    }

    updateVerifikasi() {
        // delay mencegah flag verifikasi gagal terupdate akibat promise.
        setTimeout(() => {
            this.props.dispatch(cmahasiswa.checkDataComplete(cookies.get(cookieName)));
        }, 3000);
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(cmahasiswa.checkDataComplete(cookies.get(cookieName)));
    }

    componentDidMount() {
        const tabPane = localStorage.getItem('tab-pane');

        if (tabPane) this.setState({ activeTab: tabPane });
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    handleClickTab(e) {
        const { id } = e.currentTarget.dataset;
        this.toggle(id);
        localStorage.setItem('tab-pane', id);
    }

    render() {
        console.log(this.props.verifikasi);
        if (this.props.cmahasiswa.flag !== 'pengisian' && this.props.cmahasiswa.ukt_tinggi === 'tidak') {
            return <Redirect to="/main/ukt" />;
        }
        return (
            <div className="mt-4">
                <Row className="h-100">
                    <Col md="3" xs="12">
                        <ListGroup className="modern-sidebar-menu shadow-sm mb-3">
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={this.handleClickTab}
                                data-id="1"
                            >
                                <i className="fa fa-user"></i> Data Pribadi
                                {this.props.verifikasi.cmahasiswa === 1 && <span className="sidebar-check-icon"><i className="fa fa-check"></i></span>}
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={this.handleClickTab}
                                data-id="2"
                            >
                                <i className="fa fa-user"></i> Data Ayah
                                {this.props.verifikasi.ayah === 1 && <span className="sidebar-check-icon"><i className="fa fa-check"></i></span>}
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={this.handleClickTab}
                                data-id="3"
                            >
                                <i className="fa fa-user"></i> Data Ibu
                                {this.props.verifikasi.ibu === 1 && <span className="sidebar-check-icon"><i className="fa fa-check"></i></span>}
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '4' })}
                                onClick={this.handleClickTab}
                                data-id="4"
                            >
                                <i className="fa fa-group"></i> Data Wali
                                {this.props.verifikasi.wali === 1 && <span className="sidebar-check-icon"><i className="fa fa-check"></i></span>}
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '5' })}
                                onClick={this.handleClickTab}
                                data-id="5"
                            >
                                <i className="fa fa-home"></i> Data Rumah
                                {this.props.verifikasi.rumah === 1 && <span className="sidebar-check-icon"><i className="fa fa-check"></i></span>}
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '6' })}
                                onClick={this.handleClickTab}
                                data-id="6"
                            >
                                <i className="fa fa-flash"></i> Data Listrik
                                {this.props.verifikasi.listrik === 1 && <span className="sidebar-check-icon"><i className="fa fa-check"></i></span>}
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '7' })}
                                onClick={this.handleClickTab}
                                data-id="7"
                            >
                                <i className="fa fa-bus"></i> Data Kendaraan
                                {this.props.verifikasi.kendaraan === 1 && <span className="sidebar-check-icon"><i className="fa fa-check"></i></span>}
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '8' })}
                                onClick={this.handleClickTab}
                                data-id="8"
                            >
                                <i className="fa fa-file-text"></i> Data Pendukung
                                {this.props.verifikasi.pendukung === 1 && <span className="sidebar-check-icon"><i className="fa fa-check"></i></span>}
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '9' })}
                                onClick={this.handleClickTab}
                                data-id="9"
                            >
                                <i className="fa fa-check-square"></i> Verifikasi Hasil
                            </ListGroupItem>
                        </ListGroup>
                        <BatalUktRendah />
                        <Bantuan />
                    </Col>
                    <Col md="9" xs="12" className="d-flex flex-column">
                        <TabContent activeTab={this.state.activeTab} className="h-100">
                            <TabPane tabId="1" className="h-100">
                                <Card className="premium-card">
                                    <DataPribadiSeleksi updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.cmahasiswa} />
                                </Card>
                            </TabPane>
                            <TabPane tabId="2" className="h-100">
                                <Card className="premium-card">
                                    <DataAyahSeleksi updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.ayah} />
                                </Card>
                            </TabPane>
                            <TabPane tabId="3" className="h-100">
                                <Card className="premium-card">
                                    <DataIbuSeleksi updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.ibu} />
                                </Card>
                            </TabPane>
                            <TabPane tabId="4" className="h-100">
                                <Card className="premium-card">
                                    <DataWaliSeleksi updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.wali} />
                                </Card>
                            </TabPane>
                            <TabPane tabId="5" className="h-100">
                                <Card className="premium-card">
                                    <DataRumahSeleksi updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.rumah} />
                                </Card>
                            </TabPane>
                            <TabPane tabId="6" className="h-100">
                                <Card className="premium-card">
                                    <DataListrikSeleksi updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.listrik} />
                                </Card>
                            </TabPane>
                            <TabPane tabId="7" className="h-100">
                                <Card className="premium-card">
                                    <DataKendaraanSeleksi updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.kendaraan} />
                                </Card>
                            </TabPane>
                            <TabPane tabId="8" className="h-100">
                                <Card className="premium-card">
                                    <DataPendukungSeleksi updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.pendukung} />
                                </Card>
                            </TabPane>
                            <TabPane tabId="9" className="h-100">
                                <Card className="premium-card">
                                    <VerifikasiSeleksi
                                        updateVerifikasi={this.updateVerifikasi}
                                        router={this.props}
                                        allow={
                                            (this.props.verifikasi.cmahasiswa &&
                                                this.props.verifikasi.ayah &&
                                                this.props.verifikasi.ibu &&
                                                this.props.verifikasi.wali &&
                                                this.props.verifikasi.rumah &&
                                                this.props.verifikasi.listrik &&
                                                this.props.verifikasi.kendaraan &&
                                                this.props.verifikasi.pendukung
                                            )}
                                        verified={this.props.verifikasi.verifikasi}
                                    />
                                </Card>
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
)(Seleksi);