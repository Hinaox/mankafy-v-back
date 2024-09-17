import express from 'express';
import userRoutes from "./routes/userRoutes.js";
import db from './models/db.js';
const app = express();
app.use(express.json()); // Middleware pour gérer les données JSON
// Initialiser les routes
app.use('/users', userRoutes);
// Connexion à la base de données et démarrage du serveur
db.sequelize.sync({ alter: true })
    .then(() => {
    console.log('Base de données synchronisée.');
})
    .catch((error) => {
    console.error('Erreur lors de la synchronisation de la base de données :', error);
});
app.listen(3000, () => {
    console.log('Le serveur écoute sur le port 3000.');
});
//# sourceMappingURL=index.js.map