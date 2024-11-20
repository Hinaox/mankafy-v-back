import { DataTypes, Model, Sequelize } from "sequelize";

class PlanningClient extends Model {
  public id!: number;
  public userId!: number;
  public dateDepart!: Date;
  public dateRetour!: Date;
  public isActive!: Boolean;
  public peopleNumber!: number;
  public locationId!: number;

  static initModel(sequelize: Sequelize) {
    PlanningClient.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
        dateDepart: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        dateRetour: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        peopleNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        locationId: {
          type: DataTypes.INTEGER,
          references: {
            model: "location",
            key: "id",
          },
        },
      },
      {
        sequelize,
        modelName: "planningClient",
        freezeTableName: true,
      }
    );
  }
}

export default (sequelize: Sequelize) => {
  PlanningClient.initModel(sequelize);
  return PlanningClient;
};
