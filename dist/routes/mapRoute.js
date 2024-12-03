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
import { getDistanceDurationBetweenActivities, getRoute, getRouteLocally, } from "../services/openRouteService.js";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync, writeFile } from "fs";
const mapRouter = Router();
// Obtenir le chemin actuel du fichier
const __filename = fileURLToPath(import.meta.url);
// Obtenir le répertoire du fichier actuel
const __dirname = path.dirname(__filename);
mapRouter.get("/route", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { coords } = req.query;
        if (coords) {
            // Parse les coordonnées depuis la chaîne de requête en un tableau de paires
            const coordinates = JSON.parse(coords);
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
            const route = yield getRoute(bodyData);
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
        }
        else {
            res
                .status(400)
                .json({ error: "Paramètre de coordonnées manquant ou invalide." });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
mapRouter.get("/distanceBetweenActivities", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var activity_id = req.query.activity_id;
    var another_activity_id = req.query.another_activity_id;
    if (!activity_id) {
        res.status(400).json("undefined activity_id");
        return;
    }
    if (!another_activity_id) {
        another_activity_id = null;
    }
    else {
        another_activity_id = parseInt(another_activity_id);
    }
    activity_id = parseInt(activity_id);
    try {
        const retour = yield getDistanceDurationBetweenActivities(activity_id, another_activity_id);
        res.json(retour);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
export default mapRouter;
//# sourceMappingURL=mapRoute.js.map