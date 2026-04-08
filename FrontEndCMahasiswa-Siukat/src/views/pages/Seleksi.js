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

// Menambahkan internal style untuk memastikan icon check muncul dengan benar
const styles = {
    sidebarItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer'
    },
    checkIcon: {
        color: '#28a745', // Warna hijau sukses
        marginLeft: '10px',
        fontSize: '1.1rem'
    }
};

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

        // Helper untuk merender Icon Checklist agar kode lebih bersih
        const renderCheck = (isComplete) => {
            if (isComplete === 1 || isComplete === true) {
                return (
                    <span className="sidebar-check-icon" style={styles.checkIcon}>
                        <i className="fa fa-check-circle"></i>
                    </span>
                );
            }
            return null;
        };

        return (
            <div className="mt-4">
                <Row className="h-100">
                    <Col md="3" xs="12">
                        <ListGroup className="modern-sidebar-menu shadow-sm mb-3">
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={this.handleClickTab}
                                data-id="1"
                                style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-user mr-2"></i> Data Pribadi</span>
                                {renderCheck(this.props.verifikasi.cmahasiswa)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={this.handleClickTab}
                                data-id="2"
                                style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-user mr-2"></i> Data Ayah</span>
                                {renderCheck(this.props.verifikasi.ayah)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={this.handleClickTab}
                                data-id="3"
                                style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-user mr-2"></i> Data Ibu</span>
                                {renderCheck(this.props.verifikasi.ibu)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '4' })}
                                onClick={this.handleClickTab}
                                data-id="4"
                                style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-group mr-2"></i> Data Wali</span>
                                {renderCheck(this.props.verifikasi.wali)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '5' })}
                                onClick={this.handleClickTab}
                                data-id="5"
                                style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-home mr-2"></i> Data Rumah</span>
                                {renderCheck(this.props.verifikasi.rumah)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '6' })}
                                onClick={this.handleClickTab}
                                data-id="6"
                                style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-flash mr-2"></i> Data Listrik</span>
                                {renderCheck(this.props.verifikasi.listrik)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '7' })}
                                onClick={this.handleClickTab}
                                data-id="7"
                                style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-bus mr-2"></i> Data Kendaraan</span>
                                {renderCheck(this.props.verifikasi.kendaraan)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '8' })}
                                onClick={this.handleClickTab}
                                data-id="8"
                                style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-file-text mr-2"></i> Data Pendukung</span>
                                {renderCheck(this.props.verifikasi.pendukung)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '9' })}
                                onClick={this.handleClickTab}
                                data-id="9"
                                style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-check-square mr-2"></i> Verifikasi Hasil</span>
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