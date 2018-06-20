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

const updateArticleVote = (req, res, next) => {
  if (req.query.vote !== undefined) {
    const { vote } = req.query
    const { article_id } = req.params
    let voteRef = { 'up': 1, 'down': -1 }
    Article.findByIdAndUpdate(article_id, { $inc: { votes: voteRef[vote] } })
      .then(article => {
        res.status(201).send({ article })
      })
      .catch(next)
  }
}


module.exports = { getArticles, getArticleById, getCommentsForArticle, postCommentToArticle, updateArticleVote }


