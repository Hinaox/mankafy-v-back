import { Model, DataTypes, Sequelize } from 'sequelize';

class Role extends Model {
    public id!: number;
    public name!: string;

    static initModel(sequelize: Sequelize) {
        Role.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },
            },
            {
                sequelize,
                modelName: 'roles',
                timestamps: false, // Si tu ne veux pas de `createdAt` et `updatedAt`
            }
        );
    }
}

export default (sequelize: Sequelize) => {
    Role.initModel(sequelize);
    return Role;
};
