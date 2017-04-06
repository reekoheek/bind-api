const App = require('./app');
const http = require('http');
const config = require('./config')();

const PORT = process.env.PORT || 3000;

(async () => {
  const app = new App(config);
  const server = http.createServer(app.callback());

  await app.initialize();

  server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
})();
