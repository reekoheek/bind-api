const templateLocalRow = require('./templates/local-row');
const templateZoneDb = require('./templates/zone-db');

const cache = {};
const adapterCache = {};

module.exports = class Adapter {
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

  async sync () {
    let zones = await this.norm.factory('zone', { server_id: this.id }).all();

    let localRows = zones.map(zone => {
      let content = templateZoneDb({ zone });
      this.write('db', zone.name, content + '\r\n');
      return templateLocalRow({ dbdir: this.dbdir, zone });
    });

    await this.write('conf', 'local', localRows.join('\r\n') + '\r\n');
  }
};

async function getAdapter (norm, name) {
  if (!adapterCache[name]) {
    adapterCache[name] = await norm.factory('adapter', { name }).single();
  }

  return adapterCache[name];
}
