import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getPalavraDoDia() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash-lite",
      generationConfig: {
        responseMimeType: "application/json", // força JSON
      },
    });

    const prompt = `
Você é um assistente espiritual católico. Gere a "Palavra do Dia" para o site de uma paróquia brasileira.

Regras:
- Máximo de 2 frases curtas, claras e acolhedoras.
- Sem saudações, sem introduções e sem mencionar "Igreja Católica", "paróquia" ou "padre".
- Priorize a tradição católica (Bíblia, santos ou papas).
- Tom de encorajamento, esperança e confiança em Deus. Evite moralismo pesado e frases genéricas.

Fontes preferidas quando não for Bíblia:
São João Paulo II, Papa Francisco, Bento XVI, Santa Teresa de Calcutá, São João Bosco, São José de Anchieta, Santo Agostinho, Santa Catarina de Sena, São Tomás de Aquino, Santa Teresa de Ávila.

Responda APENAS com JSON válido neste formato exato:
{
  "text": "o texto da mensagem (máximo 2 frases)",
  "verseReference": "referência bíblica (ex: Jo 14,27) OU nome do santo/papa, ou null",
  "reflection": null
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const raw = response.text();

    // Parse seguro
    const parsed = JSON.parse(raw);

    return {
      text: parsed.text?.trim() || "Que a paz de Cristo preencha o seu coração hoje.",
      verseReference: parsed.verseReference || "-",
      reflection: parsed.reflection || null,
    };
  } catch (error) {
    console.error("Erro ao buscar palavra do dia no Gemini:", error);

    // Fallback seguro
    return {
      text: "Que a paz e a esperança guiem o seu dia.",
      verseReference: null,
      reflection: null,
    };
  }
}