import db from "../models/db.js";

export default class RouteDigraphService {
  public static async findByLocation(locationId: number) {
    const routeDigraphs = await db.RouteDigraph.findAll({
      where: { parentLocationId: locationId, inTheLead: true },
    });
    const retour: any[] = [];

    if (routeDigraphs) {
      for (let element of routeDigraphs) {
        try {
          const id = element.id;
          retour.push(await this.find(id));
        } catch (error) {
          console.error(error);
        }
      }
    }

    return retour;
  }

  public static async find(id: number) {
    const retour: any = await db.RouteDigraph.findByPk(id, {
      include: { model: db.Location, foreignKey: "locationId" },
    });

    // find children
    const children = await this.findChildren(id);

    retour.dataValues.children = children;
    return retour;
  }

  private static async findChildren(parentId: number) {
    const retour: any[] = [];
    const routeGraphChildren = await db.RouteDigraphChild.findAll({
      where: { routeDigraphId: parentId },
    });
    if (routeGraphChildren) {
      for (let element of routeGraphChildren) {
        try {
          if (!element.childId)
            throw `undefined childId in routeGraphChild(${element.id})`;
          retour.push(await this.find(element.childId));
        } catch (error) {
          console.error(error);
        }
      }
    }
    return retour;
  }
}
