const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const conversationRoutes = require('./routes/conversationRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// API Routes
app.use('/api', conversationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});