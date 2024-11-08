import { Router } from 'express';
import db from '../models/db.js';

const priceRouter = Router();

// Ajouter un palier de prix à une activité
priceRouter.post('/:activityId/prices', async (req, res) => {
    const { activityId } = req.params;
    const { name, value, capacity, rating, description } = req.body;

    try {
        const activity = await db.Activity.findByPk(activityId);

        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        const price = await db.Price.create({
            activityId,
            name,
            value,
            capacity,
            rating,
            description
        });

        res.status(201).json(price);
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'An error occurred' });
    }
});

// Lire les paliers de prix d'une activité
priceRouter.get('/:activityId/prices', async (req, res) => {
    const { activityId } = req.params;

    try {
        const prices = await db.Price.findAll({
            where: { activityId }
        });

        res.status(200).json(prices);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Lire un palier de prix spécifique par ID
priceRouter.get('/:activityId/prices/:priceId', async (req, res) => {
    const { activityId, priceId } = req.params;

    try {
        const price = await db.Price.findOne({
            where: { id: priceId, activityId }
        });

        if (!price) {
            return res.status(404).json({ error: 'Price not found' });
        }

        res.status(200).json(price);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Mettre à jour un palier de prix
priceRouter.put('/:activityId/prices/:priceId', async (req, res) => {
    const { activityId, priceId } = req.params;
    const { name, value, capacity, rating, description } = req.body;

    try {
        const price = await db.Price.findOne({
            where: { id: priceId, activityId }
        });

        if (!price) {
            return res.status(404).json({ error: 'Price not found' });
        }

        await price.update({ name, value, capacity, rating, description });

        res.status(200).json({ message: 'Price updated successfully', price });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Supprimer un palier de prix
priceRouter.delete('/:activityId/prices/:priceId', async (req, res) => {
    const { activityId, priceId } = req.params;

    try {
        const price = await db.Price.findOne({
            where: { id: priceId, activityId }
        });

        if (!price) {
            return res.status(404).json({ error: 'Price not found' });
        }

        await price.destroy();
        res.status(200).json({ message: 'Price deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default priceRouter;
