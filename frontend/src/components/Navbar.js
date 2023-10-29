import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout'; // Import the Logout component

function Navbar() {
  const [authenticated, setAuthenticated] = useState(false); // Initialize with false for unauthenticated state

  // You would typically set the `authenticated` state when the user logs in
  // and clear it when the user logs out, or use a state management solution

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><Link to="/">Home</Link></li>
        {authenticated ? (
          <>
            <li className="navbar-item"><Link to="/map">View</Link></li>
            <li className="navbar-item"><Logout /></li>
          </>
        ) : (
          <>
            <li className="navbar-item"><Link to="/register">Register</Link></li>
            <li className="navbar-item"><Link to="/login">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
