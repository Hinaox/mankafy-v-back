import { Model, DataTypes, Sequelize } from 'sequelize';

class UserRole extends Model {
    public userId!: number;
    public roleId!: number;

    static initModel(sequelize: Sequelize) {
        UserRole.init(
            {
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'User', // Nom du modèle cible
                        key: 'id', // Clé étrangère sur le modèle `User`
                    },
                },
                roleId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'Role', // Nom du modèle cible
                        key: 'id', // Clé étrangère sur le modèle `Role`
                    },
                },
            },
            {
                sequelize,
                modelName: 'userroles',
                timestamps: false, // Si tu ne veux pas de `createdAt` et `updatedAt`
            }
        );
    }
}

export default (sequelize: Sequelize) => {
    UserRole.initModel(sequelize);
    return UserRole;
};
