import { config } from "dotenv";
config();

import jwt from "jsonwebtoken";
import randomID from "./randomID";

import { log } from "console";

const jwt_secret: string = process.env.JWT_SECRET || randomID(128);

export async function encodeJWT(token: object) {
    try {
        if (!token) return null;

        const encode = jwt.sign(token, jwt_secret, { expiresIn: new Date().setFullYear(new Date().getFullYear() + 1) });

        return encode;
    } catch (error) {
        log("[JWT] encodeJWT Error : ", error);
        return null;
    }
}

export async function decodeJWT(token: string) {
    try {
        if (!token) return null;

        const decode = jwt.verify(String(token), jwt_secret);

        return { ...Object(decode) };
    } catch (error) {
        log("[JWT] decodeJWT Error : ", error);
        return null;
    }
}