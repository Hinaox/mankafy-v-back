import { Router } from "express";
import db from "../models/db.js";

const planningRoute = Router();

// Create Planning
planningRoute.post("/", async (req, res) => {
  try {
    const planning = await db.PlanningClient.create(req.body);
    res.status(201).json(planning);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Read Planning
planningRoute.get("/", async (req, res) => {
  try {
    const planning = await db.PlanningClient.findAll();
    res.status(200).json(planning);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Read Planning by ID
planningRoute.get("/:id", async (req, res) => {
  try {
    const planning = await db.PlanningClient.findByPk(req.params.id);
    if (planning) {
      res.status(200).json(planning);
    } else {
      res.status(404).json({ error: "PlanningClient not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update Planning
planningRoute.put("/:id", async (req, res) => {
  try {
    const planning = await db.PlanningClient.update(req.body, {
      where: { id: req.params.id },
    });
    if (planning[0]) {
      res.status(200).json({ message: "PlanningClient updated successfully" });
    } else {
      res.status(404).json({ error: "PlanningClient not found" });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Planning
planningRoute.delete("/:id", async (req, res) => {
  try {
    const deleted = await db.PlanningClient.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "PlanningClient not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default planningRoute;
