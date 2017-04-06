const Bundle = require('bono');
const Manager = require('node-norm');
const ServerBundle = require('./bundles/server');
const AdapterBundle = require('./bundles/adapter');
const fs = require('fs-promise');
const path = require('path');

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
    this.bundle('/adapter', new AdapterBundle());
  }

  async initialize () {
    await this.manager.factory('adapter').truncate();

    let files = await fs.readdir(path.join(__dirname, 'adapters'));
    let q = this.manager.factory('adapter');
    files.map(file => {
      let name = path.basename(file, '.js');
      let source = '../adapters/' + name;
      q.insert({ name, source });
    });
    await q.save();
  }
};
