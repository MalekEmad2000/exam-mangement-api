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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentAnswersModel = void 0;
var database_1 = __importDefault(require("../utils/db-config/database"));
var exam_sections_model_1 = require("./exam_sections_model");
var exam_section_model = exam_sections_model_1.ExamSectionModel.getInstance();
var StudentAnswersModel = /** @class */ (function () {
    function StudentAnswersModel() {
        this.tableName = 'student_answers';
        // private constructor
    }
    StudentAnswersModel.getInstance = function () {
        if (!StudentAnswersModel.instance) {
            StudentAnswersModel.instance = new StudentAnswersModel();
        }
        return StudentAnswersModel.instance;
    };
    StudentAnswersModel.prototype.create_student_exam_default_answers = function (exam_id, student_id) {
        return __awaiter(this, void 0, void 0, function () {
            var examSections, conn, sql1, result, sql, i, random_shuffle, questions_ids, j, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, exam_section_model.get_sections_details(exam_id)];
                    case 1:
                        examSections = _a.sent();
                        return [4 /*yield*/, database_1.default.connect()];
                    case 2:
                        conn = _a.sent();
                        sql1 = "select * from ".concat(this.tableName, " where student_id = $1 and exam_id = $2;");
                        return [4 /*yield*/, conn.query(sql1, [student_id, exam_id])];
                    case 3:
                        result = _a.sent();
                        if (result.rows.length > 0) {
                            conn.release();
                            return [2 /*return*/, false];
                        }
                        sql = "insert into ".concat(this.tableName, " (student_id, question_id, exam_id, question_order, section_id, section_order) values ($1, $2, $3, $4, $5, $6);");
                        examSections = examSections.sort(function () { return Math.random() - 0.5; });
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < examSections.length)) return [3 /*break*/, 9];
                        random_shuffle = examSections[i].random_shuffle;
                        questions_ids = examSections[i].questions_ids;
                        if (random_shuffle) {
                            questions_ids = questions_ids.sort(function () { return Math.random() - 0.5; });
                        }
                        j = 0;
                        _a.label = 5;
                    case 5:
                        if (!(j < questions_ids.length)) return [3 /*break*/, 8];
                        // let qid = questions_ids[j];
                        return [4 /*yield*/, conn.query(sql, [
                                student_id,
                                questions_ids[j],
                                exam_id,
                                j,
                                examSections[i].section_id,
                                i,
                            ])];
                    case 6:
                        // let qid = questions_ids[j];
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        j++;
                        return [3 /*break*/, 5];
                    case 8:
                        i++;
                        return [3 /*break*/, 4];
                    case 9:
                        conn.release();
                        return [2 /*return*/, true];
                    case 10:
                        err_1 = _a.sent();
                        throw new Error("Error: ".concat(err_1));
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    StudentAnswersModel.prototype.get_student_choosen_answers = function (exam_id, student_id) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, conn, result, student_answers, i, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        sql = "SELECT *  FROM ".concat(this.tableName, " WHERE student_id = $1 and exam_id = $2;");
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(sql, [student_id, exam_id])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        student_answers = [];
                        for (i = 0; i < result.rows.length; i++) {
                            student_answers.push({
                                question_id: result.rows[i]['question_id'],
                                choice_id: result.rows[i]['student_choice'],
                                section_id: result.rows[i]['section_id'],
                            });
                        }
                        return [2 /*return*/, student_answers];
                    case 3:
                        err_2 = _a.sent();
                        throw new Error("Error: ".concat(err_2));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StudentAnswersModel.prototype.get_student_section_order = function (exam_id, student_id, section_id) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, conn, sections_result, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        sql = "SELECT max(section_order) as section_order FROM student_answers WHERE student_id = $1 and exam_id = $2 and section_id = $3 GROUP BY section_id;";
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(sql, [
                                student_id,
                                exam_id,
                                section_id,
                            ])];
                    case 2:
                        sections_result = _a.sent();
                        conn.release();
                        return [2 /*return*/, sections_result.rows[0]['section_order']];
                    case 3:
                        err_3 = _a.sent();
                        throw new Error("Error: ".concat(err_3));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StudentAnswersModel.prototype.get_student_question_choice_order = function (exam_id, student_id, section_id, question_id) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, conn, sections_result, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        sql = "SELECT question_order, student_choice FROM student_answers WHERE student_id = $1 and exam_id = $2 and section_id = $3 and question_id = $4;";
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(sql, [
                                student_id,
                                exam_id,
                                section_id,
                                question_id,
                            ])];
                    case 2:
                        sections_result = _a.sent();
                        conn.release();
                        return [2 /*return*/, {
                                student_choice: sections_result.rows[0]['student_choice'],
                                question_order: sections_result.rows[0]['question_order'],
                            }];
                    case 3:
                        err_4 = _a.sent();
                        throw new Error("Error: ".concat(err_4));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StudentAnswersModel.prototype.set_answers = function (exam_id, student_id, answers) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, conn, i, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        if (answers.length == 0) {
                            return [2 /*return*/, true];
                        }
                        sql = "UPDATE ".concat(this.tableName, " SET student_choice = $1 WHERE student_id = $2 and exam_id = $3 and question_id = $4 and section_id = $5 ;");
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < answers.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.query(sql, [
                                answers[i].choice_id,
                                student_id,
                                exam_id,
                                answers[i].question_id,
                                answers[i].section_id,
                            ])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        conn.release();
                        return [2 /*return*/, true];
                    case 6:
                        err_5 = _a.sent();
                        throw new Error("Error: ".concat(err_5));
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return StudentAnswersModel;
}());
exports.StudentAnswersModel = StudentAnswersModel;
