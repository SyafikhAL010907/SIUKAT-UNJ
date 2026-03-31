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
    Bantuan,
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
        // const flag = this.props.cmahasiswa.flag
        // console.log(flag)
        // if (flag === 'terima_ukt' || flag === 'pengumuman' || flag === 'sanggah_ukt' ) {
        //     console.log(flag)
        //     return <Redirect to={"/main/ukt"} />
        // }
        return (
            <div className="margin-top-20">
                <Row>
                    <Col md="3" xs="12">
                        <ListGroup className="tab-pane-menu">
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.toggle('1');
                                }}
                                tag="a"
                                href=""
                            >
                                <i className="fa fa-user"></i> Data Diri
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.toggle('2');
                                }}
                                tag="a"
                                href=""
                            >
                                <i className="fa fa-clock-o"></i> Informasi Jadwal
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.toggle('3');
                                }}
                                tag="a"
                                href=""
                            >
                                <i className="fa fa-user"></i> Informasi Biodata
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '4' })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.toggle('4');
                                }}
                                tag="a"
                                href=""
                            >
                                <i className="fa fa-money"></i> Informasi UKT
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '5' })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.toggle('5');
                                }}
                                tag="a"
                                href=""
                            >
                                <i className="fa fa-recycle"></i> Alur Pengisian UKT
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '6' })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.toggle('6');
                                }}
                                tag="a"
                                href=""
                            >
                                <i className="fa fa-download"></i> Berkas Yang Diperlukan
                            </ListGroupItem>
                            {/* <ListGroupItem
                className={classnames({ active: this.state.activeTab === "7" })}
                onClick={(e) => {
                  e.preventDefault();
                  this.toggle("7");
                }}
                tag="a"
                href=""
              >
                <i className="fa fa-exclamation"></i> Klarifikasi UKT
              </ListGroupItem> */}
                            <ListGroupItem
                                className={classnames({ active: this.state.activeTab === '8' })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.toggle('8');
                                }}
                                tag="a"
                                href=""
                            >
                                <i className="fa fa-question-circle"></i> FAQ
                            </ListGroupItem>
                        </ListGroup>
                        <Bantuan />
                    </Col>
                    <Col md="9" xs="12">
                        {this.props.cmahasiswa.bidik_misi_cmahasiswa === 'Ya' && (
                            <Alert color="warning">
                                Anda termasuk peserta Bidik Misi. Peserta Bidik Misi juga
                                diwajibkan mengisi data untuk penentuan UKT dengan
                                sebenar-benarnya dan sejujur-jujurnya. Apabila suatu saat status
                                Bidik Misi anda dicabut, maka hasil UKT ini yang harus anda
                                bayarkan pada setiap semester.
                            </Alert>
                        )}
                        <TabContent
                            activeTab={this.state.activeTab}
                            className="tab-pane-content"
                        >
                            <TabPane tabId="1">
                                <Row>
                                    <Col sm="12">
                                        <Card body>
                                            <CardTitle>Data Diri</CardTitle>
                                            <DataDiri />
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="2">
                                <Row>
                                    <Col sm="12">
                                        <Card body>
                                            <CardTitle>Informasi Jadwal</CardTitle>
                                            <JadwalUkt info={this.props.info} />
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="3">
                                <Row>
                                    <Col sm="12">
                                        <Card body>
                                            <CardTitle>Informasi Biodata</CardTitle>
                                            <InfoBiodata />
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="4">
                                <Row>
                                    <Col sm="12">
                                        <Card body>
                                            <CardTitle>Informasi UKT</CardTitle>
                                            <TabelUkt />
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="5">
                                <Row>
                                    <Col sm="12">
                                        <Card body>
                                            <CardTitle>Alur Pengisian UKT</CardTitle>
                                            <AlurUKT />
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="6">
                                <Row>
                                    <Col sm="12">
                                        <Card body>
                                            <CardTitle>Berkas Yang Diperlukan</CardTitle>
                                            <DaftarBerkas />
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="7">
                                <Row>
                                    <Col sm="12">
                                        <Card body>
                                            <CardTitle>Klarifikasi UKT</CardTitle>
                                            <Alert color="warning">
                                                <b>Klarifikasi UKT</b> adalah memperbarui dokumen atau
                        data yang <b>salah</b> pada saat pengisian UKT daring.
                                            </Alert>
                                            <KetentuanKlarifikasi />
                                            <JadwalKlarifikasi />
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="8">
                                <Row>
                                    <Col sm="12">
                                        <Card body>
                                            <CardTitle>Frequently Asked Questions</CardTitle>
                                            <FAQ />
                                        </Card>
                                    </Col>
                                </Row>
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
