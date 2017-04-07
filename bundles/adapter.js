const NormBundle = require('bono-norm/bundle');

module.exports = class AdapterBundle extends NormBundle {
  constructor () {
    super({ schema: 'adapter' });
  }

  create (ctx) {
    ctx.throw(404);
  }

  async read (ctx) {
    let name = ctx.parameters.id;

    let entry = await this.factory(ctx, { name }).single();
    if (!entry) {
      ctx.throw(404);
    }

    ctx.parameters.id = entry.id;

    let result = await super.read(ctx);

    return result;
  }

  update (ctx) {
    ctx.throw(404);
  }

  del (ctx) {
    ctx.throw(404);
  }
};
