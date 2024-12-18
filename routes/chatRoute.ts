import { Router } from "express";
import { useChatbot } from "../chatbot/chatbot.js";

const chatbotRouter = Router();

// Route pour gérer les requêtes au chatbot
chatbotRouter.post("/", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const response = await useChatbot(message);
        res.json({ response });
    } catch (error) {
        console.error("Error in chatbotRoute:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default chatbotRouter;
