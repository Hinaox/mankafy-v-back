import { Router } from "express";
import db from "../models/db.js";
import {
  findLocationChildren,
  getActivitiesForLocation,
} from "../services/locationService.js";
import { where } from "sequelize";

const locationRouter = Router();

// Create Location
locationRouter.post("/", async (req, res) => {
  try {
    const location = await db.Location.create(req.body);
    res.status(201).json(location);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Read Locations
locationRouter.get("/", async (req, res) => {
  try {
    const locations = await db.Location.findAll();
    res.status(200).json(locations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

locationRouter.get("/:id/children", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const retour = await findLocationChildren(id);
    res.json(retour);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// get parents locations
locationRouter.get("/parents", async (req, res) => {
  try {
    const retour = await db.Location.findAll({
      where: {
        parentId: null,
      },
    });
    res.json(retour);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Read Location by ID
locationRouter.get("/:id", async (req, res) => {
  try {
    const location = await db.Location.findByPk(req.params.id);
    if (location) {
      res.status(200).json(location);
    } else {
      res.status(404).json({ error: "Location not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update Location
locationRouter.put("/:id", async (req, res) => {
  try {
    const location = await db.Location.update(req.body, {
      where: { id: req.params.id },
    });
    if (location[0]) {
      res.status(200).json({ message: "Location updated successfully" });
    } else {
      res.status(404).json({ error: "Location not found" });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Location
locationRouter.delete("/:id", async (req, res) => {
  try {
    const deleted = await db.Location.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Location not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Route GET pour obtenir toutes les activités d'une location et ses sous-locations
locationRouter.get("/:id/activities", async (req, res) => {
  const { id } = req.params;

  try {
    // Appel de la fonction pour la location initiale
    const activities = await getActivitiesForLocation(id);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default locationRouter;
