/* eslint-env mocha */

const path = require('path');
const Tester = require('./lib/tester');
const assert = require('assert');

describe('(adapter-local)', () => {
  let tester = Tester.factory();
  let server;

  beforeEach(async () => {
    await tester.reset();
    let _server = Object.assign({
      name: 'foo',
      adapter: 'local',
    }, process.env.BIND_API_MODE === 'standalone' ? {} : {
      etcdir: path.join(__dirname, '../tmp/etc'),
      dbdir: path.join(__dirname, '../tmp/db'),
    });

    let { body: { entry } } = await tester.post('/server')
      .send(_server)
      .expect(201);

    server = entry;
  });

  async function createZone (row) {
    let { body: { entry } } = await tester.post(`/server/${server.id}/zone`)
      .send(row)
      .expect(201);

    return entry;
  }

  async function readZone (id) {
    let { body: { entry } } = await tester.get(`/server/${server.id}/zone/${id}`).expect(200);
    return entry;
  }

  async function syncZones () {
    await tester.get(`/server/${server.id}/sync`).expect(200);
  }

  async function updateZone (id, row) {
    let { body: { entry } } = await tester.put(`/server/${server.id}/zone/${id}`)
      .send(row)
      .expect(200);
    return entry;
  }

  describe('update', () => {
    it('response app description', async () => {
      let zone = await createZone({
        master: 'ns.foo.bar',
        name: 'foo.bar',
        email: 'root@foo.bar',
        records: [
          { label: '@', rr: 'NS', value: 'a-srv' },
          { label: '@', rr: 'MX', pref: 10, value: 'b-srv' },
          { label: 'a-srv', rr: 'A', value: '1.2.3.4' },
          { label: 'b-srv', rr: 'A', value: '1.2.3.5' },
        ],
      });

      {
        let entry = await readZone(zone.id);

        assert.equal(entry.serial, 1);
        assert.equal(entry.pserial, 0);
      }

      await syncZones();

      {
        let entry = await readZone(zone.id);

        assert.equal(entry.serial, 1);
        assert.equal(entry.pserial, 1);
      }

      {
        let entry = await updateZone(zone.id, { email: 'admin@foo.bar' });
        assert.equal(entry.email, 'admin@foo.bar');
      }

      {
        let entry = await readZone(zone.id);

        assert.equal(entry.email, 'admin@foo.bar');
        assert.equal(entry.serial, 2);
        assert.equal(entry.pserial, 1);
      }

      await updateZone(zone.id, { master: 'nz.bar.baz' });

      {
        let entry = await readZone(zone.id);

        assert.equal(entry.master, 'nz.bar.baz');
        assert.equal(entry.serial, 2);
        assert.equal(entry.pserial, 1);
      }

      await syncZones();

      {
        let entry = await readZone(zone.id);

        assert.equal(entry.serial, 2);
        assert.equal(entry.pserial, 2);
      }

      let { records } = zone;
      records.push({ label: 'demo', rr: 'CNAME', value: 'b-srv' });

      await updateZone(zone.id, { records });

      {
        let entry = await readZone(zone.id);

        assert.equal(entry.serial, 3);
        assert.equal(entry.pserial, 2);
      }

      await syncZones();

      {
        let entry = await readZone(zone.id);

        assert.equal(entry.serial, 3);
        assert.equal(entry.pserial, 3);
      }
    });
  });
});
