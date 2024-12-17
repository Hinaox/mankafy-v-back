import sequelize from "sequelize";
import { DataTypes, Model, Sequelize } from "sequelize";

class RouteDigraphChild extends Model {
  public id!: number;
  public routeDigraphId!: number;
  public childId!: number;

  static initModel(sequelize: Sequelize) {
    RouteDigraphChild.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        routeDigraphId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "routeDigraph",
            key: "id",
          },
        },
        childId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "routeDigraph",
            key: "id",
          },
        },
      },
      { sequelize, modelName: "routeDigraphChild", freezeTableName: true }
    );
  }
}

export default (sequelize: Sequelize) => {
  RouteDigraphChild.initModel(sequelize);
  return RouteDigraphChild;
};
