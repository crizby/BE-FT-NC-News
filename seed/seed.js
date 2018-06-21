const mongoose = require('mongoose');
mongoose.Promise = Promise;
const { Article, Comment, Topic, User } = require('../models');
const { createRefObj, createArticleRefObj, formatArticleData, formatCommentData } = require('../utils');

const seedDB = ({ topicData, userData, articleData, commentData }) => {
  return mongoose.connection.dropDatabase()
    .then(() => {
      return Promise.all([
        Topic.insertMany(topicData),
        User.insertMany(userData),
      ])
    })
    .then(([topicDocs, userDocs]) => {
      const userRef = createRefObj(userData, userDocs)
      return Promise.all([topicDocs, userDocs, Article.insertMany(formatArticleData(articleData, userRef)), userRef])
    })
    .then(([topicDocs, userDocs, articleDocs, userRef]) => {
      const articleRef = createArticleRefObj(articleData, articleDocs)
      return Promise.all([topicDocs, userDocs, articleDocs, Comment.insertMany(formatCommentData(commentData, articleRef, userRef))])
    })
};

module.exports = seedDB;