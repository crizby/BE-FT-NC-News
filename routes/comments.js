const commentsRouter = require('express').Router();
const { getComments, getCommentById, updateCommentVote, deleteComment } = require('../controllers/comments');


commentsRouter
  .route('/')
  .get(getComments)

commentsRouter
  .route('/:comment_id')
  .get(getCommentById)
  .put(updateCommentVote)
  .delete(deleteComment)


module.exports = commentsRouter;