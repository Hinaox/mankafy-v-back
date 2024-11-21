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
import { findActivitiesByLocation, getFirstTag, } from "../services/activityService.js";
const activityRouter = Router();
// Create Activity
activityRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activity = yield db.Activity.create(req.body);
        res.status(201).json(activity);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Read Activities
activityRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activities = yield db.Activity.findAll();
        res.status(200).json(activities);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
activityRouter.get("/byLocation", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const locationIdStr = req.query.locationId;
    // filtres
    const filtres = {};
    const activityTypeId = req.query.activityTypeId;
    if (activityTypeId) {
        filtres.activityTypeId = parseInt("" + activityTypeId);
    }
    if (locationIdStr) {
        const locationId = parseInt("" + locationIdStr);
        const retour = yield findActivitiesByLocation(locationId, filtres);
        res.json(retour);
    }
    else {
        res.status(400).json({ error: "location param not found" });
    }
}));
// Read Activity by ID
activityRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activity = yield db.Activity.findByPk(req.params.id);
        if (activity) {
            const firstTag = yield getFirstTag(activity.id); // Récupère le premier tag
            res.status(200).json({ activity, firstTag }); // Renvoie l'activité et le premier tag
        }
        else {
            res.status(404).json({ error: "Activity not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
activityRouter.get("/:id/full", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activityId = req.params.id;
    try {
        const activity = yield db.Activity.findOne({
            where: { id: activityId },
            include: [
                {
                    model: db.Price,
                    where: { activityId: activityId }, // Ne récupérer que les prix liés à cette activité
                    required: false, // Permet d'inclure même s'il n'y a pas de `Price`
                },
                {
                    model: db.Photo,
                    where: { activityId: activityId }, // Ne récupérer que les photos liées à cette activité
                    required: false,
                },
                {
                    model: db.Tag,
                    through: {
                        attributes: [], // Exclut les colonnes de la table de jointure
                    },
                    required: false, // Permet d'inclure même s'il n'y a pas de `Tag`
                },
            ],
        });
        if (activity) {
            res.status(200).json(activity);
        }
        else {
            res.status(404).json({ error: "Activity not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Route pour obtenir toutes les activités d'une location donnée
activityRouter.get("/location/:locationId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const locationId = req.params.locationId; // Récupération de l'ID de la location
    try {
        const activities = yield db.Activity.findAll({
            where: { locationId: locationId }, // Filtrer les activités par locationId
            include: [
                // {
                //     model: db.Price,
                //     where: { activityId: db.Sequelize.Sequelize.col('activity.id') }, // Récupérer les prix associés
                //     required: false, // Inclure même sans prix
                // },
                {
                    model: db.Photo,
                    required: false,
                },
                {
                    model: db.Tag,
                    through: {
                        attributes: [], // Exclure les colonnes de la table de jointure
                    },
                    required: false, // Inclure même sans tags
                },
            ],
        });
        if (activities.length == 0)
            console.log("0 be");
        if (activities && activities.length > 0) {
            res.status(200).json(activities); // Retourner toutes les activités trouvées
        }
        else {
            res.status(404).json({ error: "No activities found for this location" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Update Activity
activityRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activity = yield db.Activity.update(req.body, {
            where: { id: req.params.id },
        });
        if (activity[0]) {
            res.status(200).json({ message: "Activity updated successfully" });
        }
        else {
            res.status(404).json({ error: "Activity not found" });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Delete Activity
activityRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield db.Activity.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        }
        else {
            res.status(404).json({ error: "Activity not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Ajout d'une photo à une activité
activityRouter.post("/:activityId/photo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { activityId } = req.params;
    const { url } = req.body;
    try {
        const activity = yield db.Activity.findByPk(activityId);
        if (!activity) {
            return res.status(404).json({ error: "Activity not found" });
        }
        const photo = yield db.Photo.create({ activityId, url });
        res.status(201).json(photo);
    }
    catch (error) {
        res.status(400).json({ error: error.message || "An error occurred" });
    }
}));
// Suppression d'une photo d'une activité
activityRouter.delete("/:activityId/photo/:photoId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { activityId, photoId } = req.params;
    try {
        const photo = yield db.Photo.findOne({
            where: { id: photoId, activityId },
        });
        if (!photo) {
            return res.status(404).json({ error: "Photo not found" });
        }
        yield photo.destroy();
        res.status(200).json({ message: "Photo deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ error: error.message || "An error occurred" });
    }
}));
// Récupérer la première photo d'une activité
activityRouter.get("/:activityId/photo/first", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { activityId } = req.params;
    try {
        const firstPhoto = yield db.Photo.findOne({
            where: { activityId },
            order: [["createdAt", "ASC"]], // Ordre croissant pour obtenir la première photo
        });
        if (!firstPhoto) {
            return res
                .status(404)
                .json({ error: "No photo found for this activity" });
        }
        res.status(200).json(firstPhoto);
    }
    catch (error) {
        res.status(400).json({ error: error.message || "An error occurred" });
    }
}));
// Ajouter des tags à une activité
activityRouter.post("/:activityId/tags", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { activityId } = req.params;
    const { tagIds } = req.body; // Attend une liste d'IDs de tags
    try {
        const activity = yield db.Activity.findByPk(activityId);
        if (!activity) {
            return res.status(404).json({ error: "Activity not found" });
        }
        // Ajouter les tags à l'activité
        const tags = yield db.Tag.findAll({ where: { id: tagIds } });
        yield activity.addTags(tags);
        res.status(200).json({ message: "Tags added successfully" });
    }
    catch (error) {
        res.status(400).json({ error: error.message || "An error occurred" });
    }
}));
// Supprimer un tag d'une activité
activityRouter.delete("/:activityId/tags/:tagId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { activityId, tagId } = req.params;
    try {
        const activity = yield db.Activity.findByPk(activityId);
        const tag = yield db.Tag.findByPk(tagId);
        if (!activity || !tag) {
            return res.status(404).json({ error: "Activity or Tag not found" });
        }
        // Supprimer l'association entre l'activité et le tag
        yield activity.removeTag(tag);
        res.status(200).json({ message: "Tag removed successfully" });
    }
    catch (error) {
        res.status(400).json({ error: error.message || "An error occurred" });
    }
}));
export default activityRouter;
//# sourceMappingURL=activityRoute.js.map