import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import TwoCents from './components/TwoCents';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <TwoCents/>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);