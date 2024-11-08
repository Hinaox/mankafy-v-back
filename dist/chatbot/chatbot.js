var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import OpenAI from "openai";
// Initialiser OpenAI avec l'API clé (charge-la depuis une variable d'environnement)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Assure-toi que la clé API est stockée dans ton fichier .env
});
export const generateCompletion = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const completion = yield openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Tu peux adapter selon le modèle souhaité
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: "Write a haiku about recursion in programming.",
                },
            ],
        });
        return completion.choices[0].message.content;
    }
    catch (error) {
        console.error("Error generating completion:", error);
        throw error;
    }
});
//# sourceMappingURL=chatbot.js.map