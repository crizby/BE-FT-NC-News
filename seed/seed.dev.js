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








// const mongoose = require('mongoose');
// mongoose.Promise = Promise;
// const { formatActorData, formatCompanyData, formatMovieData, createRefObj } = require('../utils')
// const { Actor, Company, Movie } = require('../models')

// const seedDB = ({ actorData, companyData, movieData }) => {
//   return mongoose.connection.dropDatabase()
//     .then(() => {
//       return Promise.all([
//         Actor.insertMany(formatActorData(actorData)),
//         Company.insertMany(formatCompanyData(companyData))
//       ])
//     })
//     .then(([actorDocs, companyDocs]) => {
//       const actorRef = createRefObj(actorData, actorDocs)
//       const companyRef = createRefObj(companyData, companyDocs)
//       return Movie.insertMany(formatMovieData(movieData, actorRef, companyRef))
//     })
//     .then(movieDocs => {
//       console.log(movieDocs, '<<<<<')
//     })

// }




// mongoose.connect(DB_URL)
//   .then(() => {
//     return seedDB(rawData);
//   })
//   .then(() => {
//     console.log(`successfully seeded...`)
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .then(() => {
//     console.log(`successfully disconnected`);
//   })
