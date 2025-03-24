"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket_server = void 0;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var public_routes_1 = __importDefault(require("./public_routes"));
var local_routes_1 = __importDefault(require("./local_routes"));
// import https from 'https';
// import fs from 'fs';
var path_1 = __importDefault(require("path"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var socket_io_1 = require("socket.io");
var http_1 = require("http");
var sockets_controller_1 = require("./controller/sockets_controller");
//===================public server===================
var app = (0, express_1.default)();
var httpServer = (0, http_1.createServer)(app);
exports.socket_server = new socket_io_1.Server(httpServer, {
    cors: {
        origin: true,
        methods: ['POST', 'PUT', 'GET'],
    },
});
// adidng cors middleware
app.use((0, cors_1.default)({
    origin: true,
    methods: ['POST', 'PUT', 'GET'],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
// adding body parser middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', public_routes_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, 'Frontend')));
app.get('/*', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, 'Frontend', 'index.html'));
});
app.listen(3031, '0.0.0.0', function () {
    console.log('public server is running on port 3031');
});
exports.socket_server.listen(3032);
exports.socket_server.on('connection', function (socket) {
    console.log('socket connected');
    sockets_controller_1.SocketManager.getInstance().handleSocketConnection(socket);
});
// ===================================================
//============================== local server==============================
var app_local = (0, express_1.default)();
app_local.use((0, cors_1.default)({
    origin: true,
    methods: ['POST', 'PUT', 'GET'],
    credentials: true,
}));
app_local.use(express_1.default.json());
app_local.use(express_1.default.urlencoded({ extended: true }));
app_local.use((0, cookie_parser_1.default)());
app_local.use(local_routes_1.default);
app_local.listen(3035, function () {
    console.log('local server is running on port 3035');
});
// ========================================================================
// const options: https.ServerOptions = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem'),
//   rejectUnauthorized: false,
// };
// https.createServer(options, app).listen(443);
