import { Router } from "express";
import db from "../models/db";

const photoRouter = Router();

// Create Photo
photoRouter.post("/", async (req, res) => {
  try {
    const photo = await db.Photo.create(req.body);
    res.status(201).json(photo);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Read Photos
photoRouter.get("/", async (req, res) => {
  try {
    const photos = await db.Photo.findAll();
    res.status(200).json(photos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Read Photo by ID
photoRouter.get("/:id", async (req, res) => {
  try {
    const photo = await db.Photo.findByPk(req.params.id);
    if (photo) {
      res.status(200).json(photo);
    } else {
      res.status(404).json({ error: "Photo not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update Photo
photoRouter.put("/:id", async (req, res) => {
  try {
    const photo = await db.Photo.update(req.body, {
      where: { id: req.params.id },
    });
    if (photo[0]) {
      res.status(200).json({ message: "Photo updated successfully" });
    } else {
      res.status(404).json({ error: "Photo not found" });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Photo
photoRouter.delete("/:id", async (req, res) => {
  try {
    const deleted = await db.Photo.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Photo not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default photoRouter;
