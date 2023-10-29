// Logout.js
import React from 'react';
import { useHistory } from 'react-router';

// Rest of your code...


function Logout() {
  const history = useHistory();

  const handleLogout = () => {
    // Implement the logout functionality here (clear user data, tokens, etc.)
    // Redirect the user to the login page
    // For example, you can use localStorage or a state management tool like Redux
    localStorage.removeItem('authToken'); // Example: remove authentication token
    history.push('/'); // Redirect to the login page
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default Logout;
