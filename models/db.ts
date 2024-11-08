import { Sequelize, Dialect } from 'sequelize';
import config from '../config/config.js';
import UserModel from './user.js';
import RoleModel from './role.js';
import UserRoleModel from './userRole.js';
import Location from './location.js';
import Activity from './activity.js';
import Photo from './photo.js';
import Price from './price.js'
import Tag from './tag.js';
import ActivityTags from './activitytags.js';

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

db.User = UserModel(sequelize);
db.Role = RoleModel(sequelize);
db.UserRole = UserRoleModel(sequelize);
db.Location = Location(sequelize);
db.Activity = Activity(sequelize);
db.Photo = Photo(sequelize);
db.Price = Price(sequelize);
db.Tag= Tag(sequelize);
db.ActivityTags = ActivityTags(sequelize);

// Définition des relations entre les modèles
db.User.belongsToMany(db.Role, { through: db.UserRole });
db.Role.belongsToMany(db.User, { through: db.UserRole });

// Relation auto-référencée pour Location (un Location peut avoir un parent Location)
db.Location.belongsTo(db.Location, { as: 'parent', foreignKey: 'parentId' });
db.Location.hasMany(db.Location, { as: 'children', foreignKey: 'parentId' });

// Relation entre Activity et Location (une Activity appartient à un Location)
db.Activity.belongsTo(db.Location, { foreignKey: 'locationId' });
db.Location.hasMany(db.Activity, { foreignKey: 'locationId' });

db.Activity.belongsToMany(db.Tag, { through: db.ActivityTags });
db.Tag.belongsToMany(db.Activity, { through: db.ActivityTags });

db.Photo.belongsTo(db.Activity, { foreignKey: 'activityId' });
db.Activity.hasMany(db.Photo, { foreignKey: 'activityId' });

db.Price.belongsTo(db.Activity, { foreignKey: 'activityId' });

export default db;
