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
      return Promise.all([Article.insertMany(formatArticleData(articlesData, userRef)), userRef])
    })
    .then(([articleDocs, userRef]) => {
      const articleRef = createArticleRefObj(articlesData, articleDocs)
      console.log(userRef);
      //const userRef = createRefObj(usersData, usersDocs)
      return Comment.insertMany(formatCommentData(commentsData, articleRef, userRef))
    })
    .then((commentDocs) => {
      //console.log(commentDocs)
      return Promise.all([articleDocs, commentDocs, topicDocs, userDocs])
    })
};

module.exports = seedDB;