import express from 'express';
import { get_exam_details } from '../../controller/exam_control';

const routes = express.Router();

routes.get('/:exam_id', get_exam_details);

export default routes;