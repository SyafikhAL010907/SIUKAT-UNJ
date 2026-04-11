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

// Style tambahan untuk menyelaraskan sidebar agar rapi
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

    // Fungsi ini dipanggil setelah tombol "Simpan" di komponen anak diklik
    updateVerifikasi() {
        setTimeout(() => {
            this.props.dispatch(cmahasiswa.checkDataComplete(cookies.get(cookieName)));
        }, 3000);
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            // Logic Pencegahan: Cek kelengkapan data sebelum masuk ke tab Verifikasi (ID 6)
            if (tab === '6') {
                const v = this.props.verifikasi;
                const isComplete = (
                    v.cmahasiswa && v.ayah && v.ibu && v.wali && v.pendukung
                );

                if (!isComplete) {
                    alert("Mohon lengkapi semua data terlebih dahulu sebelum melakukan verifikasi.");
                    return;
                }
            }

            this.setState({
                activeTab: tab,
            });
        }
    }

    render() {
        if (this.props.cmahasiswa.flag !== 'pengisian' && this.props.cmahasiswa.ukt_tinggi === 'ya') {
            return <Redirect to="/main/ukt" />;
        }

        // Helper untuk merender Icon Checklist secara konsisten
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
                                tag="a"
                                href=""
                                style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-user mr-2"></i> Data Pribadi</span>
                                {renderCheck(this.props.verifikasi.cmahasiswa)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={(e) => { e.preventDefault(); this.toggle('2'); }}
                                tag="a"
                                href=""
                                style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-male mr-2"></i> Data Ayah</span>
                                {renderCheck(this.props.verifikasi.ayah)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={(e) => { e.preventDefault(); this.toggle('3'); }}
                                tag="a"
                                href=""
                                style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-female mr-2"></i> Data Ibu</span>
                                {renderCheck(this.props.verifikasi.ibu)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '4' })}
                                onClick={(e) => { e.preventDefault(); this.toggle('4'); }}
                                tag="a"
                                href=""
                                style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-users mr-2"></i> Data Wali</span>
                                {renderCheck(this.props.verifikasi.wali)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '5' })}
                                onClick={(e) => { e.preventDefault(); this.toggle('5'); }}
                                tag="a"
                                href=""
                                style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-file-text mr-2"></i> Surat Pernyataan</span>
                                {renderCheck(this.props.verifikasi.pendukung)}
                            </ListGroupItem>

                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '6' })}
                                onClick={(e) => { e.preventDefault(); this.toggle('6'); }}
                                tag="a"
                                href=""
                                style={styles.sidebarItem}
                            >
                                <span><i className="fa fa-check-square mr-2"></i> Verifikasi</span>
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