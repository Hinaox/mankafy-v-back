var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import db from '../models/db.js';
// Fonction récursive pour récupérer les sous-locations et leurs activités
export function getActivitiesForLocation(locationId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Récupère la location actuelle avec ses activités
        const location = yield db.Location.findByPk(locationId, {
            include: [{ model: db.Activity }] // Inclut les activités de cette location
        });
        if (!location) {
            return [];
        }
        // Collecte les activités directes
        let activities = [...location.Activities];
        // Récupère les sous-locations
        const childLocations = yield db.Location.findAll({
            where: { parentId: locationId } // parentId est l'ID de la location parent
        });
        // Récupère les activités des sous-locations de manière récursive
        for (const childLocation of childLocations) {
            const childActivities = yield getActivitiesForLocation(childLocation.id);
            activities = activities.concat(childActivities);
        }
        return activities;
    });
}
//# sourceMappingURL=locationService.js.map