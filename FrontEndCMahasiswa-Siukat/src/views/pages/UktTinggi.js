import React from 'react';
import {
    TabContent, TabPane,
    Row, Col,
    ListGroup, ListGroupItem,
    Card, CardBody, Button
} from 'reactstrap';
import classnames from 'classnames';
import { DataPribadi, DataAyah, DataIbu, DataWali, DataPendukung, Verifikasi, InfoUktTinggi, BatalUktTinggi } from '../components';
import { cmahasiswa } from '../../actions';
import { cookies, cookieName } from '../../global';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// Komponen Internal untuk Tampilan Data Belum Lengkap
const DataBelumLengkap = ({ toggle }) => (
    <Card className="border-danger shadow-sm">
        <CardBody className="text-center py-5">
            <i className="fa fa-exclamation-triangle text-danger mb-3" style={{ fontSize: '4rem' }}></i>
            <h3 className="font-weight-bold">Data Belum Lengkap</h3>
            <p className="text-muted mb-4">
                Anda belum dapat melakukan verifikasi. Silakan lengkapi seluruh dokumen dan data pada menu di samping kiri (yang belum memiliki tanda checklist hijau).
            </p>
            <Button color="primary" onClick={() => toggle('1')}>
                <i className="fa fa-arrow-left mr-2"></i> Kembali Lengkapi Data
            </Button>
        </CardBody>
    </Card>
);

const styles = {
    sidebarItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer'
    },
    checkIcon: {
        color: '#28a745',
        fontSize: '1rem'
    }
};

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

        const { verifikasi } = this.props;
        
        // Logika pengecekan kelengkapan
        const isAllComplete = (
            verifikasi.cmahasiswa && 
            verifikasi.ayah && 
            verifikasi.ibu && 
            verifikasi.wali && 
            verifikasi.pendukung
        );

        const renderCheck = (isComplete) => {
            if (isComplete === 1 || isComplete === true) {
                return (
                    <div className="sidebar-check-icon ml-auto" style={styles.checkIcon}>
                        <i className="fa fa-check-circle"></i>
                    </div>
                );
            }
            return null;
        };

        return (
            <div className="margin-top-20">
                <Row>
                    <Col md="3" xs="12">
                        <InfoUktTinggi />
                        
                        <ListGroup className="modern-sidebar-menu mb-4 shadow-sm">
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={(e) => { e.preventDefault(); this.toggle('1'); }}
                                tag="a" href="" style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-user mr-2"></i> Data Pribadi</span>
                                {renderCheck(verifikasi.cmahasiswa)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={(e) => { e.preventDefault(); this.toggle('2'); }}
                                tag="a" href="" style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-male mr-2"></i> Data Ayah</span>
                                {renderCheck(verifikasi.ayah)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={(e) => { e.preventDefault(); this.toggle('3'); }}
                                tag="a" href="" style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-female mr-2"></i> Data Ibu</span>
                                {renderCheck(verifikasi.ibu)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '4' })}
                                onClick={(e) => { e.preventDefault(); this.toggle('4'); }}
                                tag="a" href="" style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-users mr-2"></i> Data Wali</span>
                                {renderCheck(verifikasi.wali)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '5' })}
                                onClick={(e) => { e.preventDefault(); this.toggle('5'); }}
                                tag="a" href="" style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-file-text mr-2"></i> Surat Pernyataan</span>
                                {renderCheck(verifikasi.pendukung)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ 
                                    active: this.state.activeTab === '6',
                                    'bg-light': !isAllComplete && this.state.activeTab !== '6' 
                                })}
                                onClick={(e) => { e.preventDefault(); this.toggle('6'); }}
                                tag="a" href="" style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-check-square mr-2"></i> Verifikasi</span>
                            </ListGroupItem>
                        </ListGroup>

                        <BatalUktTinggi />
                    </Col>
                    
                    <Col md="9" xs="12">
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <DataPribadi updateVerifikasi={this.updateVerifikasi} allow={verifikasi.cmahasiswa} />
                            </TabPane>
                            <TabPane tabId="2">
                                <DataAyah updateVerifikasi={this.updateVerifikasi} allow={verifikasi.ayah} />
                            </TabPane>
                            <TabPane tabId="3">
                                <DataIbu updateVerifikasi={this.updateVerifikasi} allow={verifikasi.ibu} />
                            </TabPane>
                            <TabPane tabId="4">
                                <DataWali updateVerifikasi={this.updateVerifikasi} allow={verifikasi.wali} />
                            </TabPane>
                            <TabPane tabId="5">
                                <DataPendukung updateVerifikasi={this.updateVerifikasi} allow={verifikasi.pendukung} />
                            </TabPane>
                            
                            <TabPane tabId="6">
                                {isAllComplete ? (
                                    <Verifikasi
                                        updateVerifikasi={this.updateVerifikasi}
                                        router={this.props}
                                        allow={true}
                                    />
                                ) : (
                                    <DataBelumLengkap toggle={this.toggle} />
                                )}
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