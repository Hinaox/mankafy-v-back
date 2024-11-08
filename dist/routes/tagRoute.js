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
const tagRouter = Router();
// Create a new tag
tagRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tag = yield db.Tag.create(req.body);
        res.status(201).json(tag);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Read all tags
tagRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield db.Tag.findAll();
        res.status(200).json(tags);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Read a tag by ID
tagRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tag = yield db.Tag.findByPk(req.params.id);
        if (tag) {
            res.status(200).json(tag);
        }
        else {
            res.status(404).json({ error: 'Tag not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Update a tag
tagRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tag = yield db.Tag.update(req.body, {
            where: { id: req.params.id },
        });
        if (tag[0]) {
            res.status(200).json({ message: 'Tag updated successfully' });
        }
        else {
            res.status(404).json({ error: 'Tag not found' });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Delete a tag
tagRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield db.Tag.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        }
        else {
            res.status(404).json({ error: 'Tag not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
export default tagRouter;
//# sourceMappingURL=tagRoute.js.map