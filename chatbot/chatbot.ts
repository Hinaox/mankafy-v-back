import OpenAI from "openai";

// Initialiser OpenAI avec l'API clé (charge-la depuis une variable d'environnement)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Assure-toi que la clé API est stockée dans ton fichier .env
});

export const generateCompletion = async () => {
    try {
        const completion = await openai.chat.completions.create({
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
    } catch (error) {
        console.error("Error generating completion:", error);
        throw error;
    }
};
