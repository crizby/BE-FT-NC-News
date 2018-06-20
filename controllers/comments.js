const { Comment } = require('../models');

const getComments = (req, res, next) => {
  Comment.find()
    .then(comments => {
      res.send({ comments });
    })
    .catch(next)
};

const getCommentById = (req, res, next) => {
  const { comment_id } = req.params
  Comment.find({ _id: comment_id })
    .then(comment => {
      res.send({ comment })
    })
    .catch(next)
}

const updateCommentVote = (req, res, next) => {
  if (req.query.vote !== undefined) {
    const { vote } = req.query
    const { comment_id } = req.params
    let voteRef = { 'up': 1, 'down': -1 }
    Comment.findByIdAndUpdate(comment_id, { $inc: { votes: voteRef[vote] } })
      .then(comment => {
        res.status(201).send({ comment })
      })
      .catch(next)
  }
}

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params
  Comment.findByIdAndRemove(comment_id)
    .then(comment => {
      res.status(200).send({ comment, msg: "Comment Deleted!" })
    })
    .catch(next)
}


module.exports = { getComments, getCommentById, updateCommentVote, deleteComment };