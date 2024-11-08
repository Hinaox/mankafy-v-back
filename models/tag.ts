import { Model, DataTypes, Sequelize } from 'sequelize';

class Tag extends Model {
    public id!: number;
    public name!: string;

    static initModel(sequelize: Sequelize) {
        Tag.init(
            {
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
            },
            {
                sequelize,
                modelName: 'tag',
                timestamps: false,
                freezeTableName: true,
            }
        );
    }
}

export default (sequelize: Sequelize) => {
    Tag.initModel(sequelize);
    return Tag;
};
