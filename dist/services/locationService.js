var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import db from "../models/db.js";
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
//# sourceMappingURL=locationService.js.map