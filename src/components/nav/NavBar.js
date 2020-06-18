import React, { useState } from "react";
import { withRouter } from 'react-router-dom';
import { Link } from "react-router-dom";
// import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
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
            <Link className={`nav-link ${props.location.pathname === "/" ? 'active' : ''}`} to="/">Home</Link>
          </li>
          : null
        }
        {props.hasUser
        ? <li>
            <Link className={`nav-link ${props.location.pathname === "/cryptos" ? 'active' : ''}`} to="/cryptos"> Cryptos </Link>
          </li>
        : null}
        {props.hasUser
        ? <li>
            <Link className={`nav-link ${props.location.pathname === "/stocks" ? 'active' : ''}`} to="/stocks"> Stocks </Link>
          </li>
        : null}
        {props.hasUser
        ? <li>
            <Link className={`nav-link ${props.location.pathname === "/finances" ? 'active' : ''}`} to="/finances"> Expenses </Link>
          </li>
        : null}
        {props.hasUser
        ? <li>
            <Link className={`nav-link ${props.location.pathname === "/projects" ? 'active' : ''}`} to="/projects"> Projects </Link>
          </li>
        : null}
        {props.hasUser
        ? 
          <li>
            <span className="nav-link logout btn-nomore" onClick={handleLogout}> Logout </span>
          </li>
        : <li>
            <Link className="nav-link" to="/login"> Login </Link>
          </li>}
        {props.hasUser
        ? 
        <span onClick={() => setToggle(!toggle)} className="icon btn-nomore">
          <i className="fa fa-bars"></i>
        </span>
        : null}
        </ul>
      </nav>
      </> : null
    }
    </header>
  );
}

export default withRouter(NavBar);