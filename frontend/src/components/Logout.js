import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement the logout functionality here (clear user data, tokens, etc.)
    // Redirect the user to the login page
    // For example, you can use localStorage or a state management tool like Redux
    localStorage.removeItem('authToken'); // Example: remove authentication token
    navigate('/'); // Redirect to the login page
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default Logout;
