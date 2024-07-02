const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const cors = require('cors')
const conversationRoutes = require('./routes/conversationRoutes');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: '../frontend' }); // Make sure the dir points to 'frontend' directory
const handle = nextApp.getRequestHandler();

const app = express();

nextApp.prepare().then(() => {
  // Middleware
  app.use(bodyParser.json());
app.use(cors())
  // API Routes
  app.use('/api', conversationRoutes);

  // Serve Next.js frontend
  app.get('*', (req, res) => {
    return handle(req, res);
  });

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
});
