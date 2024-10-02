// Dans le fichier prix.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

class Prix extends Model {
    public id!: number;
    public activityId!: number;
    public name!: string;
    public value!: number;
    public description?: string;

    static initModel(sequelize: Sequelize) {
        Prix.init(
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
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize,
                modelName: 'prix',
                freezeTableName: true,
                timestamps: true,
            }
        );
    }

    static associate(models: any) {
        // Relation avec le modèle Activity
        Prix.belongsTo(models.Activity, { foreignKey: 'activityId' });
    }
}

export default (sequelize: Sequelize) => {
    Prix.initModel(sequelize);
    return Prix;
};
