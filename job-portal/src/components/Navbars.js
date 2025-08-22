import { Link } from 'react-router-dom';
import React from 'react';

function Navbars({onLogout}) {
  return (
    <div className="navbar">
      <a href='/' className='sub-title'>Jobzz</a>
      <ul>
        <li><Link to="/">Home</Link></li> 
        <li><Link to="/Test">Test</Link></li> 
        <li><Link to="/JobsList">JobsList</Link></li>
        {onLogout && (
          <li>
            <button onClick={onLogout} className="logout-button"> Logout ▶ </button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navbars;
