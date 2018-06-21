const app = require('express')();
const { DB_URL } = require('./config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
mongoose.Promise = Promise;


mongoose.connect(DB_URL)
  .then(() => {
    console.log(`Connected to the DB on ${DB_URL}...`)
  })

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.send('Welcome to NC NEWS');
});

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  err.status ?
    res.status(404).send({ message: err.message }) : next(err);
})


module.exports = app;







