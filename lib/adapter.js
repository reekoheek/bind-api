const fs = require('fs-promise');
const path = require('path');

const templateLocalRow = require('./templates/local-row');
const templateZoneDb = require('./templates/zone-db');

const cache = {};
const adapterCache = {};

module.exports = class Adapter {
  static async initialize (norm) {
    console.log('Initializing adapters ...');

    await norm.factory('adapter').truncate();
    let files = await fs.readdir(path.join(__dirname, '../adapters'));
    let q = norm.factory('adapter');
    files.map(file => {
      let name = path.basename(file, '.js');
      let source = '../adapters/' + name;
      q.insert({ name, source });

      console.log(`Adapter ${name} initialized`);
    });
    await q.save();

    console.log('First run syncing registered servers ...');
    let servers = await norm.factory('server').all();
    await Promise.all(servers.map(async server => {
      let adapter = await Adapter.factory(norm, server.id);
      if (!adapter) {
        throw new Error(`Ineligible adapter ${server.adapter} for server: ${server.name}`);
      }

      await adapter.sync();

      console.log(`Server ${server.name} synced`);
    }));
  }

  static async factory (norm, id) {
    if (id in cache === false) {
      cache[id] = null;
      try {
        let server = await norm.factory('server', id).single();
        if (!server) {
          return cache[id];
        }

        let adapter = await getAdapter(norm, server.adapter);
        if (!adapter) {
          return cache[id];
        }

        let AdapterClass = require(adapter.source);
        cache[id] = new AdapterClass(norm, server);

        await cache[id].initialize();
      } catch (err) {
        console.error('Err caught', err);
      }
    }

    return cache[id];
  }

  constructor (norm, { id, name, etcdir, dbdir, localfile }) {
    this.id = id;
    this.name = name;
    this.etcdir = etcdir;
    this.dbdir = dbdir;
    this.localfile = localfile;
    this.norm = norm;
  }

  initialize () {

  }

  async sync () {
    let zones = await this.norm.factory('zone', { server_id: this.id }).all();

    let localRows = [];

    await Promise.all(zones.map(async zone => {
      localRows.push(templateLocalRow({ dbdir: this.dbdir, zone }));

      if (await this.exists('db', zone.name) && zone.serial === zone.pserial) {
        return;
      }

      let content = templateZoneDb({ zone });
      await this.write('db', zone.name, content + '\r\n');
    }));

    await this.write('conf', 'local', localRows.join('\r\n') + '\r\n');

    await this.reload();

    await Promise.all(zones.map(async zone => {
      if (zone.serial === zone.pserial) {
        return;
      }

      await this.norm.factory('zone', zone.id).set({ pserial: zone.serial }).save();
    }));
  }
};

async function getAdapter (norm, name) {
  if (!adapterCache[name]) {
    adapterCache[name] = await norm.factory('adapter', { name }).single();
  }

  return adapterCache[name];
}
