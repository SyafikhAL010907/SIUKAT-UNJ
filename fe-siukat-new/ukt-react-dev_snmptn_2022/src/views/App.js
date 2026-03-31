import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './dist/libraries/font-awesome-4.7.0/css/font-awesome.min.css';
import 'react-day-picker/lib/style.css';
import './dist/css/loader.css';
import './dist/css/styles.css';
import Login from './pages/Login';
import Layout from './pages/Layout';
import {
    BrowserRouter,
    Route,
} from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route exact path="/" component={Login}/>
                    <Route path="/main" component={Layout}/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
