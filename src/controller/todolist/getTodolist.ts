import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import getUserJWT from "../../function/getUserJWT";

import { log } from "console";

export default async function getTodolist(req: Request, res: Response) {
    const prisma = new PrismaClient();
    try {
        const userJWT = await getUserJWT(req);
        if (!userJWT) {
            res.status(400).json({ msg: 'กรุณาเข้าสู่ระบบ' });
            return;
        }

        const to_id = req.params.to_id;
        if (to_id) {
            const todolistData = await prisma.todolist.findUnique({
                where: {
                    to_id: to_id,
                    user_id: userJWT.user_id,
                },
                include: {
                    todolist_detail: true,
                }
            });

            res.status(200).json({ data: todolistData });
            return;
        }

        const todolistData = await prisma.todolist.findMany({
            where: {
                user_id: userJWT.user_id,
            },
            include: {
                todolist_detail: true,
            }
        });

        res.status(200).json({ data: todolistData });
        return;
    } catch (error) {
        log("[Express] getTodolist Error : ", error);
        res.status(400).json({ msg: "ดึงข้อมูล Todolist ไม่สำเร็จ" });
    } finally {
        await prisma.$disconnect();
    }
}