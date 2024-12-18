import path from "path";
import db from "../models/db.js";
import { defaultStartPoint, getRoute, __dirname } from "./openRouteService.js";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { RouteFetch } from "models/Route.js";

export class LocationModel {
  public id?: number;
  public name?: string;
  public point_x?: number;
  public point_y?: number;
  public surface?: string;
  public parentId?: number;
  public description?: string;
  public image?: string;
}

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

export class LocationService {
  public static async getDistanceDurationBetweenLocations(
    location1: LocationModel,
    location2: LocationModel | null
  ) {
    const routeFetch: RouteFetch =
      await LocationService.getRouteBetweenLocations(location1, location2);
    if (
      routeFetch.route?.routes?.length &&
      routeFetch.route.routes[0].summary
    ) {
      return routeFetch.route.routes[0].summary;
    } else throw "invalid response routeData";
  }

  public static async getRouteBetweenLocations(
    location1: LocationModel,
    location2: LocationModel | null
  ) {
    if (
      location1.point_x == null ||
      location1.point_x == undefined ||
      location1.point_y == null ||
      location1.point_y == undefined
    )
      throw "undefined location1 coords";
    if (location2 != null && (!location2.point_x || !location2.point_y))
      throw "undefined location2 coords";
    const coord1: number[] = [location1.point_y, location1.point_x];
    var coord2: number[] = defaultStartPoint;
    if (location2 && location2.point_x && location2.point_y)
      coord2 = [location2.point_y, location2.point_x];

    // try to get the routes locally
    const localRoute = this.getRouteLocally(coord1, coord2);
    if (localRoute) {
      // correction de la durée
      if (
        localRoute.route?.routes?.length &&
        localRoute.route.routes[0].summary?.duration
      ) {
        localRoute.route.routes[0].summary.duration *= 1.35;
      }
      return localRoute;
    }

    // else, get the route by api
    const fetchRoute = await this.findRouteOnline(coord1, coord2);
    // correction de la durée
    if (
      fetchRoute.route?.routes?.length &&
      fetchRoute.route.routes[0].summary?.duration
    ) {
      fetchRoute.route.routes[0].summary.duration *= 1.35;
    }
    return fetchRoute;
  }

  public static getRouteLocally(coord1: number[], coord2: number[]) {
    const rechercheCoords = [coord1.join(","), coord2.join(",")];
    const folderPath = path.join(__dirname, "../assets/routes");
    if (existsSync(folderPath)) {
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
        return fileContent;
      }
    }
    return null;
  }

  public static async findRouteOnline(coord1: number[], coord2: number[]) {
    const coordinates = [coord1, coord2];
    const bodyData = {
      coordinates: coordinates,
      radiuses: Array(coordinates.length).fill(10000),
    };
    var retour: any = await getRoute(JSON.stringify(bodyData));
    retour = { route: retour };

    this.saveRoute(coord1, coord2, retour);
    return retour;
  }

  public static async saveRoute(
    coord1: number[],
    coord2: number[],
    data: RouteFetch
  ) {
    const coordinates = [coord1, coord2];
    const folderPath = path.join(__dirname, "../assets/routes");
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true });
    }
    const fileName = coordinates.join(",") + ".json";
    const filePath = path.join(folderPath, fileName);
    writeFileSync(filePath, JSON.stringify(data));
  }
}
