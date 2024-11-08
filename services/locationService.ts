import db from '../models/db.js';

// Fonction récursive pour récupérer les sous-locations et leurs activités
export async function getActivitiesForLocation(locationId: string) {
    // Récupère la location actuelle avec ses activités
    const location = await db.Location.findByPk(locationId, {
        include: [{ model: db.Activity }]  // Inclut les activités de cette location
    });

    if (!location) {
        return [];
    }

    // Collecte les activités directes
    let activities = [...location.Activities];

    // Récupère les sous-locations
    const childLocations = await db.Location.findAll({
        where: { parentId: locationId }  // parentId est l'ID de la location parent
    });

    // Récupère les activités des sous-locations de manière récursive
    for (const childLocation of childLocations) {
        const childActivities = await getActivitiesForLocation(childLocation.id);
        activities = activities.concat(childActivities);
    }

    return activities;
}
