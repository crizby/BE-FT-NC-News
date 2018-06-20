const mongoose = require('mongoose');
mongoose.Promise = Promise;
const { Article, Comment, Topic, User } = require('../models');
const { articlesData, commentsData, topicsData, usersData } = process.env.NODE_ENV === 'test' ? require('./testData') : require('./devData')
const { createRefObj, createArticleRefObj, formatArticleData, formatCommentData } = require('../utils');

const seedDB = ({ topicsData, usersData, articlesData }) => {
  return mongoose.connection.dropDatabase()
    .then(() => {
      return Promise.all([
        Topic.insertMany(topicsData),
        User.insertMany(usersData),
      ])
    })
    .then(([topicDocs, userDocs]) => {
      const userRef = createRefObj(usersData, userDocs)
      return Promise.all([topicDocs, userDocs, Article.insertMany(formatArticleData(articlesData, userRef)), userRef])
    })
    .then(([topicDocs, userDocs, articleDocs, userRef]) => {
      const articleRef = createArticleRefObj(articlesData, articleDocs)
      return Promise.all([topicDocs, userDocs, articleDocs, Comment.insertMany(formatCommentData(commentsData, articleRef, userRef))])
    })
};

module.exports = seedDB;