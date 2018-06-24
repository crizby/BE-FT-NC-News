const { Topic, Article, Comment } = require('../models');

const getTopics = (req, res, next) => {
  return Topic.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(next)
};

const getArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;

  return Article.find({ belongs_to: topic }).lean()
    .then(articleDocs => {
      let commentCount = articleDocs.map((article) => {
        return Comment.find({ belongs_to: article._id }).count();
      })
      return Promise.all([articleDocs, ...commentCount])
    })
    .then(([articleDocs, ...commentCount]) => {
      let articles = articleDocs.map((doc, index) => {
        doc.comments = commentCount[index];
        return doc;
      })
      return articles
    })
    .then(articles => {
      articles.length === 0
        ? next({ status: 404, message: `Page not found for topic : ${topic}` })
        : res.status(200).send({ articles })
    })
    .catch(next)
};

const postArticleToTopic = (req, res, next) => {
  let inputArticle = {
    title: req.body.title,
    body: req.body.body,
    belongs_to: req.params.topic,
    created_by: req.body.created_by
  }
  const newArticle = new Article(inputArticle)
  return newArticle.save()
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(next)
}


module.exports = { getTopics, getArticlesByTopic, postArticleToTopic };



