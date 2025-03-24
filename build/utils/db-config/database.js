"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var pg_2 = __importDefault(require("pg"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var POSTGRES_HOST = process.env.POSTGRES_HOST;
var POSTGRES_PORT = process.env.POSTGRES_PORT;
var POSTGRES_DB = process.env.POSTGRES_DB;
var POSTGRES_USER = process.env.POSTGRES_USER;
var POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
var client = new pg_1.Pool({
    host: POSTGRES_HOST,
    port: Number(POSTGRES_PORT),
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    // If local, set ssl to false to avoid errors
    // ssl: true,
});
pg_2.default.types.setTypeParser(1082, function (value) { return value; });
exports.default = client;
