import React, { useState } from "react";
import { withRouter } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import './NavBar.css';

const NavBar = props => {
  const handleLogout = () => {
    props.clearUser();
    props.history.push('/');
  }

  const [toggle, setToggle] = useState(false);
  return (
    <header className="navBar">
    {
      props.hasUser ?
      <>
      <nav>
        <ul className={`container-nav ${toggle ? 'responsive' : ''}`}>
          <h1 className="site-title">
            2cents
          </h1>
        {
          props.hasUser ?
          <li>
            <Link className="nav-link" to="/">Home</Link>
          </li>
          : null
        }
        {props.hasUser
        ? <li>
            <Link className="nav-link" to="/cryptos"> Cryptos </Link>
          </li>
        : null}
        {props.hasUser
        ? <li>
            <Link className="nav-link" to="/stocks"> Stocks </Link>
          </li>
        : null}
        {props.hasUser
        ? <li>
            <Link className="nav-link" to="/finances"> Finances </Link>
          </li>
        : null}
        {props.hasUser
        ? <li>
            <Link className="nav-link" to="/projects"> Projects </Link>
          </li>
        : null}
        {props.hasUser
        ? 
          <li>
            <a href="#" className="nav-link logout" onClick={handleLogout}> Logout </a>
          </li>
        : <li>
            <Link className="nav-link" to="/login"> Login </Link>
          </li>}
        {props.hasUser
        ? 
        <a onClick={() => setToggle(!toggle)} className="icon">
          <i className="fa fa-bars"></i>
        </a>
        : null}
        </ul>
      </nav>
      </> : null
    }
    </header>
  );
}

export default withRouter(NavBar);