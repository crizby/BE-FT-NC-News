const topicsRouter = require('express').Router();
const { getTopics, getArticlesByTopic, postArticleToTopic } = require('../controllers/topics')


topicsRouter
  .route('/')
  .get(getTopics)

topicsRouter
  .route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(postArticleToTopic)


module.exports = topicsRouter;