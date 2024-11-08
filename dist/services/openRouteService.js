var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// openRouteService.ts
import fetch from 'node-fetch';
const API_KEY = process.env.ORS_API_KEY || ""; // Remplacez par votre clé API ORS
export function getRoute(bodyData) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://api.openrouteservice.org/v2/directions/driving-car/json`;
        try {
            const response = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                    'Authorization': API_KEY,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: bodyData
            });
            const data = yield response.json();
            // const encodedPolyline = data.routes[0].geometry;
            // const decodedPolyline = polyline.decode(encodedPolyline);
            // console.log(decodedPolyline);
            return data;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
export function getCitiesOnRoute(routeData) {
    return __awaiter(this, void 0, void 0, function* () {
        // Récupère les coordonnées du trajet depuis les données de route
        const routeCoordinates = routeData.routes[0].geometry;
        // Convertir les coordonnées en chaîne de polygone pour Overpass
        const polygon = routeCoordinates.map((coord) => `${coord[1]} ${coord[0]}`).join(' ');
        const overpassUrl = `https://overpass-api.de/api/interpreter`;
        const query = `
        [out:json];
        (
            node["place"="city"](poly:"${polygon}");
        );
        out body;
    `;
        try {
            const response = yield fetch(overpassUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: query
            });
            const data = yield response.json();
            return data.elements.map((city) => ({
                name: city.tags.name,
                latitude: city.lat,
                longitude: city.lon,
            }));
        }
        catch (error) {
            console.error('Erreur lors de la récupération des villes avec Overpass:', error);
            throw error;
        }
        function getNearbyCities(coordinates) {
            return __awaiter(this, void 0, void 0, function* () {
                const overpassUrl = 'https://overpass-api.de/api/interpreter';
                const query = `
    [out:json];
    (
      node["place"="city"](around:10000, ${coordinates[0][1]}, ${coordinates[0][0]}); // Latitude, Longitude du premier point
      node["place"="town"](around:10000, ${coordinates[0][1]}, ${coordinates[0][0]});
      // Vous pouvez ajouter d'autres points de coordonnées ici si nécessaire
    );
    out body;
    `;
                const response = yield fetch(`${overpassUrl}?data=${encodeURIComponent(query)}`);
                const data = yield response.json();
                return data.elements; // Cela contient les villes trouvées
            });
        }
    });
}
//# sourceMappingURL=openRouteService.js.map