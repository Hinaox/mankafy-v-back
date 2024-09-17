import { Model, DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
    public username!: string;
    public email!: string;
    public password!: string;
    public firstName?: string;
    public lastName?: string;
    public profilPic?: string;
    public isActive!: boolean;

    // Méthode pour hasher le mot de passe
    static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    // Initialisation du modèle avec Sequelize
    static initModel(sequelize: Sequelize) {
        User.init(
            {
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
                profilPict: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                isActive: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                },
            },
            {
                sequelize,
                modelName: 'users',
                hooks: {
                    beforeCreate: async (user: User) => {
                        user.password = await User.hashPassword(user.password);
                    },
                },
            }
        );
    }

    // Méthode pour vérifier le mot de passe
    public async checkPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

export default (sequelize: Sequelize) => {
    User.initModel(sequelize);
    return User;
};
