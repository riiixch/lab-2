import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import { log } from "console";

export default async function getTodolistDetail(req: Request, res: Response) {
    const prisma = new PrismaClient();
    try {
        const td_id = req.params.td_id;
        if (td_id) {
            const todolistDetailData = await prisma.todolistDetail.findUnique({
                where: {
                    td_id: td_id,
                },
                include: {
                    todolist: true,
                }
            });

            res.status(200).json({ data: todolistDetailData });
            return;
        }

        const todolistDetailData = await prisma.todolistDetail.findMany({
            include: {
                todolist: true,
            }
        });

        res.status(200).json({ data: todolistDetailData });
        return;
    } catch (error) {
        log("[Express] getTodolistDetail Error : ", error);
        res.status(400).json({ msg: "ดึงข้อมูล Todolist Detail ไม่สำเร็จ" });
    } finally {
        await prisma.$disconnect();
    }
}