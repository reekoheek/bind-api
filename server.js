const App = require('./app');
const http = require('http');
const config = require('./config')();

const PORT = process.env.PORT || 3000;

(async () => {
  const app = new App(config);
  const server = http.createServer(app.callback());

  await app.initialize();

  console.log('');
  server.listen(PORT, () => {
    console.log(`Listening bind_api at port ${PORT} ...`);
  });
})().catch(err => {
  console.log('\n\n\n\n');
  console.error(`Globally caught error ...`);
  console.error(err.stack);
  console.log('\n\n\n\n');
});
