import { Router } from "express";
import db from "../models/db.js";
import { getFirstTag } from "../services/activityService.js";

const activityTypeRouter = Router();

// get collection
activityTypeRouter.get("/", async (req, res) => {
  const params = req.query;

  try {
    const types = await db.ActivityType.findAll({ where: params });
    res.status(200).json(types);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default activityTypeRouter;
