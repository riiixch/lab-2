import { Request, Response } from "express";
import { stock, todolist } from "../../cache";

import { ValidationSchema, validateInput } from "../../plugin/validator";

export default function editStock(req: Request, res: Response) {
    const sto_id = req.params.sto_id;

    if (!sto_id || sto_id === '') {
        res.status(400).json({ msg: 'ไม่มี sto_id' });
        return;
    }

    const index = stock.findIndex(sto => sto.id === Number(sto_id));
    if (index < 0) {
        res.status(400).json({ msg: 'ไม่พบ Stock ID นี้' });
        return;
    }

    const scheme: ValidationSchema = {
        product: {
            type: 'string',
            minLength: 1,
            required: true,
        },
        in_stock: {
            type: 'integer',
            min: 0,
            required: true,
        },
        out_stock: {
            type: 'integer',
            min: 0,
            required: true,
        },
    };

    const validate = validateInput(req.body, scheme);

    if (!validate.success) {
        res.status(400).json({ msg: validate.errorMsg });
        return;
    }

    const { product, in_stock, out_stock } = validate.data;

    stock[index].product = product;
    stock[index].in_stock = in_stock;
    stock[index].out_stock = out_stock;

    res.status(200).json({ msg: 'แก้ไข Stock ID ' + index + ' สำเร็จ' });
}