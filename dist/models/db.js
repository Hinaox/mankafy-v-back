import { Sequelize } from 'sequelize';
import config from '../config/config.js';
import UserModel from './user.js';
import RoleModel from './role.js';
import UserRoleModel from './userRole.js';
import Location from './location.js';
import Activity from './activity.js';
import Photo from './photo.js';
import Prix from './prix.js';
const conf = config.development;
// Initialisation de Sequelize avec les paramètres de configuration
const sequelize = new Sequelize(conf.database, conf.username, conf.password, {
    host: conf.host,
    dialect: conf.dialect,
});
const db = {};
// Ajout des modèles à l'objet db
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = UserModel(sequelize);
db.Role = RoleModel(sequelize);
db.UserRole = UserRoleModel(sequelize);
db.Location = Location(sequelize);
db.Activity = Activity(sequelize);
db.Phto = Photo(sequelize);
db.Prix = Prix(sequelize);
// Définition des relations entre les modèles
db.User.belongsToMany(db.Role, { through: db.UserRole });
db.Role.belongsToMany(db.User, { through: db.UserRole });
// Relation auto-référencée pour Location (un Location peut avoir un parent Location)
db.Location.belongsTo(db.Location, { as: 'parent', foreignKey: 'parentId' });
db.Location.hasMany(db.Location, { as: 'children', foreignKey: 'parentId' });
// Relation entre Activity et Location (une Activity appartient à un Location)
db.Activity.belongsTo(db.Location, { foreignKey: 'locationId' });
db.Location.hasMany(db.Activity, { foreignKey: 'locationId' });
export default db;
//# sourceMappingURL=db.js.map