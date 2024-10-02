// Dans le fichier photo.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

class Photo extends Model {
    public id!: number;
    public activityId!: number;
    public url!: string;

    static initModel(sequelize: Sequelize) {
        Photo.init(
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
                url: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: 'photo',
                freezeTableName: true,
                timestamps: true,
            }
        );
    }

    static associate(models: any) {
        // Relation avec le modèle Activity
        Photo.belongsTo(models.Activity, { foreignKey: 'activityId' });
    }
}

export default (sequelize: Sequelize) => {
    Photo.initModel(sequelize);
    return Photo;
};
