var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import db from "../models/db.js";
const planningRoute = Router();
// Create Planning
planningRoute.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const planning = yield db.PlanningClient.create(req.body);
        res.status(201).json(planning);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Read Planning
planningRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const planning = yield db.PlanningClient.findAll();
        res.status(200).json(planning);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Read Planning by ID
planningRoute.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const planning = yield db.PlanningClient.findByPk(req.params.id);
        if (planning) {
            res.status(200).json(planning);
        }
        else {
            res.status(404).json({ error: "PlanningClient not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Update Planning
planningRoute.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const planning = yield db.PlanningClient.update(req.body, {
            where: { id: req.params.id },
        });
        if (planning[0]) {
            res.status(200).json({ message: "PlanningClient updated successfully" });
        }
        else {
            res.status(404).json({ error: "PlanningClient not found" });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Delete Planning
planningRoute.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield db.PlanningClient.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        }
        else {
            res.status(404).json({ error: "PlanningClient not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
export default planningRoute;
//# sourceMappingURL=planningClientRoute.js.map