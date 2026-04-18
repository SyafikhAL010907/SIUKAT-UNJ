import React from 'react';
import { Row, Col,
    TabContent, TabPane,
    ListGroup, ListGroupItem, Card } from 'reactstrap';
import classnames from 'classnames';
import { Loading }  from 'redux-global-loader';
import { Bantuan, UktLoader,
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
            <div className="modern-portal-container">
                <Loading>
                    <UktLoader/>
                </Loading>
                <div className="container-fluid px-0 px-md-3">
                    <div className="mt-2 mt-md-4">
                        <Row>
                            <Col lg="3" xs="12" className="d-flex flex-column mb-4 mb-lg-0">
                                {/* MENU */}
                                <div className="order-1 order-lg-1">
                                    <ListGroup className="modern-sidebar-menu shadow-sm mb-3">
                                        <ListGroupItem 
                                            className={classnames({ active: this.state.activeTab === '1' }, "py-3 px-4 border-0")} 
                                            onClick={(e) => { this.toggle(e, '1'); }}
                                            style={{cursor: 'pointer'}}
                                        >
                                            <i className="fa fa-bolt mr-3"></i> Tagihan Listrik
                                        </ListGroupItem>
                                        <ListGroupItem 
                                            className={classnames({ active: this.state.activeTab === '2' }, "py-3 px-4 border-0")} 
                                            onClick={(e) => { this.toggle(e, '2'); }}
                                            style={{cursor: 'pointer'}}
                                        >
                                            <i className="fa fa-file-pdf-o mr-3"></i> Gabung Berkas
                                        </ListGroupItem>
                                        <ListGroupItem 
                                            className={classnames({ active: this.state.activeTab === '3' }, "py-3 px-4 border-0")} 
                                            onClick={(e) => { this.toggle(e, '3'); }}
                                            style={{cursor: 'pointer'}}
                                        >
                                            <i className="fa fa-compress mr-3"></i> Ukuran Berkas
                                        </ListGroupItem>
                                    </ListGroup>
                                </div>

                                {/* BANTUAN */}
                                <div className="order-3 order-lg-2 mt-2 mt-lg-3">
                                    <Bantuan />
                                </div>
                            </Col>
                            
                            <Col lg="9" xs="12" className="d-flex flex-column">
                                <TabContent activeTab={this.state.activeTab} className="h-100">
                                    <TabPane tabId="1" className="h-100">
                                        <TagihanListrik/>
                                    </TabPane>
                                    <TabPane tabId="2" className="h-100">
                                        <GabungBerkas/>
                                    </TabPane>
                                    <TabPane tabId="3" className="h-100">
                                        <UkuranBerkas/>
                                    </TabPane>
                                </TabContent>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

export default Petunjuk;