var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import db from "../models/db.js";
import { findLocationChildren, getActivitiesForLocation, } from "../services/locationService.js";
const locationRouter = Router();
// Create Location
locationRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const location = yield db.Location.create(req.body);
        res.status(201).json(location);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Read Locations
locationRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locations = yield db.Location.findAll();
        res.status(200).json(locations);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
locationRouter.get("/:id/children", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const retour = yield findLocationChildren(id);
        res.json(retour);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}));
// get parents locations
locationRouter.get("/parents", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const retour = yield db.Location.findAll({
            where: {
                parentId: null,
            },
        });
        res.json(retour);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}));
// Read Location by ID
locationRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const location = yield db.Location.findByPk(req.params.id);
        if (location) {
            res.status(200).json(location);
        }
        else {
            res.status(404).json({ error: "Location not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Update Location
locationRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const location = yield db.Location.update(req.body, {
            where: { id: req.params.id },
        });
        if (location[0]) {
            res.status(200).json({ message: "Location updated successfully" });
        }
        else {
            res.status(404).json({ error: "Location not found" });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Delete Location
locationRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield db.Location.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        }
        else {
            res.status(404).json({ error: "Location not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Route GET pour obtenir toutes les activités d'une location et ses sous-locations
locationRouter.get("/:id/activities", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Appel de la fonction pour la location initiale
        const activities = yield getActivitiesForLocation(id);
        res.status(200).json(activities);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
export default locationRouter;
//# sourceMappingURL=locationRoute.js.map