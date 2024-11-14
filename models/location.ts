import { Model, DataTypes, Sequelize } from "sequelize";

class Location extends Model {
  public id!: number;
  public name!: string;
  public point_x?: number;
  public point_y?: number;
  public surface!: string;
  public parentId?: number; // id_mere, pour indiquer une relation parent-enfant
  public description?: string;

  // Initialisation du modèle avec Sequelize
  static initModel(sequelize: Sequelize) {
    Location.init(
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
        point_x: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        point_y: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        surface: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        parentId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "location", // Auto-référence pour créer des relations parent-enfant
            key: "id",
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "location",
        freezeTableName: true,
      }
    );
  }
}

export default (sequelize: Sequelize) => {
  Location.initModel(sequelize);
  return Location;
};
