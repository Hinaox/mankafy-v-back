import { Router } from "express";
import db from "../models/db.js";
import {
  getDistanceDurationBetweenActivities,
  getRoute,
  getRouteLocally,
} from "../services/openRouteService.js";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync, writeFile } from "fs";
import { LocationService } from "../services/locationService.js";

const mapRouter = Router();

// Obtenir le chemin actuel du fichier
const __filename = fileURLToPath(import.meta.url);

// Obtenir le répertoire du fichier actuel
const __dirname = path.dirname(__filename);

mapRouter.get("/distanceDuration", async (req, res) => {
  const location1_idStr = req.query.location_id;
  const location2_idStr = req.query.another_location_id;
  if (!location1_idStr) {
    res.status(400).json({ error: "Unspecified location1_id" });
    return;
  }
  const location1_id = parseInt(`${location1_idStr}`);
  var location2_id: number | null = null;
  if (location2_idStr) {
    location2_id = parseInt(`${location2_idStr}`);
  }

  try {
    const location1 = await db.Location.findByPk(location1_id);
    var location2 = null;
    if (location2_id) {
      location2 = await db.Location.findByPk(location2_id);
    }

    const retour = await LocationService.getDistanceDurationBetweenLocations(
      location1,
      location2
    );
    res.json(retour);
  } catch (error) {
    res.status(500).json(error);
  }
});

mapRouter.get("/locationsRoutes", async (req, res) => {
  const location1_idStr = req.query.location_id;
  const location2_idStr = req.query.another_location_id;
  if (!location1_idStr) {
    res.status(400).json({ error: "Unspecified location1_id" });
    return;
  }
  const location1_id = parseInt(`${location1_idStr}`);
  var location2_id: number | null = null;
  if (location2_idStr) {
    location2_id = parseInt(`${location2_idStr}`);
  }

  try {
    const location1 = await db.Location.findByPk(location1_id);
    var location2 = null;
    if (location2_id) {
      location2 = await db.Location.findByPk(location2_id);
    }

    const retour = await LocationService.getRouteBetweenLocations(
      location1,
      location2
    );
    res.json(retour);
  } catch (error) {
    res.status(500).json(error);
  }
});

mapRouter.get("/route", async (req, res) => {
  try {
    const { coords } = req.query;

    if (coords) {
      // Parse les coordonnées depuis la chaîne de requête en un tableau de paires
      const coordinates = JSON.parse(coords as string);

      const bodyData = JSON.stringify({
        coordinates: coordinates,
        radiuses: Array(coordinates.length).fill(10000), // Appliquer un radius de 10000 à chaque point
      });

      //console.log(bodyData);
      //body.Data.route[0].summary.distance   accès à la distance
      //body.Data.route[0].summary.duration   accès à la durée

      // attempt to get data from storage
      const dataFilename = coordinates + ".json";
      const retour = getRouteLocally(dataFilename);
      if (retour) {
        res.json(JSON.parse(retour));
        return;
      }

      const route = await getRoute(bodyData);

      // stocker le data
      const routesFolder = path.join(__dirname, "../assets/routes");
      if (!existsSync(routesFolder)) {
        mkdirSync(routesFolder, { recursive: true });
        console.log("dossier créé avec succès");
      }

      const dataFilePath = path.join(routesFolder, dataFilename);
      writeFile(dataFilePath, JSON.stringify({ route }), "utf8", (err) => {
        if (err) {
          console.error("Erreur lors de l'écriture du fichier :", err);
        }
      });

      res.status(200).json({ route });
    } else {
      res
        .status(400)
        .json({ error: "Paramètre de coordonnées manquant ou invalide." });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

mapRouter.get("/distanceBetweenActivities", async (req, res) => {
  var activity_id: any = req.query.activity_id;
  var another_activity_id: any = req.query.another_activity_id;
  if (!activity_id) {
    res.status(400).json("undefined activity_id");
    return;
  }
  if (!another_activity_id) {
    another_activity_id = null;
  } else {
    another_activity_id = parseInt(another_activity_id);
  }
  activity_id = parseInt(activity_id);

  try {
    const retour = await getDistanceDurationBetweenActivities(
      activity_id,
      another_activity_id
    );
    res.json(retour);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default mapRouter;
