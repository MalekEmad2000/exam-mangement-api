"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var exam_control_1 = require("../../controller/exam_control");
var routes = express_1.default.Router();
routes.get('/:exam_id', exam_control_1.get_exam_details);
exports.default = routes;
