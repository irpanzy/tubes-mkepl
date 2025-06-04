const express = require('express');
const app = express();
const routes = require('./routes');
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());
app.use('/api/v1', routes);

// Error handler untuk malformed JSON dan error lainnya
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Malformed JSON' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
