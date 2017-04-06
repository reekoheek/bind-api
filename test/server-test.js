/* eslint-env mocha */

const Tester = require('./lib/tester');
const assert = require('assert');

describe('/server', () => {
  let tester;
  beforeEach(async () => {
    tester = new Tester();

    await tester.reset();
  });

  describe('GET /', () => {
    it('response array', async () => {
      const { body } = await tester.get('/server')
        .expect('Content-Type', /json/).expect(200);

      assert(body.entries instanceof Array);
    });
  });

  describe('POST /', () => {
    it('add new server', async () => {
      let { body: { entry } } = await tester.post('/server')
        .send({ name: 'memory', adapter: 'memory' })
        .expect('Content-Type', /json/).expect(201);

      assert.equal(entry.name, 'memory');
      assert.equal(entry.adapter, 'memory');

      let data = await tester.getData();
      assert.equal(data.server.length, 1);
    });

    it.skip('fail when name is already exist in system', () => {

    });

    it.skip('response default options is empty object', () => {

    });

    it('response unsynced server', async () => {
      let { body: { entry } } = await tester.post('/server')
        .send({ name: 'memory', adapter: 'memory' })
        .expect('Content-Type', /json/).expect(201);

      assert.equal(entry.synced, false);
    });
  });

  describe('GET /{id}', () => {
    it('response single server', async () => {
      let { body: { entry } } = await tester.post('/server')
        .send({ name: 'memory', adapter: 'memory' });

      let { body } = await tester.get(`/server/${entry.id}`)
        .expect('Content-Type', /json/).expect(200);

      assert.deepEqual(entry, body.entry);
    });
  });

  describe('GET /{id}/sync', () => {
    // TODO please finish this later
  });
});
