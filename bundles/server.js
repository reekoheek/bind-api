const NormBundle = require('node-bono-norm/bundle');
const ZoneBundle = require('./zone');

module.exports = class ServerBundle extends NormBundle {
  constructor () {
    super({ schema: 'server' });

    this.bundle('/{serverId}/zone', new ZoneBundle());
  }
};
