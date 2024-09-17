import { Model, DataTypes } from 'sequelize';
class Role extends Model {
    static initModel(sequelize) {
        Role.init({
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
        }, {
            sequelize,
            modelName: 'roles',
            timestamps: false, // Si tu ne veux pas de `createdAt` et `updatedAt`
        });
    }
}
export default (sequelize) => {
    Role.initModel(sequelize);
    return Role;
};
//# sourceMappingURL=role.js.map