const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var fs = require('fs')
var morgan = require('morgan')
var path = require('path')

var app = express()

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))
// Middleware
app.use(bodyParser.json());
app.use(cors());

const authorization = require('./api/authorizationApi');
app.use("/api", authorization);
const parcelApi = require('./api/parcelApi');
app.use("/api/parcel", parcelApi);
const tankApi = require('./api/tankApi');
app.use("/api/tank", tankApi);
// Handle production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile('./public/index.html'));
}

const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`Server started on port ${port}`));
