// In routes/logout.js
const express = require('express');
const router = express.Router();

// Define the logout route
router.post('/', (req, res) => {
  // Implement the server-side logout functionality here
  // This can include destroying the user's session, revoking tokens, etc.

  // Example: Destroy the session for session-based authentication
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});

module.exports = router;
