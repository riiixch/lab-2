import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

import JWTUserData from "../../interfaces/JWTUserData";

import { validateInput, ValidationSchema } from "../../plugin/validator";
import { encodeJWT } from "../../plugin/JWT";

import { log } from "console";

export default async function login(req: Request, res: Response) {
    const prisma = new PrismaClient();
    try {
        const schema: ValidationSchema = {
            username: {
                type: 'string',
                minLength: 6,
                displayName: 'ชื่อผู้ใช้งาน',
                required: true,
            },
            password: {
                type: 'string',
                minLength: 8,
                displayName: 'รหัสผ่าน',
                required: true,
            },
        }

        const validate = validateInput(req.body, schema);
        if (!validate.success) {
            res.status(400).json({ msg: validate.errorMsg });
            return;
        }

        const { username, password } = validate.data;

        const user = await prisma.user.findFirst({
            where: {
                username: username,
            }
        });
        if (!user) {
            res.status(400).json({ msg: "ไม่พบชื่อผู้ใช้งานนี้" });
            return;
        }

        const isCompare = await bcrypt.compare(password, user.password);
        if (!isCompare) {
            res.status(400).json({ msg: "รหัสผ่านไม่ถูกต้อง" });
            return;
        }

        const jwtEncodeData: JWTUserData = {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
        }

        const token: string | null = await encodeJWT(jwtEncodeData);
        
        res.status(200).json({ msg: "เข้าสู่ระบบสำเร็จ", token });
    } catch (error) {
        log("[Express] login Error : ", error);
        res.status(400).json({ msg: "เข้าสู่ระบบไม่สำเร็จ" });
    } finally {
        await prisma.$disconnect();
    }
}