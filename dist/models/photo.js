// Dans le fichier photo.ts
import { Model, DataTypes } from 'sequelize';
class Photo extends Model {
    static initModel(sequelize) {
        Photo.init({
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
        }, {
            sequelize,
            modelName: 'photo',
            freezeTableName: true,
            timestamps: true,
        });
    }
    static associate(models) {
        // Relation avec le modèle Activity
        Photo.belongsTo(models.Activity, { foreignKey: 'activityId' });
    }
}
export default (sequelize) => {
    Photo.initModel(sequelize);
    return Photo;
};
//# sourceMappingURL=photo.js.map