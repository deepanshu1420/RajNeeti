import { GoogleGenerativeAI } from "@google/generative-ai";

// --- API KEY 1: For the Main Dashboard Cards ---
const MAIN_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const mainGenAI = new GoogleGenerativeAI(MAIN_API_KEY);

// --- API KEY 2: For the ChatBot ---
const CHAT_API_KEY = import.meta.env.VITE_CHATBOT_API_KEY;
const chatGenAI = new GoogleGenerativeAI(CHAT_API_KEY);


// ---------------------------------------------------------------------------
// FUNCTION 1: Fetches the Main Dashboard JSON (Uses MAIN_API_KEY)
// ---------------------------------------------------------------------------
export const fetchStateData = async (stateName, language = 'en') => {
  try {
    // Uses mainGenAI
    const model = mainGenAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const languagePrompt = language === 'hi' 
      ? "Please return the ENTIRE JSON response strictly in Hindi. Use very simple, everyday conversational Hindi (Aam Bolchal ki Bhasha) that a 10-year-old or an elderly person can easily understand. DO NOT use heavy, formal, or 'Shuddh' Hindi words. Translate all titles and points simply." 
      : "Please return the ENTIRE JSON response strictly in English. Use very simple, plain, everyday English. DO NOT use heavy political jargon, formal vocabulary, or a 'news anchor' tone. Keep it easy for anyone to read.";

    const prompt = `
      You are a friendly, helpful guide explaining the current state of ${stateName}, India, to a common person.
      
      ${languagePrompt}
      
      CRITICAL INSTRUCTION: Keep every single bullet point well-balanced. Write around 10 to 15 words per point. Each point should be a complete, engaging sentence that comfortably fills about two lines of text on a screen. 
      ABSOLUTELY DO NOT output the word count at the end of the sentences. NEVER write things like "(10 words)" or "(12 words)". Just provide the clean sentence.
      
      The JSON must strictly follow this structure exactly (ensure all properties exist):
      {
        "title": "${stateName}",
        "issues": [
          { "title": "Category 1", "points": ["A well-balanced, engaging sentence goes here.", "Another descriptive, well-balanced sentence goes right here.", "A third insightful sentence to complete the card."] },
          { "title": "Category 2", "points": ["A well-balanced, engaging sentence goes here.", "Another descriptive, well-balanced sentence goes right here.", "A third insightful sentence to complete the card."] },
          { "title": "Category 3", "points": ["A well-balanced, engaging sentence goes here.", "Another descriptive, well-balanced sentence goes right here.", "A third insightful sentence to complete the card."] }
        ],
        "politics": [
          { "title": "Category 1", "points": ["A well-balanced, engaging sentence goes here.", "Another descriptive, well-balanced sentence goes right here.", "A third insightful sentence to complete the card."] },
          { "title": "Category 2", "points": ["A well-balanced, engaging sentence goes here.", "Another descriptive, well-balanced sentence goes right here.", "A third insightful sentence to complete the card."] },
          { "title": "Category 3", "points": ["A well-balanced, engaging sentence goes here.", "Another descriptive, well-balanced sentence goes right here.", "A third insightful sentence to complete the card."] }
        ],
        "crime": [
          { "title": "Category 1", "points": ["A well-balanced, engaging sentence goes here.", "Another descriptive, well-balanced sentence goes right here.", "A third insightful sentence to complete the card."] },
          { "title": "Category 2", "points": ["A well-balanced, engaging sentence goes here.", "Another descriptive, well-balanced sentence goes right here.", "A third insightful sentence to complete the card."] },
          { "title": "Category 3", "points": ["A well-balanced, engaging sentence goes here.", "Another descriptive, well-balanced sentence goes right here.", "A third insightful sentence to complete the card."] }
        ],
        "positive": [
          { "title": "Category 1", "points": ["A well-balanced, engaging sentence goes here.", "Another descriptive, well-balanced sentence goes right here.", "A third insightful sentence to complete the card."] },
          { "title": "Category 2", "points": ["A well-balanced, engaging sentence goes here.", "Another descriptive, well-balanced sentence goes right here.", "A third insightful sentence to complete the card."] },
          { "title": "Category 3", "points": ["A well-balanced, engaging sentence goes here.", "Another descriptive, well-balanced sentence goes right here.", "A third insightful sentence to complete the card."] }
        ]
      }
      Do not include markdown tags like \`\`\`json. Return only valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching data from Gemini:", error);
    return {
      title: stateName,
      issues: [{ title: "Error", points: ["Failed to load data"] }],
      politics: [{ title: "Error", points: ["Failed to load data"] }],
      crime: [{ title: "Error", points: ["Failed to load data"] }],
      positive: [{ title: "Error", points: ["Failed to load data"] }]
    };
  }
};


// ---------------------------------------------------------------------------
// FUNCTION 2: Handles the ChatBot Q&A (Uses CHAT_API_KEY)
// ---------------------------------------------------------------------------
export const askStateQuestion = async (stateName, question, language = 'en') => {
  try {
    // Uses chatGenAI!
    const model = chatGenAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const langPrompt = language === 'hi' 
      ? "Answer strictly in simple, everyday Hindi (Aam Bolchal ki Bhasha)." 
      : "Answer strictly in simple, everyday English.";

    const prompt = `
      You are RajNeeti AI, a helpful and friendly civic intelligence assistant. 
      The user is currently reading about the Indian state of ${stateName}.
      
      User's Question: "${question}"
      
      CRITICAL INSTRUCTIONS:
      1. Keep your answer very short, punchy, and conversational (maximum 2 to 3 short sentences).
      2. Be highly accurate about ${stateName}'s politics, history, or current affairs.
      3. GUARDRAIL: If the user's question is completely unrelated to ${stateName}, Indian politics, or civic issues, YOU MUST POLITELY REFUSE TO ANSWER. Tell them you are specifically here to discuss ${stateName}.
      4. ${langPrompt}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error with AI Chat:", error);
    return language === 'hi' 
      ? "माफ़ करें, मुझे अभी कनेक्ट करने में परेशानी हो रही है।" 
      : "Sorry, I'm having trouble connecting to the network right now.";
  }
};