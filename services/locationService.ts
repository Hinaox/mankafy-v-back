import db from "../models/db.js";

// Fonction récursive pour récupérer les sous-locations et leurs activités
export async function getActivitiesForLocation(locationId: string) {
  // Récupère la location actuelle avec ses activités
  const location = await db.Location.findByPk(locationId, {
    include: [{ model: db.Activity }], // Inclut les activités de cette location
  });

  if (!location) {
    return [];
  }

  // Collecte les activités directes
  let activities = [...location.Activities];

  // Récupère les sous-locations
  const childLocations = await db.Location.findAll({
    where: { parentId: locationId }, // parentId est l'ID de la location parent
  });

  // Récupère les activités des sous-locations de manière récursive
  for (const childLocation of childLocations) {
    const childActivities = await getActivitiesForLocation(childLocation.id);
    activities = activities.concat(childActivities);
  }

  return activities;
}

// retourne un tableau d'ID
export function findLocationChildren(
  locationId: number,
  retour?: number[]
): Promise<number[]> {
  return new Promise<number[]>(async (resolve, reject) => {
    if (!retour) {
      retour = [];
    }
    var children: { id: number }[] | undefined = undefined;

    try {
      children = await db.Location.findAll({
        where: { parentId: locationId },
      });
    } catch (error) {
      reject(error);
    }

    if (children)
      for (let child of children) {
        retour.push(child.id);
        try {
          await findLocationChildren(child.id, retour);
        } catch (error) {
          reject(error);
        }
      }
    resolve(retour);
  });
}
