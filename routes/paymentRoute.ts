import { Router } from "express";
import db from "../models/db.js";

const paymentRouter = Router();

// Create Payment
paymentRouter.post("/", async (req, res) => {
    try {
        const payment = await db.Payment.create(req.body);
        res.status(201).json(payment);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Read All Payments
paymentRouter.get("/", async (req, res) => {
    try {
        const payments = await db.Payment.findAll();
        res.status(200).json(payments);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Read Payment by ID
paymentRouter.get("/:id", async (req, res) => {
    try {
        const payment = await db.Payment.findByPk(req.params.id);
        if (payment) {
            res.status(200).json(payment);
        } else {
            res.status(404).json({ error: "Payment not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Update Payment
paymentRouter.put("/:id", async (req, res) => {
    try {
        const [updated] = await db.Payment.update(req.body, {
            where: { id: req.params.id },
        });
        if (updated) {
            const updatedPayment = await db.Payment.findByPk(req.params.id);
            res.status(200).json(updatedPayment);
        } else {
            res.status(404).json({ error: "Payment not found" });
        }
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Delete Payment
paymentRouter.delete("/:id", async (req, res) => {
    try {
        const deleted = await db.Payment.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: "Payment not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default paymentRouter;
