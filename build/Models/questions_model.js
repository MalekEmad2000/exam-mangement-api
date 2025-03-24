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
exports.Question_Model = void 0;
var database_1 = __importDefault(require("../utils/db-config/database"));
var Question_Model = /** @class */ (function () {
    function Question_Model() {
        this.questions_table = 'section_questions';
        this.question_choices_table = 'section_question_choices';
        // private constructor
    }
    Question_Model.getInstance = function () {
        if (!Question_Model.instance) {
            Question_Model.instance = new Question_Model();
        }
        return Question_Model.instance;
    };
    Question_Model.prototype.get_question_image = function (exam_id, question_id, section_id) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, image, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "select encode(section_questions.diagram::bytea, 'base64') as diagram from ".concat(this.questions_table, " where question_id = ").concat(question_id, " and section_id = ").concat(section_id, " and exam_id = ").concat(exam_id);
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        if (result.rows.length === 0) {
                            return [2 /*return*/, null];
                        }
                        image = result.rows[0].diagram;
                        return [2 /*return*/, image];
                    case 3:
                        err_1 = _a.sent();
                        throw new Error("Error: ".concat(err_1));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Question_Model.prototype.get_question = function (question_id, section_id, weight) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, question, err_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _b.sent();
                        sql = "select question_id,question_text,diagram from ".concat(this.questions_table, " where question_id = ").concat(question_id, " and section_id = ").concat(section_id, ";");
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        result = _b.sent();
                        conn.release();
                        _a = {
                            question_id: result.rows[0]['question_id'],
                            has_diagram: result.rows[0]['diagram'] == null ? false : true,
                            question_text: result.rows[0]['question_text']
                        };
                        return [4 /*yield*/, this.get_question_choices(question_id, section_id)];
                    case 3:
                        question = (_a.question_choices = _b.sent(),
                            _a.question_order = null,
                            _a.weight = weight,
                            _a.section_id = section_id,
                            _a.student_choice = null,
                            _a);
                        return [2 /*return*/, question];
                    case 4:
                        err_2 = _b.sent();
                        console.log('ERROR AT QUESTION', err_2);
                        throw new Error("Error: ".concat(err_2));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Question_Model.prototype.get_question_choices = function (question_id, section_id) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, question_choices, i, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "select question_id,choice_text,choice_id from ".concat(this.question_choices_table, " where question_id = ").concat(question_id, " and section_id = ").concat(section_id, ";");
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        question_choices = Array(result.rows.length);
                        for (i = 0; i < result.rows.length; i++) {
                            question_choices[i] = {
                                question_id: result.rows[i]['question_id'],
                                choice_text: result.rows[i]['choice_text'],
                                choice_id: result.rows[i]['choice_id'],
                            };
                        }
                        return [2 /*return*/, question_choices];
                    case 3:
                        err_3 = _a.sent();
                        throw new Error("Error: ".concat(err_3));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Question_Model;
}());
exports.Question_Model = Question_Model;
