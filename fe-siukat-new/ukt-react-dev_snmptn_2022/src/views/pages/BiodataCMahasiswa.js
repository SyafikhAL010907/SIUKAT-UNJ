import React from 'react';
import {
    TabContent,
    TabPane,
    Row,
    Col,
    ListGroup,
    ListGroupItem,
} from 'reactstrap';
import classnames from 'classnames';
import {
    BiodataPribadi,
    BiodataVerifikasi,
    BiodataInfo,
    BiodataOrangTua,
    DataSekolah,
} from '../components';
import { cmahasiswa, bio_cmahasiswa } from '../../actions';
import { cookies, cookieName } from '../../global';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const CheckIcon = () => (
    <span className="pull-right">
        <i className="fa fa-check"></i>
    </span>
);

class BiodataCMahasiswa extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1',
        };

        this.toggle = this.toggle.bind(this);
        this.updateVerifikasi = this.updateVerifikasi.bind(this);
    }

    updateVerifikasi() {
        // delay mencegah flag verifikasi gagal terupdate akibat promise.
        setTimeout(() => {
            this.props.dispatch(
                bio_cmahasiswa.checkDataComplete(cookies.get(cookieName))
            );
            this.props.dispatch(
                cmahasiswa.checkDataComplete(cookies.get(cookieName))
            );
        }, 3000);
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(cmahasiswa.checkDataComplete(cookies.get(cookieName)));
        this.props.dispatch(bio_cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(
            bio_cmahasiswa.checkDataComplete(cookies.get(cookieName))
        );
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    render() {
        // console.log(typeof this.props.bio_cmahasiswa.flag_lengkap);
        if (this.props.bio_cmahasiswa.flag_lengkap === '1') {
            return <Redirect to="/main/biodata/selesai-isi-biodata" />;
        }
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
                                <div className="clearfix">
                                    <i className="fa fa-user"></i> Biodata Pribadi
                                    {this.props.bio_verifikasi.biodataPribadi === 1 ? (
                                        <CheckIcon />
                                    ) : (
                                        ''
                                    )}
                                </div>
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
                                <div className="clearfix">
                                    <i className="fa fa-user"></i> Biodata Orang Tua dan Wali
                                    {this.props.bio_verifikasi.biodataOrtu === 1 ? (
                                        <CheckIcon />
                                    ) : (
                                        ''
                                    )}
                                </div>
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
                                <div className="clearfix">
                                    <i className="fa fa-user"></i> Data Sekolah
                                    {this.props.bio_verifikasi.biodataSekolah === 1 ? (
                                        <CheckIcon />
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </ListGroupItem>
                            <ListGroupItem
                                className={classnames({
                                    active: this.state.activeTab === '9',
                                    'bg-warning': this.state.activeTab !== '9',
                                })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.toggle('9');
                                }}
                                tag="a"
                                href=""
                            >
                                <div className="clearfix">
                                    <i className="fa fa-check-square"></i> Verifikasi
                                </div>
                            </ListGroupItem>
                        </ListGroup>
                        <BiodataInfo />
                    </Col>
                    <Col md="9" xs="12">
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <BiodataPribadi
                                    updateVerifikasi={this.updateVerifikasi}
                                    allow={this.props.bio_verifikasi.biodataPribadi}
                                />
                            </TabPane>
                            <TabPane tabId="2">
                                <BiodataOrangTua
                                    updateVerifikasi={this.updateVerifikasi}
                                    allow={this.props.bio_verifikasi.biodataOrtu}
                                />
                            </TabPane>
                            <TabPane tabId="3">
                                <DataSekolah
                                    updateVerifikasi={this.updateVerifikasi}
                                    allow={this.props.bio_verifikasi.biodataSekolah}
                                />
                            </TabPane>
                            <TabPane tabId="9">
                                <BiodataVerifikasi
                                    updateVerifikasi={this.updateVerifikasi}
                                    router={this.props}
                                    allow={
                                        this.props.bio_verifikasi.biodataPribadi &&
                                        this.props.bio_verifikasi.biodataOrtu &&
                                        this.props.bio_verifikasi.biodataSekolah
                                    }
                                    verified={this.props.bio_verifikasi.verifikasi}
                                />
                            </TabPane>
                        </TabContent>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect((store) => ({
    verifikasi: store.cmahasiswa.verifikasi,
    bio_verifikasi: store.bio_cmahasiswa.bio_verifikasi,
    cmahasiswa: store.cmahasiswa.cmahasiswa,
    bio_cmahasiswa: store.bio_cmahasiswa.bio_cmahasiswa,
}))(BiodataCMahasiswa);
