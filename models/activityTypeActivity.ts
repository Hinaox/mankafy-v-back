import { DataTypes, Model, Sequelize } from "sequelize";

class ActivityTypeActivity extends Model {
  public id!: number;
  public activityId!: number;
  public activityTypeId!: number;

  static initModel(sequelize: Sequelize) {
    ActivityTypeActivity.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        activityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "activity",
            key: "id",
          },
        },
        activityTypeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "activityType",
            key: "id",
          },
        },
      },
      {
        sequelize,
        modelName: "activityTypeActivity",
        freezeTableName: true,
      }
    );
  }
}

export default (sequelize: Sequelize) => {
  ActivityTypeActivity.initModel(sequelize);
  return ActivityTypeActivity;
};
