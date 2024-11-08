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
                allowNull: true, // Durée de l'activité (exprimée en minutes ou heures)
            },
            durationadvice: {
                type: DataTypes.INTEGER,
                allowNull: true, // Durée de l'activité conseillée (exprimée en minutes ou heures)
                defaultValue: 0,
            },
            link: {
                type: DataTypes.STRING,
                allowNull: true, // Lien vers plus d'informations sur l'activité (site web, etc.)
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true, // Description de l'activité
            },
        }, {
            sequelize,
            modelName: "activity",
            freezeTableName: true,
            hooks: {
                beforeCreate: (activity) => {
                    // Si `durationadvice` n'est pas défini, on le met à la valeur de `duration`
                    if (activity.durationadvice == 0) {
                        activity.durationadvice = activity.duration;
                    }
                },
                beforeUpdate: (activity) => {
                    // Si `durationadvice` est null lors d'une mise à jour, on le remet à `duration`
                    if (activity.durationadvice == 0) {
                        activity.durationadvice = activity.duration;
                    }
                }
            },
        });
    }
}
export default (sequelize) => {
    Activity.initModel(sequelize);
    return Activity;
};
//# sourceMappingURL=activity.js.map