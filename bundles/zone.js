const NormBundle = require('node-bono-norm/bundle');

module.exports = class ServerBundle extends NormBundle {
  constructor () {
    super({ schema: 'zone' });
  }

  async create (ctx) {
    let entry = await ctx.parse();
    entry.server_id = ctx.parameters.serverId;

    let result = await super.create(ctx);
    return result;
  }
};
