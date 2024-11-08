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
import db from '../models/db.js';
const priceRouter = Router();
// Ajouter un palier de prix à une activité
priceRouter.post('/:activityId/prices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { activityId } = req.params;
    const { name, value, capacity, rating, description } = req.body;
    try {
        const activity = yield db.Activity.findByPk(activityId);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        const price = yield db.Price.create({
            activityId,
            name,
            value,
            capacity,
            rating,
            description
        });
        res.status(201).json(price);
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'An error occurred' });
    }
}));
// Lire les paliers de prix d'une activité
priceRouter.get('/:activityId/prices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { activityId } = req.params;
    try {
        const prices = yield db.Price.findAll({
            where: { activityId }
        });
        res.status(200).json(prices);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Lire un palier de prix spécifique par ID
priceRouter.get('/:activityId/prices/:priceId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { activityId, priceId } = req.params;
    try {
        const price = yield db.Price.findOne({
            where: { id: priceId, activityId }
        });
        if (!price) {
            return res.status(404).json({ error: 'Price not found' });
        }
        res.status(200).json(price);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Mettre à jour un palier de prix
priceRouter.put('/:activityId/prices/:priceId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { activityId, priceId } = req.params;
    const { name, value, capacity, rating, description } = req.body;
    try {
        const price = yield db.Price.findOne({
            where: { id: priceId, activityId }
        });
        if (!price) {
            return res.status(404).json({ error: 'Price not found' });
        }
        yield price.update({ name, value, capacity, rating, description });
        res.status(200).json({ message: 'Price updated successfully', price });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Supprimer un palier de prix
priceRouter.delete('/:activityId/prices/:priceId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { activityId, priceId } = req.params;
    try {
        const price = yield db.Price.findOne({
            where: { id: priceId, activityId }
        });
        if (!price) {
            return res.status(404).json({ error: 'Price not found' });
        }
        yield price.destroy();
        res.status(200).json({ message: 'Price deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
export default priceRouter;
//# sourceMappingURL=priceRoute.js.map