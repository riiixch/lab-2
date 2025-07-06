import { Request, Response } from "express";
import { todolist } from "../../cache";

export default function delTodolist(req: Request, res: Response) {
    const to_id = req.params.to_id;

    if (!to_id || to_id == '') {
        res.status(400).json({ msg: 'ไม่มี to_id' });
        return;
    }

    const index = todolist.findIndex(to => to.id === Number(to_id));
    if (index < 0) {
        res.status(400).json({ msg: 'ไม่พบ Todolist ID นี้' });
        return;
    }

    todolist.splice(index, 1);
    res.status(200).json({ msg: 'ลบ Todolist ID ' + index + ' สำเร็จ' });
}