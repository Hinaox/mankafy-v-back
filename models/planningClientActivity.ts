import sequelize from "sequelize";
import { DataTypes, Model, Sequelize } from "sequelize";

class PlanningClientActivity extends Model {
  public id!: number;
  public planningClientId!: number;
  public activityId!: number;
  public dateDebut!: Date;
  public dateFin!: Date;

  static initModel(sequelize: Sequelize) {
    PlanningClientActivity.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        planningClientId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "planningClient",
            key: "id",
          },
        },
        activityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "activity",
            key: "id",
          },
        },
        dateDebut: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        dateFin: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "planningClientActivity",
        freezeTableName: true,
      }
    );
  }
}

export default (sequelize: Sequelize) => {
  PlanningClientActivity.initModel(sequelize);
  return PlanningClientActivity;
};
