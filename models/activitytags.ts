import { Model, DataTypes, Sequelize } from "sequelize";

class ActivityTags extends Model {
  public activityId!: number;
  public tagId!: number;

  static initModel(sequelize: Sequelize) {
    ActivityTags.init(
      {
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
      },
      {
        sequelize,
        modelName: "activitytags",
        timestamps: false, // Pas de `createdAt` et `updatedAt`
        freezeTableName: true,
      }
    );
  }
}

export default (sequelize: Sequelize) => {
  ActivityTags.initModel(sequelize);
  return ActivityTags;
};
