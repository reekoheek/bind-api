const exec = require('child_process').exec;
const spawn = require('child_process').spawn;

let initialized = false;
let version;
let instance;

class Binder {
  static async initialize (mode) {
    if (initialized) {
      return;
    }

    initialized = true;

    console.log('Initializing binder ...');
    version = await checkVersion('named');
    await checkVersion('named-checkconf');
    await checkVersion('named-checkzone');

    if (mode === 'standalone') {
      if (!version) {
        console.warn('Cannot start bind server, no binary installed ...');
        return;
      }

      console.log(`Starting bind server ...`);
      instance = new Binder('named', ['-g']);
      instance.start();

      // delay to make sure
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  static async exec (cmd) {
    let result = await new Promise((resolve, reject) => {
      try {
        exec(cmd, (err, stdout, stderr) => {
          if (err) {
            err.stdout = stdout;
            err.stderr = stderr;
            reject(err);
          } else {
            resolve([ stdout, stderr ]);
          }
        });
      } catch (err) {
        reject(err);
      }
    });

    return result;
  }

  static async reload () {
    await checkWaitError(`rndc reload`);
  }

  static async checkZone (file, filepath) {
    await checkWaitError(`named-checkzone ${file} ${filepath}`);
  }

  static async checkConf (filepath) {
    await checkWaitError(`named-checkconf ${filepath}`);
  }

  constructor (cmd, args = []) {
    this.cmd = cmd;
    this.args = args;
  }

  start () {
    // this.proc = spawn(this.cmd, this.args);
    this.proc = spawn(this.cmd, this.args, { stdio: 'inherit' });
  }
};

async function checkVersion (cmd) {
  try {
    let [ out ] = await Binder.exec(`${cmd} -v`);
    let version = out.trim();
    console.log(`${cmd} version`, version);
    return version;
  } catch (err) {
    console.warn(`${cmd} error or not found!`);
  }
}

async function checkWaitError (cmd) {
  if (version) {
    try {
      await Binder.exec(cmd);
    } catch (err) {
      if (err.code !== 1) throw err;
      throw new BinderError(err.stdout.trim());
    }
  }
}

class BinderError extends Error {
  constructor (message, ...args) {
    super(message, ...args);

    this.status = 400;
    this.children = message.split('\n').map(line => new Error(line.trim()));
  }
};

module.exports = Binder;
