import { GoogleGenAI } from "@google/genai";
import { UserProfile, BMIData } from "../types";

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFitnessAdvice = async (
  profile: UserProfile,
  bmi: BMIData,
  contextGoal: string
): Promise<string> => {
  const ai = getClient();
  
  const prompt = `
    You are an expert fitness and nutrition coach.
    User Profile:
    - Name: ${profile.name}
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - BMI: ${bmi.value.toFixed(1)} (${bmi.category})
    - Activity Level: ${profile.activityLevel} (CRITICAL)
    - Primary Goal: ${profile.goal} (Context: ${contextGoal})

    Please provide a concise, actionable plan containing:
    1. A 1-paragraph assessment of their current BMI health implication.
    2. 3 specific workout recommendations tailored to their goal (${profile.goal}).
    3. 3 specific nutritional adjustments.
    
    IMPORTANT: Explicitly explain how their '${profile.activityLevel}' activity level influences these recommendations (e.g., calorie intake needs, recovery time, or workout intensity).

    Format the output in Markdown. Keep it encouraging but realistic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "I couldn't generate advice at this moment. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the fitness database right now.";
  }
};

export const chatWithAdvisor = async (
  history: { role: 'user' | 'model'; text: string }[],
  message: string
): Promise<string> => {
  const ai = getClient();
  
  // Format history for Gemini API
  const formattedHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are a helpful, motivating fitness assistant named VitalityBot. Keep answers short (under 100 words) and focused on health, wellness, and exercise."
      },
      history: formattedHistory
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I didn't quite catch that.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm experiencing a temporary glitch. Let's try again later.";
  }
};