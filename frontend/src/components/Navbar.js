import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout'; // Import the Logout component

function Navbar() {
  const [authenticated, setAuthenticated] = useState(false); // Initialize with false for unauthenticated state
  const [showDropdown, setShowDropdown] = useState(false); // To control the visibility of the dropdown

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#333', padding: '10px 20px', position: 'relative', zIndex: 1 }}>
      <div className="navbar-toggle" style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={toggleDropdown}>
        <div style={{ width: '20px', height: '2px', backgroundColor: '#fff', margin: '3px 0' }}></div>
        <div style={{ width: '20px', height: '2px', backgroundColor: '#fff', margin: '3px 0' }}></div>
        <div style={{ width: '20px', height: '2px', backgroundColor: '#fff', margin: '3px 0' }}></div>
      </div>
      <ul style={{ display: showDropdown ? 'flex' : 'none', flexDirection: 'column', position: 'absolute', top: '50px', right: 0, backgroundColor: '#333', border: '1px solid #777', padding: '10px' }}>
        {authenticated ? (
          <li style={{ marginBottom: '10px' }}>
            <Link to="/map" style={{ color: '#fff' }}>View</Link>
          </li>
        ) : (
          <li style={{ marginBottom: '10px' }}>
            <Link to="/register" style={{ color: '#fff' }}>Register</Link>
          </li>
        )}
        <li style={{ marginBottom: '10px' }}>
          {authenticated ? <Logout /> : <Link to="/login" style={{ color: '#fff' }}>Login</Link>}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
