import { Route, Redirect } from 'react-router-dom';
import React from 'react';
import Login from './auth/Login';
import CryptoList from './cryptos/CryptoList';
import FinanceList from './finances/FinanceList';

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
      <Route path="/crypto" render={props => {
        if(hasUser) {
          return <CryptoList hasUser={hasUser} userId={userId} {...props}/>
        } else {
          return <Redirect to="/Login"/>
        }
      }}
      />
      <Route path="/finances" render={props => {
        if(hasUser) {
          return <FinanceList userId={userId} {...props}/>
        } else {
          return <Redirect to="/Login"/>
        }
      }}
      />
    </>
  )
}

export default ApplicationViews;