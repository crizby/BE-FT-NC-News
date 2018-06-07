const seedDB = require('./seed');
const mongoose = require('mongoose');
const { DB_URL } = require('../config')
//const DB_URL = process.env.NODE_ENV === 'production' ? process.env.DB_URL : require('../config')
const rawData = require('./devData')


mongoose.connect(DB_URL)
  .then(() => {
    return seedDB(rawData)
  })
  .then(() => {
    return console.log('successfully seeded...')
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .then(() => {
    return console.log('successfully disconnected...')
  })




