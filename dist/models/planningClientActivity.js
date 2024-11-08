import { DataTypes, Model } from "sequelize";
class PlanningClientActivity extends Model {
    static initModel(sequelize) {
        PlanningClientActivity.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            planningClientId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "planningClient",
                    key: "id",
                },
            },
            activityId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "activity",
                    key: "id",
                },
            },
            dateDebut: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            dateFin: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: "planningClientActivity",
            freezeTableName: true,
        });
    }
}
export default (sequelize) => {
    PlanningClientActivity.initModel(sequelize);
    return PlanningClientActivity;
};
//# sourceMappingURL=planningClientActivity.js.map