import { Request, Response } from 'express';
import { StatusCodes } from '../constants/status_codes';
import { Exam, ExamModel } from '../Models/exam_model';
import { SocketManager } from './sockets_controller';
import { captureRejectionSymbol } from 'events';

const socket_manager = SocketManager.getInstance();
const exam_model = ExamModel.getInstance();

export const get_exam_details = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const exam_id: number = parseInt(req.params.exam_id as string);
    if (isNaN(exam_id)) {
      res.status(StatusCodes.BAD_REQUEST);
      res.json({
        error: 'Bad Request',
      });
      return;
    }
    
    const exam_db_response = await exam_model.get_exam_details(exam_id);
    if (exam_db_response == null) {
      res.status(StatusCodes.NOT_FOUND);
      res.json({
        error: 'Exam Not Found',
      });
      return;
    }

    res.json(exam_db_response).status(StatusCodes.OK);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.NOT_FOUND,
      message: 'Error At Server',
    });
  }
};

export const end_exam = async (req: Request, res: Response): Promise<void> => {
  try {
    const exam_id: number = parseInt(req.body.exam_id as string);
    const Response = await exam_model.end_exam(exam_id);
    console.log(exam_id);
    socket_manager.tellExamToEnd(exam_id.toString());

    res.json(Response).status(StatusCodes.OK);
  } catch (err) {
    res.json({
      status: StatusCodes.NOT_FOUND,
      message: 'Exam Not Found',
    });
  }
};

export const start_exam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const exam_id: number = parseInt(req.body.exam_id as string);
    const Response = await exam_model.start_exam(exam_id);
    console.log('tell exam to start = ' + exam_id);
    socket_manager.tellExamToStart(exam_id.toString());

    res.json(Response).status(StatusCodes.OK);
  } catch (err) {
    res.json({
      status: StatusCodes.NOT_FOUND,
      message: 'Exam Not Found',
    });
  }
};
