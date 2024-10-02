var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
class User extends Model {
    // Méthode pour hasher le mot de passe
    static hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt.hash(password, 10);
        });
    }
    // Initialisation du modèle avec Sequelize
    static initModel(sequelize) {
        User.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            profilPic: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        }, {
            sequelize,
            modelName: 'users',
            hooks: {
                beforeCreate: (user) => __awaiter(this, void 0, void 0, function* () {
                    user.password = yield User.hashPassword(user.password);
                }),
            },
        });
    }
    // Méthode pour vérifier le mot de passe
    checkPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt.compare(password, this.password);
        });
    }
}
export default (sequelize) => {
    User.initModel(sequelize);
    return User;
};
//# sourceMappingURL=user.js.map