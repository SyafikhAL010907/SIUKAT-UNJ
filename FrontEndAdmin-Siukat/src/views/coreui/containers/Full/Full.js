import React, {Component} from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
// import Breadcrumb from '../../components/Breadcrumb/';
// import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import Page404 from '../../views/Pages/Page404';
// import Dashboard from '../../views/Dashboard/';
// import Charts from '../../views/Charts/';
// import Widgets from '../../views/Widgets/';
// import Buttons from '../../views/Components/Buttons/';
// import Cards from '../../views/Components/Cards/';
// import Forms from '../../views/Components/Forms/';
// import Modals from '../../views/Components/Modals/';
// import SocialButtons from '../../views/Components/SocialButtons/';
// import Switches from '../../views/Components/Switches/';
// import Tables from '../../views/Components/Tables/';
// import Tabs from '../../views/Components/Tabs/';
// import FontAwesome from '../../views/Icons/FontAwesome/';
// import SimpleLineIcons from '../../views/Icons/SimpleLineIcons/';

import { connect } from 'react-redux'
import { user } from '../../../../actions'
import { cookies, cookieName, notif } from '../../../../global'
import {Administrator, Dashboard, JadwalUkt, RefUkt, CalonMahasiswa, DetailCmahasiswa,
        Fakultas, ProgramStudi, Klarifikasi} from '../../../pages';
import { Loading }  from 'redux-global-loader';
import { Loader } from '../../../components'

class Full extends Component {
  constructor(props){
      super(props)
      this.state = {
          isLogin: undefined
      }
  }
  componentWillMount(){
      this.setState({
          isLogin: cookies.get(cookieName)
      })
      this.props.dispatch(user.getByLoggedIn(cookies.get(cookieName)))
  }
  render() { 
    if(cookies.get(cookieName) === undefined){
        cookies.remove(cookieName, {path: "/"})
        notif("Sesi Telah Habis!", "Silakan masuk kembali", "error")
        return <Redirect to="/"/>
    }
    return (
      <div className="app">
        <Header router={this.props}/>
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Loading>
                <Loader/>
            </Loading>
            {/* <Breadcrumb /> */}
            <Container fluid style={{paddingTop: "20px"}}>
              <Switch> 
                <Route exact path={this.props.match.path + "/dashboard"} component={Dashboard}/>
                <Route exact path={this.props.match.path + "/manajemen/administrator"} component={Administrator}/>
                <Route exact path={this.props.match.path + "/manajemen/jadwal-ukt"} component={JadwalUkt}/>
                <Route exact path={this.props.match.path + "/manajemen/ukt"} component={RefUkt}/>
                <Route exact path={this.props.match.path + "/peserta/semua"} component={CalonMahasiswa}/>
                <Route exact path={this.props.match.path + "/peserta/klarifikasi"} component={Klarifikasi}/>
                <Route path={this.props.match.path + "/peserta/:no_peserta"} component={DetailCmahasiswa}/>
                <Route exact path={this.props.match.path + "/rekapitulasi/fakultas"} component={Fakultas}/>
                <Route exact path={this.props.match.path + "/rekapitulasi/program-studi"} component={ProgramStudi}/>
                <Route component={Page404}/>
              </Switch>
            </Container>
          </main>
          {/* <Aside /> */}
        </div>
        <Footer />
      </div>
    );
  }
}

export default connect((store) => {
  return {
    user: store.user.user,
  }
})(Full)
