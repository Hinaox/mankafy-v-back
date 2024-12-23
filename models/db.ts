import { Sequelize, Dialect } from "sequelize";
import config from "../config/config.js";
import UserModel from "./user.js";
import RoleModel from "./role.js";
import UserRoleModel from "./userRole.js";
import Location from "./location.js";
import Activity from "./activity.js";
import Photo from "./photo.js";
import Price from "./price.js";
import PlanningClient from "./planningClient.js";
import planningClientActivity from "./planningClientActivity.js";
import activityType from "./activityType.js";
import tag from "./tag.js";
import activityTags from "./activitytags.js";
import payment from "./payment.js";
import RouteDigraph from "./RouteDigraph.js";
import RouteDigraphChild from "./RouteDigraphChild.js";

const conf = config.development;

// Initialisation de Sequelize avec les paramètres de configuration
const sequelize = new Sequelize(conf.database, conf.username, conf.password, {
  host: conf.host,
  dialect: conf.dialect as Dialect,
});

const db: any = {};

// Ajout des modèles à l'objet db
db.Sequelize = Sequelize;
db.sequelize = sequelize;

try {
  console.log("Creation des modeles");
  db.User = UserModel(sequelize);
  db.Role = RoleModel(sequelize);
  db.UserRole = UserRoleModel(sequelize);
  db.Location = Location(sequelize);
  db.Activity = Activity(sequelize);
  db.Phto = Photo(sequelize);
  db.Price = Price(sequelize);
  db.PlanningClient = PlanningClient(sequelize);
  db.PlanningClientActivity = planningClientActivity(sequelize);
  db.ActivityType = activityType(sequelize);
  db.Tag = tag(sequelize);
  db.ActivityTags = activityTags(sequelize);
  db.Payment = payment(sequelize);
  db.RouteDigraph = RouteDigraph(sequelize);
  db.RouteDigraphChild = RouteDigraphChild(sequelize);

  // Définition des relations entre les modèles
  db.User.belongsToMany(db.Role, { through: db.UserRole });
  db.Role.belongsToMany(db.User, { through: db.UserRole });

  // Relation auto-référencée pour Location (un Location peut avoir un parent Location)
  db.Location.belongsTo(db.Location, { as: "parent", foreignKey: "parentId" });
  db.Location.hasMany(db.Location, { as: "children", foreignKey: "parentId" });

  // Relation entre Activity et Location (une Activity appartient à un Location)
  db.Activity.belongsTo(db.Location, { foreignKey: "locationId" });
  db.Location.hasMany(db.Activity, { foreignKey: "locationId" });

  // Relation PlanningClient et User (Un PlanningClient appartient à un User)
  db.PlanningClient.belongsTo(db.User, { foreignKey: "userId" });
  db.User.hasMany(db.PlanningClient, { foreignKey: "userId" });

  //Relation Price
  db.Price.belongsTo(db.Activity, { foreignKey: "activityId" });
  db.Activity.hasMany(db.Price, { foreignKey: "activityId" });

  // Relation userRole et role
  db.UserRole.belongsTo(db.Role, { foreignKey: "roleId" });
  db.Role.hasMany(db.UserRole, { forignKey: "roleId" });

  // relation activity et activity tags
  db.ActivityTags.belongsTo(db.Activity, { foreignKey: "activityId" });
  db.Activity.hasMany(db.ActivityTags, { foreignKey: "activityId" });

  // relation tag et activityTags
  db.ActivityTags.belongsTo(db.Tag, { foreignKey: "tagId" });
  db.Tag.hasMany(db.ActivityTags, { foreignKey: "tagId" });

  // relation activity et activityType
  db.Activity.belongsTo(db.ActivityType, { foreignKey: "activityTypeId" });
  db.ActivityType.hasMany(db.Activity, { foreignKey: "activityTypeId" });

  // relation planningClient et location
  db.PlanningClient.belongsTo(db.Location, { foreignKey: "locationId" });
  db.Location.hasMany(db.PlanningClient, { foreignKey: "locationId" });

  //relation paiement et user
  db.Payment.belongsTo(db.PlanningClient, { foreignKey: "planningClientId"});
  db.PlanningClient.hasMany(db.Payment,{foreignKey:"planningClientId"});
  // relation routeDigraph et routeDigraphChild
  db.RouteDigraphChild.belongsTo(db.RouteDigraph, {
    foreignKey: "routeDigraphId",
  });
  db.RouteDigraph.hasMany(db.RouteDigraphChild, {
    foreignKey: "routeDigraphId",
  });
  db.RouteDigraphChild.belongsTo(db.RouteDigraph, {
    foreignKey: "childId",
  });
  db.RouteDigraph.hasMany(db.RouteDigraphChild, {
    foreignKey: "childId",
  });

  // relation routeDigraph et location
  db.RouteDigraph.belongsTo(db.Location, { foreignKey: "parentLocationId" });
  db.Location.hasMany(db.RouteDigraph, { foreignKey: "parentLocationId" });
  db.RouteDigraph.belongsTo(db.Location, { foreignKey: "locationId" });
  db.Location.hasMany(db.RouteDigraph, { foreignKey: "locationId" });
} catch (error) {
  console.error(error);
}

export default db;
