/* eslint-env mocha */

const Tester = require('./lib/tester');
const assert = require('assert');

describe('/server', () => {
  let tester = Tester.factory();

  beforeEach(async () => {
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
        .send({ name: 'mock', adapter: 'mock' })
        .expect('Content-Type', /json/).expect(201);

      assert.equal(entry.name, 'mock');
      assert.equal(entry.adapter, 'mock');

      let data = await tester.getData();
      assert.equal(data.server.length, 1);
    });

    it('fail when name is already exist in system', async () => {
      await tester.post('/server')
        .send({ name: 'mock', adapter: 'mock' })
        .expect('Content-Type', /json/).expect(201);

      await tester.post('/server')
        .send({ name: 'mock', adapter: 'local' })
        .expect('Content-Type', /json/).expect(400);
    });

    it('fail when created with unknown adapter', async () => {
      await tester.post('/server')
        .send({ name: 'mock', adapter: 'unknown' })
        .expect('Content-Type', /json/).expect(400);
    });

    it.skip('response default options is empty object', () => {

    });

    // it('response unsynced server', async () => {
    //   let { body: { entry } } = await tester.post('/server')
    //     .send({ name: 'mock', adapter: 'mock' })
    //     .expect('Content-Type', /json/).expect(201);
    //
    //   assert.equal(entry.synced, false);
    // });
  });

  describe('GET /{id}', () => {
    it('response single server', async () => {
      let { body: { entry } } = await tester.post('/server')
        .send({ name: 'mock', adapter: 'mock' });

      let { body } = await tester.get(`/server/${entry.id}`)
        .expect('Content-Type', /json/).expect(200);

      assert.deepEqual(entry, body.entry);
    });
  });

  describe('PUT /{id}', () => {
    it.skip('please write this', () => {});
  });

  describe('DELETE /{id}', () => {
    it.skip('please write this', () => {});
  });

  describe('GET /{id}/sync', () => {
    let server;
    let mock;

    beforeEach(async () => {
      let name = 'mock';

      mock = tester.getMockData(name);

      let { body } = await tester.post('/server')
        .send({ name, adapter: 'mock' })
        .expect('Content-Type', /json/).expect(201);

      server = body.entry;

      let zones = [
        {
          name: 'foo.bar',
          master: 'ns.foo.bar',
          email: 'admin@foo.bar',
          records: [
            {
              label: '@',
              rr: 'NS',
              value: 'ns',
            },
            {
              label: '@',
              rr: 'NS',
              value: 'ns.xinixhost.com.',
            },
            {
              label: '@',
              rr: 'MX',
              pref: 10,
              value: 'mail',
            },
            {
              label: 'ns',
              rr: 'CNAME',
              value: 'a-a',
            },
            {
              label: 'ns2',
              rr: 'CNAME',
              value: 'b-b',
            },
            {
              label: 'mail',
              rr: 'CNAME',
              value: 'b-b',
            },
            {
              label: 'a-a',
              rr: 'A',
              value: '1.1.1.1',
            },
            {
              label: 'b-b',
              rr: 'A',
              value: '2.2.2.2',
            },
          ],
        },
        {
          name: 'bar.baz',
          master: 'ns.bar.baz',
          email: 'admin@bar.baz',
        },
      ];
      await Promise.all(zones.map(async zone => {
        await tester.post(`/server/${server.id}/zone`).send(zone).expect(201);
      }));
      await tester.get(`/server/${server.id}/sync`).expect(200);
    });

    it('write local zone file', () => {
      let content = mock.read('conf', 'local');

      assert(content.match(/zone "foo.bar"/));
      assert(content.match(/zone "bar.baz"/));
    });

    it('write db zone files', () => {
      let content;

      content = mock.read('db', 'foo.bar');
      assert(content.match(/@\s+IN\s+SOA\s+ns\.foo\.bar\.\s+admin\.foo\.bar\./));

      content = mock.read('db', 'bar.baz');
      assert(content.match(/@\s+IN\s+SOA\s+ns\.bar\.baz\.\s+admin\.bar\.baz\./));
    });
  });
});
