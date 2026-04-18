import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody, CardFooter } from "reactstrap";
import { Link } from "react-router-dom";

class Page404 extends Component {
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Card>
                {/* <CardHeader className="btn-danger"><b>Terjadi Kesalahan!</b></CardHeader> */}
                <CardBody>
                  <div className="clearfix">
                    <h1 className="float-left display-3 mr-4">404</h1>
                    <h4 className="pt-3">Oops! Anda Tersesat.</h4>
                    <p className="text-muted float-left">
                      Halaman yang Anda cari tidak ditemukan.
                    </p>
                  </div>
                  <div className="text-center">
                    <Link to="/" className="btn btn-warning btn-sm">
                      Kembali ke Halaman Utama
                    </Link>
                  </div>
                </CardBody>
                <CardFooter className="btn-success">
                  Copyrights &copy; 2017 Sistem Informasi UKT | Oleh UPT TIK UNJ
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Page404;
