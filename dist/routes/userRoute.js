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
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import tokenService from "../services/tokenService.js";
import authenticateToken from "../services/tokenService.js";
const router = Router();
const tsk = process.env.tsk; //token secret key
//login
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Trouver l'utilisateur par email
        const user = yield db.User.findOne({
            where: { email: email },
        });
        // Vérifier si l'utilisateur existe
        if (!user) {
            return res
                .status(404)
                .json({ message: "Vos identifiants son incorrects." });
        }
        // Comparer le mot de passe en clair avec le mot de passe haché stocké
        const isPasswordValid = yield bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            // Mot de passe correct, retourner un succès
            console.log(tsk + "tsk here......");
            const token = jwt.sign({
                userId: user.id,
                email: user.email,
                username: user.username,
                profilPic: user.profilPic,
                firstName: user.firstName,
                lastName: user.lastName,
            }, // Payload
            tsk, // Clé secrète pour signer le token
            { expiresIn: "6h" } // Expiration du token
            );
            return res
                .status(200)
                .json({ message: "Connexion réussie.", token: token });
        }
        else {
            // Mot de passe incorrect
            return res
                .status(401)
                .json({ message: "Vos identifiants son incorrects." });
        }
    }
    catch (error) {
        // En cas d'erreur, loggez l'erreur et retournez une réponse d'erreur
        console.error("Erreur lors de la connexion :", error);
        return res.status(500).json({ message: "Erreur serveur." });
    }
}));
// Création d'un utilisateur
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, firstName, lastName, profilPic } = req.body;
        const newUser = yield db.User.create({
            username,
            email,
            password,
            firstName,
            lastName,
            profilPic,
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        res
            .status(400)
            .json({ error: "Erreur lors de la création de l'utilisateur" });
    }
}));
// Récupération de tous les utilisateurs
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db.User.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
}));
router.get("/user_info", authenticateToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: "Profil utilisateur", user: req.user });
}));
//exemple d'appel protégé par token
router.get("/protected", tokenService, (req, res) => {
    var _a, _b;
    // Accéder au payload depuis req.user
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const email = (_b = req.user) === null || _b === void 0 ? void 0 : _b.email;
    res.json({
        message: "Accès autorisé à la route protégée.",
        // userId: userId,
        // email: email,
        user: req.user,
    });
});
export default router;
//# sourceMappingURL=userRoute.js.map