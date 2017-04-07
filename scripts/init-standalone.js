const req = require('superagent');
const SERVER_ID = '4f56d847-11c9-4273-83a9-deee0b344cc3';
function uri (uri) {
  return 'http://localhost:3000' + uri;
}

// { name: 'local', adapter: 'local' }
async function createServer (row) {
  let { body: { entry } } = await req.post(uri('/server'))
    .send(row);
  return entry;
}

// { name: 'local', adapter: 'local' }
async function updateServer (row) {
  let { body: { entry } } = await req.put(uri(`/server/${SERVER_ID}`))
    .send(row);
  return entry;
}

async function createZone (row) {
  let { body: { entry } } = await req.post(uri(`/server/${SERVER_ID}/zone`))
    .send(row);
  return entry;
}

async function updateZone (id, row) {
  let { body: { entry } } = await req.post(uri(`/server/${SERVER_ID}/zone/${id}`))
    .send(row);
  return entry;
}

(async () => {
  try {
    let x = await updateZone('a0264398-5f34-49b8-9713-b1712bd00df0', {
      master: 'ns.xinixhost1.com',
    });
    console.log('xx', x);
  } catch (err) {
    if (err.response) {
      console.error(err.response.body);
    }
    console.log('');
    console.error(err.stack);
  }
})();
