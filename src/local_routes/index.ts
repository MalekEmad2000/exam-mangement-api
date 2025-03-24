import express from 'express';
import { end_exam, start_exam } from '../controller/exam_control';

const local_routes = express.Router();

local_routes.post('/end_exam', end_exam);
local_routes.post('/start_exam', start_exam);

export default local_routes;
