// openRouteService.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { existsSync, readdirSync, readFileSync, writeFileSync, } from "fs";
import db from "../models/db.js";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
// import polyline from '@mapbox/polyline';
export const defaultStartPoint = [
    47.52113602393204, -18.90332092867509,
];
const API_KEY = process.env.ORS_API_KEY || ""; // Remplacez par votre clé API ORS
const __filename = fileURLToPath(import.meta.url);
// Obtenir le répertoire du fichier actuel
const __dirname = path.dirname(__filename);
export function getRouteLocally(fileName) {
    const filePath = path.join(__dirname, "../assets/routes/", fileName);
    if (existsSync(filePath)) {
        return readFileSync(filePath).toString();
    }
    return null;
}
export function getRoute(bodyData) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://api.openrouteservice.org/v2/directions/driving-car/json`;
        try {
            const response = yield fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
                    Authorization: API_KEY,
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: bodyData,
            });
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
export function getDistanceDurationBetweenActivities(activity_id, another_activity_id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        // get the coords
        var location1 = null;
        var location2 = null;
        const activity1 = yield db.Activity.findByPk(activity_id);
        if (activity1.point_x && activity1.point_y) {
            location1 = [activity1.point_y, activity1.point_x];
        }
        else
            throw "undefined location for activity1";
        if (another_activity_id == null) {
            location2 = defaultStartPoint;
        }
        else {
            const activity2 = yield db.Activity.findByPk(another_activity_id);
            if (activity2.point_x && activity2.point_y) {
                location2 = [activity2.point_y, activity2.point_x];
            }
            else
                throw "undefined location for activity2";
        }
        const rechercheCoords = [location1.join(","), location2.join(",")];
        // read saved datas
        const folderPath = path.join(__dirname, "../assets/routes");
        const fileList = readdirSync(folderPath);
        // traitement des fichiers
        const fileListSplited = [];
        for (let filename of fileList) {
            try {
                const firstPart = filename.substring(0, filename.lastIndexOf("."));
                const firstPartSplit = firstPart.split(",");
                if (firstPartSplit.length == 4) {
                    fileListSplited.push([
                        firstPartSplit[0] + "," + firstPartSplit[1],
                        firstPartSplit[2] + "," + firstPartSplit[3],
                    ]);
                }
                else
                    throw "incorrect filename for : " + filename;
            }
            catch (error) {
                console.error(error);
            }
        }
        const fileFound = fileListSplited.find((el) => el.some((anEl) => anEl == rechercheCoords[0]) &&
            el.some((anEl) => anEl == rechercheCoords[1]));
        if (fileFound) {
            const fileName = fileFound.join(",") + ".json";
            const fileContent = JSON.parse(readFileSync(path.join(folderPath, fileName)).toString());
            if ((_b = (_a = fileContent.route) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.length) {
                const retour = fileContent.route.routes[0].summary;
                if (retour) {
                    return retour;
                }
            }
        }
        // file not found
        // get from the api
        const coordinates = [location1, location2];
        const bodyData = {
            coordinates: coordinates,
            radiuses: Array(coordinates.length).fill(10000),
        };
        var retour = yield getRoute(JSON.stringify(bodyData));
        retour = { route: retour };
        console.log("retour", retour);
        if (retour) {
            if ((_d = (_c = retour.route) === null || _c === void 0 ? void 0 : _c.routes) === null || _d === void 0 ? void 0 : _d.length) {
                const summary = retour.route.routes[0].summary;
                if (summary) {
                    // save file first
                    const fileName = bodyData.coordinates.join(",") + ".json";
                    const filePath = path.join(folderPath, fileName);
                    writeFileSync(filePath, JSON.stringify(retour));
                    return summary;
                }
            }
        }
        return null;
    });
}
//# sourceMappingURL=openRouteService.js.map