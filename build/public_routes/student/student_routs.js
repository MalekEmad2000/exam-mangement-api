"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var student_control_1 = require("../../controller/student_control");
var student_submition_control_1 = require("../../controller/student_submition_control");
var student_exam_1 = require("../../controller/student_exam");
var student_control_2 = require("../../controller/student_control");
var student_auth_1 = require("../../controller/middleware/validation/student_auth");
var routes = express_1.default.Router();
//================handle login =============
routes.post('/login', student_auth_1.validate_student, student_control_2.student_login);
//TODO
routes.post('/login_by_password', student_control_2.student_password_login);
//=========================================
routes.use('/', student_auth_1.authenticate_student);
routes.put('/submit_answers', student_submition_control_1.submit_answers);
routes.post('/question_image', student_exam_1.get_question_image);
routes.get('/exam', student_exam_1.get_exam_sections_questions);
routes.get('/logout', student_control_1.student_logout);
routes.get('/answers', student_exam_1.get_chosen_choices);
// routes.put('/browser_closed');
exports.default = routes;
