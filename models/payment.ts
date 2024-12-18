import { Model, DataTypes, Sequelize } from "sequelize";

class Payment extends Model {
  public id!: number;
  public accountNumber !: string;
  public accountName!: number;
  public transactionRef!: number;
  public facturationAdress!: string;
  public paymentMethod!: number; 
  public planningClientId!: string;
  public paymentStatus?: string;

  // Initialisation du modèle avec Sequelize
  static initModel(sequelize: Sequelize) {
    Payment.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        accountNumber: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        accountName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        transactionRef: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        facturationAdress: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        paymentMethod: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        planningClientId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "planningClient", // Auto-référence pour créer des relations parent-enfant
            key: "id",
          },
        },
        paymentStatus: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "payment",
        freezeTableName: true,
        timestamps: true,
      }
    );
  }
}

export default (sequelize: Sequelize) => {
  Payment.initModel(sequelize);
  return Payment;
};
