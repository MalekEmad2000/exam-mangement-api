"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var student_routs_1 = __importDefault(require("./student/student_routs"));
var exam_data_1 = __importDefault(require("./exam/exam_data"));
var public_routes = express_1.default.Router();
public_routes.use('/exam/', exam_data_1.default);
public_routes.use('/student/', student_routs_1.default);
exports.default = public_routes;
