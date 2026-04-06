import React from 'react'
import {Row, Col, Button,
        TabContent, TabPane, Nav, NavItem, NavLink, Table } from 'reactstrap'
import classnames from 'classnames';
import { connect } from 'react-redux'
import { cmahasiswa, ukt, user, hitung } from '../../../actions'
import { Ayah, Ibu, Kendaraan, Listrik, Pendukung, Pribadi, Rumah, Wali } from './details'
import { cookies, cookieName, rupiah } from '../../../global'
        
class DetailCmahasiswa extends React.Component{
    constructor(props) {
      super(props);
  
      this.toggle = this.toggle.bind(this);
      this.state = {
        activeTab: '1'
      };
    }

    componentWillMount(){
      this.props.dispatch(user.getByLoggedIn(cookies.get(cookieName)))
      this.props.dispatch(cmahasiswa.getById(cookies.get(cookieName), this.props.match.params.no_peserta))
      this.props.dispatch(ukt.getById(cookies.get(cookieName), this.props.match.params.no_peserta))
      this.props.dispatch(hitung.flagHitung(cookies.get(cookieName), this.props.match.params.no_peserta))
    }
  
    toggle(tab) {
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab
        });
      }
    }

    batalKlarifikasi = () => {
      this.props.dispatch(cmahasiswa.flagBatalKlarifikasi(cookies.get(cookieName), this.props.match.params.no_peserta))
    }

    selesaiKlarifikasi = () => {
      this.props.dispatch(cmahasiswa.flagSelesaiKlarifikasi(cookies.get(cookieName), this.props.match.params.no_peserta))      
    }
    selesaiHitung = () => {
      this.props.dispatch(hitung.flagHitung(cookies.get(cookieName), this.props.match.params.no_peserta))      
    }
    render(){
        return(
            <div>
              { this.props.cmahasiswa.golongan_id && (
                <div>
                  <Row>
                    <Col md="6">
                      <h4><small>UKT Saat Ini:</small> { rupiah(this.props.ukt[this.props.cmahasiswa.golongan_id])} ({this.props.cmahasiswa.golongan_id}) {(this.props.cmahasiswa.penalty === '1') ? "- Penalty": ""} </h4>
                    </Col>
                    <Col md="6" className="text-right">
                      { this.props.cmahasiswa.atribut === "sanggah" && 
                        this.props.cmahasiswa.flag === "sanggah_ukt" && (
                        <div>
                          <Button size="md" color="primary" onClick={this.selesaiKlarifikasi.bind(this)}>Selesai Klarifikasi</Button>{" "}
                          <Button size="md" color="danger" onClick={this.batalKlarifikasi.bind(this)}>Batal Klarifikasi</Button>
                        </div>
                      )}
                    </Col>     
                  </Row>
                  <hr/>
                </div>                
              )}
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '1' })}
                    onClick={() => { this.toggle('1'); }}
                  >
                    Data Pribadi
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => { this.toggle('2'); }}
                  >
                    Data Ayah/Ibu/Wali
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '3' })}
                    onClick={() => { this.toggle('3'); }}
                  >
                    Data Rumah & Listrik
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '4' })}
                    onClick={() => { this.toggle('4'); }}
                  >
                    Data Kendaraan
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '5' })}
                    onClick={() => { this.toggle('5'); }}
                  >
                    Data Pendukung
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '6' })}
                    onClick={() => { this.toggle('6'); }}
                  >
                    Coba Menghitung
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <Pribadi 
                    noPeserta={this.props.match.params.no_peserta}
                    editable={(this.props.cmahasiswa.atribut === "sanggah" && 
                        this.props.cmahasiswa.flag === "sanggah_ukt") || (this.props.user && this.props.user.role === "admin")}
                    />
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col sm="6">
                      <Ayah 
                        noPeserta={this.props.match.params.no_peserta}
                        editable={this.props.cmahasiswa.atribut === "sanggah" && 
                        this.props.cmahasiswa.flag === "sanggah_ukt"}/>
                    </Col>
                    <Col sm="6">
                      <Ibu 
                        noPeserta={this.props.match.params.no_peserta}
                        editable={(this.props.cmahasiswa.atribut === "sanggah" && 
                        this.props.cmahasiswa.flag === "sanggah_ukt") || (this.props.user && this.props.user.role === "admin")}
                        />
                    </Col>
                  </Row>
                  <hr/>
                  <Row>
                    <Col sm="12">
                      <Wali 
                        noPeserta={this.props.match.params.no_peserta}
                        editable={(this.props.cmahasiswa.atribut === "sanggah" && 
                        this.props.cmahasiswa.flag === "sanggah_ukt") || (this.props.user && this.props.user.role === "admin")}
                        />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="3">
                    <Row>
                        <Col sm="12">
                            <Row>
                                <Col sm="6"><Rumah 
                                              noPeserta={this.props.match.params.no_peserta}
                                              editable={this.props.cmahasiswa.atribut === "sanggah" && 
                                              this.props.cmahasiswa.flag === "sanggah_ukt"}
                                              /></Col>
                                <Col sm="6"><Listrik 
                                              noPeserta={this.props.match.params.no_peserta}
                                              editable={this.props.cmahasiswa.atribut === "sanggah" && 
                                              this.props.cmahasiswa.flag === "sanggah_ukt"}
                                              /></Col>
                            </Row>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="4">
                    <Row>
                        <Col sm="12">
                            <Kendaraan 
                              noPeserta={this.props.match.params.no_peserta}
                              editable={this.props.cmahasiswa.atribut === "sanggah" && 
                              this.props.cmahasiswa.flag === "sanggah_ukt"}
                              />
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="5">
                    <Row>
                        <Col sm="12">
                            <Pendukung 
                              noPeserta={this.props.match.params.no_peserta}
                              editable={this.props.cmahasiswa.atribut === "sanggah" && 
                              this.props.cmahasiswa.flag === "sanggah_ukt"}
                              />
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="6">
                    <Row>
                        <Col sm="12">
                          <h4>Coba Menghitung</h4>
                          <hr/>
                          <Button size="md" color="primary" onClick={this.selesaiHitung.bind(this)}>Coba Menghitung Ulang</Button>{" "}
                          <br/><br/>
                          <Table>
                            <tbody>
                              <tr>
                                <th>UKT yang harusnya didapat</th>
                                <td>:</td>
                                <td>{this.props.hitung.choosenUkt} - { rupiah(this.props.ukt[this.props.hitung.choosenUkt])}</td>
                              </tr>
                              <tr>
                                <th>Indeks Kemampuan Bayar</th>
                                <td>:</td>
                                <td>{(this.props.hitung.ikb !== undefined) ? rupiah(parseInt(this.props.hitung.ikb, 10)) : "Rp. 0"}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Col>
                    </Row>
                </TabPane>
              </TabContent>
            </div>
        )
    }
}

export default connect(
  (store) => ({
      ukt: store.ukt.ukt,
      cmahasiswa: store.cmahasiswa.singleCmahasiswa,
      user: store.user.user,
      hitung: store.hitung.hitung
  })
)(DetailCmahasiswa)