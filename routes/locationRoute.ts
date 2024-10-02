import { Router } from 'express';
import db from '../models/db.js';

const locationRouter = Router();

// Create Location
locationRouter.post('/', async (req, res) => {
    try {
        const location = await db.Location.create(req.body);
        res.status(201).json(location);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Read Locations
locationRouter.get('/', async (req, res) => {
    try {
        const locations = await db.Location.findAll();
        res.status(200).json(locations);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Read Location by ID
locationRouter.get('/:id', async (req, res) => {
    try {
        const location = await db.Location.findByPk(req.params.id);
        if (location) {
            res.status(200).json(location);
        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Update Location
locationRouter.put('/:id', async (req, res) => {
    try {
        const location = await db.Location.update(req.body, {
            where: { id: req.params.id },
        });
        if (location[0]) {
            res.status(200).json({ message: 'Location updated successfully' });
        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Delete Location
locationRouter.delete('/:id', async (req, res) => {
    try {
        const deleted = await db.Location.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
});

export default locationRouter;
