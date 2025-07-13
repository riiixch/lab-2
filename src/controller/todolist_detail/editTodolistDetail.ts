import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import { validateInput, ValidationSchema } from "../../plugin/validator";

import { log } from "console";

export default async function editTodolistDetail(req: Request, res: Response) {
    const prisma = new PrismaClient();
    try {
        const td_id = req.params.td_id;
        if (!td_id) {
            res.status(400).json({ msg: 'กรุณาระบุ Todolist Detail ID' });
            return;
        }

        const checker = await prisma.todolistDetail.findUnique({
            where: {
                td_id: td_id,
            }
        });
        if (!checker) {
            res.status(400).json({ msg: 'ไม่พบ Todolist Detail ID นี้' });
            return;
        }

        const schema: ValidationSchema = {
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

        const { td_title, td_descript, td_completed } = validate.data;

        await prisma.todolistDetail.update({
            where: {
                td_id: td_id
            },
            data: {
                td_title: td_title,
                td_descript: td_descript,
                td_completed: td_completed,
            }
        })

        res.status(200).json({ msg: 'คุณได้แก้ไข Todolist Detail ' + checker.td_title + ' แล้ว' });
    } catch (error) {
        log("[Express] editTodolistDetail Error : ", error);
        res.status(400).json({ msg: "แก้ไข Todolist Detail ไม่สำเร็จ" });
    } finally {
        await prisma.$disconnect();
    }
}