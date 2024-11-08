import { Router } from 'express';
import db from '../models/db.js';
import { getRoute } from '../services/openRouteService.js';

const mapRouter = Router();

mapRouter.get('/route', async (req, res) => {
    try {
        const { coords } = req.query;

        if (coords) {
            // Parse les coordonnées depuis la chaîne de requête en un tableau de paires
            const coordinates = JSON.parse(coords as string);

            const bodyData = JSON.stringify({
                coordinates: coordinates,
                radiuses: Array(coordinates.length).fill(10000) // Appliquer un radius de 10000 à chaque point
            });

            //console.log(bodyData);
            //body.Data.route[0].summary.distance   accès à la distance
            //body.Data.route[0].summary.duration   accès à la durée 

            const route = await getRoute(bodyData);
            res.status(200).json({ route });
        } else {
            res.status(400).json({ error: 'Paramètre de coordonnées manquant ou invalide.' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default mapRouter;
