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
            <div>
                <Loading>
                    <UktLoader/>
                </Loading>
                <div>
                    <div className="mt-4">
                        <Row>
                           <Col md="3" xs="12" className="d-flex flex-column">
    
    {/* MENU */}
    <div className="order-1 order-md-1">
        <ListGroup className="modern-sidebar-menu shadow-sm mb-3">
            <ListGroupItem 
                className={classnames({ active: this.state.activeTab === '1' })} 
                onClick={(e) => { this.toggle(e, '1'); }}
            >
                <i className="fa fa-flash"></i> Memeriksa Tagihan Listrik
            </ListGroupItem>
            <ListGroupItem 
                className={classnames({ active: this.state.activeTab === '2' })} 
                onClick={(e) => { this.toggle(e, '2'); }}
            >
                <i className="fa fa-file"></i> Menggabungkan Hasil Scan
            </ListGroupItem>
            <ListGroupItem 
                className={classnames({ active: this.state.activeTab === '3' })} 
                onClick={(e) => { this.toggle(e, '3'); }}
            >
                <i className="fa fa-image"></i> Mengubah Ukuran Berkas
            </ListGroupItem>
        </ListGroup>
    </div>

    {/* BANTUAN */}
    <div className="order-3 order-md-2 mt-3 mt-md-0">
        <Bantuan />
    </div>

</Col>
                            <Col md="9" xs="12" className="d-flex flex-column">
                                <TabContent activeTab={this.state.activeTab} className="h-100">
                                    <TabPane tabId="1" className="h-100">
                                        <Card className="premium-card">
                                            <TagihanListrik/>
                                        </Card>
                                    </TabPane>
                                    <TabPane tabId="2" className="h-100">
                                        <Card className="premium-card">
                                            <GabungBerkas/>
                                        </Card>
                                    </TabPane>
                                    <TabPane tabId="3" className="h-100">
                                        <Card className="premium-card">
                                            <UkuranBerkas/>
                                        </Card>
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