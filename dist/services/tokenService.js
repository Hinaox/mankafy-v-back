import jwt from "jsonwebtoken";
// Clé secrète pour vérifier le token
const SECRET_KEY = process.env.tsk || "";
const authenticateToken = (req, res, next) => {
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
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
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
        // Si le token est validé, attacher le payload décodé à req.user
        req.user = decoded;
        next();
    });
};
export default authenticateToken;
//# sourceMappingURL=tokenService.js.map