import express from 'express';
import { student_logout } from '../../controller/student_control';

import { submit_answers } from '../../controller/student_submition_control';
import {
  get_exam_sections_questions,
  get_chosen_choices,
  get_question_image,
} from '../../controller/student_exam';

import {
  student_login,
  student_password_login,
} from '../../controller/student_control';

import {
  authenticate_student,
  validate_student,
} from '../../controller/middleware/validation/student_auth';

const routes = express.Router();

//================handle login =============

routes.post('/login', validate_student, student_login);

//TODO
routes.post('/login_by_password', student_password_login);

//=========================================

routes.use('/', authenticate_student);

routes.put('/submit_answers', submit_answers);
routes.post('/question_image', get_question_image);

routes.get('/exam', get_exam_sections_questions);

routes.get('/logout', student_logout);

routes.get('/answers', get_chosen_choices);

// routes.put('/browser_closed');

export default routes;
