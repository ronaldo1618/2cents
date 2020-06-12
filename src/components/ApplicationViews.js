import { Route, Redirect } from 'react-router-dom';
import React from 'react';
import Login from './auth/Login';
import CryptoList from './cryptos/CryptoList';
import ProjectList from './projects/ProjectList';
import FinanceList from './finances/FinanceList';
import Home from './home/Home';
import FinanceForm from './finances/FinanceForm';

const ApplicationViews = props => {
  const hasUser = props.hasUser;
  const setUser = props.setUser;
  let userId = ""
  if(hasUser) {
    userId = JSON.parse(sessionStorage.getItem("credentials")).id
  }

  return (
    <>
      <Route path="/login" render={props => {
        return <Login setUser={setUser} hasUser={hasUser} {...props}/>
      }}
      />
      <Route exact path="/" render={props => {
        if(hasUser) {
          return <Home userId={userId} {...props}/>
        } else {
          return <Redirect to="Login"/>
        }
      }}
      />
      <Route path="/crypto" render={props => {
        if(hasUser) {
          return <CryptoList hasUser={hasUser} userId={userId} {...props}/>
        } else {
          return <Redirect to="/Login"/>
        }
      }}
      />
      <Route exact path="/finances" render={props => {
        if(hasUser) {
          return <FinanceList userId={userId} {...props}/>
        } else {
          return <Redirect to="/Login"/>
        }
      }}
      />
      <Route exact path="/projects" render={props => {
        if(hasUser) {
          return <ProjectList userId={userId} {...props}/>
        } else {
          return <Redirect to="/Login"/>
        }
      }}
      />
      <Route exact path="/finances/form" render={props => {
        if(hasUser) {
          return <FinanceForm userId={userId} {...props}/>
        } else {
          return <Redirect to="login"/>
        }
      }}
      />
      <Route exact path="/finances/form/:financeId(\d+)" render={props => {
        if(hasUser) {
          return <FinanceForm userId={userId} {...props}/>
        } else {
          return <Redirect to="/Login"/>
        }
      }}
      />
    </>
  )
}

export default ApplicationViews;