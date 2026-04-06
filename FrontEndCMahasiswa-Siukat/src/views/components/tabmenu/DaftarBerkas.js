import React from 'react';
import { Row, Col } from 'reactstrap';
import UktTinggi from './UktTinggi';
import UktRendah from './UktRendah';

const DaftarBerkas = (props) => {
    return (
        <div>
            <Row>
                <Col sm="12">
                    <UktTinggi/>
                </Col>
            </Row>
            <Row className="margin-top-20">
                <Col sm="12">
                    <UktRendah/>
                </Col>
            </Row>
        </div>
    );
};

export default DaftarBerkas;