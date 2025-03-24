import { Socket } from 'socket.io';

import { StudentModel } from '../Models/students_model';
import { ExamLogModel, Exam_Log } from '../Models/exam_logs';

const student_model = StudentModel.getInstance();
const exam_log_model = ExamLogModel.getInstance();

export type Student_Socket = {
  student_id: string;
  exam_id: string;
  socket: Socket;
};

export class SocketManager {
  private static instance: SocketManager;
  private connected_sockets = new Map<string, Student_Socket[]>();
  private pending_sockets = new Map<string, string[]>();

  private constructor() {
    // private constructor
  }

  public addToPending(exam_id: string, ip: string) {
    const sock_ip = ip.split(':').slice(-1)[0];
    console.log('adding socket to pending: ' + sock_ip);

    if (!this.pending_sockets.has(exam_id)) {
      this.pending_sockets.set(exam_id, [sock_ip]);
    } else {
      this.pending_sockets.get(exam_id)?.push(sock_ip);
    }
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public handleSocketConnection(socket: Socket) {
    socket.on('leave_exam', (exam_id: string) => {
      this.removeSocket(exam_id, socket.handshake.address);
      console.log('socket disconnected from exam: ' + exam_id);
    });

    socket.on('join_exam', (exam_id: string, student_id: string) => {
      console.log('socket joined exam: ' + exam_id);

      let ip = socket.handshake.address.toString();
      ip = ip.split(':').slice(-1)[0];

      const pending_ips = this.pending_sockets.get(exam_id);

      console.log('socket is pending : ' + pending_ips?.includes(ip));
      if (pending_ips?.includes(ip)) {
        socket.emit('exam_started');
      }

      this.addSocket(exam_id, student_id, socket);
    });

    socket.on('disconnect', () => {
      //handle disconnect

      console.log('socket disconnected');

      this.connected_sockets.forEach((socketsInRoom, exam_id) => {
        socketsInRoom.map((student_socket) => {
          if (student_socket.socket.id === socket.id) {
            console.log('socket disconnected from exam: ' + exam_id);
            console.log(
              'socket disconnected from student: ' + student_socket.student_id
            );

            student_model.make_student_disconnected(
              student_socket.student_id,
              student_socket.exam_id
            );
            let sock_ip = student_socket.socket.handshake.address.toString();
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
  }

  private addSocket(exam_id: string, student_id: string, socket: Socket) {
    console.log('adding socket to exam: ' + exam_id);
    if (!this.connected_sockets.has(exam_id)) {
      this.connected_sockets.set(exam_id, []);
    }

    this.connected_sockets.get(exam_id)?.push({
      student_id: student_id,
      exam_id: exam_id,
      socket: socket,
    });
  }

  public removeSocket(exam_id: string, ipaddress: string) {
    const socketsInRoom = this.connected_sockets.get(exam_id);
    if (socketsInRoom) {
      socketsInRoom.map((student_socket) => {
        let sock_ip = student_socket.socket.handshake.address.toString();
        sock_ip = sock_ip.split(':').slice(-1)[0];
        if (sock_ip == ipaddress) {
          student_socket.socket.emit('exam_ended');
          student_socket.socket.disconnect();
          socketsInRoom.splice(socketsInRoom.indexOf(student_socket), 1);
        }
      });
    }
  }

  public checkSocket(exam_id: string, ipaddress: string): boolean {
    const student_sockets = this.connected_sockets.get(exam_id);

    if (student_sockets) {
      for (let i = 0; i < student_sockets.length; i++) {
        let sock_ip = student_sockets[i].socket.handshake.address.toString();
        sock_ip = sock_ip.split(':').slice(-1)[0];

        if (sock_ip == ipaddress) {
          return true;
        }
      }
    }

    return false;
  }

  public tellExamToEnd(exam_id: string) {
    const connected_sockets = this.connected_sockets.get(exam_id);
    if (connected_sockets) {
      connected_sockets.forEach((student_socket) => {
        if (student_socket.socket.disconnected) {
          return;
        }
        console.log('telling socket to end' + student_socket.student_id);
        student_socket.socket.emit('exam_ended');
      });
    }
    this.connected_sockets.delete(exam_id);
  }

  public tellExamToStart(exam_id: string) {
    const connected_sockets = this.connected_sockets.get(exam_id);
    if (connected_sockets) {
      connected_sockets.forEach((student_socket) => {
        if (student_socket.socket.disconnected) {
          return;
        }
        console.log('telling socket to start' + student_socket.student_id);
        student_socket.socket.emit('exam_started');
      });
    }
  }
}
