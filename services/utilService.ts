import db from "../models/db.js";

class UtilService {
  public async createDefaultLocation() {
    const defaultLocations = [
      {
        name: "Sud",
        point_x: -21.45068342642904,
        point_y: 47.09227972592077,
      },
      {
        name: "Est",
        point_x: -18.145946547444964,
        point_y: 49.39481378536066,
      },
    ];

    const savedLocations = await this.getLocations();

    for (let location of defaultLocations) {
      if (!savedLocations.some((el) => el.name == location.name)) {
        // enregistrer
        db.Location.create(location);
      }
    }
  }

  public async createDefaultActivityTypes() {
    console.log("create default activity types");
    const defaultActivities = ["restaurant", "breakPoint", "activity"];

    try {
      const savedActivities = await this.getActivityTypes();
      for (let typeDefault of defaultActivities) {
        if (!savedActivities.some((el: any) => el.name == typeDefault)) {
          // enregistrer
          await db.ActivityType.create({ name: typeDefault });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async createDefaultRoles() {
    console.log("create Default roles");
    const defaultRoles = ["admin"];

    try {
      const savedRoles = await db.Role.findAll();

      for (let role of defaultRoles) {
        if (!savedRoles.some((el: any) => el.name == role)) {
          const retour = await db.Role.create({ name: role });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async createDefaultUser() {
    const admin = {
      username: "mankafyadmin",
      email: "mankafyadmin@gmail.com",
      password: "comaesta",
      firstName: "Mankafy",
      lastName: "Admin",
    };
    // verification de l'existence de l'admin
    var userFound = await db.User.findOne({
      where: { username: "mankafyadmin" },
    });

    if (!userFound) {
      // création d'un nouvel admin
      const newAdmin = (await db.User.create(admin)).dataValues;
      userFound = newAdmin;
    }
    // attribution du role d'admin
    // verification si l'utilisateur possède le rôle admin
    const adminRole = (await db.Role.findOne({ where: { name: "admin" } }))
      .dataValues;
    const userRole = await db.UserRole.findOne({
      where: { userId: userFound.id, roleId: adminRole.id },
    });
    if (!userRole) {
      await db.UserRole.create({ userId: userFound.id, roleId: adminRole.id });
    }
  }

  public getActivityTypes(): Promise<
    { id: number; name: string; createdAt: Date; updatedAt: Date }[]
  > {
    return db.ActivityType.findAll();
  }

  public getLocations(): Promise<
    {
      id: number;
      name: string;
      point_x: number;
      point_y: number;
      surface: string;
      parentId: number;
      description: string;
      createdAt: Date;
      updatedAt: string;
    }[]
  > {
    return db.Location.findAll();
  }
}

export default new UtilService();
