const App = require('../../app');
const http = require('http');
const request = require('supertest');
const config = require('../../config')('test');

module.exports = class Tester {
  constructor () {
    this.app = new App(config);

    this.server = http.createServer(this.app.callback());
  }

  async getData () {
    let { data } = await this.app.manager.tx.getConnection();
    return data;
  }

  get (uri) {
    return request(this.server).get(uri);
  }

  post (uri) {
    return request(this.server).post(uri);
  }

  put (uri) {
    return request(this.server).put(uri);
  }

  delete (uri) {
    return request(this.server).delete(uri);
  }

  async reset () {
    let { manager } = this.app;

    await manager.factory('server').truncate();
    await manager.factory('zone').truncate();
  }
};