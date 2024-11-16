var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Op } from "sequelize";
import db from "../models/db.js";
import { findLocationChildren } from "./locationService.js";
export function getFirstTag(activityId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const activity = yield db.Activity.findOne({
                where: { id: activityId },
                include: [
                    {
                        model: db.Tag,
                        through: {
                            attributes: [], // Ignore les attributs de la table de liaison
                        },
                    },
                ],
            });
            if (activity && activity.tags && activity.tags.length > 0) {
                return activity.tags[0]; // Retourne le premier tag
            }
            else {
                return null; // Pas de tag trouvé
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error fetching first tag:", error.message);
                throw error; // Relance l'erreur pour la gestion externe
            }
            else {
                console.error("Unexpected error:", error);
                throw new Error("An unexpected error occurred");
            }
        }
    });
}
export function findActivitiesByLocation(locationId) {
    return __awaiter(this, void 0, void 0, function* () {
        var locationIds = [locationId];
        // find child Locations
        const children = yield findLocationChildren(locationId);
        if (children) {
            locationIds = locationIds.concat(children);
        }
        const activities = yield db.Activity.findAll({
            where: {
                locationId: {
                    [Op.in]: locationIds,
                },
            },
        });
        return activities;
    });
}
export function searchActivitiesAndLocations(keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const searchTerm = `%${keyword}%`; // Recherche de sous-chaîne
            // Recherche dans la table Activity
            const activities = yield db.Activity.findAll({
                where: {
                    name: {
                        [db.Sequelize.Op.like]: searchTerm,
                    },
                },
            });
            // Recherche dans la table Location
            const locations = yield db.Location.findAll({
                where: {
                    name: {
                        [db.Sequelize.Op.like]: searchTerm,
                    },
                },
            });
            return { activities, locations };
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error fetching activities and locations:", error.message);
                throw error; // Relance l'erreur pour la gestion externe
            }
            else {
                console.error("Unexpected error:", error);
                throw new Error("An unexpected error occurred");
            }
        }
    });
}
//# sourceMappingURL=activityService.js.map