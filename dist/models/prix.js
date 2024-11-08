// Dans le fichier prix.ts
import { Model, DataTypes } from "sequelize";
class Prix extends Model {
    static initModel(sequelize) {
        Prix.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            activityId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "activity", // Nom du modèle cible
                    key: "id",
                },
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            value: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: "prix",
            freezeTableName: true,
            timestamps: true,
        });
    }
    static associate(models) {
        // Relation avec le modèle Activity
        Prix.belongsTo(models.Activity, { foreignKey: "activityId" });
    }
}
export default (sequelize) => {
    Prix.initModel(sequelize);
    return Prix;
};
//# sourceMappingURL=prix.js.map