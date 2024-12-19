import { Router } from "express";
import { useChatbot } from "../chatbot/chatbot.js";

const chatbotRouter = Router();

// Route pour gérer les requêtes au chatbot
// chatbotRouter.post("/", async (req, res) => {
//     const { message,userId } = req.body;

//     if (!message) {
//         return res.status(400).json({ error: "Message is required" });
//     }

//     try {
//         const response = await useChatbot(message, userId);
//         res.json({ response });
//     } catch (error) {
//         console.error("Error in chatbotRoute:", error);
//         res.status(500).json({ error: "Something went wrong" });
//     }
// });
chatbotRouter.post("/load-context", (req, res) => {
    const { context } = req.body;

    if (!context || !Array.isArray(context)) {
        req.app.locals.context = [
            { role: "system", content: "Tu es un assistant virtuel travaillant pour Mankafy Voyage (Agence), ton rôle est d'aider les clients à trouver des activités et des informations sur les destinations de voyage, les hôtels et les activités." }
        ];
        res.status(200).send({ message: "Nouveau contexte créé avec succès." });
    }

    // Sauvegarder temporairement le contexte côté backend si nécessaire
    req.app.locals.context = context;

    res.status(200).send({ message: "Contexte chargé avec succès." });
});

chatbotRouter.post("/", async (req, res) => {
    const { message, userId } = req.body;

    if (!message || !userId) {
        return res.status(400).send({ error: "Message et User ID sont requis." });
    }
    // Charger le contexte actuel depuis req.app.locals ou démarrer un nouveau
    const context = req.app.locals.context || [
        { role: "system", content: "Tu es un assistant virtuel travaillant pour Mankafy Voyage (Agence), ton rôle est d'aider les clients à trouver des activités et des informations sur les destinations de voyage, les hôtels et les activités." }
    ];
    context.push({ role: "user", content: message });


    try {
        const response = await useChatbot(message, userId,context);
        
        // Ajouter la réponse de l'assistant et de l'utilisateur au contexte
        context.push({ role: "assistant", content: response });
        
        // Sauvegarder le contexte mis à jour
        req.app.locals.context = context;
        console.log("context:-------"+context);
        res.status(200).send({ response });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Erreur lors de la communication avec le chatbot." });
    }
});

export default chatbotRouter;
