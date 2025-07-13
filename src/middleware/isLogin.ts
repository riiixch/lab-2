import { NextFunction, Request, Response } from "express";

import { decodeJWT } from "../plugin/JWT";

import { log } from "console";

export default async function isLogin(req: Request, res: Response, next: NextFunction) {
    try {
        const token: string | undefined = req.headers.authorization;
        if (!token) {
            res.status(400).json({ isLogin: false, msg: 'กรุณาเข้าสู่ระบบ' });
            return;
        }

        const decodeData = await decodeJWT(token);
        if (!decodeData) {
            res.status(400).json({ isLogin: false, msg: 'กรุณาเข้าสู่ระบบ' });
            return;
        }

        const { user_id, username, email } = decodeData;
        if (!user_id || !username || !email) {
            res.status(400).json({ isLogin: false, msg: 'กรุณาเข้าสู่ระบบ' });
            return;
        }

        next();
    } catch (error) {
        log("[Express] isLogin Error : ", error);
        res.status(400).json({ isLogin: false, msg: 'กรุณาเข้าสู่ระบบ' });
        return;
    }
}