import React from 'react';
import { Container, Row, Col,
    TabContent, TabPane,
    ListGroup, ListGroupItem, } from 'reactstrap';
import classnames from 'classnames';
import { Loading }  from 'redux-global-loader';
import { Navigation, Footer, Bantuan, UktLoader,
    GabungBerkas, UkuranBerkas, TagihanListrik } from '../components';

class Petunjuk extends React.Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1'
        };
    }
    toggle(e, tab) {
        e.preventDefault();
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    render() {
        return (
            <div>
                <Navigation router={this.props}/>
                <Loading>
                    <UktLoader/>
                </Loading>
                <Container className="margin-top-90">
                    <div className="margin-top-20">
                        <Row>
                            <Col md="3" xs="12">
                                <ListGroup className="tab-pane-menu">
                                    <ListGroupItem 
                                        className={classnames({ active: this.state.activeTab === '1' })} 
                                        onClick={(e) => { this.toggle(e, '1'); }}
                                        tag="a" 
                                        href="">
                                        <i className="fa fa-flash"></i> Memeriksa Tagihan Listrik
                                    </ListGroupItem>
                                    <ListGroupItem 
                                        className={classnames({ active: this.state.activeTab === '2' })} 
                                        onClick={(e) => { this.toggle(e, '2'); }}
                                        tag="a" 
                                        href="">
                                        <i className="fa fa-file"></i> Menggabungkan Hasil Scan
                                    </ListGroupItem>
                                    <ListGroupItem 
                                        className={classnames({ active: this.state.activeTab === '3' })} 
                                        onClick={(e) => { this.toggle(e, '3'); }}
                                        tag="a" 
                                        href="">
                                        <i className="fa fa-image"></i> Mengubah Ukuran Berkas
                                    </ListGroupItem>
                                </ListGroup>
                                <Bantuan/>
                            </Col>
                            <Col md="9" xs="12">
                                <TabContent activeTab={this.state.activeTab} className="tab-pane-content">
                                    <TabPane tabId="1">
                                        <TagihanListrik/>
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <GabungBerkas/>
                                    </TabPane>
                                    <TabPane tabId="3">
                                        <UkuranBerkas/>
                                    </TabPane>
                                </TabContent>
                            </Col>
                        </Row>
                        <Footer/>
                    </div>
                </Container>
            </div>
        );
    }
}

export default Petunjuk;