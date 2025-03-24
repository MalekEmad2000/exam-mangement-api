"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_chosen_choices = exports.get_question_image = exports.get_exam_sections_questions = void 0;
var status_codes_1 = require("../constants/status_codes");
var exam_sections_model_1 = require("../Models/exam_sections_model");
var student_answers_model_1 = require("../Models/student_answers_model");
var students_model_1 = require("../Models/students_model");
var sockets_controller_1 = require("./sockets_controller");
var questions_model_1 = require("../Models/questions_model");
var exam_section_model = exam_sections_model_1.ExamSectionModel.getInstance();
var student_answers_model = student_answers_model_1.StudentAnswersModel.getInstance();
var studnet_model = students_model_1.StudentModel.getInstance();
var question_model = questions_model_1.Question_Model.getInstance();
var socket_manager = sockets_controller_1.SocketManager.getInstance();
var get_exam_sections_questions = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var student, socket_check, submit, is_active, exam_sections, i, section_order, j, question_order, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                student = res.locals.student;
                socket_check = socket_manager.checkSocket(student.exam_id.toString(), req.ip);
                console.log('socket check = ' + socket_check);
                if (socket_check === false) {
                    res.status(status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        status: status_codes_1.StatusCodes.UNAUTHORIZED,
                        error: 'Socket not found',
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, studnet_model.is_student_submitted(student)];
            case 1:
                submit = _a.sent();
                if (submit === true) {
                    res.status(status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        status: status_codes_1.StatusCodes.UNAUTHORIZED,
                        message: 'Unauthorized',
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, studnet_model.is_student_active(student)];
            case 2:
                is_active = _a.sent();
                if (!is_active) {
                    res.status(status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        error: 'Student Not Active',
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, exam_section_model.get_exam_sections(student.exam_id)];
            case 3:
                exam_sections = _a.sent();
                i = 0;
                _a.label = 4;
            case 4:
                if (!(i < exam_sections.length)) return [3 /*break*/, 11];
                return [4 /*yield*/, student_answers_model.get_student_section_order(student.exam_id, student.id, exam_sections[i].section_id)];
            case 5:
                section_order = _a.sent();
                exam_sections[i].section_order = section_order;
                j = 0;
                _a.label = 6;
            case 6:
                if (!(j < exam_sections[i].questions.length)) return [3 /*break*/, 9];
                return [4 /*yield*/, student_answers_model.get_student_question_choice_order(student.exam_id, student.id, exam_sections[i].section_id, exam_sections[i].questions[j].question_id)];
            case 7:
                question_order = _a.sent();
                exam_sections[i].questions[j].question_order =
                    question_order.question_order;
                exam_sections[i].questions[j].student_choice =
                    question_order.student_choice;
                _a.label = 8;
            case 8:
                j++;
                return [3 /*break*/, 6];
            case 9:
                exam_sections[i].questions.sort(function (a, b) { var _a, _b; return ((_a = a.question_order) !== null && _a !== void 0 ? _a : 0) - ((_b = b.question_order) !== null && _b !== void 0 ? _b : 0); });
                _a.label = 10;
            case 10:
                i++;
                return [3 /*break*/, 4];
            case 11:
                exam_sections.sort(function (a, b) { var _a, _b; return ((_a = a.section_order) !== null && _a !== void 0 ? _a : 0) - ((_b = b.section_order) !== null && _b !== void 0 ? _b : 0); });
                res.json(exam_sections).status(status_codes_1.StatusCodes.OK);
                return [3 /*break*/, 13];
            case 12:
                err_1 = _a.sent();
                console.log(err_1);
                res.status(status_codes_1.StatusCodes.NOT_FOUND).json({
                    status: status_codes_1.StatusCodes.NOT_FOUND,
                    error: 'Error Getting Exam',
                });
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.get_exam_sections_questions = get_exam_sections_questions;
var get_question_image = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var student, question_id, section_id, socket_check, question_image, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                student = res.locals.student;
                question_id = req.body.question_id;
                section_id = req.body.section_id;
                console.log(req.body);
                console.log('get question image' + student);
                console.log('get q_id = ' + question_id);
                console.log('get sec_id = ' + section_id);
                socket_check = socket_manager.checkSocket(student.exam_id.toString(), req.ip);
                if (socket_check === false) {
                    res.status(status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        status: status_codes_1.StatusCodes.UNAUTHORIZED,
                        error: 'Socket not found',
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, question_model.get_question_image(student.exam_id, parseInt(question_id), parseInt(section_id))];
            case 1:
                question_image = _a.sent();
                res
                    .json({
                    image: question_image,
                })
                    .status(status_codes_1.StatusCodes.OK);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.log(err_2);
                res.status(status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    error: 'Error Getting Questsion Image',
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.get_question_image = get_question_image;
var get_chosen_choices = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var student, exam_id, student_id, socket_check, chossen_choices, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                student = res.locals.student;
                exam_id = student.exam_id;
                student_id = student.id;
                console.log('get chosen choices' + student);
                socket_check = socket_manager.checkSocket(student.exam_id.toString(), req.ip);
                if (socket_check === false) {
                    res.status(status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        status: status_codes_1.StatusCodes.UNAUTHORIZED,
                        error: 'Socket not found',
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, student_answers_model.get_student_choosen_answers(exam_id, student_id)];
            case 1:
                chossen_choices = _a.sent();
                res.json(chossen_choices).status(status_codes_1.StatusCodes.OK);
                return [2 /*return*/];
            case 2:
                err_3 = _a.sent();
                console.log(err_3);
                res.status(status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    message: 'Server Error',
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.get_chosen_choices = get_chosen_choices;
