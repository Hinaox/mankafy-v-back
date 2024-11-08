import { Router } from 'express';
import db from '../models/db.js'; // Assurez-vous que le chemin est correct

const tagRouter = Router();

// Create a new tag
tagRouter.post('/', async (req, res) => {
    try {
        const tag = await db.Tag.create(req.body);
        res.status(201).json(tag);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Read all tags
tagRouter.get('/', async (req, res) => {
    try {
        const tags = await db.Tag.findAll();
        res.status(200).json(tags);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Read a tag by ID
tagRouter.get('/:id', async (req, res) => {
    try {
        const tag = await db.Tag.findByPk(req.params.id);
        if (tag) {
            res.status(200).json(tag);
        } else {
            res.status(404).json({ error: 'Tag not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Update a tag
tagRouter.put('/:id', async (req, res) => {
    try {
        const tag = await db.Tag.update(req.body, {
            where: { id: req.params.id },
        });
        if (tag[0]) {
            res.status(200).json({ message: 'Tag updated successfully' });
        } else {
            res.status(404).json({ error: 'Tag not found' });
        }
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a tag
tagRouter.delete('/:id', async (req, res) => {
    try {
        const deleted = await db.Tag.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Tag not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default tagRouter;
