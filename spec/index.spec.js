process.env.NODE_ENV = 'test';
const app = require('../app');
const rawData = require('../seed/testData');
const seedDB = require('../seed/seed')
const mongoose = require('mongoose');
const request = require('supertest')(app);
const { expect } = require('chai');

describe('/northcoders-news', () => {
  let articleDocs;
  let commentDocs;
  let topicDocs;
  let userDocs;
  beforeEach(() => {
    return seedDB(rawData)
      .then(docs => {
        [topicDocs, userDocs, articleDocs, commentDocs] = docs;
      })
  })
  after(() => {
    return mongoose.disconnect()
  })

  describe('/api/topics', () => {
    it("GET responds with status 200 and an array of topics", () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.topics.length).to.equal(2);
          expect(res.body.topics).to.be.an('array')
          expect(res.body.topics[0]).to.include.keys('title', 'slug')
        });
    });
  })

  describe('/topics/:topic_slug/articles', () => {
    it('GET responds with status 200 an an array of article objects for the given topic', () => {
      return request
        .get(`/api/topics/${topicDocs[0].slug}/articles`)
        .expect(200)
        .then(res => {
          expect(res.body.articles[0]).to.contain.all.keys(['_id', 'title', 'created_by', 'body', 'belongs_to'])
          expect(res.body.articles.length).to.equal(2)
          expect(res.body.articles[0]).to.be.an('object')
        })
    })
    it('GET responds with status 404 for an invalid topic name', () => {
      return request
        .get('/api/topics/boringtopic/articles')
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('Article topic not found!');
        })
    })
    it('POST responds with status 201 and successfully posts a new article', () => {
      const user_id = articleDocs[0]._id;
      return request
        .post('/api/topics/coding/articles')
        .send({
          "title": "Living in the shadow of a great man",
          "body": "I find this existence challenging",
          "created_by": user_id
        })
        .expect(201)
        .then(res => {
          expect(res.body.article.title).to.equal('Living in the shadow of a great man')
          expect(res.body.article).to.include.keys(['_id', 'title', 'body', 'created_by'])
        })
    })
  })

  describe('/api/articles', () => {
    it("GET responds with status 200 and an array of article objects", () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(4);
          expect(res.body.articles).to.be.an('array')
          expect(res.body.articles[0]).to.include.keys('title', 'belongs_to', 'body', 'created_by')
        });
    });
  })

  describe('/articles/:article_id', () => {
    it('GET responds with status 200 an single article for the given id', () => {
      const article_id = articleDocs[0]._id;
      return request
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then(res => {
          expect(res.body.article[0]).to.contain.all.keys(['_id', 'title', 'created_by', 'body', 'belongs_to'])
          expect(res.body.article.length).to.equal(1)
          expect(res.body.article[0]).to.be.an('object')
        })
    })
    it.only('PUT request responds with status 200 and increments the vote count of the article by 1', () => {
      const article_id = articleDocs[0]._id;
      return request
        .put(`/api/articles/${article_id}?vote=up`)
        .expect(200)
        .then(res => {
          console.log(res.body.article)
          expect(res.body.article.votes).to.equal(1)
        })
    })
  })







  describe('/articles/:article_id/comments', () => {
    it('GET responds with status 200 and all the articles comments for the given id', () => {
      const article_id = articleDocs[0]._id;
      return request
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body.comments[0]).to.include.keys(['_id', 'body', 'belongs_to', 'created_by', 'votes'])
          expect(res.body.comments.length).to.equal(2)
          expect(res.body.comments).to.be.an('array')
        })
    })
    it('POST responds with status 201 and successfully posts a comment to the article for the given id', () => {
      const article_id = articleDocs[0]._id;
      const user = userDocs[0]._id;
      return request
        .post(`/api/articles/${article_id}/comments`)
        .send({
          "body": "post test",
          "belongs_to": article_id,
          "created_by": user
        })
        .expect(201)
        .then(res => {
          expect(res.body.comment.body).to.equal('post test')
          expect(res.body.comment).to.be.an('object')
          expect(res.body.comment).to.include.keys(['_id', 'body', 'created_by', 'belongs_to', 'votes'])
        })
    })
  })




})
