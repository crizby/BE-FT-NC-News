const apiRouter = require("express").Router();
const topicsRouter = require("./topics");


// apiRouter.route('/')
//   .get(res.send({ message: 'docs go here' }))


apiRouter.use("/topics", topicsRouter);


module.exports = apiRouter;