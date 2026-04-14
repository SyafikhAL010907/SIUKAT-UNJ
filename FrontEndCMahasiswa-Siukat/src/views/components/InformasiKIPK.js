import React from 'react';
import { Card, Row, Col } from 'reactstrap';

class InformasiKIPK extends React.Component {
    render() {
        return (
            <div>
                <Card body className={this.props.cardStyles} color={this.props.color}>
                    <Row>
                        <Col md={2} xs={12}><h2 className="margin-top-10"><i className={this.props.icon}></i></h2></Col>
                        <Col md={8} xs={12}>
                            Informasi KIPK:<br />
                            <h4>{this.props.content}</h4>
                            {this.props.message}
                        </Col>
                        <Col md={2} xs={12}><h2 className="margin-top-10"><i className={this.props.icon}></i></h2></Col>
                    </Row>
                    <Row className="margin-top-10">
                        <Col md={12} xs={12}><a className="btn btn-primary" href="/VerKIPK.pdf" target="_blank" rel="noopener noreferrer"><i className="fa fa-file"></i> Download Dokumen KIPK</a></Col>
                    </Row>
                </Card>
                <hr />
            </div>
        );
    }
}

export default InformasiKIPK;