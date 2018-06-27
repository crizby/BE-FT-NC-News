const app = require('express')();
const { DB_URL } = require('./config');
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

app.get('/*', (req, res, next) => {
  next({ status: 404, message: 'Page not found' })
})

app.use((err, req, res, next) => {
  err.status
    ? res.status(err.status).send({ message: err.message })
    : next(err);
})

app.use((err, req, res, next) => {
  err.name === 'CastError'
    ? res.status(400).send({ message: `Bad request : ${err.value} is not a valid ID` })
    : err.name === 'ValidationError'
      ? res.status(400).send({ message: `${err.message}` })
      : next(err);
})

app.use((err, req, res, next) => {
  res.status(500).send({ message: 'Internal server error' })
})

module.exports = app;