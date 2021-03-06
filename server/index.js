import http from 'http';
import express from 'express';

const app = express();

const log = message => {
    process.stdout.write(`${message}\n`);
}

const normalisePort = val => {
    const port = parseInt(val, 10);

    if (Number.isNaN(port)) {
        return val;
    }
    
    if (port >= 0) {
        return port;
    }

    return false;
}

const port = normalisePort(process.env.PORT || 3000);
app.set('port', port);

const server = http.createServer(app);
let availablePort = port;

const startServer = serverPort => {
    server.listen(serverPort);
}

const onError = error => {
    if (error.syscall !== 'listen') {
        throw error;
      }
      const bind = `${
        typeof port === 'string' ? 'Pipe' : 'Port'
      } ${port}`;
      switch (error.code) {
        case 'EACCES':
          log(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          if (availablePort - port < 10) {
            availablePort += 1;
            startServer(availablePort);
          } else {
            log(`${bind} is already in use`);
            process.exit(1);
          }
          break;
        default:
          throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = `${
      typeof addr === 'string' ? 'pipe' : 'port'
    } ${
      typeof addr === 'string' ? addr : addr.port
    }`;
    log(`Server is listening on ${bind}`);
    log(`Visit: http://localhost:${addr.port}`);
  }


server.on('error', onError);
server.on('listening', onListening);
startServer(availablePort);