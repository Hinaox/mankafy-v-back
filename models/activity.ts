import { Model, DataTypes, Sequelize } from "sequelize";

class Activity extends Model {
  public id!: number;
  public name!: string;
  public locationId!: number;
  public point_x!: number;
  public point_y!: number;
  public duration!: number; // Durée en minutes ou en heures
  public link?: string;
  public description?: string;

  // Initialisation du modèle avec Sequelize
  static initModel(sequelize: Sequelize) {
    Activity.init(
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
        link: {
          type: DataTypes.STRING,
          allowNull: true, // Lien vers plus d'informations sur l'activité (site web, etc.)
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true, // Description de l'activité
        },
      },
      {
        sequelize,
        modelName: "activity",
        freezeTableName: true,
      }
    );
  }
}

export default (sequelize: Sequelize) => {
  Activity.initModel(sequelize);
  return Activity;
};
