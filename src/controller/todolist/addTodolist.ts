import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import { validateInput, ValidationSchema } from "../../plugin/validator";

import getUserJWT from "../../function/getUserJWT";

import { log } from "console";

export default async function addTodolist(req: Request, res: Response) {
    const prisma = new PrismaClient();
    try {
        const userJWT = await getUserJWT(req);
        if (!userJWT) {
            res.status(400).json({ msg: 'กรุณาเข้าสู่ระบบ' });
            return;
        }

        const schema: ValidationSchema = {
            to_title: {
                type: 'string',
                minLength: 1,
                displayName: 'ชื่อรายการ',
                required: true,
            }
        }

        const validate = validateInput(req.body, schema);
        if (!validate.success) {
            res.status(400).json({ msg: validate.errorMsg });
            return;
        }

        const { to_title } = validate.data;

        await prisma.todolist.create({
            data: {
                to_title: to_title,
                user_id: userJWT.user_id,
            }
        })

        res.status(200).json({ msg: "เพิ่ม Todolist " + to_title + " สำเร็จ" });
    } catch (error) {
        log("[Express] addTodolist Error : ", error);
        res.status(400).json({ msg: "เพิ่ม Todolist ไม่สำเร็จ" });
    } finally {
        await prisma.$disconnect();
    }
}