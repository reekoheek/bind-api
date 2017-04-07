const NormBundle = require('bono-norm/bundle');

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

  async update (ctx) {
    let { entry } = await this.read(ctx);

    let row = await ctx.parse();

    // avoid updating serial and pserial by hand
    delete row.serial;
    delete row.pserial;

    entry = Object.assign(entry, row);

    if (entry.serial === entry.pserial) {
      entry.serial++;
    }

    await this.factory(ctx, ctx.parameters.id).set(entry).save();

    return { entry };
  }
};
