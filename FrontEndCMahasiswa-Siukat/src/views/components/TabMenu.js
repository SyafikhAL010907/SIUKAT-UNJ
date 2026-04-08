import React from 'react';
import {
    Row,
    Col,
    Alert,
    Card,
    CardTitle,
    TabContent,
    TabPane,
    ListGroup,
    ListGroupItem,
} from 'reactstrap';
import classnames from 'classnames';
import { cookies, cookieName } from '../../global';
import {
    DataDiri,
    JadwalUkt,
    InfoBiodata,
    TabelUkt,
    FAQ,
    AlurUKT,
    DaftarBerkas,
    JadwalKlarifikasi,
    KetentuanKlarifikasi,
} from '../components';
import { cmahasiswa, info } from '../../actions';
import { connect } from 'react-redux';

class TabMenu extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1',
        };
    }
    UNSAFE_componentWillMount() {
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(info.fetchInfo());
    }
    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }
    render() {
        if (!this.props.cmahasiswa || Object.keys(this.props.cmahasiswa).length === 0) {
            return (
                <div className="text-center p-5">
                    <i className="fa fa-spinner fa-spin fa-2x mb-3"></i>
                    <p>Memuat menu sistem UKT...</p>
                </div>
            );
        }
        // const flag = this.props.cmahasiswa.flag
        // console.log(flag)
        // if (flag === 'terima_ukt' || flag === 'pengumuman' || flag === 'sanggah_ukt' ) {
        //     console.log(flag)
        //     return <Redirect to={"/main/ukt"} />
        // }
        return (
            <div className="mt-4">
                <Row>
                    <Col md="3" xs="12">
                        <ListGroup className="modern-sidebar-menu shadow-sm h-100">
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.toggle('1');
                                }}
                            >
                                <i className="fa fa-user"></i> Data Diri
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.toggle('2');
                                }}
                            >
                                <i className="fa fa-calendar-check-o"></i> Informasi Jadwal
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.toggle('3');
                                }}
                            >
                               
                                <i className="fa fa-money"></i> Informasi UKT
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '5' })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.toggle('5');
                                }}
                            >
                                <i className="fa fa-road"></i> Alur Pengisian UKT
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '6' })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.toggle('6');
                                }}
                            >
                                <i className="fa fa-folder-open-o"></i> Berkas Penting
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '8' })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.toggle('8');
                                }}
                            >
                                <i className="fa fa-question-circle-o"></i> FAQ
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col md="9" xs="12" className="d-flex flex-column">
                        {this.props.cmahasiswa.bidik_misi_cmahasiswa === 'Ya' && (
                            <Alert color="warning" className="rounded-lg shadow-sm border-0 mb-4">
                                <i className="fa fa-graduation-cap mr-2"></i>
                                <strong>Peserta Bidik Misi:</strong> Anda diwajibkan tetap mengisi data untuk penentuan UKT dengan
                                sebenar-benarnya. Data ini akan digunakan jika status Bidik Misi dicabut.
                            </Alert>
                        )}
                        <TabContent
                            activeTab={this.state.activeTab}
                            className="h-100"
                        >
                            <TabPane tabId="1" className="h-100">
                                <Card className="premium-card">
                                    <CardTitle tag="h4">Data Diri Mahasiswa</CardTitle>
                                    <DataDiri />
                                </Card>
                            </TabPane>
                            <TabPane tabId="2" className="h-100">
                                <Card className="premium-card">
                                    <CardTitle tag="h4">Informasi Jadwal Penting</CardTitle>
                                    <JadwalUkt info={this.props.info} />
                                </Card>
                            </TabPane>
                            <TabPane tabId="3" className="h-100">
                                <Card className="premium-card">
                                    <CardTitle tag="h4">Status Kelengkapan Biodata</CardTitle>
                                    <InfoBiodata />
                                </Card>
                            </TabPane>
                            <TabPane tabId="4" className="h-100">
                                <Card className="premium-card">
                                    <CardTitle tag="h4">Informasi Tabel UKT</CardTitle>
                                    <TabelUkt />
                                </Card>
                            </TabPane>
                            <TabPane tabId="5" className="h-100">
                                <Card className="premium-card">
                                    <CardTitle tag="h4">Alur Pengisian UKT</CardTitle>
                                    <AlurUKT />
                                </Card>
                            </TabPane>
                            <TabPane tabId="6" className="h-100">
                                <Card className="premium-card">
                                    <CardTitle tag="h4">Daftar Berkas Persyaratan</CardTitle>
                                    <DaftarBerkas />
                                </Card>
                            </TabPane>
                            <TabPane tabId="7" className="h-100">
                                <Card className="premium-card">
                                    <CardTitle tag="h4">Klarifikasi Data UKT</CardTitle>
                                    <Alert color="warning" className="border-0 shadow-sm mb-4">
                                        <b>Klarifikasi UKT</b> adalah momen untuk memperbarui dokumen yang memiliki kesalahan pengisian.
                                    </Alert>
                                    <KetentuanKlarifikasi />
                                    <JadwalKlarifikasi />
                                </Card>
                            </TabPane>
                            <TabPane tabId="8" className="h-100">
                                <Card className="premium-card">
                                    <CardTitle tag="h4">Frequently Asked Questions (FAQ)</CardTitle>
                                    <FAQ />
                                </Card>
                            </TabPane>
                        </TabContent>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default connect((store) => ({
    cmahasiswa: store.cmahasiswa.cmahasiswa,
    info: store.info.info,
}))(TabMenu);
