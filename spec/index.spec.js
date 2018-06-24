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

  describe.only('/api/topics', () => {
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
    it('GET responds with status 400 for an invalid topic name', () => {
      return request
        .get('/api/topics/reliabletrains/articles')
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal(`Page not found for topic : reliabletrains`);
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
    it('POST responds with status 400 for an article with insufficient fields', () => {
      return request
        .post('/api/topics/coding/articles')
        .send({
          "title": "Living in the shadow of a great man",
          "body": "I find this existence challenging"
        })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal("articles validation failed: created_by: Path `created_by` is required.");
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

  describe.only('/articles/:article_id', () => {
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
    it('PUT request responds with status 200 and increments the vote count of the article by 1', () => {
      const article_id = articleDocs[0]._id;
      return request
        .put(`/api/articles/${article_id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(1)
        })
    })
    it('GET responds with status 400 for an invalid article ID', () => {
      return request
        .get(`/api/articles/ab123`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(`Bad request : ab123 is not a valid ID`);
        })
    });
    it('GET responds with 404 for an article id that doesn\'t exist', () => {
      return request
        .get(`/api/articles/${commentDocs[0]._id}`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal(`Page not found for article_id : ${commentDocs[0]._id}`)
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
    it('GET responds with 404 for an article id that doesn\'t exist', () => {
      return request
        .get(`/api/articles/${commentDocs[0]._id}/comments`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal(`Page not found for article_id : ${commentDocs[0]._id}`)
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

  describe('comments/:comment_id', () => {
    it('PUT request responds with status 200 and increments the vote count of the comment by 1', () => {
      const comment_id = commentDocs[0]._id;
      return request
        .put(`/api/comments/${comment_id}?vote=up`)
        .expect(201)
        .then(res => {
          expect(res.body.comment.votes).to.equal(8)
        })
    })
    it('PUT responds with status 404 for a comment ID that doesn\'t exist', () => {
      const comment_id = userDocs[0]._id;
      return request
        .put(`/api/comments/${comment_id}?vote=up`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal(`Page not found for id : ${comment_id}`);
        })
    })
    it('PUT request responds with status 200 and increments the vote count of the comment by -1', () => {
      const comment_id = commentDocs[0]._id;
      return request
        .put(`/api/comments/${comment_id}?vote=down`)
        .expect(201)
        .then(res => {
          expect(res.body.comment.votes).to.equal(6)
        })
    })
    it('DELETE request responds with status 204 and deletes the comment for the given id', () => {
      const comment_id = commentDocs[0]._id;
      return request
        .delete(`/api/comments/${comment_id}`)
        .expect(204)
        .then(res => {
          expect(res.body).to.eql({})
        })
    })
  })

  describe('/users/:username', () => {
    it('GET responds with status 200 a profile object for the given username', () => {
      const username = userDocs[0].username;
      return request
        .get(`/api/users/${username}`)
        .expect(200)
        .then(res => {
          expect(res.body.user[0]).to.include.keys(['_id', 'username', 'name', 'avatar_url'])
          expect(res.body.user.length).to.equal(1)
          expect(res.body.user[0]).to.be.an('object')
        })
    })
    it('GET responds with status 404 for an invalid username', () => {
      const username = 'joeyjoejoeshabadoo';
      return request
        .get(`/api/users/${username}`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal(`Page not found for username : ${username}`);
        })
    });
  })
})
