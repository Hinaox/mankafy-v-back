var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from "path";
import db from "../models/db.js";
import { defaultStartPoint, getRoute, __dirname } from "./openRouteService.js";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, } from "fs";
export class LocationModel {
}
// Fonction récursive pour récupérer les sous-locations et leurs activités
export function getActivitiesForLocation(locationId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Récupère la location actuelle avec ses activités
        const location = yield db.Location.findByPk(locationId, {
            include: [{ model: db.Activity }], // Inclut les activités de cette location
        });
        if (!location) {
            return [];
        }
        // Collecte les activités directes
        let activities = [...location.Activities];
        // Récupère les sous-locations
        const childLocations = yield db.Location.findAll({
            where: { parentId: locationId }, // parentId est l'ID de la location parent
        });
        // Récupère les activités des sous-locations de manière récursive
        for (const childLocation of childLocations) {
            const childActivities = yield getActivitiesForLocation(childLocation.id);
            activities = activities.concat(childActivities);
        }
        return activities;
    });
}
// retourne un tableau d'ID
export function findLocationChildren(locationId, retour) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        if (!retour) {
            retour = [];
        }
        var children = undefined;
        try {
            children = yield db.Location.findAll({
                where: { parentId: locationId },
            });
        }
        catch (error) {
            reject(error);
        }
        if (children)
            for (let child of children) {
                retour.push(child.id);
                try {
                    yield findLocationChildren(child.id, retour);
                }
                catch (error) {
                    reject(error);
                }
            }
        resolve(retour);
    }));
}
export class LocationService {
    static getDistanceDurationBetweenLocations(location1, location2) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const routeFetch = yield LocationService.getRouteBetweenLocations(location1, location2);
            if (((_b = (_a = routeFetch.route) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.length) &&
                routeFetch.route.routes[0].summary) {
                return routeFetch.route.routes[0].summary;
            }
            else
                throw "invalid response routeData";
        });
    }
    static getRouteBetweenLocations(location1, location2) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            if (location1.point_x == null ||
                location1.point_x == undefined ||
                location1.point_y == null ||
                location1.point_y == undefined)
                throw "undefined location1 coords";
            if (location2 != null && (!location2.point_x || !location2.point_y))
                throw "undefined location2 coords";
            const coord1 = [location1.point_y, location1.point_x];
            var coord2 = defaultStartPoint;
            if (location2 && location2.point_x && location2.point_y)
                coord2 = [location2.point_y, location2.point_x];
            // try to get the routes locally
            const localRoute = this.getRouteLocally(coord1, coord2);
            if (localRoute) {
                // correction de la durée
                if (((_b = (_a = localRoute.route) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.length) &&
                    ((_c = localRoute.route.routes[0].summary) === null || _c === void 0 ? void 0 : _c.duration)) {
                    localRoute.route.routes[0].summary.duration *= 1.35;
                }
                return localRoute;
            }
            // else, get the route by api
            const fetchRoute = yield this.findRouteOnline(coord1, coord2);
            // correction de la durée
            if (((_e = (_d = fetchRoute.route) === null || _d === void 0 ? void 0 : _d.routes) === null || _e === void 0 ? void 0 : _e.length) &&
                ((_f = fetchRoute.route.routes[0].summary) === null || _f === void 0 ? void 0 : _f.duration)) {
                fetchRoute.route.routes[0].summary.duration *= 1.35;
            }
            return fetchRoute;
        });
    }
    static getRouteLocally(coord1, coord2) {
        const rechercheCoords = [coord1.join(","), coord2.join(",")];
        const folderPath = path.join(__dirname, "../assets/routes");
        if (existsSync(folderPath)) {
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
                return fileContent;
            }
        }
        return null;
    }
    static findRouteOnline(coord1, coord2) {
        return __awaiter(this, void 0, void 0, function* () {
            const coordinates = [coord1, coord2];
            const bodyData = {
                coordinates: coordinates,
                radiuses: Array(coordinates.length).fill(10000),
            };
            var retour = yield getRoute(JSON.stringify(bodyData));
            retour = { route: retour };
            this.saveRoute(coord1, coord2, retour);
            return retour;
        });
    }
    static saveRoute(coord1, coord2, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const coordinates = [coord1, coord2];
            const folderPath = path.join(__dirname, "../assets/routes");
            if (!existsSync(folderPath)) {
                mkdirSync(folderPath, { recursive: true });
            }
            const fileName = coordinates.join(",") + ".json";
            const filePath = path.join(folderPath, fileName);
            writeFileSync(filePath, JSON.stringify(data));
        });
    }
}
//# sourceMappingURL=locationService.js.map