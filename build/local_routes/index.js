"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var exam_control_1 = require("../controller/exam_control");
var local_routes = express_1.default.Router();
local_routes.post('/end_exam', exam_control_1.end_exam);
local_routes.post('/start_exam', exam_control_1.start_exam);
exports.default = local_routes;
