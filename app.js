const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

// Logging
const pino = require('pino');
const pinoHttp = require('pino-http')()
const logger = pino({ level: 'info' });
app.use(pinoHttp({ logger }));

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

