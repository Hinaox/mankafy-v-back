import { DataTypes, Model, Sequelize } from "sequelize";

class ActivityType extends Model {
  public id!: number;
  public name!: string;

  static initModel(sequelize: Sequelize) {
    ActivityType.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      { sequelize, modelName: "activityType", freezeTableName: true }
    );
  }
}

export default (sequelize: Sequelize) => {
  ActivityType.initModel(sequelize);
  return ActivityType;
};
