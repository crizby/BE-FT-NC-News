const { Article, Comment } = require('../models');

const getArticles = (req, res, next) => {

  Article.find().populate("created_by").lean()
    .then(articleDocs => {
      let commentCount = articleDocs.map((article) => {
        return Comment.find({ belongs_to: article._id }).count()

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
      res.status(200).send({ articles });
    })
    .catch(next)
}

const getArticleById = (req, res, next) => {
  const { article_id } = req.params
  Article.findById(article_id).populate("created_by")
    .then(article => {
      !article
        ? next({ status: 404, message: `Page not found for article_id : ${article_id}` })
        : res.status(200).send({ article })
    })
    .catch(next)
}

const getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params
  Comment.find({ belongs_to: article_id }).populate("created_by")
    .then(comments => {
      comments.length === 0
        ? next({ status: 404, message: `Page not found for article_id : ${article_id}` })
        : res.status(200).send({ comments })
    })
    .catch(next)
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
    Article.findByIdAndUpdate(article_id, { $inc: { votes: voteRef[vote] } }, { new: true })
      .then(article => {
        res.status(200).send({ article })
      })
      .catch(next)
  }
}


module.exports = { getArticles, getArticleById, getCommentsForArticle, postCommentToArticle, updateArticleVote }


