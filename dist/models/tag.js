import { Model, DataTypes } from 'sequelize';
class Tag extends Model {
    static initModel(sequelize) {
        Tag.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true, // Assure que les tags sont uniques
            },
        }, {
            sequelize,
            modelName: 'tag',
            timestamps: false,
            freezeTableName: true,
        });
    }
}
export default (sequelize) => {
    Tag.initModel(sequelize);
    return Tag;
};
//# sourceMappingURL=tag.js.map