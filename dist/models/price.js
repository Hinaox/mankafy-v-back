// Dans le fichier prix.ts
import { Model, DataTypes } from "sequelize";
class Price extends Model {
    static initModel(sequelize) {
        Price.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            activityId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'activity', // Nom du modèle cible
                    key: 'id',
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
            rating: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: 'price',
            freezeTableName: true,
            timestamps: true,
        });
    }
}
export default (sequelize) => {
    Price.initModel(sequelize);
    return Price;
};
//# sourceMappingURL=price.js.map