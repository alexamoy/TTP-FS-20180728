const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(morgan('dev'));

/*---------Body Parsing Middleware---------*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*------------Static Middleware------------*/
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../node_modules')));

app.use('/api', require('./api'));

/*-----------Send to index.html------------*/
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

/*-------------Error Handling--------------*/
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

module.exports = app;
