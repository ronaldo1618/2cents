import React, { useState } from 'react';
import apiManager from '../../modules/apiManager';
import { Form, Button, Container, Jumbotron } from 'react-bootstrap';
import './Login.css'

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
        if(!user && loginOrRegister !== 'register') return alert('user does not exist')
        if(!user && loginOrRegister === 'register') {
          if(credentials.confirmPassword !== credentials.password) return alert('passwords do not match')
          credentials.id = newUserId
          delete credentials.confirmPassword
          apiManager.post('users', credentials).then(() => {
            apiManager.getById('users', credentials.id).then(newUser => {
              delete credentials.id
              const stateToChange = { ...credentials }
              stateToChange.userId = newUser.id
              setCredentials(stateToChange)
              props.setUser(newUser)
              props.history.push("/");
            })
          })
        } else {
          delete credentials.id
          const stateToChange = { ...credentials }
          stateToChange.userId = user.id
          setCredentials(stateToChange)
          props.setUser(user)
          props.history.push("/");
        }
      })
  }

  return (
    <>
      <img className="img" alt="" src={require('../nav/img.jpg')}/>
      <Container className="w-30 p-5 login-container">
        <Jumbotron className="login-jumbotron">
        {
          registering ? 
          (
          <Form onSubmit={e => handleLoginAndRegister(e, 'register')}>
            <fieldset>
              <div className="logo-container">
                <img alt="" className="logo" src={require('../nav/2cents.png')}></img>
              </div>
              <h2>Welcome to 2Cents!</h2>
              <p className="login-question" onClick={toggle}>Already have an account? <span className="btn-nomore">Sign In.</span></p>
              <Form.Group>
                <Form.Control className="input" onChange={handleFieldChange} type="email" id="email" placeholder="Email Address" required/>
              </Form.Group>
              <Form.Group>
                <Form.Control className="input" onChange={handleFieldChange} type="password" id="password" required placeholder="Password"/>
                <Form.Control className="input" onChange={handleFieldChange} type="password" id="confirmPassword" required placeholder="Confirm Password"/>
              </Form.Group>
              <Button type="submt" block>Register</Button>
            </fieldset>
          </Form> 
          ) 
          : 
          (
          <Form onSubmit={e => handleLoginAndRegister(e, 'login')}>
            <fieldset>
              <div className="logo-container">
                <img alt="" className="logo" src={require('../nav/2cents.png')}></img>
              </div>
              <h2>Welcome to 2Cents!</h2>
              <p className="login-question" onClick={toggle}>New? <span className="btn-nomore">Register Here.</span></p>
              <Form.Group>
                <Form.Control className="input" onChange={handleFieldChange} type="email" id="email" placeholder="Email Address" required="" autoFocus="" />
              </Form.Group>
              <Form.Group>
                <Form.Control className="input" onChange={handleFieldChange} type="password" id="password"  placeholder="Password" required="" />
              </Form.Group>
              <Button type="submit" block>Sign In</Button>
            </fieldset>
          </Form>
          )
        }
        </Jumbotron>
      </Container>
    </>
  );
};

export default Login;