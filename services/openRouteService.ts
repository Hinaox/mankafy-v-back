// openRouteService.ts

import { existsSync, readFile, readFileSync } from "fs";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

// import polyline from '@mapbox/polyline';

const API_KEY = process.env.ORS_API_KEY || ""; // Remplacez par votre clé API ORS

const __filename = fileURLToPath(import.meta.url);
// Obtenir le répertoire du fichier actuel
const __dirname = path.dirname(__filename);

export function getRouteLocally(fileName: string): string | null {
  const filePath = path.join(__dirname, "../assets/routes/", fileName);
  if (existsSync(filePath)) {
    return readFileSync(filePath).toString();
  }
  return null;
}

export async function getRoute(bodyData: string) {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car/json`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept:
          "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
        Authorization: API_KEY,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: bodyData,
    });
    const data: any = await response.json();
    // const encodedPolyline = data.routes[0].geometry;
    // const decodedPolyline = polyline.decode(encodedPolyline);
    // console.log(decodedPolyline);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
