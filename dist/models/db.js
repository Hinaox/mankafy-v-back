import { Sequelize } from 'sequelize';
import config from '../config/config.js';
import UserModel from './user.js';
import RoleModel from './role.js';
import UserRoleModel from './userRole.js';
const env = process.env.NODE_ENV || 'development';
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
// Définition des relations entre les modèles
db.User.belongsToMany(db.Role, { through: db.UserRole });
db.Role.belongsToMany(db.User, { through: db.UserRole });
export default db;
//# sourceMappingURL=db.js.map