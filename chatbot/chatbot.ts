import {OpenAI } from "openai";
import * as dotenv from 'dotenv';
// Initialisation de la configuration OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAIAPI_KEY, // Assure-toi que la clé API est stockée dans ton fichier .env
});

/**
 * Fonction pour obtenir une réponse du chatbot.
 * @param message Le message envoyé par l'utilisateur.
 * @param userId L'identifiant de l'utilisateur.
 * @returns La réponse générée par le chatbot.
 */
export const useChatbot = async (message: string,userId:string,context:any): Promise<any> => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k",
            messages: [
                { role: "system", content: "You are an AI assistant helping users with travel-related queries." }, 
                { role: "user", content: message },
                ...context 
            ],
        });

        // Retourner la réponse du chatbot
        // const test= completion.choices[0].message?.content;
        // console.log("test:-------"+test);
        return completion.choices[0].message?.content || "No response";
    } catch (error) {
        console.error("Error in useChatbot:", error);
        throw new Error("Chatbot failed to respond");
    }
};
