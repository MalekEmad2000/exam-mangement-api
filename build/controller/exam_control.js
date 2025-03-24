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
exports.start_exam = exports.end_exam = exports.get_exam_details = void 0;
var status_codes_1 = require("../constants/status_codes");
var exam_model_1 = require("../Models/exam_model");
var sockets_controller_1 = require("./sockets_controller");
var socket_manager = sockets_controller_1.SocketManager.getInstance();
var exam_model = exam_model_1.ExamModel.getInstance();
var get_exam_details = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var exam_id, exam_db_response, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                exam_id = parseInt(req.params.exam_id);
                if (isNaN(exam_id)) {
                    res.status(status_codes_1.StatusCodes.BAD_REQUEST);
                    res.json({
                        error: 'Bad Request',
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, exam_model.get_exam_details(exam_id)];
            case 1:
                exam_db_response = _a.sent();
                if (exam_db_response == null) {
                    res.status(status_codes_1.StatusCodes.NOT_FOUND);
                    res.json({
                        error: 'Exam Not Found',
                    });
                    return [2 /*return*/];
                }
                res.json(exam_db_response).status(status_codes_1.StatusCodes.OK);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.log(err_1);
                res.status(status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: status_codes_1.StatusCodes.NOT_FOUND,
                    message: 'Error At Server',
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.get_exam_details = get_exam_details;
var end_exam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var exam_id, Response, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                exam_id = parseInt(req.body.exam_id);
                return [4 /*yield*/, exam_model.end_exam(exam_id)];
            case 1:
                Response = _a.sent();
                console.log(exam_id);
                socket_manager.tellExamToEnd(exam_id.toString());
                res.json(Response).status(status_codes_1.StatusCodes.OK);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.json({
                    status: status_codes_1.StatusCodes.NOT_FOUND,
                    message: 'Exam Not Found',
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.end_exam = end_exam;
var start_exam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var exam_id, Response, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                exam_id = parseInt(req.body.exam_id);
                return [4 /*yield*/, exam_model.start_exam(exam_id)];
            case 1:
                Response = _a.sent();
                console.log('tell exam to start = ' + exam_id);
                socket_manager.tellExamToStart(exam_id.toString());
                res.json(Response).status(status_codes_1.StatusCodes.OK);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                res.json({
                    status: status_codes_1.StatusCodes.NOT_FOUND,
                    message: 'Exam Not Found',
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.start_exam = start_exam;
