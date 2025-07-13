import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import { validateInput, ValidationSchema } from "../../plugin/validator";

import { log } from "console";

export default async function addTodolistDetail(req: Request, res: Response) {
    const prisma = new PrismaClient();
    try {
        const schema: ValidationSchema = {
            to_id: {
                type: 'string',
                minLength: 1,
                displayName: 'ไอดีรายการ',
                required: true,
            },
            td_title: {
                type: 'string',
                minLength: 1,
                displayName: 'ชื่อรายการย่อย',
                required: true,
            },
            td_descript: {
                type: 'string',
                minLength: 1,
                displayName: 'คำอธิบายรายการย่อย',
                required: true,
            },
            td_completed: {
                type: 'boolean',
                minLength: 1,
                displayName: 'สำเร็จรายการย่อย',
                required: true,
            }
        }

        const validate = validateInput(req.body, schema);
        if (!validate.success) {
            res.status(400).json({ msg: validate.errorMsg });
            return;
        }

        const { to_id, td_title, td_descript, td_completed } = validate.data;

        const checker = await prisma.todolist.findUnique({
            where: {
                to_id: to_id
            }
        });
        if (!checker) {
            res.status(400).json({ msg: 'ไม่พบรายการ' });
            return;
        }

        await prisma.todolistDetail.create({
            data: {
                td_title: td_title,
                td_descript: td_descript,
                td_completed: td_completed,
                to_id: to_id,
            }
        });
    } catch (error) {
        log("[Express] addTodolistDetail Error : ", error);
        res.status(400).json({ msg: "เพิ่ม Todolist Detail ไม่สำเร็จ" });
    } finally {
        await prisma.$disconnect();
    }
}