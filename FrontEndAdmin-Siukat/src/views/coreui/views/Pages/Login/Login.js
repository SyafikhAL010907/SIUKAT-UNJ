import React, {Component} from "react";
import logoUnj from "../../../../dist/images/unj.png";
import {Container, Alert, Form, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon} from "reactstrap";
import { captcha } from '../../../../../actions'
import { user } from '../../../../../api'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { notif, cookies, cookieName } from '../../../../../global';

class Login extends Component {
  constructor(props){
      super(props)
      this.state = {
        no_peserta: '',
        password: '',
        kode_captcha: '',
        jawaban: '',
        authCookie: null,
        tombolMasuk: 'Masuk',
      }
  }
  componentWillMount(){
      this.props.dispatch(captcha.fetchCaptcha())
      this.setState({
          authCookie: cookies.get(cookieName)
      })
  }
  handleNamaPengguna(e){
      this.setState({
          no_peserta: e.target.value
      })
  }
  handleKataSandi(e){
      this.setState({
          password: e.target.value
      })
  }
  handleCaptcha(e){
      var self = this
      this.setState({
          jawaban: e.target.value,
          kode_captcha: self.props.captcha.kode
      })
  }
  login(e){
      e.preventDefault()
      this.setState({
          tombolMasuk: 'Mohon Menunggu'
      })
      user.login(this.state).then(res => {
          cookies.set(cookieName, res.token, {path: "/"})
          notif("Berhasil!", "Anda berhasil masuk", "success")
          this.setState({
              authCookie: cookies.get(cookieName)
          })
      }, function(err){
          notif("Gagal!", "Periksa kembali username, password, dan captcha anda", "error")
      })
      this.setState({
          tombolMasuk: 'Masuk'
      })

  }
  render() {
    if( this.state.authCookie !== undefined){
        return <Redirect to='/admin/dashboard'/>
    }
    return (
      <div className="app flex-row align-items-center login-card">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup className="mb-0">
                <Card className="text-white bg-green py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="card-body text-center">
                    <div>
                      <img src={logoUnj} alt="logo-unj" width="150"/><br/><br/>
                      <h2>ADMINISTRATOR</h2>
                      <p>Sistem Informasai Uang Kuliah Tunggal<br/>
                        Universitas Negeri Jakarta</p>
                      <small>&copy; {(new Date().getFullYear())} All Right Reserved. Oleh UPT TIK UNJ.</small>                      
                    </div>
                  </CardBody>
                </Card>
                <Card className="p-4">
                  <CardBody className="card-body">
                    <h1>Portal Masuk</h1>
                    <p className="text-muted">Masukkan ID Anda</p>
                    <Form onSubmit={this.login.bind(this)}>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend" className="input-group-text"><i className="fa fa-user"></i></InputGroupAddon>
                        <Input type="text" autoFocus placeholder="Nama Pengguna" onChange={this.handleNamaPengguna.bind(this)} />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend" className="input-group-text"><i className="fa fa-lock"></i></InputGroupAddon>
                        <Input type="password" placeholder="Kata Sandi" onChange={this.handleKataSandi.bind(this)} />
                      </InputGroup>
                      <hr/>
                      <Alert color="warning">Berapakah { this.props.captcha.pertanyaan }?</Alert>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend" className="input-group-text"><i className="fa fa-key"></i></InputGroupAddon>                      
                        <Input type="hidden" name="kode_captcha" id="kode_captcha" defaultValue={ this.props.captcha.kode } />
                        <Input type="text" name="jawaban" id="jawaban" placeholder="Jawaban Anda" onChange={this.handleCaptcha.bind(this)} required/>
                      </InputGroup>
                      <Row>
                        <Col xs="12">
                          <Button color="success" className="px-4 btn-block">{ this.state.tombolMasuk }</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default connect((store) => {
  return {
    captcha: store.captcha.captcha,
  }
})(Login);
