// Dans le fichier prix.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

class Price extends Model {
    public id!: number;
    public activityId!: number;
    public name!: string;
    public value!: number;
    public capacity?: number;
    public rating?: number;
    public description?: string;

    static initModel(sequelize: Sequelize) {
        Price.init(
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
                        model: 'activity', // Nom du modèle cible
                        key: 'id',
                    },
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                value: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                rating: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                capacity: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize,
                modelName: 'price',
                freezeTableName: true,
                timestamps: true,
            }
        );
    }

    // static associate(models: any) {
    //     // Relation avec le modèle Activity
    //     Price.belongsTo(models.Activity, { foreignKey: 'activityId' });
    // }
}

export default (sequelize: Sequelize) => {
    Price.initModel(sequelize);
    return Price;
};
