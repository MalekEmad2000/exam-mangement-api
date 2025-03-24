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
exports.StudentModel = exports.validate_student_vairables = void 0;
var database_1 = __importDefault(require("../utils/db-config/database"));
function validate_student_vairables(student) {
    if (!student.email) {
        return false;
    }
    if (!student.id) {
        return false;
    }
    if (!student.name) {
        return false;
    }
    if (!student.national_id) {
        return false;
    }
    if (!student.exam_id) {
        return false;
    }
    return true;
}
exports.validate_student_vairables = validate_student_vairables;
var StudentModel = /** @class */ (function () {
    function StudentModel() {
        this.tableName = 'students';
        // private constructor
    }
    StudentModel.getInstance = function () {
        if (!StudentModel.instance) {
            StudentModel.instance = new StudentModel();
        }
        return StudentModel.instance;
    };
    StudentModel.prototype.check_and_update_student = function (student) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, std, sql1, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "select * from ".concat(this.tableName, " where id = '").concat(student.id, "' and exam_id = ").concat(student.exam_id, ";");
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        result = _a.sent();
                        std = null;
                        if (result.rows[0] === undefined) {
                            conn.release();
                            return [2 /*return*/, std];
                        }
                        sql1 = "update ".concat(this.tableName, " set name = '").concat(student.name, "', national_id = '").concat(student.national_id, "', email = '").concat(student.email, "'  where  id = '").concat(student.id, "' and exam_id = ").concat(student.exam_id, ";");
                        return [4 /*yield*/, conn.query(sql1)];
                    case 3:
                        _a.sent();
                        conn.release();
                        std = {
                            id: result.rows[0].id,
                            name: result.rows[0].name,
                            national_id: result.rows[0].national_id,
                            email: result.rows[0].email,
                            exam_id: result.rows[0].exam_id,
                        };
                        return [2 /*return*/, std];
                    case 4:
                        err_1 = _a.sent();
                        throw new Error("Error: ".concat(err_1));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    StudentModel.prototype.make_student_active = function (student) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "update ".concat(this.tableName, " set status = 'ACTIVE' where id = '").concat(student.id, "' and exam_id = ").concat(student.exam_id, ";");
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        _a.sent();
                        conn.release();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        throw new Error("Error: ".concat(err_2));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StudentModel.prototype.student_in_db = function (student) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "select * from ".concat(this.tableName, " where id=(").concat(student.id, " and name='").concat(student.name, "' and national_id='").concat(student.national_id, "' and email='").concat(student.email, "');");
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        if (result.rowCount == 0) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                    case 3:
                        err_3 = _a.sent();
                        throw new Error("Error: ".concat(err_3));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StudentModel.prototype.is_student_submitted = function (student) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "select status from ".concat(this.tableName, " where id = '").concat(student.id, "' and exam_id = ").concat(student.exam_id, ";");
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, (result.rows[0].status == 'SUBMITTED_BY_HIMSELF' ||
                                result.rows[0].status == 'SUBMITTED_BY_PROFESSOR')];
                    case 3:
                        err_4 = _a.sent();
                        throw new Error("Error: ".concat(err_4));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StudentModel.prototype.is_student_active = function (student) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "select status from ".concat(this.tableName, " where id = '").concat(student.id, "' and exam_id = ").concat(student.exam_id, ";");
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows[0].status == 'ACTIVE'];
                    case 3:
                        err_5 = _a.sent();
                        throw new Error("Error: ".concat(err_5));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StudentModel.prototype.update_student_is_submitted = function (student) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql1, result1, sql, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql1 = "select status from ".concat(this.tableName, " where id = '").concat(student.id, "' and exam_id = ").concat(student.exam_id, ";");
                        return [4 /*yield*/, conn.query(sql1)];
                    case 2:
                        result1 = _a.sent();
                        if (!(result1.rows[0].status != 'SUBMITTED_BY_PROFESSOR')) return [3 /*break*/, 4];
                        sql = "update ".concat(this.tableName, " set status = 'SUBMITTED_BY_HIMSELF' where id = '").concat(student.id, "' and exam_id = ").concat(student.exam_id, ";");
                        return [4 /*yield*/, conn.query(sql)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        conn.release();
                        return [3 /*break*/, 6];
                    case 5:
                        err_6 = _a.sent();
                        throw new Error("Error: ".concat(err_6));
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    StudentModel.prototype.make_student_disconnected = function (student_id, exam_id) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "update ".concat(this.tableName, " set status = 'DISCONNECTED' where id = '").concat(student_id, "' and exam_id = ").concat(exam_id, ";");
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        _a.sent();
                        conn.release();
                        return [3 /*break*/, 4];
                    case 3:
                        err_7 = _a.sent();
                        throw new Error("Error: ".concat(err_7));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StudentModel.prototype.decrease_student_attempts = function (student) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, sql1, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "select remaining_attempts from ".concat(this.tableName, " where id = '").concat(student.id, "' and exam_id = ").concat(student.exam_id, ";");
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        result = _a.sent();
                        if (result.rows[0].remaining_attempts == 0) {
                            conn.release();
                            return [2 /*return*/, false];
                        }
                        sql1 = "update ".concat(this.tableName, " set remaining_attempts = remaining_attempts - 1 where id = '").concat(student.id, "' and exam_id = ").concat(student.exam_id, ";");
                        conn.query(sql1);
                        conn.release();
                        return [2 /*return*/, true];
                    case 3:
                        err_8 = _a.sent();
                        throw new Error("Error: ".concat(err_8));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StudentModel.prototype.get_student = function (id, exam_id) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, std, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "select * from ".concat(this.tableName, " where id = '").concat(id, "' and exam_id = ").concat(exam_id, ";");
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        if (result.rows[0] === undefined) {
                            return [2 /*return*/, null];
                        }
                        std = null;
                        std = {
                            id: result.rows[0].id,
                            name: result.rows[0].name,
                            national_id: result.rows[0].national_id,
                            email: result.rows[0].email,
                            exam_id: result.rows[0].exam_id,
                        };
                        return [2 /*return*/, std];
                    case 3:
                        err_9 = _a.sent();
                        throw new Error("Error: ".concat(err_9));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return StudentModel;
}());
exports.StudentModel = StudentModel;
