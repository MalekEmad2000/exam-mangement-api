"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = void 0;
var students_model_1 = require("../Models/students_model");
var exam_logs_1 = require("../Models/exam_logs");
var student_model = students_model_1.StudentModel.getInstance();
var exam_log_model = exam_logs_1.ExamLogModel.getInstance();
var SocketManager = /** @class */ (function () {
    function SocketManager() {
        this.connected_sockets = new Map();
        this.pending_sockets = new Map();
        // private constructor
    }
    SocketManager.prototype.addToPending = function (exam_id, ip) {
        var _a;
        var sock_ip = ip.split(':').slice(-1)[0];
        console.log('adding socket to pending: ' + sock_ip);
        if (!this.pending_sockets.has(exam_id)) {
            this.pending_sockets.set(exam_id, [sock_ip]);
        }
        else {
            (_a = this.pending_sockets.get(exam_id)) === null || _a === void 0 ? void 0 : _a.push(sock_ip);
        }
    };
    SocketManager.getInstance = function () {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager();
        }
        return SocketManager.instance;
    };
    SocketManager.prototype.handleSocketConnection = function (socket) {
        var _this = this;
        socket.on('leave_exam', function (exam_id) {
            _this.removeSocket(exam_id, socket.handshake.address);
            console.log('socket disconnected from exam: ' + exam_id);
        });
        socket.on('join_exam', function (exam_id, student_id) {
            console.log('socket joined exam: ' + exam_id);
            var ip = socket.handshake.address.toString();
            ip = ip.split(':').slice(-1)[0];
            var pending_ips = _this.pending_sockets.get(exam_id);
            console.log('socket is pending : ' + (pending_ips === null || pending_ips === void 0 ? void 0 : pending_ips.includes(ip)));
            if (pending_ips === null || pending_ips === void 0 ? void 0 : pending_ips.includes(ip)) {
                socket.emit('exam_started');
            }
            _this.addSocket(exam_id, student_id, socket);
        });
        socket.on('disconnect', function () {
            //handle disconnect
            console.log('socket disconnected');
            _this.connected_sockets.forEach(function (socketsInRoom, exam_id) {
                socketsInRoom.map(function (student_socket) {
                    if (student_socket.socket.id === socket.id) {
                        console.log('socket disconnected from exam: ' + exam_id);
                        console.log('socket disconnected from student: ' + student_socket.student_id);
                        student_model.make_student_disconnected(student_socket.student_id, student_socket.exam_id);
                        var sock_ip = student_socket.socket.handshake.address.toString();
                        sock_ip = sock_ip.split(':').slice(-1)[0];
                        exam_log_model.create_disconnect_log({
                            exam_id: parseInt(student_socket.exam_id),
                            student_id: student_socket.student_id,
                            ip_address: sock_ip,
                            user_agent: 'None',
                        });
                    }
                });
            });
        });
    };
    SocketManager.prototype.addSocket = function (exam_id, student_id, socket) {
        var _a;
        console.log('adding socket to exam: ' + exam_id);
        if (!this.connected_sockets.has(exam_id)) {
            this.connected_sockets.set(exam_id, []);
        }
        (_a = this.connected_sockets.get(exam_id)) === null || _a === void 0 ? void 0 : _a.push({
            student_id: student_id,
            exam_id: exam_id,
            socket: socket,
        });
    };
    SocketManager.prototype.removeSocket = function (exam_id, ipaddress) {
        var socketsInRoom = this.connected_sockets.get(exam_id);
        if (socketsInRoom) {
            socketsInRoom.map(function (student_socket) {
                var sock_ip = student_socket.socket.handshake.address.toString();
                sock_ip = sock_ip.split(':').slice(-1)[0];
                if (sock_ip == ipaddress) {
                    student_socket.socket.emit('exam_ended');
                    student_socket.socket.disconnect();
                    socketsInRoom.splice(socketsInRoom.indexOf(student_socket), 1);
                }
            });
        }
    };
    SocketManager.prototype.checkSocket = function (exam_id, ipaddress) {
        var student_sockets = this.connected_sockets.get(exam_id);
        if (student_sockets) {
            for (var i = 0; i < student_sockets.length; i++) {
                var sock_ip = student_sockets[i].socket.handshake.address.toString();
                sock_ip = sock_ip.split(':').slice(-1)[0];
                if (sock_ip == ipaddress) {
                    return true;
                }
            }
        }
        return false;
    };
    SocketManager.prototype.tellExamToEnd = function (exam_id) {
        var connected_sockets = this.connected_sockets.get(exam_id);
        if (connected_sockets) {
            connected_sockets.forEach(function (student_socket) {
                if (student_socket.socket.disconnected) {
                    return;
                }
                console.log('telling socket to end' + student_socket.student_id);
                student_socket.socket.emit('exam_ended');
            });
        }
        this.connected_sockets.delete(exam_id);
    };
    SocketManager.prototype.tellExamToStart = function (exam_id) {
        var connected_sockets = this.connected_sockets.get(exam_id);
        if (connected_sockets) {
            connected_sockets.forEach(function (student_socket) {
                if (student_socket.socket.disconnected) {
                    return;
                }
                console.log('telling socket to start' + student_socket.student_id);
                student_socket.socket.emit('exam_started');
            });
        }
    };
    return SocketManager;
}());
exports.SocketManager = SocketManager;
