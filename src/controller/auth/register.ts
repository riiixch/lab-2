import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

import JWTUserData from "../../interfaces/JWTUserData";

import { validateInput, ValidationSchema } from "../../plugin/validator";
import { encodeJWT } from "../../plugin/JWT";

import { log } from "console";

export default async function register(req: Request, res: Response) {
    const prisma = new PrismaClient();
    try {
        const schema: ValidationSchema = {
            username: {
                type: 'string',
                minLength: 6,
                displayName: 'ชื่อผู้ใช้งาน',
                required: true,
            },
            email: {
                type: 'email',
                minLength: 6,
                displayName: 'อีเมล',
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

        const { username, email, password } = validate.data;

        const checker = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: email },
                ],
            }
        });

        if (checker) {
            res.status(400).json({ msg: "ชื่อผู้ใช้งาน หรืออีเมลนี้ถูกใช้งานไปแล้ว" });
            return;
        }

        const passwordHash: string = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: passwordHash,
            }
        });

        const jwtEncodeData: JWTUserData = {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
        }

        const token: string | null = await encodeJWT(jwtEncodeData);
        
        res.status(200).json({ msg: "สมัครสมาชิกสำเร็จ", token });
    } catch (error) {
        log("[Express] register Error : ", error);
        res.status(400).json({ msg: "สมัครสมาชิกไม่สำเร็จ" });
    } finally {
        await prisma.$disconnect();
    }
}