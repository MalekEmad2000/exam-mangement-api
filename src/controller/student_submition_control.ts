import { Request, Response } from 'express';
import { StatusCodes } from '../constants/status_codes';

import { StudentAnswersModel } from '../Models/student_answers_model';
import { Student, StudentModel } from '../Models/students_model';

import { SocketManager } from './sockets_controller';
import { ExamLogModel, Exam_Log } from '../Models/exam_logs';

const student_answers = StudentAnswersModel.getInstance();
const student_model = StudentModel.getInstance();
const exam_log_model = ExamLogModel.getInstance();

const socket_manager = SocketManager.getInstance();

export async function submit_answers(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const std = res.locals.student as Student;

    const socket_check = socket_manager.checkSocket(
      std.exam_id.toString(),
      req.ip
    );

    if (socket_check === false) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Socket not found',
      });
      return;
    }

    if (std === null) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Unauthorized',
      });
      return;
    }

    const student = std as Student;

    const student_id = student.id;
    const exam_id = student.exam_id;
    const answers = req.body.answers;

    const is_active = await student_model.is_student_active(student);

    if (!is_active) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.BAD_REQUEST,
        error: 'Student Not Allowed to Submit',
      });
      return;
    }

    const examLog: Exam_Log = {
      student_id: student_id,
      exam_id: exam_id,
      user_agent: req.headers['user-agent'],
      ip_address: req.ip,
    };

    for (let i = 0; i < answers.length; i++) {
      await exam_log_model.create_choice_log(
        examLog,
        answers[i].question_id,
        answers[i].choice_id,
        answers[i].section_id
      );
    }

    const result = await student_answers.set_answers(
      exam_id,
      student_id,
      answers
    );

    if (result) {
      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Answers Submitted Successfully',
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: 'Bad Request',
      });
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Error at Server',
    });
  }
}
