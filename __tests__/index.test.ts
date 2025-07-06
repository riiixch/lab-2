import app from "../src/index"
import request from "supertest";

describe('Unit Testing Hello World', () => {
    it('GET /hello -> return Hello World', async () => {
        const res = await request(app)
            .get("/hello");
        expect(res.status).toBe(200);
        expect(res.body.msg).toBe("Hello World");
    });
});

describe('Unit Testing Todolist', () => {
    it('GET /api/todolist -> return todolist: [] length 0', async () => {
        const res = await request(app)
            .get("/api/todolist");
        expect(res.status).toBe(200);
        expect(res.body.todolist.length).toBe(0);
    });

    it('POST /api/todolist -> return todolist: [] length 0', async () => {
        const res = await request(app)
            .post("/api/todolist")
            .send({ "title": "Hello World", "descript": "Hello World Descript", "completed": false });
        expect(res.status).toBe(200);
        expect(res.body.msg).toBe("ข้อมูลถูกเพิ่มแล้ว");
    });

    it('POST /api/todolist -> return todolist: [] length 0', async () => {
        const res = await request(app)
            .post("/api/todolist")
            .send({ "title": "Hello World", "descript": "Hello World Descript" });
        expect(res.status).toBe(400);
        //expect(res.body.msg).toBe("ข้อมูลถูกเพิ่มแล้ว");
    });

    it('PUT /api/todolist -> return todolist: [] length 0', async () => {
        const res = await request(app)
            .put("/api/todolist/0")
            .send({ "title": "Hello Express", "descript": "Hello Express Descript", "completed": true });
        expect(res.status).toBe(200);
        expect(res.body.msg).toBe("แก้ไข Todolist ID 0 สำเร็จ");
    });

    it('PUT /api/todolist -> return todolist: [] length 0', async () => {
        const res = await request(app)
            .put("/api/todolist/0")
            .send({ "title": "Hello Express", "descript": "Hello Express Descript" });
        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("completed จำเป็นต้องกรอก");
    });

    it('DELETE /api/todolist -> return todolist: [] length 0', async () => {
        const res = await request(app)
            .delete("/api/todolist/0");
        expect(res.status).toBe(200);
        expect(res.body.msg).toBe("ลบ Todolist ID 0 สำเร็จ");
    });

    it('DELETE /api/todolist -> return todolist: [] length 0', async () => {
        const res = await request(app)
            .delete("/api/todolist/2");
        expect(res.status).toBe(400);
        //expect(res.body.msg).toBe("ลบ Todolist ID 0 สำเร็จ");
    });
});


describe('Unit Testing Stock', () => {
    it('GET /api/stock -> return stock: [] length 0', async () => {
        const res = await request(app)
            .get("/api/stock");
        expect(res.status).toBe(200);
        expect(res.body.stock.length).toBe(0);
    });

    it('POST /api/stock -> return ข้อมูลถูกเพิ่มแล้ว', async () => {
        const res = await request(app)
            .post("/api/stock")
            .send({ "product": "Ryzen 9 5950X", "in_stock": 0, "out_stock": 0 });
        expect(res.status).toBe(200);
        expect(res.body.msg).toBe("ข้อมูลถูกเพิ่มแล้ว");
    });

    it('POST /api/stock -> return', async () => {
        const res = await request(app)
            .post("/api/stock")
            .send({ "product": "Ryzen 9 5950X", "in_stock": 0 });
        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("out_stock จำเป็นต้องกรอก");
    });

    it('PUT /api/stock -> return แก้ไข Stock ID 0 สำเร็จ', async () => {
        const res = await request(app)
            .put("/api/stock/0")
            .send({ "product": "Ryzen 9 5950X", "in_stock": 10, "out_stock": 0 });
        expect(res.status).toBe(200);
        expect(res.body.msg).toBe("แก้ไข Stock ID 0 สำเร็จ");
    });

    it('PUT /api/stock -> return out_stock จำเป็นต้องกรอก', async () => {
        const res = await request(app)
            .put("/api/stock/0")
            .send({ "product": "Ryzen 9 5950X", "in_stock": 100 });
        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("out_stock จำเป็นต้องกรอก");
    });

    it('DELETE /api/stock -> return ลบ Stock ID 0 สำเร็จ', async () => {
        const res = await request(app)
            .delete("/api/stock/0");
        expect(res.status).toBe(200);
        expect(res.body.msg).toBe("ลบ Stock ID 0 สำเร็จ");
    });

    it('DELETE /api/stock -> return ไม่พบ Stock ID นี้', async () => {
        const res = await request(app)
            .delete("/api/stock/2");
        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("ไม่พบ Stock ID นี้");
    });
});