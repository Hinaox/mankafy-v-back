import { Router } from "express";
import db from "../models/db.js";
import { getRoute, getRouteLocally } from "../services/openRouteService.js";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync, writeFile } from "fs";

const mapRouter = Router();

// Obtenir le chemin actuel du fichier
const __filename = fileURLToPath(import.meta.url);

// Obtenir le répertoire du fichier actuel
const __dirname = path.dirname(__filename);

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
      writeFile(dataFilePath, JSON.stringify(route), "utf8", (err) => {
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

export default mapRouter;
