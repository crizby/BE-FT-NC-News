// for spec file
process.env.NODE_ENV = 'test';
const app = require('../app');
const rawData = require('../seeds/testData');

//re-seed test DB before each it block
describe('/northcoders-news', () => {
  beforeEach(() => {
    return seedDB(rawData)
  })
  after(() => {
    mongoose.disconnect()
  })
})
// disconnect afterwards