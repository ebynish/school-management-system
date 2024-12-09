const express = require('express');
const path = require('path');
const app = express();

// Serve static assets from the build folder
app.use(express.static(path.join(__dirname, 'build')));

// Serve the React app for all routes
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(5000, function() {
  console.log('Server started on port 3010');
});
