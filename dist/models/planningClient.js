import { DataTypes, Model } from "sequelize";
class PlanningClient extends Model {
    static initModel(sequelize) {
        PlanningClient.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            dateDepart: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            dateRetour: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: "planningClient",
            freezeTableName: true,
        });
    }
}
export default (sequelize) => {
    PlanningClient.initModel(sequelize);
    return PlanningClient;
};
//# sourceMappingURL=planningClient.js.map