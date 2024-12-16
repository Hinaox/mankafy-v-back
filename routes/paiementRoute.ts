import { Router } from 'express';
import { readPaiements, addPaiement, updatePaiement, deletePaiement } from '../services/paiementService.js';

const paiementRouter = Router();

// Lire tous les paiements
paiementRouter.get('/', (req, res) => {
    try {
        const paiements = readPaiements();
        res.status(200).json(paiements);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// // Lire un paiement spécifique avec un chemin dynamique
// paiementRouter.get('/:path', (req, res) => {
//     const path = req.params.path.replace(/_/g, '.'); // Remplace les underscores par des points pour la syntaxe de chemin
//     try {
//         const paiement = readPaiements();
//         const specificPaiement = path.split('.').reduce((acc, key) => acc && acc[key], paiement);

//         if (specificPaiement) {
//             res.status(200).json(specificPaiement);
//         } else {
//             res.status(404).json({ error: `Paiement not found at path: ${path}` });
//         }
//     } catch (error: any) {
//         res.status(400).json({ error: error.message });
//     }
// });
paiementRouter.get('/:name', (req, res) => {
    const name = req.params.name; // Nom du moyen de paiement
    try {
        const paiements = readPaiements(); // Fonction pour lire le fichier JSON
        if (!paiements || !Array.isArray(paiements)) {
            return res.status(500).json({ error: "Paiements data is invalid or not an array." });
        }

        const paiement = paiements.find(p => p.name.toLowerCase() === name.toLowerCase()); // Recherche insensible à la casse

        if (paiement) {
            res.status(200).json(paiement);
        } else {
            res.status(404).json({ error: `Paiement not found: ${name}` });
        }
    } catch (error) {
        console.error("Error reading paiements:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});

// Ajouter un nouveau paiement
paiementRouter.post('/', (req, res) => {
    const { path, paiementData } = req.body;
    try {
        const updatedPaiements = addPaiement(path, paiementData);
        res.status(201).json(updatedPaiements);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Modifier un paiement existant
paiementRouter.put('/:path', (req, res) => {
    const path = req.params.path.replace(/_/g, '.'); // Remplace les underscores par des points pour la syntaxe de chemin
    const paiementData = req.body;

    try {
        const updatedPaiements = updatePaiement(path, paiementData);
        res.status(200).json(updatedPaiements);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Supprimer un paiement
paiementRouter.delete('/:path', (req, res) => {
    const path = req.params.path.replace(/_/g, '.'); // Remplace les underscores par des points pour la syntaxe de chemin

    try {
        const updatedPaiements = deletePaiement(path);
        res.status(200).json(updatedPaiements);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default paiementRouter;
