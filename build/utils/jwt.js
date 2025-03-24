"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTHelper = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var JWTHelper = /** @class */ (function () {
    function JWTHelper() {
    }
    JWTHelper.sign = function (obj) {
        return jsonwebtoken_1.default.sign(obj, this.getJWTSecret());
    };
    JWTHelper.verify = function (token) {
        return jsonwebtoken_1.default.verify(token, this.getJWTSecret());
    };
    JWTHelper.getStudentID = function (token) {
        return this.verify(token).student_id;
    };
    JWTHelper.getExamID = function (token) {
        return this.verify(token).exam_id;
    };
    JWTHelper.getJWTSecret = function () {
        return 'secret';
    };
    return JWTHelper;
}());
exports.JWTHelper = JWTHelper;
