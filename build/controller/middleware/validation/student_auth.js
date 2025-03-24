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
exports.validate_student = exports.authenticate_student = void 0;
var status_codes_1 = require("../../../constants/status_codes");
var jwt_1 = require("../../../utils/jwt");
var students_model_1 = require("../../../Models/students_model");
var error_messages_1 = require("../../../constants/error_messages");
var student_model = students_model_1.StudentModel.getInstance();
function authenticate_student(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var token, jwtObj, student, err_1, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                    if (!token) {
                        res.json({
                            status: status_codes_1.StatusCodes.UNAUTHORIZED,
                            message: 'No Token Provided',
                        });
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    jwtObj = jwt_1.JWTHelper.verify(token);
                    return [4 /*yield*/, student_model.get_student(jwtObj.student_id, jwtObj.exam_id)];
                case 2:
                    student = _b.sent();
                    if (student === null) {
                        res.json({
                            status: status_codes_1.StatusCodes.UNAUTHORIZED,
                            message: 'Invalid Token',
                        });
                        return [2 /*return*/];
                    }
                    res.locals.student = student;
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _b.sent();
                    res.json({
                        status: status_codes_1.StatusCodes.UNAUTHORIZED,
                        message: 'Invalid Token',
                    });
                    return [2 /*return*/];
                case 4:
                    next();
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _b.sent();
                    res.json({
                        status: status_codes_1.StatusCodes.NOT_FOUND,
                        message: 'Failed to Authenticate Student',
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.authenticate_student = authenticate_student;
function validate_student(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var student;
        return __generator(this, function (_a) {
            try {
                student = {
                    id: req.body.id,
                    name: req.body.name,
                    national_id: req.body.national_id,
                    email: req.body.email,
                    exam_id: req.body.exam_id,
                };
                if (!(0, students_model_1.validate_student_vairables)(student)) {
                    res.status(status_codes_1.StatusCodes.BAD_REQUEST).json({
                        message: error_messages_1.ResponseMessages.BAD_REQUEST,
                    });
                    return [2 /*return*/];
                }
                next();
            }
            catch (err) {
                res.status(status_codes_1.StatusCodes.NOT_FOUND).json({
                    message: 'Invalid Student',
                });
            }
            return [2 /*return*/];
        });
    });
}
exports.validate_student = validate_student;
