const { Article, Comment } = require('../models');

const getArticles = (req, res, next) => {
  Article.find()
    .then(articles => {
      res.send({ articles });
    })
    .catch(next)
}

const getArticleById = (req, res, next) => {
  const { article_id } = req.params
  Article.find({ _id: article_id })
    .then(article => {
      res.send({ article })
    })
    .catch(next)
}

const getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params
  Comment.find({ belongs_to: article_id })
    .then(comments => {
      res.send({ comments })
    })
}

const postCommentToArticle = (req, res, next) => {
  let inputComment = {
    body: req.body.body,
    belongs_to: req.params.article_id,
    created_by: req.body.created_by
  }
  const newComment = new Comment(inputComment)
  return newComment.save()
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next)
}

const incrementArticleVotes = (req, res, next) => {
  //const {voteIncrement} = req.query.vote
  const { article_id } = req.params
  if (req.query.vote === true)
    Article.findByIdAndUpdate({ _id: article_id })
}










module.exports = { getArticles, getArticleById, getCommentsForArticle, postCommentToArticle, incrementArticleVotes }


