const NString = require('node-norm/schema/nstring');
const NBoolean = require('node-norm/schema/nboolean');
const NDateTime = require('node-norm/schema/ndatetime');

module.exports = function (env = 'production') {
  console.log('Env', env);

  let adapter = env === 'test' ? 'memory' : 'disk';

  return {
    env,
    // debug: true,
    connections: [
      {
        name: 'default',
        adapter,
        schemas: [
          {
            name: 'server',
            fields: [
              new NString('name').filter('required'), // TODO unique
              new NString('adapter').filter('required'),
              // TODO - options     (object, default:{})
              new NBoolean('synced').filter('default:false'), // TODO hidden, default:false
              new NDateTime('last_synced'), // TODO hidden, default:null
            ],
          },
        ],
      },
    ],
  };
};
