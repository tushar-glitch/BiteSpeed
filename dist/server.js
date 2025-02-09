"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const conn_1 = __importDefault(require("./db/conn"));
const contactRouter_1 = __importDefault(require("./routes/contactRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send("Server Up and running!");
});
app.use('/api/contact', contactRouter_1.default);
conn_1.default.connect((err) => {
    if (err) {
        console.error('Error in connecting to DB:', err);
        return;
    }
    conn_1.default.query("select * from Contact", [], (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(result.rows);
    });
});
app.listen(4000);
