const App = require('./app');
const http = require('http');
const config = require('./config')();

const PORT = process.env.PORT || 3000;

const server = http.createServer(new App(config).callback());

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
