var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "dotenv/config";
import express from "express";
import userRoutes from "./routes/userRoute.js";
import db from "./models/db.js";
import locationRoute from "./routes/locationRoute.js";
import activityRoute from "./routes/activityRoute.js";
import planningRoute from "./routes/planningClientRoute.js";
import tagRoute from "./routes/tagRoute.js";
import chargesRouter from "./routes/chargesRoute.js";
import priceRouter from "./routes/priceRoute.js";
import mapRoute from "./routes/mapRoute.js";
import utilService from "./services/utilService.js";
import activityTypeRouter from "./routes/activityTypeRoute.js";
const app = express();
app.use(express.json()); // Middleware pour gérer les données JSON
// Initialiser les routes
app.use("/planningClient", planningRoute);
app.use("/users", userRoutes);
app.use("/location", locationRoute);
app.use("/activity", activityRoute);
app.use("/tag", tagRoute);
app.use("/charges", chargesRouter);
app.use("/activity", priceRouter);
app.use("/map", mapRoute);
app.use("/activity-types", activityTypeRouter);
// Connexion à la base de données et démarrage du serveur
db.sequelize
    .sync({ alter: true })
    .then(() => {
    console.log("Base de données synchronisée.");
    // creation des données d'origine
    utilService.createDefaultActivityTypes();
    utilService.createDefaultLocation();
    utilService.createDefaultRoles();
    utilService.createDefaultUser();
})
    .catch((error) => {
    console.error("Erreur lors de la synchronisation de la base de données :", error);
});
app.listen(3000, () => {
    console.log("Le serveur écoute sur le port 3000.");
});
// Exemple d'utilisation
(() => __awaiter(void 0, void 0, void 0, function* () {
    const start = [47.492889, -18.908804]; // Exemple coordonnée de départ (Antananarivo)
    const end = [46.940113, -19.896642]; // Exemple coordonnée d'arrivée (Antsirabe)
    const bodyData = JSON.stringify({
        coordinates: [start, end],
        radiuses: [10000, 10000],
    });
    // const route = await getRoute(bodyData);
    // const cityOnRoute = await getCitiesOnRoute(route);
    // console.log("villes:"+cityOnRoute);
    console.log("------------");
}))();
//# sourceMappingURL=index.js.map