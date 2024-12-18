import { DataTypes, Model, Sequelize } from "sequelize";

class RouteDigraph extends Model {
  public id!: number;
  public name!: string;
  public locationId!: number;
  public parentLocationId?: number;
  public inTheLead?: boolean;
  // not db field
  public children?: RouteDigraph[];

  static initModel(sequelize: Sequelize) {
    RouteDigraph.init(
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
        locationId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "location",
            key: "id",
          },
        },
        inTheLead: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        parentLocationId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "location",
            key: "id",
          },
        },
      },
      { sequelize, modelName: "routeDigraph", freezeTableName: true }
    );
  }
}

export default (sequelize: Sequelize) => {
  RouteDigraph.initModel(sequelize);
  return RouteDigraph;
};
