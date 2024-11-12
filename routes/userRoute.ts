import { Router } from "express";
import db from "../models/db.js";
import bcrypt from "bcrypt";
import jwt, { VerifyErrors } from "jsonwebtoken";
import tokenService from "../services/tokenService.js";
import authenticateToken from "../services/tokenService.js";

const router = Router();
const tsk = process.env.tsk as string; //token secret key

// Clé secrète pour vérifier le token
const SECRET_KEY = process.env.tsk || "";

interface DecodedToken {
  userId: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  profilPic: string;
  iat: number; //issued at
  exp: number; //expired at
}

//login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Trouver l'utilisateur par email
    const user = await db.User.findOne({
      where: { email: email },
    });
    // Vérifier si l'utilisateur existe
    if (!user) {
      return res
        .status(404)
        .json({ message: "Vos identifiants son incorrects." });
    }
    // Comparer le mot de passe en clair avec le mot de passe haché stocké
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Mot de passe correct, retourner un succès
      console.log(tsk + "tsk here......");
      const token = jwt.sign(
        {
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
    } else {
      // Mot de passe incorrect
      return res
        .status(401)
        .json({ message: "Vos identifiants son incorrects." });
    }
  } catch (error) {
    // En cas d'erreur, loggez l'erreur et retournez une réponse d'erreur
    console.error("Erreur lors de la connexion :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

// Création d'un utilisateur
router.post("/", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, profilPic } =
      req.body;
    const newUser = await db.User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      profilPic,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erreur lors de la création de l'utilisateur" });
  }
});

// Récupération de tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
});

router.get("/user_info", async (req, res, next) => {
  var retour: any = null;
  // Récupérer le token depuis les en-têtes de la requête
  var token = "";
  const bearer = req.headers["authorization"];
  if (bearer) {
    token = bearer.split(" ")[1];
  }
  console.log(token + "----here");
  if (!token) {
    return res.status(401).json({ message: "Token non fourni." });
  }

  // Vérifier et décoder le token
  await new Promise<void>((resolve, reject) => {
    jwt.verify(
      token,
      SECRET_KEY,
      async (err: VerifyErrors | null, decoded: any) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            // Token a expiré
            // Effectuez une action spécifique, par exemple, rediriger ou renvoyer un message d'erreur
            return res
              .status(403)
              .json({ message: "Session expirée. Veuillez vous reconnecter." });
          }
          return res
            .status(403)
            .json({ message: "Session invalide. Veuillez vous reconnecter." });
        }

        const decodedUser = decoded as DecodedToken;

        // get the roles
        const userRoles = await db.UserRole.findAll({
          where: { userId: decodedUser.userId },
          include: [{ model: db.Role }],
        });
        // Si le token est validé, attacher le payload décodé à req.user
        retour = decodedUser;
        retour.userRoles = userRoles;
        resolve();
      }
    );
  });
  res.json(retour);
});

//exemple d'appel protégé par token
router.get("/protected", tokenService, (req, res) => {
  // Accéder au payload depuis req.user
  const userId = (req as any).user?.userId;
  const email = (req as any).user?.email;

  res.json({
    // userId: userId,
    // email: email,
    user: (req as any).user,
  });
});

export default router;
