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
exports.ExamModel = void 0;
var database_1 = __importDefault(require("../utils/db-config/database"));
var ExamModel = /** @class */ (function () {
    function ExamModel() {
        this.tableName = 'exams';
        // private constructor
    }
    ExamModel.getInstance = function () {
        if (!ExamModel.instance) {
            ExamModel.instance = new ExamModel();
        }
        return ExamModel.instance;
    };
    ExamModel.prototype.get_exam_details = function (exam_id) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql1, result1, sql2, result2, sql3, result3, exam_db, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql1 = "select id,name,start_date,exam_instructions,start_time,end_time,min_submit_time,max_attempts,professor_id,course_id from ".concat(this.tableName, " where id = $1;");
                        return [4 /*yield*/, conn.query(sql1, [exam_id])];
                    case 2:
                        result1 = _a.sent();
                        if (result1.rows.length === 0) {
                            conn.release();
                            return [2 /*return*/, null];
                        }
                        sql2 = "select name from users where id = ".concat(result1.rows[0]['professor_id']);
                        return [4 /*yield*/, conn.query(sql2)];
                    case 3:
                        result2 = _a.sent();
                        sql3 = "select course_name from courses where course_id = $1;";
                        return [4 /*yield*/, conn.query(sql3, [result1.rows[0]['course_id']])];
                    case 4:
                        result3 = _a.sent();
                        conn.release();
                        exam_db = {
                            course_id: result1.rows[0]['course_id'],
                            course_name: result3.rows[0]['course_name'],
                            exam_id: result1.rows[0]['id'],
                            name: result1.rows[0]['name'],
                            exam_instructions: result1.rows[0]['exam_instructions'],
                            start_date: result1.rows[0]['start_date'],
                            starting_time: result1.rows[0]['start_time'],
                            ending_time: result1.rows[0]['end_time'],
                            min_submit_time: result1.rows[0]['min_submit_time'],
                            max_attempts: result1.rows[0]['max_attempts'],
                            professor_name: result2.rows[0]['name'],
                        };
                        return [2 /*return*/, exam_db];
                    case 5:
                        err_1 = _a.sent();
                        throw new Error("Error: ".concat(err_1));
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ExamModel.prototype.get_exam_status = function (exam_id) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "select status from ".concat(this.tableName, " where id = $1;");
                        return [4 /*yield*/, conn.query(sql, [exam_id])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows[0]['status']];
                    case 3:
                        err_2 = _a.sent();
                        throw new Error("Error: ".concat(err_2));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ExamModel.prototype.end_exam = function (exam_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, true];
                }
                catch (err) {
                    throw new Error("Error: ".concat(err));
                }
                return [2 /*return*/];
            });
        });
    };
    ExamModel.prototype.check_exam_password = function (exam_id, password) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "select * from ".concat(this.tableName, " where id = $1;");
                        return [4 /*yield*/, conn.query(sql, [exam_id])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows[0]['exam_password'] == password];
                    case 3:
                        err_3 = _a.sent();
                        throw new Error("Error: ".concat(err_3));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ExamModel.prototype.start_exam = function (exam_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, true];
                }
                catch (err) {
                    throw new Error("Error: ".concat(err));
                }
                return [2 /*return*/];
            });
        });
    };
    return ExamModel;
}());
exports.ExamModel = ExamModel;
