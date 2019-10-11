import React from "react";
import LoginForm from './Login/Login.js';
import Home from './Home/Home.js';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { observable } from "mobx-react";
// import { observable } from "mobx";

function BasicExample () {
    return(
      <Router>
        <Route exact path="/" component={
          LoginForm
        }/>
        <Route path="/home" component={
          Home
        }/>
      </Router>
    );
}

export default BasicExample;
