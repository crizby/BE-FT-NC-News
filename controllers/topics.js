const { Topic, Article } = require('../models');

const getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(next)
};

const getArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;
  Article.find({ belongs_to: topic })
    .then(topics => {
      res.send({ topics });
    })
    .catch(next)
};


module.exports = { getTopics, getArticlesByTopic };





// const getAnimals = (req, res, next) => {
//   const { rehomed } = req.query
//   const lookupRehomed = {
//     true: { $ne: null },
//     false: { $eq: null }
//   }
//   Animal
//     .find({
//       owner_id: rehomed ? lookupRehomed[rehomed] : { $exists: true }
//     })
//     .lean()
//     .populate('owner_id', 'name')
//     .then(animals => {
//       res.send({ animals });
//     })
// };

// const getAnimalByID = (req, res, next) => { };

// module.exports = { getAnimals, getAnimalByID };