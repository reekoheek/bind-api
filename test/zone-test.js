/* eslint-env mocha */

const Tester = require('./lib/tester');
const assert = require('assert');

describe('/server/{id}/zone', () => {
  let tester;
  let server;

  function uriOf (uri = '') {
    return `/server/${server.id}${uri === '/' ? '' : uri}`;
  }

  beforeEach(async () => {
    tester = new Tester();

    let { body: { entry } } = await tester.post('/server')
      .send({ name: 'memory', adapter: 'memory' })
      .expect('Content-Type', /json/).expect(201);

    server = entry;
  });

  describe('GET /', () => {
    it('response array', async () => {
      const { body: { entries } } = await tester.get(uriOf('/zone'))
        .expect('Content-Type', /json/).expect(200);

      assert(entries instanceof Array);
    });
  });

  describe('POST /', () => {
    it('add new zone', async () => {
      let zone = {
        name: 'foo.bar',
        master: 'ns.foo.bar',
        email: 'root@foo.bar',
      };
      let { body: { entry } } = await tester.post(uriOf('/zone'))
        .send(zone)
        .expect('Content-Type', /json/).expect(201);

      assert.equal(entry.name, 'foo.bar');
      assert.equal(entry.master, 'ns.foo.bar');
      assert.equal(entry.email, 'root@foo.bar');
      assert.equal(entry.server_id, server.id);

      let data = await tester.getData();
      assert.equal(data.zone.length, 1);
    });
  });

  describe('GET /{id}', () => {
    it('response single zone', async () => {
      let zone = {
        name: 'foo.bar',
        master: 'ns.foo.bar',
        email: 'root@foo.bar',
      };
      let { body: { entry } } = await tester.post(uriOf('/zone'))
        .send(zone);

      let { body } = await tester.get(uriOf(`/zone/${entry.id}`))
        .expect('Content-Type', /json/).expect(200);

      assert.deepEqual(entry, body.entry);
    });
  });
});
