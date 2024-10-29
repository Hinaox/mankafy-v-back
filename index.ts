import "dotenv/config";
import express, { Application } from "express";
import userRoutes from "./routes/userRoute.js";
import db from "./models/db.js";
import locationRoute from "./routes/locationRoute.js";
import activityRoute from "./routes/activityRoute.js";
import planningRoute from "routes/planningClientRoute.js";

const app: Application = express();

app.use(express.json()); // Middleware pour gérer les données JSON

// Initialiser les routes
app.use("/planningClient", planningRoute);
app.use("/users", userRoutes);
app.use("/location", locationRoute);
app.use("/activity", activityRoute);

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
