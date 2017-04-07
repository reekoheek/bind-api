const NormBundle = require('bono-norm/bundle');
const ZoneBundle = require('./zone');
const Adapter = require('../lib/adapter');

module.exports = class ServerBundle extends NormBundle {
  constructor () {
    super({ schema: 'server' });

    this.get('/{id}/sync', this.sync.bind(this));

    this.bundle('/{serverId}/zone', new ZoneBundle());
  }

  async sync (ctx) {
    let { norm, parameters: { id } } = ctx;
    let adapter = await Adapter.factory(norm, id);
    if (!adapter) {
      ctx.throw(404);
    }

    await adapter.sync();
  }
};
