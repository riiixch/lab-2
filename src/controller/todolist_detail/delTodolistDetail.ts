import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import { log } from "console";

export default async function delTodolistDetail(req: Request, res: Response) {
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

        await prisma.todolistDetail.delete({
            where: {
                td_id: td_id,
            }
        });

        res.status(200).json({ msg: 'คุณได้ลบ Todolist ' + checker.td_title + ' แล้ว' });
    } catch (error) {
        log("[Express] delTodolistDetail Error : ", error);
        res.status(400).json({ msg: "ลบ Todolist Detail ไม่สำเร็จ" });
    } finally {
        await prisma.$disconnect();
    }
}