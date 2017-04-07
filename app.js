const Bundle = require('bono');
const Manager = require('node-norm');
const ServerBundle = require('./bundles/server');
const AdapterBundle = require('./bundles/adapter');
const Adapter = require('./lib/adapter');
const Binder = require('./lib/binder');

module.exports = class App extends Bundle {
  constructor (config) {
    super();

    let { env, debug, mode } = config;
    let manager = this.manager = new Manager(config);

    this.mode = mode;

    if (env !== 'test') {
      this.use(require('bono/middlewares/logger')());
    }
    this.use(require('bono/middlewares/json')({ debug }));
    this.use(require('bono-norm/middleware')({ manager }));

    this.get('/', ctx => ({ name: 'bind-api' }));

    this.bundle('/server', new ServerBundle());
    this.bundle('/adapter', new AdapterBundle());
  }

  async initialize () {
    await Binder.initialize(this.mode);

    await Adapter.initialize(this.manager);
  }
};
