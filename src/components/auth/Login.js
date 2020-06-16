import React, { useState } from 'react';
import apiManager from '../../modules/apiManager';
import { Form, Button, Container } from 'react-bootstrap';

const Login = props => {
  const [credentials, setCredentials] = useState();
  const [registering, setRegistering] = useState(false)
  const toggle = () => setRegistering(!registering)

  const handleFieldChange = e => {
    const stateToChange = { ...credentials };
    stateToChange[e.target.id] = e.target.value;
    setCredentials(stateToChange);
  }

  const handleLoginAndRegister = (e, loginOrRegister) => {
    e.preventDefault();
    apiManager.get("users")
      .then(users => {
        let newUserId = users.length + 1
        const user = users.find(user => user.email === credentials.email && user.password === credentials.password)
        let date = new Date()
        if(!user && loginOrRegister !== 'register') return alert('user does not exist')
        if(!user && loginOrRegister === 'register') {
          if(credentials.confirmPassword !== credentials.password) return alert('passwords do not match')
          console.log(credentials)
          delete credentials.confirmPassword
          credentials.userId = newUserId
          apiManager.post('users', credentials).then(() => {
            apiManager.getByUserId('users', credentials.userId).then(user => {
              const stateToChange = { ...credentials }
              stateToChange.userId = user.id
              setCredentials(stateToChange)
              console.log(credentials)
              props.setUser(user)
              props.history.push("/");
            })
          })
        } else {
          const stateToChange = { ...credentials }
          stateToChange.userId = user.id
          setCredentials(stateToChange)
          props.setUser(user)
          props.history.push("/");
        }
      })
  }

  return (
    <Container>
      {
        registering ? 
        (
        <Form onSubmit={e => handleLoginAndRegister(e, 'register')}>
          <fieldset>
            <h3>Register</h3>
            <div>
              <input onChange={handleFieldChange} type="email" id="email" placeholder="Email Address" required/>
              <label htmlFor="inputEmail">Email address</label>

              <input onChange={handleFieldChange} type="password" id="password" required placeholder="Password"/>
              <label htmlFor="inputPassword">Password</label>

              <input onChange={handleFieldChange} type="password" id="confirmPassword" required placeholder="Confirm Password"/>
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>
            <Button type="submt">Register</Button>
          </fieldset>
            <p onClick={toggle}>Back to Login</p>
        </Form> 
        ) 
        : 
        (
        <Form onSubmit={e => handleLoginAndRegister(e, 'login')}>
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
        <p onClick={toggle}>New? Register Here</p>
        </Form>
        )
      }
    </Container>
  );
};

export default Login;