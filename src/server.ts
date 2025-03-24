import express from 'express';
import cors from 'cors';
import public_routes from './public_routes';
import local_routes from './local_routes';

// import https from 'https';
// import fs from 'fs';

import path from 'path';
import cookieParser from 'cookie-parser';

import { Server } from 'socket.io';
import { createServer } from 'http';
import { SocketManager } from './controller/sockets_controller';

//===================public server===================
const app = express();
const httpServer = createServer(app);
export const socket_server = new Server(httpServer, {
  cors: {
    origin: true,
    methods: ['POST', 'PUT', 'GET'],
  },
});

// adidng cors middleware
app.use(
  cors({
    origin: true,
    methods: ['POST', 'PUT', 'GET'],
    credentials: true,
  })
);

app.use(cookieParser());

// adding body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', public_routes);

app.use(express.static(path.join(__dirname, 'Frontend')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

app.listen(3031, '0.0.0.0', () => {
  console.log('public server is running on port 3031');
});

socket_server.listen(3032);

socket_server.on('connection', (socket) => {
  console.log('socket connected');
  SocketManager.getInstance().handleSocketConnection(socket);
});
// ===================================================

//============================== local server==============================
const app_local = express();

app_local.use(
  cors({
    origin: true,
    methods: ['POST', 'PUT', 'GET'],
    credentials: true,
  })
);

app_local.use(express.json());
app_local.use(express.urlencoded({ extended: true }));

app_local.use(cookieParser());

app_local.use(local_routes);

app_local.listen(3035, () => {
  console.log('local server is running on port 3035');
});
// ========================================================================

// const options: https.ServerOptions = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem'),
//   rejectUnauthorized: false,
// };

// https.createServer(options, app).listen(443);
