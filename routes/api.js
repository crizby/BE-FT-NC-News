const apiRouter = require("express").Router();
const topicsRouter = require("./topics");
const articlesRouter = require('./articles');
const commentsRouter = require('./comments');


apiRouter.use("/topics", topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);


// apiRouter.use('/', (req, res, next) => {
//   res.send('Docs go here...');
// });

module.exports = apiRouter;