import { Model, DataTypes } from "sequelize";
class Location extends Model {
    // Initialisation du modèle avec Sequelize
    static initModel(sequelize) {
        Location.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            point_x: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            point_y: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            surface: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            parentId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "location", // Auto-référence pour créer des relations parent-enfant
                    key: "id",
                },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: "location",
            freezeTableName: true,
        });
    }
}
export default (sequelize) => {
    Location.initModel(sequelize);
    return Location;
};
//# sourceMappingURL=location.js.map