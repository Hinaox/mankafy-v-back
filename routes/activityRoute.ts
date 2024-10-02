import { Router } from 'express';
import db from '../models/db.js'; // Assurez-vous que le chemin est correct

const activityRouter = Router();

// Create Activity
activityRouter.post('/', async (req, res) => {
    try {
        const activity = await db.Activity.create(req.body);
        res.status(201).json(activity);
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
});

// Read Activities
activityRouter.get('/', async (req, res) => {
    try {
        const activities = await db.Activity.findAll();
        res.status(200).json(activities);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Read Activity by ID
activityRouter.get('/:id', async (req, res) => {
    try {
        const activity = await db.Activity.findByPk(req.params.id);
        if (activity) {
            res.status(200).json(activity);
        } else {
            res.status(404).json({ error: 'Activity not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Update Activity
activityRouter.put('/:id', async (req, res) => {
    try {
        const activity = await db.Activity.update(req.body, {
            where: { id: req.params.id },
        });
        if (activity[0]) {
            res.status(200).json({ message: 'Activity updated successfully' });
        } else {
            res.status(404).json({ error: 'Activity not found' });
        }
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Delete Activity
activityRouter.delete('/:id', async (req, res) => {
    try {
        const deleted = await db.Activity.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Activity not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});


// Ajout d'une photo à une activité
activityRouter.post('/:activityId/photo', async (req, res) => {
    const { activityId } = req.params;
    const { url } = req.body;

    try {
        const activity = await db.Activity.findByPk(activityId);

        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        const photo = await db.Photo.create({ activityId, url });
        res.status(201).json(photo);
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'An error occurred' });
    }
});

// Suppression d'une photo d'une activité
activityRouter.delete('/:activityId/photo/:photoId', async (req, res) => {
    const { activityId, photoId } = req.params;

    try {
        const photo = await db.Photo.findOne({
            where: { id: photoId, activityId }
        });

        if (!photo) {
            return res.status(404).json({ error: 'Photo not found' });
        }

        await photo.destroy();
        res.status(200).json({ message: 'Photo deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'An error occurred' });
    }
});

// Récupérer la première photo d'une activité
activityRouter.get('/:activityId/photo/first', async (req, res) => {
    const { activityId } = req.params;

    try {
        const firstPhoto = await db.Photo.findOne({
            where: { activityId },
            order: [['createdAt', 'ASC']] // Ordre croissant pour obtenir la première photo
        });

        if (!firstPhoto) {
            return res.status(404).json({ error: 'No photo found for this activity' });
        }

        res.status(200).json(firstPhoto);
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'An error occurred' });
    }
});


export default activityRouter;
