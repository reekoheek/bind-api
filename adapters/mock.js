const Adapter = require('../lib/adapter');

let datum = {};

module.exports = class Mock extends Adapter {
  static reset () {
    datum = {};
  }

  static getData (name) {
    datum[name] = datum[name] || new MockData();
    return datum[name];
  }

  exists (kind, file) {

  }

  write (kind, file, content) {
    let data = Mock.getData(this.name);

    data[kind][file] = content;
  }

  reload () {

  }
};

class MockData {
  constructor () {
    this.conf = {};
    this.db = {};
  }

  read (kind, file) {
    return this[kind][file] || '';
  }
}
