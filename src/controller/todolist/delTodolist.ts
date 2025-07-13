import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import getUserJWT from "../../function/getUserJWT";

import { log } from "console";

export default async function delTodolist(req: Request, res: Response) {
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

        await prisma.todolist.delete({
            where: {
                to_id: to_id
            }
        });

        res.status(200).json({ msg: 'คุณได้ลบ Todolist ' + checker.to_title + ' แล้ว' });
    } catch (error) {
        log("[Express] delTodolist Error : ", error);
        res.status(400).json({ msg: "ลบ Todolist ไม่สำเร็จ" });
    } finally {
        await prisma.$disconnect();
    }
}