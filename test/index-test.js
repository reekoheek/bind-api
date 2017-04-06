/* eslint-env mocha */

const Tester = require('./lib/tester');
const assert = require('assert');

describe('/', () => {
  describe('GET /', () => {
    it('response app description', async () => {
      let tester = new Tester();

      const { body } = await tester.get('/')
        .expect('Content-Type', /json/).expect(200);

      assert.equal(body.name, 'bind-api');
    });
  });
});
