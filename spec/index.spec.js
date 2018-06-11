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

  describe('/api', () => {
    describe('/topics', () => {
      it("GET responds with status 200 and an array of topics", () => {
        return request
          .get('/api/topics')
          .expect(200)
          .then(res => {
            expect(res.body.topics.length).to.equal(2);
          });
      });

      describe('/topics/:topic_slug/articles', () => {
        it('GET responds with status 200 an an array of article objects for the given topic', () => {
          return request
            .get(`/api/topics/${topicDocs[0].slug}/articles`)
            .expect(200)
            .then(res => {
              expect(res.body.topics[0]).to.contain.all.keys(['_id', 'title', 'created_by', 'body', 'belongs_to'])
            })
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
      it('POST responds with 201 for a successful creation', () => {
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
          })
      })
      it.only('POST responds with 404 for a body without a name', () => {
        return request
          .post('/api/coding/articles')
          .send({})
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal('actors validation failed: name: Path `name` is required.')
          })
      })








    })
  })
  after(() => {
    mongoose.disconnect()
  })
})