import { GoogleGenAI } from "@google/genai";

// Per guidelines, API key must be from process.env.API_KEY
// and the AI instance should be created with it.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates text content using the Gemini API based on a given prompt.
 * @param prompt The prompt to send to the model.
 * @returns The generated text as a string.
 */
export const generateText = async (prompt: string): Promise<string> => {
  try {
    // Per guidelines, use ai.models.generateContent
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Basic text task model
      contents: prompt,
    });
    // Per guidelines, access text directly from response.text
    return response.text;
  } catch (error) {
    console.error("Error generating text with Gemini API:", error);
    // Return a user-friendly error message
    return "Sorry, there was an error generating the text. Please try again.";
  }
};

/**
 * Generates bullet points for a job description.
 * @param jobTitle The job title.
 * @param company The company name.
 * @param description A brief description of the role or key achievements.
 * @returns An array of generated bullet points.
 */
export const generateResponsibilities = async (jobTitle: string, company: string, description: string): Promise<string[]> => {
    const prompt = `
        You are an expert resume writer.
        Generate 3-5 concise, impactful bullet points for a resume based on the following job details.
        Focus on achievements and quantifiable results. Use strong action verbs.
        Do not use punctuation at the end of the bullet point.

        Job Title: ${jobTitle}
        Company: ${company}
        Description/Keywords: ${description}

        Return the bullet points as a JSON array of strings. For example: ["bullet point 1", "bullet point 2"]
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        const text = response.text;
        // The API should return a JSON string, so we parse it.
        const responsibilities = JSON.parse(text);
        if (Array.isArray(responsibilities) && responsibilities.every(item => typeof item === 'string')) {
            return responsibilities;
        }
        return [];
    } catch (error) {
        console.error("Error generating responsibilities:", error);
        return ["Error generating content. Please check your input and try again."];
    }
};

/**
 * Rephrases a given text to be more professional, concise, or impactful.
 * @param text The text to rephrase.
 * @param tone The desired tone (e.g., 'more professional', 'more concise', 'more impactful').
 * @returns The rephrased text.
 */
export const rephraseText = async (text: string, tone: string): Promise<string> => {
    const prompt = `
        Rephrase the following text to be ${tone}.
        Original text: "${text}"
    `;
    return generateText(prompt);
};
