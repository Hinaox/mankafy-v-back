var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import db from '../models/db.js'; // Assurez-vous que le chemin est correct
const activityRouter = Router();
// Create Activity
activityRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activity = yield db.Activity.create(req.body);
        res.status(201).json(activity);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Read Activities
activityRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activities = yield db.Activity.findAll();
        res.status(200).json(activities);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Read Activity by ID
activityRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activity = yield db.Activity.findByPk(req.params.id);
        if (activity) {
            res.status(200).json(activity);
        }
        else {
            res.status(404).json({ error: 'Activity not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Update Activity
activityRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activity = yield db.Activity.update(req.body, {
            where: { id: req.params.id },
        });
        if (activity[0]) {
            res.status(200).json({ message: 'Activity updated successfully' });
        }
        else {
            res.status(404).json({ error: 'Activity not found' });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Delete Activity
activityRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield db.Activity.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        }
        else {
            res.status(404).json({ error: 'Activity not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Ajout d'une photo à une activité
activityRouter.post('/:activityId/photo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { activityId } = req.params;
    const { url } = req.body;
    try {
        const activity = yield db.Activity.findByPk(activityId);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        const photo = yield db.Photo.create({ activityId, url });
        res.status(201).json(photo);
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'An error occurred' });
    }
}));
// Suppression d'une photo d'une activité
activityRouter.delete('/:activityId/photo/:photoId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { activityId, photoId } = req.params;
    try {
        const photo = yield db.Photo.findOne({
            where: { id: photoId, activityId }
        });
        if (!photo) {
            return res.status(404).json({ error: 'Photo not found' });
        }
        yield photo.destroy();
        res.status(200).json({ message: 'Photo deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'An error occurred' });
    }
}));
// Récupérer la première photo d'une activité
activityRouter.get('/:activityId/photo/first', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { activityId } = req.params;
    try {
        const firstPhoto = yield db.Photo.findOne({
            where: { activityId },
            order: [['createdAt', 'ASC']] // Ordre croissant pour obtenir la première photo
        });
        if (!firstPhoto) {
            return res.status(404).json({ error: 'No photo found for this activity' });
        }
        res.status(200).json(firstPhoto);
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'An error occurred' });
    }
}));
export default activityRouter;
//# sourceMappingURL=activityRoute.js.map