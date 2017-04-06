const Adapter = require('../lib/adapter');
const path = require('path');
const fs = require('fs-promise');

module.exports = class Local extends Adapter {
  async write (kind, file, content) {
    if (kind === 'db') {
      await this.writeDb(file, content);
    } else {
      await this.writeCfg(file, content);
    }
  }

  async writeDb (file, content) {
    await fs.ensureDir(this.dbdir);
    await fs.writeFile(path.join(this.dbdir, `db.${file}`), content);
  }

  async writeCfg (file, content) {
    await fs.ensureDir(this.etcdir);
    await fs.writeFile(path.join(this.etcdir, `db.${file}`), content);
  }
};
