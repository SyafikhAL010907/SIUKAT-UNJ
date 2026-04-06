import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './dist/libraries/font-awesome-4.7.0/css/font-awesome.min.css';
import 'react-day-picker/lib/style.css';
import './dist/css/loader.css';
import './coreui/index.styles.css';
import './dist/css/styles.css';
import Login from './coreui/views/Pages/Login'
import Full from './coreui/containers/Full'
import Page404 from './coreui/views/Pages/Page404';
import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/" component={Login}/>
            <Route path="/admin" component={Full}/>
            <Route component={Page404}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
