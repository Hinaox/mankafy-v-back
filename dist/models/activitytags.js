import { Model, DataTypes } from "sequelize";
class ActivityTags extends Model {
    static initModel(sequelize) {
        ActivityTags.init({
            activityId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "activity", // Nom du modèle `Activity`
                    key: "id", // Clé étrangère sur le modèle `Activity`
                },
            },
            tagId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "tag", // Nom du modèle `Tag`
                    key: "id", // Clé étrangère sur le modèle `Tag`
                },
            },
        }, {
            sequelize,
            modelName: "activityTags",
            timestamps: false, // Pas de `createdAt` et `updatedAt`
            freezeTableName: true,
        });
    }
}
export default (sequelize) => {
    ActivityTags.initModel(sequelize);
    return ActivityTags;
};
//# sourceMappingURL=activityTags.js.map