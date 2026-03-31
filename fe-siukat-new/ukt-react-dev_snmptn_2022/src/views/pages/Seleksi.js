import React from 'react';
import {
    TabContent, TabPane,
    Row, Col,
    ListGroup, ListGroupItem,
} from 'reactstrap';
import classnames from 'classnames';
import {
    DataPribadiSeleksi, DataAyahSeleksi, DataIbuSeleksi, DataWaliSeleksi,
    DataRumahSeleksi, DataListrikSeleksi, DataKendaraanSeleksi, DataPendukungSeleksi, VerifikasiSeleksi,
    BatalUktRendah
} from '../components';
import { cmahasiswa } from '../../actions';
import { cookies, cookieName } from '../../global';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const CheckIcon = () => (
    <span className="pull-right">
        <i className="fa fa-check"></i>
    </span>
);

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
            <div className="margin-top-20">
                <Row>
                    <Col md="3" xs="12">
                        <ListGroup className="tab-pane-menu">
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={this.handleClickTab}
                                data-id="1"
                                tag="a"
                                role="button"
                            >
                                <div className="clearfix">
                                    <i className="fa fa-user"></i> Data Pribadi
                                    {this.props.verifikasi.cmahasiswa === 1 ? <CheckIcon /> : ''}
                                </div>
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={this.handleClickTab}
                                data-id="2"
                                tag="a"
                                role="button"
                            >
                                <div className="clearfix">
                                    <i className="fa fa-user"></i> Data Ayah
                                    {this.props.verifikasi.ayah === 1 ? <CheckIcon /> : ''}
                                </div>
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={this.handleClickTab}
                                data-id="3"
                                tag="a"
                                role="button"
                            >
                                <div className="clearfix">
                                    <i className="fa fa-user"></i> Data Ibu
                                    {this.props.verifikasi.ibu === 1 ? <CheckIcon /> : ''}
                                </div>
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '4' })}
                                onClick={this.handleClickTab}
                                data-id="4"
                                tag="a"
                                role="button"
                            >
                                <div className="clearfix">
                                    <i className="fa fa-group"></i> Data Wali
                                    {this.props.verifikasi.wali === 1 ? <CheckIcon /> : ''}
                                </div>
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '5' })}
                                onClick={this.handleClickTab}
                                data-id="5"
                                tag="a"
                                role="button"
                            >
                                <div className="clearfix">
                                    <i className="fa fa-home"></i> Data Rumah
                                    {this.props.verifikasi.rumah === 1 ? <CheckIcon /> : ''}
                                </div>
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '6' })}
                                onClick={this.handleClickTab}
                                data-id="6"
                                tag="a"
                                role="button"
                            >
                                <div className="clearfix">
                                    <i className="fa fa-flash"></i> Data Listrik
                                    {this.props.verifikasi.listrik === 1 ? <CheckIcon /> : ''}
                                </div>
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '7' })}
                                onClick={this.handleClickTab}
                                data-id="7"
                                tag="a"
                                role="button"
                            >
                                <div className="clearfix">
                                    <i className="fa fa-bus"></i> Data Kendaraan
                                    {this.props.verifikasi.kendaraan === 1 ? <CheckIcon /> : ''}
                                </div>
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '8' })}
                                onClick={this.handleClickTab}
                                data-id="8"
                                tag="a"
                                role="button"
                            >
                                <div className="clearfix">
                                    <i className="fa fa-file-text"></i> Data Pendukung
                                    {this.props.verifikasi.pendukung === 1 ? <CheckIcon /> : ''}
                                </div>
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({
                                    active: this.state.activeTab === '9',
                                    'bg-warning': this.state.activeTab !== '9'
                                })}
                                onClick={this.handleClickTab}
                                data-id="9"
                                tag="a"
                                role="button"
                            >
                                <div className="clearfix">
                                    <i className="fa fa-check-square"></i> Verifikasi
                                </div>
                            </ListGroupItem>
                        </ListGroup>
                        <BatalUktRendah />
                    </Col>
                    <Col md="9" xs="12">
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <DataPribadiSeleksi updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.cmahasiswa} />
                            </TabPane>
                            <TabPane tabId="2">
                                <DataAyahSeleksi updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.ayah} />
                            </TabPane>
                            <TabPane tabId="3">
                                <DataIbuSeleksi updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.ibu} />
                            </TabPane>
                            <TabPane tabId="4">
                                <DataWaliSeleksi updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.wali} />
                            </TabPane>
                            <TabPane tabId="5">
                                <DataRumahSeleksi updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.rumah} />
                            </TabPane>
                            <TabPane tabId="6">
                                <DataListrikSeleksi updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.listrik} />
                            </TabPane>
                            <TabPane tabId="7">
                                <DataKendaraanSeleksi updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.kendaraan} />
                            </TabPane>
                            <TabPane tabId="8">
                                <DataPendukungSeleksi updateVerifikasi={this.updateVerifikasi} allow={this.props.verifikasi.pendukung} />
                            </TabPane>
                            <TabPane tabId="9">
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