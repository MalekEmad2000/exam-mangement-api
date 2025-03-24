import express from 'express';
import StudentApis from './student/student_routs';
import ExamApi from './exam/exam_data';

const public_routes = express.Router();

public_routes.use('/exam/', ExamApi);
public_routes.use('/student/', StudentApis);


export default public_routes;
