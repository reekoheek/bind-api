/* eslint-env mocha */

const path = require('path');
const Tester = require('./lib/tester');
const assert = require('assert');

describe('(adapter-local)', () => {
  let tester = new Tester();

  beforeEach(async () => {
    await tester.reset();
  });

  it.only('response app description', async () => {
    let server = {
      name: 'foo',
      adapter: 'local',
      etcdir: path.join(__dirname, '../tmp/etc'),
      dbdir: path.join(__dirname, '../tmp/db'),
    };

    let { body: { entry: { id } } } = await tester.post('/server')
      .send(server)
      .expect(201);

    await tester.post(`/server/${id}/zone`)
      .send({
        master: 'ns.foo.bar',
        name: 'foo.bar',
        email: 'root@foo.bar',
        records: [
          { label: '@', rr: 'NS', value: 'a-srv' },
          { label: '@', rr: 'MX', pref: 10, value: 'b-srv' },
        ],
      })
      .expect(201);

    await tester.get(`/server/${id}/sync`)
      .expect(200);
  });
});
