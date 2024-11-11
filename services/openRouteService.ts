// openRouteService.ts
import fetch from "node-fetch";
// import polyline from '@mapbox/polyline';

const API_KEY = process.env.ORS_API_KEY || ""; // Remplacez par votre clé API ORS

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
