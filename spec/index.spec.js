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
        [articleDocs, commentDocs, topicDocs, userDocs] = docs;
      })
  })
  describe('/api', () => {
    describe('/topics', () => {
      it("GET responds with status 200 and an array of topics", () => {
        return request
          .get('/api/topics')
          .expect(200)
          .then(res => {
            console.log(res.body.topics)
            expect(res.body.topics.length).to.equal(2);
          });
      });









    })
  })
  after(() => {
    mongoose.disconnect()
  })
})