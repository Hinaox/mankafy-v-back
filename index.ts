import "dotenv/config";
import express, { Application } from "express";
import userRoutes from "./routes/userRoute.js";
import db from "./models/db.js";
import locationRoute from "./routes/locationRoute.js";
import activityRoute from "./routes/activityRoute.js";
import planningRoute from "./routes/planningClientRoute.js";
import { generateCompletion } from './chatbot/chatbot.js';
import tagRoute from './routes/tagRoute.js';
import chargesRouter from './routes/chargesRoute.js';
import priceRouter from './routes/priceRoute.js';
import { getRoute } from './services/openRouteService.js';
import mapRoute from './routes/mapRoute.js';

const app: Application = express();

app.use(express.json()); // Middleware pour gérer les données JSON

// Initialiser les routes
app.use("/planningClient", planningRoute);
app.use("/users", userRoutes);
app.use("/location", locationRoute);
app.use("/activity", activityRoute);
app.use('/tag', tagRoute);
app.use('/charges', chargesRouter);
app.use('/activity', priceRouter);
app.use('/map', mapRoute);

// Connexion à la base de données et démarrage du serveur
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Base de données synchronisée.");
  })
  .catch((error: Error) => {
    console.error(
      "Erreur lors de la synchronisation de la base de données :",
      error
    );
  });

app.listen(3000, () => {
  console.log("Le serveur écoute sur le port 3000.");
});

// Exemple d'utilisation
(async () => {
    const start = [47.492889, -18.908804]; // Exemple coordonnée de départ (Antananarivo)
    const end = [46.940113, -19.896642];   // Exemple coordonnée d'arrivée (Antsirabe)
    const bodyData = JSON.stringify({
        coordinates: [start, end],
        radiuses: [10000, 10000]
    });
    const route = await getRoute(bodyData);
    console.log(route);

    // const cityOnRoute = await getCitiesOnRoute(route); 
    // console.log("villes:"+cityOnRoute);
    console.log('------------');
})();

