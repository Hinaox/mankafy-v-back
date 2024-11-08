import { Router } from 'express';
import { readCharges, addCharge, updateCharge, deleteCharge } from '../services/chargesService.js';
const chargesRouter = Router();
// Lire toutes les charges
chargesRouter.get('/', (req, res) => {
    try {
        const charges = readCharges();
        res.status(200).json(charges);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Lire une charge spécifique avec un chemin dynamique
chargesRouter.get('/:path', (req, res) => {
    const path = req.params.path.replace(/_/g, '.'); // Remplace les underscores par des points pour la syntaxe de chemin
    try {
        const charge = readCharges();
        const specificCharge = path.split('.').reduce((acc, key) => acc && acc[key], charge);
        if (specificCharge) {
            res.status(200).json(specificCharge);
        }
        else {
            res.status(404).json({ error: `Charge not found at path: ${path}` });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Ajouter une nouvelle charge
chargesRouter.post('/', (req, res) => {
    const { path, chargeData } = req.body;
    try {
        const updatedCharges = addCharge(path, chargeData);
        res.status(201).json(updatedCharges);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Modifier une charge existante
chargesRouter.put('/:path', (req, res) => {
    const path = req.params.path.replace(/_/g, '.'); // Remplace les underscores par des points pour la syntaxe de chemin
    const chargeData = req.body;
    try {
        const updatedCharges = updateCharge(path, chargeData);
        res.status(200).json(updatedCharges);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Supprimer une charge
chargesRouter.delete('/:path', (req, res) => {
    const path = req.params.path.replace(/_/g, '.'); // Remplace les underscores par des points pour la syntaxe de chemin
    try {
        const updatedCharges = deleteCharge(path);
        res.status(200).json(updatedCharges);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
export default chargesRouter;
//# sourceMappingURL=chargesRoute.js.map