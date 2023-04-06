const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

// Logging using pino-http
const logger = require('pino-http')(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        headers: req.headers,
        remoteAddress: req.remoteAddress,
        remotePort: req.remotePort,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    }
  },
);
app.use(logger);

// Enable CORS for all routes
app.use(cors());

// Serve the static files from the 'dist' folder
app.use(express.static(path.join(__dirname, 'dist')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

