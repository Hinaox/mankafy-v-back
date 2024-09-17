import { Router } from 'express';
import db from '../models/db.js';

const router = Router();

// Création d'un utilisateur
router.post('/', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, profilPic } = req.body;
        const newUser = await db.User.create({ username, email, password, firstName, lastName, profilPic });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: 'Erreur lors de la création de l\'utilisateur' });
    }
});

// Récupération de tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await db.User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
});

export default router;
