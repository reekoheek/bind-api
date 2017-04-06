const Bundle = require('bono');
const Manager = require('node-norm');
const ServerBundle = require('./bundles/server');

module.exports = class App extends Bundle {
  constructor (config) {
    super();

    let { env, debug } = config;

    let manager = this.manager = new Manager(config);

    if (env !== 'test') {
      this.use(require('bono/middlewares/logger')());
    }
    this.use(require('bono/middlewares/json')({ debug }));
    this.use(require('node-bono-norm/middleware')({ manager }));

    this.get('/', ctx => ({ name: 'bind-api' }));

    this.bundle('/server', new ServerBundle());
  }
};
