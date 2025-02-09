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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.identify = void 0;
const conn_1 = __importDefault(require("../db/conn"));
const identify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber } = req.body;
    if (email || phoneNumber) {
        try {
            console.log("result");
            const result = yield conn_1.default.query("SELECT * FROM Contact WHERE email = $1 OR phoneNumber = $2", [email, phoneNumber]).catch((err) => {
                console.error("Query error:", err);
                throw err;
            });
            console.log("result");
            if (result.rows.length > 0) {
                const data = result.rows[0];
                console.log(data);
                if (data.email != email || data.phonenumber != phoneNumber) {
                    const result = yield conn_1.default.query("INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence) VALUES ($1, $2, $3, $4)", [email, phoneNumber, data.id, "secondary"]);
                    const secondaryContact = result.rows[0];
                    const response = {
                        contact: {
                            primaryContactId: data.id,
                            emails: [email],
                            phoneNumbers: [phoneNumber],
                            secondaryContactIds: [secondaryContact.id],
                        },
                    };
                    res.status(200).json(response);
                }
                else {
                    const response = {
                        contact: {
                            primaryContactId: data.id,
                            emails: [email],
                            phoneNumbers: [phoneNumber],
                            secondaryContactIds: [],
                        },
                    };
                    res.status(200).json(response);
                }
            }
            else {
                console.log("asdf");
                const result = yield conn_1.default.query("INSERT INTO Contact (email, phoneNumber, linkPrecedence) VALUES ($1, $2, $3)", [email, phoneNumber, "primary"]);
                const primaryContact = result.rows[0];
                const response = {
                    contact: {
                        primaryContactId: primaryContact.id,
                        emails: [email],
                        phoneNumbers: [phoneNumber],
                        secondaryContactIds: [],
                    },
                };
                res.status(200).json(response);
            }
        }
        catch (error) {
            res.status(500).json({
                message: "Error identifying contact",
                error: error,
            });
        }
    }
    else {
        res.status(400).json({
            message: "Email or phone number is required",
        });
    }
});
exports.identify = identify;
