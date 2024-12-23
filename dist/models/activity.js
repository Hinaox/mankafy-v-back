import { Model, DataTypes } from "sequelize";
class Activity extends Model {
    // Initialisation du modèle avec Sequelize
    static initModel(sequelize) {
        Activity.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            locationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "location", // Référence au modèle `Location` pour lier une activité à un lieu
                    key: "id",
                },
            },
            point_x: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            point_y: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            duration: {
                type: DataTypes.INTEGER,
                allowNull: true, // Durée de l'activité (secondes)
            },
            minDuration: {
                type: DataTypes.INTEGER,
                allowNull: true, // Durée minimale de l'activité (secondes)
            },
            openingTime: {
                type: DataTypes.TIME,
                allowNull: true,
            },
            closingTime: {
                type: DataTypes.TIME,
                allowNull: true,
            },
            link: {
                type: DataTypes.STRING,
                allowNull: true, // Lien vers plus d'informations sur l'activité (site web, etc.)
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true, // Description de l'activité
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true, // image de l'activité
            },
            activityTypeId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "activityType",
                    key: "id",
                },
            },
        }, {
            sequelize,
            modelName: "activity",
            freezeTableName: true,
        });
    }
}
export default (sequelize) => {
    Activity.initModel(sequelize);
    return Activity;
};
//# sourceMappingURL=activity.js.map