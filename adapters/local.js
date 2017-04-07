const path = require('path');
const fs = require('fs-promise');
const Adapter = require('../lib/adapter');
const Binder = require('../lib/binder');

module.exports = class Local extends Adapter {
  async initialize () {
    await Promise.all([
      fs.ensureDir(this.dbdir),
      fs.ensureDir(this.etcdir),
    ]);
  }

  async exists (kind, file) {
    if (kind === 'db') {
      let filepath = path.join(this.dbdir, `db.${file}`);
      let exists = await fs.exists(filepath);
      return exists;
    }

    throw new Error('Unimplemented yet');
  }

  async write (kind, file, content) {
    if (kind === 'db') {
      await this.writeDb(file, content);
    } else {
      await this.writeCfg(file, content);
    }
  }

  async reload () {
    await Binder.reload();
  }

  async writeDb (file, content) {
    let filepath = path.join(this.dbdir, `db.${file}`);
    await fs.writeFile(filepath, content);
    Binder.checkZone(file, filepath);
  }

  async writeCfg (file, content) {
    let filepath = path.join(this.etcdir, `named.conf.${file}`);
    await fs.writeFile(filepath, content);
    Binder.checkConf(filepath);
  }
};
