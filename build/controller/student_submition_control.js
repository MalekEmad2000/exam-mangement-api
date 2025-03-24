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
exports.submit_answers = void 0;
var status_codes_1 = require("../constants/status_codes");
var student_answers_model_1 = require("../Models/student_answers_model");
var students_model_1 = require("../Models/students_model");
var sockets_controller_1 = require("./sockets_controller");
var exam_logs_1 = require("../Models/exam_logs");
var student_answers = student_answers_model_1.StudentAnswersModel.getInstance();
var student_model = students_model_1.StudentModel.getInstance();
var exam_log_model = exam_logs_1.ExamLogModel.getInstance();
var socket_manager = sockets_controller_1.SocketManager.getInstance();
function submit_answers(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var std, socket_check, student, student_id, exam_id, answers, is_active, examLog, i, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    std = res.locals.student;
                    socket_check = socket_manager.checkSocket(std.exam_id.toString(), req.ip);
                    if (socket_check === false) {
                        res.status(status_codes_1.StatusCodes.UNAUTHORIZED).json({
                            error: 'Socket not found',
                        });
                        return [2 /*return*/];
                    }
                    if (std === null) {
                        res.status(status_codes_1.StatusCodes.UNAUTHORIZED).json({
                            error: 'Unauthorized',
                        });
                        return [2 /*return*/];
                    }
                    student = std;
                    student_id = student.id;
                    exam_id = student.exam_id;
                    answers = req.body.answers;
                    return [4 /*yield*/, student_model.is_student_active(student)];
                case 1:
                    is_active = _a.sent();
                    if (!is_active) {
                        res.status(status_codes_1.StatusCodes.UNAUTHORIZED).json({
                            status: status_codes_1.StatusCodes.BAD_REQUEST,
                            error: 'Student Not Allowed to Submit',
                        });
                        return [2 /*return*/];
                    }
                    examLog = {
                        student_id: student_id,
                        exam_id: exam_id,
                        user_agent: req.headers['user-agent'],
                        ip_address: req.ip,
                    };
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < answers.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, exam_log_model.create_choice_log(examLog, answers[i].question_id, answers[i].choice_id, answers[i].section_id)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, student_answers.set_answers(exam_id, student_id, answers)];
                case 6:
                    result = _a.sent();
                    if (result) {
                        res.status(status_codes_1.StatusCodes.OK).json({
                            status: status_codes_1.StatusCodes.OK,
                            message: 'Answers Submitted Successfully',
                        });
                    }
                    else {
                        res.status(status_codes_1.StatusCodes.BAD_REQUEST).json({
                            status: status_codes_1.StatusCodes.BAD_REQUEST,
                            message: 'Bad Request',
                        });
                    }
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    res.status(status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: 'Error at Server',
                    });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.submit_answers = submit_answers;
