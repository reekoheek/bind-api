const NString = require('node-norm/schema/nstring');
const NInteger = require('node-norm/schema/ninteger');
const NList = require('node-norm/schema/nlist');
// const NBoolean = require('node-norm/schema/nboolean');
// const NDateTime = require('node-norm/schema/ndatetime');

const fnShortLabel = (value) => value;

module.exports = function (env = 'production') {
  console.log('Env', env);

  let adapter = env === 'test' ? 'memory' : 'disk';

  return {
    env,
    debug: true,
    connections: [
      {
        name: 'default',
        adapter,
        schemas: [
          {
            name: 'server',
            fields: [
              new NString('name').filter('required', [ 'unique', 'server' ]),
              new NString('adapter').filter('required', [ 'exists', 'adapter', 'name' ]),
              new NString('etcdir').filter([ 'default', '/etc/bind' ]),
              new NString('dbdir').filter([ 'default', '/var/lib/bind' ]),
              new NString('localfile').filter([ 'default', 'named.conf.local' ]),
              // TODO - options     (object, default:{})
              // new NBoolean('synced').filter([ 'default', false ]),
              // new NDateTime('last_synced'),
            ],
          },
          {
            name: 'zone',
            fields: [
              new NString('name').filter('required', [ 'unique', 'zone' ]),
              new NString('master').filter('required'),
              new NString('email').filter('required', 'email'),
              new NInteger('serial').filter([ 'default', 1 ]),
              new NInteger('refresh').filter([ 'default', 10800 ]),
              new NInteger('retry').filter([ 'default', 3600 ]),
              new NInteger('expire').filter([ 'default', 604800 ]),
              new NInteger('ttl').filter([ 'default', 38400 ]),
              new NList('records').filter([ 'are', 'record' ], [ 'default', [] ]),
            ],
          },
          {
            name: 'record',
            fields: [
              new NString('label').filter('required', fnShortLabel),
              // new NString('class').filter([ 'default', 'IN' ]),
              new NString('rr').filter('required', [ 'enum', 'A', 'CNAME', 'MX', 'NS', 'TXT' ]),
              new NString('pref').filter([ 'requiredIf', 'rr', 'MX' ]),
              new NString('value').filter('required'),
            ],
          },
        ],
      },
    ],
  };
};
