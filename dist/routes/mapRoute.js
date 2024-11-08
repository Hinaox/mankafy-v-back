var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import { getRoute } from '../services/openRouteService.js';
const mapRouter = Router();
mapRouter.get('/route', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { coords } = req.query;
        if (coords) {
            // Parse les coordonnées depuis la chaîne de requête en un tableau de paires
            const coordinates = JSON.parse(coords);
            const bodyData = JSON.stringify({
                coordinates: coordinates,
                radiuses: Array(coordinates.length).fill(10000) // Appliquer un radius de 10000 à chaque point
            });
            //console.log(bodyData);
            //body.Data.route[0].summary.distance   accès à la distance
            //body.Data.route[0].summary.duration   accès à la durée 
            const route = yield getRoute(bodyData);
            res.status(200).json({ route });
        }
        else {
            res.status(400).json({ error: 'Paramètre de coordonnées manquant ou invalide.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
export default mapRouter;
//# sourceMappingURL=mapRoute.js.map