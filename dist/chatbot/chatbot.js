var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OpenAI } from "openai";
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
export const useChatbot = (message, userId, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const completion = yield openai.chat.completions.create({
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
        return ((_a = completion.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) || "No response";
    }
    catch (error) {
        console.error("Error in useChatbot:", error);
        throw new Error("Chatbot failed to respond");
    }
});
//# sourceMappingURL=chatbot.js.map