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
import fetch from "node-fetch";
// import polyline from '@mapbox/polyline';
const API_KEY = process.env.ORS_API_KEY || ""; // Remplacez par votre clé API ORS
export function getRoute(bodyData) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://api.openrouteservice.org/v2/directions/driving-car/json`;
        try {
            const response = yield fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
                    Authorization: API_KEY,
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: bodyData,
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
//# sourceMappingURL=openRouteService.js.map