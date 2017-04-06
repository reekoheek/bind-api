/* eslint-env mocha */

const Tester = require('./lib/tester');
const assert = require('assert');

describe('/adapter', () => {
  let tester = new Tester();

  beforeEach(async () => {
    await tester.reset();
  });

  describe('GET /', () => {
    it('response array', async () => {
      const { body: { entries } } = await tester.get('/adapter')
        .expect('Content-Type', /json/).expect(200);

      let { name, source } = entries[0];

      assert(entries instanceof Array);
      assert.equal(entries.length, 2);
      assert.deepEqual({ name, source }, { name: 'local', source: '../adapters/local' });
    });
  });

  describe('POST /', () => {
    it('reject with 404', async () => {
      await tester.post('/adapter')
        .send({})
        .expect('Content-Type', /json/).expect(404);
    });
  });

  describe('GET /{name}', () => {
    it('response single adapter', async () => {
      let { body: { entry: { name, source } } } = await tester.get('/adapter/local')
        .expect('Content-Type', /json/).expect(200);

      assert.deepEqual({ name, source }, { name: 'local', source: '../adapters/local' });
    });
  });

  describe('PUT /{id}', () => {
    it('reject with 404', async () => {
      await tester.put('/adapter/local')
        .send({})
        .expect('Content-Type', /json/).expect(404);
    });
  });

  describe('DELETE /{name}', () => {
    it('reject with 404', async () => {
      await tester.delete('/adapter/local')
        .expect('Content-Type', /json/).expect(404);
    });
  });
});
