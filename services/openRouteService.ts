// openRouteService.ts

import {
  existsSync,
  readdir,
  readdirSync,
  readFile,
  readFileSync,
  writeFile,
  writeFileSync,
} from "fs";
import db from "../models/db.js";
import { RouteFetch } from "../models/Route.js";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

// import polyline from '@mapbox/polyline';

export const defaultStartPoint: number[] = [
  47.52113602393204, -18.90332092867509,
];

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

export async function getRoute(bodyData: any) {
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
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getDistanceDurationBetweenActivities(
  activity_id: number,
  another_activity_id: number | null
) {
  // get the coords
  var location1: number[] | null = null;
  var location2: number[] | null = null;
  const activity1 = await db.Activity.findByPk(activity_id);

  if (activity1.point_x && activity1.point_y) {
    location1 = [activity1.point_y, activity1.point_x];
  } else throw "undefined location for activity1";
  if (another_activity_id == null) {
    location2 = defaultStartPoint;
  } else {
    const activity2 = await db.Activity.findByPk(another_activity_id);
    if (activity2.point_x && activity2.point_y) {
      location2 = [activity2.point_y, activity2.point_x];
    } else throw "undefined location for activity2";
  }
  const rechercheCoords = [location1.join(","), location2.join(",")];

  // read saved datas
  const folderPath = path.join(__dirname, "../assets/routes");
  const fileList = readdirSync(folderPath);
  // traitement des fichiers
  const fileListSplited: string[][] = [];
  for (let filename of fileList) {
    try {
      const firstPart = filename.substring(0, filename.lastIndexOf("."));
      const firstPartSplit = firstPart.split(",");

      if (firstPartSplit.length == 4) {
        fileListSplited.push([
          firstPartSplit[0] + "," + firstPartSplit[1],
          firstPartSplit[2] + "," + firstPartSplit[3],
        ]);
      } else throw "incorrect filename for : " + filename;
    } catch (error) {
      console.error(error);
    }
  }

  const fileFound = fileListSplited.find(
    (el) =>
      el.some((anEl) => anEl == rechercheCoords[0]) &&
      el.some((anEl) => anEl == rechercheCoords[1])
  );

  if (fileFound) {
    const fileName = fileFound.join(",") + ".json";
    const fileContent: RouteFetch = JSON.parse(
      readFileSync(path.join(folderPath, fileName)).toString()
    );
    if (fileContent.route?.routes?.length) {
      const retour = fileContent.route.routes[0].summary;
      if (retour) {
        return retour;
      }
    }
  }

  // file not found
  // get from the api
  const coordinates = [location1, location2];
  const bodyData = {
    coordinates: coordinates,
    radiuses: Array(coordinates.length).fill(10000),
  };
  var retour: any = await getRoute(JSON.stringify(bodyData));
  retour = { route: retour };
  console.log("retour", retour);

  if (retour) {
    if (retour.route?.routes?.length) {
      const summary = retour.route.routes[0].summary;
      if (summary) {
        // save file first
        const fileName = bodyData.coordinates.join(",") + ".json";
        const filePath = path.join(folderPath, fileName);
        writeFileSync(filePath, JSON.stringify(retour));
        return summary;
      }
    }
  }

  return null;
}
