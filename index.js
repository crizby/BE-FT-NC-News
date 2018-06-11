const app = require('./app');

const { PORT = 9090 } = process.env;

app.listen(9090, (err) => {
  if (err) throw err;
  console.log(`listening on port ${PORT}`);
});


//const PORT = process.env.PORT || require ('./config').PORT;