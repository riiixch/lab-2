import { Request, Response } from "express";
import { stock } from "../../cache";

export default function delStock(req: Request, res: Response) {
    const sto_id = req.params.sto_id;

    if (!sto_id || sto_id == '') {
        res.status(400).json({ msg: 'ไม่มี sto_id' });
        return;
    }

    const index = stock.findIndex(sto => sto.id === Number(sto_id));
    if (index < 0) {
        res.status(400).json({ msg: 'ไม่พบ Stock ID นี้' });
        return;
    }

    stock.splice(index, 1);
    res.status(200).json({ msg: 'ลบ Stock ID ' + index + ' สำเร็จ' });
}