import db from '../models/db.js';

export async function getFirstTag(activityId: number) {
    try {
        const activity = await db.Activity.findOne({
            where: { id: activityId },
            include: [{
                model: db.Tag,
                through: {
                    attributes: [] // Ignore les attributs de la table de liaison
                }
            }]
        });

        if (activity && activity.tags && activity.tags.length > 0) {
            return activity.tags[0]; // Retourne le premier tag
        } else {
            return null; // Pas de tag trouvé
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching first tag:', error.message);
            throw error; // Relance l'erreur pour la gestion externe
        } else {
            console.error('Unexpected error:', error);
            throw new Error('An unexpected error occurred');
        }
    }
}
export async function searchActivitiesAndLocations(keyword: string) {
    try {
        const searchTerm = `%${keyword}%`; // Recherche de sous-chaîne

        // Recherche dans la table Activity
        const activities = await db.Activity.findAll({
            where: {
                name: {
                    [db.Sequelize.Op.like]: searchTerm
                }
            }
        });

        // Recherche dans la table Location
        const locations = await db.Location.findAll({
            where: {
                name: {
                    [db.Sequelize.Op.like]: searchTerm
                }
            }
        });

        return { activities, locations };
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching activities and locations:', error.message);
            throw error; // Relance l'erreur pour la gestion externe
        } else {
            console.error('Unexpected error:', error);
            throw new Error('An unexpected error occurred');
        }
    }
}
