import { Request, Response } from 'express';
import { StatusCodes } from '../constants/status_codes';
import { ResponseMessages } from '../constants/error_messages';

import { ExamModel } from '../Models/exam_model';
import { ExamLogModel, Exam_Log } from '../Models/exam_logs';
import { StudentAnswersModel } from '../Models/student_answers_model';

import { StudentModel, Student, Student_Pass } from '../Models/students_model';

import { SocketManager } from './sockets_controller';

import { JWTHelper } from '../utils/jwt';

const student_model = StudentModel.getInstance();
const exam_model = ExamModel.getInstance();
const exam_log_model = ExamLogModel.getInstance();
const student_answers_model = StudentAnswersModel.getInstance();
const socket_manager = SocketManager.getInstance();

export const student_login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const student_recived: Student = {
      id: req.body.id,
      name: req.body.name,
      national_id: req.body.national_id,
      email: req.body.email,
      exam_id: req.body.exam_id,
    };

    const student_db_response = await student_model.check_and_update_student(
      student_recived
    );

    if (student_db_response === null) {
      console.log('student not found');

      res.status(StatusCodes.NOT_FOUND);
      res.json({
        error: ResponseMessages.STUDENT_NOT_FOUND,
      });

      return;
    }
    const is_submitted = await student_model.is_student_submitted(
      student_db_response
    );

    if (is_submitted === true) {
      res.status(StatusCodes.UNAUTHORIZED);
      res.json({
        status: StatusCodes.UNAUTHORIZED,
        error: ResponseMessages.STUDENT_ALREADY_SUBMITTED,
      });
      return;
    }
    const exam_state = await exam_model.get_exam_status(
      student_db_response.exam_id
    );

    if (exam_state === 'COMPLETED') {
      res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        error: 'Exam Already Completed',
      });
      return;
    } else if (exam_state === 'NOT_STARTED') {
      await student_answers_model.create_student_exam_default_answers(
        student_db_response.exam_id,
        student_db_response.id
      );

      const attempts = await student_model.decrease_student_attempts(
        student_db_response
      );

      if (attempts == false) {
        res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: StatusCodes.NOT_ACCEPTABLE,
          error:
            ResponseMessages.UNAUTHORIZED +
            ' ' +
            'Connect With Password To Proceed',
        });
        return;
      }

      const token = JWTHelper.sign({
        student_id: student_db_response.id,
        exam_id: student_db_response.exam_id,
      });

      student_model.make_student_active(student_db_response);
      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Exam Not Started Connect Socket and Wait',
        token: token,
      });
    } else if (exam_state === 'ONGOING') {
      await student_answers_model.create_student_exam_default_answers(
        student_db_response.exam_id,
        student_db_response.id
      );

      const attempts = await student_model.decrease_student_attempts(
        student_db_response
      );

      if (attempts == false) {
        res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: StatusCodes.NOT_ACCEPTABLE,
          error:
            ResponseMessages.UNAUTHORIZED +
            ' ' +
            'Connect With Password To Proceed',
        });
        return;
      }

      const token = JWTHelper.sign({
        student_id: student_db_response.id,
        exam_id: student_db_response.exam_id,
      });

      student_model.make_student_active(student_db_response);
      res.status(StatusCodes.OK).send({
        message: 'Connect Socket to Proceed',
        token: token,
      });

      socket_manager.addToPending(
        student_db_response.exam_id.toString(),
        req.ip
      );
    }

    const exam_log: Exam_Log = {
      student_id: student_db_response.id,
      exam_id: student_db_response.exam_id,
      user_agent: req.headers['user-agent'],
      ip_address: req.ip,
    };

    //  ==================================================
    const e_log = await exam_log_model.create_start_log(exam_log, false); // create exam log
    //  ==================================================

    if (e_log === true) {
      console.log('exam log created');
    } else {
      console.log('exam log not created');
    }

    return;
  } catch (err) {
    console.log(err);

    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      error: 'error at server',
    });
  }
};

export const student_logout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // const std = await exam_log_model.get_student(req.sessionID);

    const student = res.locals.student as Student;

    const submit = await student_model.is_student_submitted(student);

    if (submit === true) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        error: ResponseMessages.STUDENT_ALREADY_SUBMITTED,
      });
      return;
    }

    const socket_check = socket_manager.checkSocket(
      student.exam_id.toString(),
      req.ip
    );

    if (socket_check === false) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        error: 'Socket not found',
      });
      return;
    }

    const exam_log: Exam_Log = {
      student_id: student.id,
      exam_id: student.exam_id,
      user_agent: req.headers['user-agent'],
      ip_address: req.ip,
    };

    exam_log_model.create_submit_log(exam_log);

    student_model.update_student_is_submitted(student);

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: ResponseMessages.LOGOUT_SUCCESS,
    });
  } catch (err) {
    const errorMessage = (err as Error)?.message;
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      status: StatusCodes.SERVICE_UNAVAILABLE,
      error: errorMessage,
    });
  }
};

export const student_password_login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const student_recived: Student_Pass = {
      id: req.body.id,
      name: req.body.name,
      exam_password: req.body.exam_password,
      exam_id: req.body.exam_id,
    };

    const check_exam_password = await exam_model.check_exam_password(
      student_recived.exam_id,
      student_recived.exam_password
    );

    if (check_exam_password === false) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        error: 'Wrong Password',
      });
      return;
    }

    const student_db_response = await student_model.get_student(
      student_recived.id,
      student_recived.exam_id
    );

    if (student_db_response === null) {
      res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        error: ResponseMessages.STUDENT_NOT_FOUND,
      });
      return;
    }

    const is_submitted = await student_model.is_student_submitted(
      student_db_response
    );

    if (is_submitted === true) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        error: ResponseMessages.STUDENT_ALREADY_SUBMITTED,
      });
      return;
    }

    const exam_state = await exam_model.get_exam_status(
      student_db_response.exam_id
    );

    if (exam_state === 'COMPLETED') {
      res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        error: 'Exam Already Completed',
      });
      return;
    }

    await student_model.decrease_student_attempts(student_db_response);

    const exam_log: Exam_Log = {
      student_id: student_db_response.id,
      exam_id: student_db_response.exam_id,
      user_agent: req.headers['user-agent'],
      ip_address: req.ip,
    };

    //=========================================
    //TODO check student in exam log
    //=========================================

    await student_answers_model.create_student_exam_default_answers(
      student_db_response.exam_id,
      student_db_response.id
    );

    const e_log = await exam_log_model.create_start_log(exam_log, true);
    if (e_log === true) {
      console.log('exam log created');
    } else {
      console.log('exam log not created');
    }

    const token = JWTHelper.sign({
      student_id: student_db_response.id,
      exam_id: student_db_response.exam_id,
    });

    student_model.make_student_active(student_db_response);
    res.status(StatusCodes.OK).send({
      message: 'Connect Socket to Proceed',
      token: token,
    });
    socket_manager.addToPending(student_db_response.exam_id.toString(), req.ip);
    return;
  } catch (err) {
    const errorMessage = (err as Error)?.message;
    console.log(err);
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      status: StatusCodes.SERVICE_UNAVAILABLE,
      error: errorMessage,
    });
  }
};
