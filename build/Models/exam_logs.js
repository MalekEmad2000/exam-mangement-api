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
exports.ExamLogModel = void 0;
var database_1 = __importDefault(require("../utils/db-config/database"));
var students_model_1 = require("./students_model");
var ExamLogModel = /** @class */ (function () {
    function ExamLogModel() {
        this.tableName = 'exam_logs';
        this.student_model = students_model_1.StudentModel.getInstance();
        // private constructor
    }
    ExamLogModel.getInstance = function () {
        if (!ExamLogModel.instance) {
            ExamLogModel.instance = new ExamLogModel();
        }
        return ExamLogModel.instance;
    };
    ExamLogModel.prototype.create_start_log = function (exam_log, byPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "INSERT INTO exam_logs (time_stamp,exam_id, student_id, ip_addr, user_agent,action) VALUES (current_timestamp, $1 , $2, $3, $4, $5);";
                        return [4 /*yield*/, conn.query(sql, [
                                exam_log.exam_id,
                                exam_log.student_id,
                                exam_log.ip_address,
                                exam_log.user_agent,
                                'LOGIN' + (byPassword ? '_WITH_PASSWORD' : ''),
                            ])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        if (result.rowCount == 1) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                    case 3:
                        err_1 = _a.sent();
                        console.log(err_1);
                        throw new Error("Error: ".concat(err_1));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ExamLogModel.prototype.create_submit_log = function (exam_log) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "INSERT INTO exam_logs (time_stamp,exam_id, student_id, ip_addr, user_agent,action) VALUES (current_timestamp, $1 , $2, $3, $4, $5 );";
                        return [4 /*yield*/, conn.query(sql, [
                                exam_log.exam_id,
                                exam_log.student_id,
                                exam_log.ip_address,
                                exam_log.user_agent,
                                'SUBMIT_EXAM',
                            ])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        if (result.rowCount == 1) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                    case 3:
                        err_2 = _a.sent();
                        throw new Error("Error: ".concat(err_2));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ExamLogModel.prototype.create_disconnect_log = function (exam_log) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "INSERT INTO exam_logs (time_stamp,exam_id, student_id, ip_addr, user_agent,action) VALUES (current_timestamp, $1 , $2, $3, $4, $5 );";
                        conn.query(sql, [
                            exam_log.exam_id,
                            exam_log.student_id,
                            exam_log.ip_address,
                            exam_log.user_agent,
                            'DISCONNECT',
                        ]);
                        conn.release();
                        return [2 /*return*/, true];
                    case 2:
                        err_3 = _a.sent();
                        throw new Error("Error: ".concat(err_3));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ExamLogModel.prototype.create_choice_log = function (exam_log, question_id, choice_id, section_id) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log('creating choice logs');
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "INSERT INTO exam_logs (time_stamp, action, exam_id, student_id, ip_addr,  question_id, student_choice, user_agent, section_id) VALUES (current_timestamp, 'ANSWER_QUESTION', $1 , $2, $3, $4, $5, $6, $7 );";
                        return [4 /*yield*/, conn.query(sql, [
                                exam_log.exam_id,
                                exam_log.student_id,
                                exam_log.ip_address,
                                question_id,
                                choice_id,
                                exam_log.user_agent,
                                section_id,
                            ])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        if (result.rowCount == 1) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                    case 3:
                        err_4 = _a.sent();
                        console.log(err_4);
                        throw new Error("Error: ".concat(err_4));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ExamLogModel;
}());
exports.ExamLogModel = ExamLogModel;
