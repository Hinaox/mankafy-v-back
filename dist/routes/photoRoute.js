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
import db from '../models/db';
const photoRouter = Router();
// Create Photo
photoRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const photo = yield db.Photo.create(req.body);
        res.status(201).json(photo);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Read Photos
photoRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const photos = yield db.Photo.findAll();
        res.status(200).json(photos);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Read Photo by ID
photoRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const photo = yield db.Photo.findByPk(req.params.id);
        if (photo) {
            res.status(200).json(photo);
        }
        else {
            res.status(404).json({ error: 'Photo not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Update Photo
photoRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const photo = yield db.Photo.update(req.body, {
            where: { id: req.params.id },
        });
        if (photo[0]) {
            res.status(200).json({ message: 'Photo updated successfully' });
        }
        else {
            res.status(404).json({ error: 'Photo not found' });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Delete Photo
photoRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield db.Photo.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        }
        else {
            res.status(404).json({ error: 'Photo not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
export default photoRouter;
//# sourceMappingURL=photoRoute.js.map