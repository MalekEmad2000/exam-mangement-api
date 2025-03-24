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
exports.student_password_login = exports.student_logout = exports.student_login = void 0;
var status_codes_1 = require("../constants/status_codes");
var error_messages_1 = require("../constants/error_messages");
var exam_model_1 = require("../Models/exam_model");
var exam_logs_1 = require("../Models/exam_logs");
var student_answers_model_1 = require("../Models/student_answers_model");
var students_model_1 = require("../Models/students_model");
var sockets_controller_1 = require("./sockets_controller");
var jwt_1 = require("../utils/jwt");
var student_model = students_model_1.StudentModel.getInstance();
var exam_model = exam_model_1.ExamModel.getInstance();
var exam_log_model = exam_logs_1.ExamLogModel.getInstance();
var student_answers_model = student_answers_model_1.StudentAnswersModel.getInstance();
var socket_manager = sockets_controller_1.SocketManager.getInstance();
var student_login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var student_recived, student_db_response, is_submitted, exam_state, attempts, token, attempts, token, exam_log, e_log, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                student_recived = {
                    id: req.body.id,
                    name: req.body.name,
                    national_id: req.body.national_id,
                    email: req.body.email,
                    exam_id: req.body.exam_id,
                };
                return [4 /*yield*/, student_model.check_and_update_student(student_recived)];
            case 1:
                student_db_response = _a.sent();
                if (student_db_response === null) {
                    console.log('student not found');
                    res.status(status_codes_1.StatusCodes.NOT_FOUND);
                    res.json({
                        error: error_messages_1.ResponseMessages.STUDENT_NOT_FOUND,
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, student_model.is_student_submitted(student_db_response)];
            case 2:
                is_submitted = _a.sent();
                if (is_submitted === true) {
                    res.status(status_codes_1.StatusCodes.UNAUTHORIZED);
                    res.json({
                        status: status_codes_1.StatusCodes.UNAUTHORIZED,
                        error: error_messages_1.ResponseMessages.STUDENT_ALREADY_SUBMITTED,
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, exam_model.get_exam_status(student_db_response.exam_id)];
            case 3:
                exam_state = _a.sent();
                if (!(exam_state === 'COMPLETED')) return [3 /*break*/, 4];
                res.status(status_codes_1.StatusCodes.NOT_FOUND).json({
                    status: status_codes_1.StatusCodes.NOT_FOUND,
                    error: 'Exam Already Completed',
                });
                return [2 /*return*/];
            case 4:
                if (!(exam_state === 'NOT_STARTED')) return [3 /*break*/, 7];
                return [4 /*yield*/, student_answers_model.create_student_exam_default_answers(student_db_response.exam_id, student_db_response.id)];
            case 5:
                _a.sent();
                return [4 /*yield*/, student_model.decrease_student_attempts(student_db_response)];
            case 6:
                attempts = _a.sent();
                if (attempts == false) {
                    res.status(status_codes_1.StatusCodes.NOT_ACCEPTABLE).json({
                        status: status_codes_1.StatusCodes.NOT_ACCEPTABLE,
                        error: error_messages_1.ResponseMessages.UNAUTHORIZED +
                            ' ' +
                            'Connect With Password To Proceed',
                    });
                    return [2 /*return*/];
                }
                token = jwt_1.JWTHelper.sign({
                    student_id: student_db_response.id,
                    exam_id: student_db_response.exam_id,
                });
                student_model.make_student_active(student_db_response);
                res.status(status_codes_1.StatusCodes.OK).json({
                    status: status_codes_1.StatusCodes.OK,
                    message: 'Exam Not Started Connect Socket and Wait',
                    token: token,
                });
                return [3 /*break*/, 10];
            case 7:
                if (!(exam_state === 'ONGOING')) return [3 /*break*/, 10];
                return [4 /*yield*/, student_answers_model.create_student_exam_default_answers(student_db_response.exam_id, student_db_response.id)];
            case 8:
                _a.sent();
                return [4 /*yield*/, student_model.decrease_student_attempts(student_db_response)];
            case 9:
                attempts = _a.sent();
                if (attempts == false) {
                    res.status(status_codes_1.StatusCodes.NOT_ACCEPTABLE).json({
                        status: status_codes_1.StatusCodes.NOT_ACCEPTABLE,
                        error: error_messages_1.ResponseMessages.UNAUTHORIZED +
                            ' ' +
                            'Connect With Password To Proceed',
                    });
                    return [2 /*return*/];
                }
                token = jwt_1.JWTHelper.sign({
                    student_id: student_db_response.id,
                    exam_id: student_db_response.exam_id,
                });
                student_model.make_student_active(student_db_response);
                res.status(status_codes_1.StatusCodes.OK).send({
                    message: 'Connect Socket to Proceed',
                    token: token,
                });
                socket_manager.addToPending(student_db_response.exam_id.toString(), req.ip);
                _a.label = 10;
            case 10:
                exam_log = {
                    student_id: student_db_response.id,
                    exam_id: student_db_response.exam_id,
                    user_agent: req.headers['user-agent'],
                    ip_address: req.ip,
                };
                return [4 /*yield*/, exam_log_model.create_start_log(exam_log, false)];
            case 11:
                e_log = _a.sent();
                //  ==================================================
                if (e_log === true) {
                    console.log('exam log created');
                }
                else {
                    console.log('exam log not created');
                }
                return [2 /*return*/];
            case 12:
                err_1 = _a.sent();
                console.log(err_1);
                res.status(status_codes_1.StatusCodes.SERVICE_UNAVAILABLE).json({
                    error: 'error at server',
                });
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.student_login = student_login;
var student_logout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var student, submit, socket_check, exam_log, err_2, errorMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                student = res.locals.student;
                return [4 /*yield*/, student_model.is_student_submitted(student)];
            case 1:
                submit = _a.sent();
                if (submit === true) {
                    res.status(status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        status: status_codes_1.StatusCodes.UNAUTHORIZED,
                        error: error_messages_1.ResponseMessages.STUDENT_ALREADY_SUBMITTED,
                    });
                    return [2 /*return*/];
                }
                socket_check = socket_manager.checkSocket(student.exam_id.toString(), req.ip);
                if (socket_check === false) {
                    res.status(status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        status: status_codes_1.StatusCodes.UNAUTHORIZED,
                        error: 'Socket not found',
                    });
                    return [2 /*return*/];
                }
                exam_log = {
                    student_id: student.id,
                    exam_id: student.exam_id,
                    user_agent: req.headers['user-agent'],
                    ip_address: req.ip,
                };
                exam_log_model.create_submit_log(exam_log);
                student_model.update_student_is_submitted(student);
                res.status(status_codes_1.StatusCodes.OK).json({
                    status: status_codes_1.StatusCodes.OK,
                    message: error_messages_1.ResponseMessages.LOGOUT_SUCCESS,
                });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                errorMessage = err_2 === null || err_2 === void 0 ? void 0 : err_2.message;
                res.status(status_codes_1.StatusCodes.SERVICE_UNAVAILABLE).json({
                    status: status_codes_1.StatusCodes.SERVICE_UNAVAILABLE,
                    error: errorMessage,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.student_logout = student_logout;
var student_password_login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var student_recived, check_exam_password, student_db_response, is_submitted, exam_state, exam_log, e_log, token, err_3, errorMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                student_recived = {
                    id: req.body.id,
                    name: req.body.name,
                    exam_password: req.body.exam_password,
                    exam_id: req.body.exam_id,
                };
                return [4 /*yield*/, exam_model.check_exam_password(student_recived.exam_id, student_recived.exam_password)];
            case 1:
                check_exam_password = _a.sent();
                if (check_exam_password === false) {
                    res.status(status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        status: status_codes_1.StatusCodes.UNAUTHORIZED,
                        error: 'Wrong Password',
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, student_model.get_student(student_recived.id, student_recived.exam_id)];
            case 2:
                student_db_response = _a.sent();
                if (student_db_response === null) {
                    res.status(status_codes_1.StatusCodes.NOT_FOUND).json({
                        status: status_codes_1.StatusCodes.NOT_FOUND,
                        error: error_messages_1.ResponseMessages.STUDENT_NOT_FOUND,
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, student_model.is_student_submitted(student_db_response)];
            case 3:
                is_submitted = _a.sent();
                if (is_submitted === true) {
                    res.status(status_codes_1.StatusCodes.UNAUTHORIZED).json({
                        status: status_codes_1.StatusCodes.UNAUTHORIZED,
                        error: error_messages_1.ResponseMessages.STUDENT_ALREADY_SUBMITTED,
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, exam_model.get_exam_status(student_db_response.exam_id)];
            case 4:
                exam_state = _a.sent();
                if (exam_state === 'COMPLETED') {
                    res.status(status_codes_1.StatusCodes.NOT_FOUND).json({
                        status: status_codes_1.StatusCodes.NOT_FOUND,
                        error: 'Exam Already Completed',
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, student_model.decrease_student_attempts(student_db_response)];
            case 5:
                _a.sent();
                exam_log = {
                    student_id: student_db_response.id,
                    exam_id: student_db_response.exam_id,
                    user_agent: req.headers['user-agent'],
                    ip_address: req.ip,
                };
                //=========================================
                //TODO check student in exam log
                //=========================================
                return [4 /*yield*/, student_answers_model.create_student_exam_default_answers(student_db_response.exam_id, student_db_response.id)];
            case 6:
                //=========================================
                //TODO check student in exam log
                //=========================================
                _a.sent();
                return [4 /*yield*/, exam_log_model.create_start_log(exam_log, true)];
            case 7:
                e_log = _a.sent();
                if (e_log === true) {
                    console.log('exam log created');
                }
                else {
                    console.log('exam log not created');
                }
                token = jwt_1.JWTHelper.sign({
                    student_id: student_db_response.id,
                    exam_id: student_db_response.exam_id,
                });
                student_model.make_student_active(student_db_response);
                res.status(status_codes_1.StatusCodes.OK).send({
                    message: 'Connect Socket to Proceed',
                    token: token,
                });
                socket_manager.addToPending(student_db_response.exam_id.toString(), req.ip);
                return [2 /*return*/];
            case 8:
                err_3 = _a.sent();
                errorMessage = err_3 === null || err_3 === void 0 ? void 0 : err_3.message;
                console.log(err_3);
                res.status(status_codes_1.StatusCodes.SERVICE_UNAVAILABLE).json({
                    status: status_codes_1.StatusCodes.SERVICE_UNAVAILABLE,
                    error: errorMessage,
                });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.student_password_login = student_password_login;
