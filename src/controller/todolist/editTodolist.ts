import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import { validateInput, ValidationSchema } from "../../plugin/validator";

import getUserJWT from "../../function/getUserJWT";

import { log } from "console";

export default async function editTodolist(req: Request, res: Response) {
    const prisma = new PrismaClient();
    try {
        const userJWT = await getUserJWT(req);
        if (!userJWT) {
            res.status(400).json({ msg: 'กรุณาเข้าสู่ระบบ' });
            return;
        }

        const to_id = req.params.to_id;
        if (!to_id) {
            res.status(400).json({ msg: 'กรุณาระบุ Todolist ID' });
            return;
        }

        const checker = await prisma.todolist.findUnique({
            where: {
                to_id: to_id,
            }
        });
        if (!checker) {
            res.status(400).json({ msg: 'ไม่พบ Todolist ID นี้' });
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

        await prisma.todolist.update({
            where: {
                to_id: to_id
            },
            data: {
                to_title: to_title
            }
        })

        res.status(200).json({ msg: 'คุณได้แก้ไข Todolist ' + checker.to_title + ' เป็น ' + to_title + ' แล้ว' });
    } catch (error) {
        log("[Express] editTodolist Error : ", error);
        res.status(400).json({ msg: "แก้ไข Todolist ไม่สำเร็จ" });
    } finally {
        await prisma.$disconnect();
    }
}