import React, { useState } from 'react';
import apiManager from '../../modules/apiManager';
import Button from 'react-bootstrap/Button'

const Login = props => {
  const [credentials, setCredentials] = useState();

  const handleFieldChange = e => {
    const stateToChange = { ...credentials };
    stateToChange[e.target.id] = e.target.value;
    setCredentials(stateToChange);
  }

  const handleLogin = e => {
    e.preventDefault();
    apiManager.get("users")
      .then(users => {
        const user = users.find(user => user.email === credentials.email)
        if(!user) return alert('user does not exist')
        let date = new Date()
        console.log(user.id)
        console.log(date.getFullYear())
        console.log(date.getMonth() + 1)
        const stateToChange = { ...credentials }
        stateToChange.userId = user.id
        setCredentials(stateToChange)
        props.setUser(user)
        props.history.push("/");
      })
  }

  return (
    <form onSubmit={handleLogin}>
      <fieldset>
        <h3>Please Sign In</h3>
        <div className="formgrid">
          <input onChange={handleFieldChange} type="email" id="email" placeholder="Email Address" required="" autoFocus="" />
          <label htmlFor="inputEmail">Email address</label>

          <input onChange={handleFieldChange} type="password" id="password"  placeholder="Password" required="" />
          <label htmlFor="inputPassword">Password</label>
        </div>
        <Button type="submit">Sign In</Button>
      </fieldset>
    </form>
  );
};

export default Login;