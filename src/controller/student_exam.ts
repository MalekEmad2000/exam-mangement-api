import { Request, Response } from 'express';
import { StatusCodes } from '../constants/status_codes';
import { ExamSectionModel, Section } from '../Models/exam_sections_model';
import { StudentAnswersModel } from '../Models/student_answers_model';
import { Student, StudentModel } from '../Models/students_model';
import { SocketManager } from './sockets_controller';
import { Question_Model } from '../Models/questions_model';

const exam_section_model = ExamSectionModel.getInstance();
const student_answers_model = StudentAnswersModel.getInstance();
const studnet_model = StudentModel.getInstance();

const question_model = Question_Model.getInstance();

const socket_manager = SocketManager.getInstance();

export const get_exam_sections_questions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const student = res.locals.student as Student;

    const socket_check = socket_manager.checkSocket(
      student.exam_id.toString(),
      req.ip
    );

    console.log('socket check = ' + socket_check);

    if (socket_check === false) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        error: 'Socket not found',
      });
      return;
    }

    const submit = await studnet_model.is_student_submitted(student);

    if (submit === true) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: 'Unauthorized',
      });
      return;
    }

    const is_active = await studnet_model.is_student_active(student);
    if (!is_active) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Student Not Active',
      });
      return;
    }

    const exam_sections: Section[] = await exam_section_model.get_exam_sections(
      student.exam_id
    );

    for (let i = 0; i < exam_sections.length; i++) {
      const section_order =
        await student_answers_model.get_student_section_order(
          student.exam_id,
          student.id,
          exam_sections[i].section_id
        );
      exam_sections[i].section_order = section_order;

      for (let j = 0; j < exam_sections[i].questions.length; j++) {
        const question_order =
          await student_answers_model.get_student_question_choice_order(
            student.exam_id,
            student.id,
            exam_sections[i].section_id,
            exam_sections[i].questions[j].question_id
          );
        exam_sections[i].questions[j].question_order =
          question_order.question_order;
        exam_sections[i].questions[j].student_choice =
          question_order.student_choice;
      }
      exam_sections[i].questions.sort(
        (a, b) => (a.question_order ?? 0) - (b.question_order ?? 0)
      );
    }

    exam_sections.sort(
      (a, b) => (a.section_order ?? 0) - (b.section_order ?? 0)
    );

    res.json(exam_sections).status(StatusCodes.OK);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.NOT_FOUND).json({
      status: StatusCodes.NOT_FOUND,
      error: 'Error Getting Exam',
    });
  }
};

export const get_question_image = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const student = res.locals.student as Student;
    const question_id = req.body.question_id;
    const section_id = req.body.section_id;
    console.log(req.body);
    console.log('get question image' + student);
    console.log('get q_id = ' + question_id);
    console.log('get sec_id = ' + section_id);

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

    const question_image = await question_model.get_question_image(
      student.exam_id,
      parseInt(question_id),
      parseInt(section_id)
    );

    res
      .json({
        image: question_image,
      })
      .status(StatusCodes.OK);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Error Getting Questsion Image',
    });
  }
};

export const get_chosen_choices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const student = res.locals.student as Student;
    const exam_id = student.exam_id;
    const student_id = student.id;

    console.log('get chosen choices' + student);

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

    const chossen_choices =
      await student_answers_model.get_student_choosen_answers(
        exam_id,
        student_id
      );

    res.json(chossen_choices).status(StatusCodes.OK);
    return;
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Server Error',
    });
  }
};
