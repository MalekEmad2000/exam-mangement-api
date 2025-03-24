import { Request, Response, NextFunction } from 'express';

import { StatusCodes } from '../../../constants/status_codes';
import { JWTHelper } from '../../../utils/jwt';
import {
  StudentModel,
  Student,
  validate_student_vairables,
} from '../../../Models/students_model';

import { ResponseMessages } from '../../../constants/error_messages';

const student_model = StudentModel.getInstance();

export async function authenticate_student(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.json({
        status: StatusCodes.UNAUTHORIZED,
        message: 'No Token Provided',
      });
      return;
    }
    try {
      const jwtObj = JWTHelper.verify(token);
      const student = await student_model.get_student(
        jwtObj.student_id,
        jwtObj.exam_id
      );

      if (student === null) {
        res.json({
          status: StatusCodes.UNAUTHORIZED,
          message: 'Invalid Token',
        });
        return;
      }

      res.locals.student = student;
    } catch (err) {
      res.json({
        status: StatusCodes.UNAUTHORIZED,
        message: 'Invalid Token',
      });
      return;
    }

    next();
  } catch (err) {
    res.json({
      status: StatusCodes.NOT_FOUND,
      message: 'Failed to Authenticate Student',
    });
  }
}

export async function validate_student(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const student: Student = {
      id: req.body.id,
      name: req.body.name,
      national_id: req.body.national_id,
      email: req.body.email,
      exam_id: req.body.exam_id,
    };

    if (!validate_student_vairables(student)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: ResponseMessages.BAD_REQUEST,
      });

      return;
    }

    next();
  } catch (err) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: 'Invalid Student',
    });
  }
}
