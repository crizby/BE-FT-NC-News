## Northcoders News API

This is my implementation of the Northcoders News API.

## Getting Started:

The app is hosted on Heroku and can be found at:

[api.heroku.com](api.heroku.com)
(Work in progess due to port issues).

## Installing a Local Version:

Clone the repo from https://github.com/crizby/BE-FT-northcoders-news

Open up in VS Code and in the command line run npm install to install all dependencies.
```
npm install
```

Create a config folder in the root and an index.js file within it with the following code.
```
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

const config = {
  dev: {
    DB_URL: 'mongodb://localhost:27017/nc_news'
  },
  test: {
    DB_URL: 'mongodb://localhost:27017/nc_news_test'
  }
}

module.exports = config[process.env.NODE_ENV]
```
You need to have mongo db installed and make sure Mongod is running.
```
Mongod
```
Then seed the local database.
```
npm run seed:dev
```
In the command line start the server.
```
npm run dev
```
Then to access the api type the following into your browsers address bar.
```
http://localhost:9090/api
```

## Built With

[Javascript ES6](http://http://es6-features.org)\
[Node 9.9.0](https://nodejs.org/en/)\
[Express 4.16.03](https://expressjs.com/)\
[MongoDB 3.6](https://www.mongodb.com/)\
[Mongoose 5.0.14](http://mongoosejs.com/)


## Acknowledments

Shout outs to Mitch, Paul R, JD & Ant and anyone else who's helped along the way.


