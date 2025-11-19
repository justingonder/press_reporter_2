import { GoogleGenAI } from "@google/genai";
import { ProcessedJournalStats } from "../types";

// Initialize the Google GenAI SDK
// Note: In a real Janeway plugin, this key would likely be injected via Django settings or a secured proxy.
// For this client-side implementation, we rely on the environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateExecutiveSummary = async (stats: ProcessedJournalStats[]) => {
  const criticalJournals = stats.filter(s => s.status === 'critical');
  const warningJournals = stats.filter(s => s.status === 'warning');
  
  // Construct a prompt based on the data
  const prompt = `
    You are an assistant to an Academic Press Manager. 
    Analyze the following journal performance data and write a concise, professional executive summary (1-2 paragraphs) identifying bottlenecks.
    
    Data:
    ${JSON.stringify(stats.map(s => ({
      name: s.journalName,
      status: s.status,
      unassignedSubmissions: s.unassignedCount,
      oldestUnassignedDays: s.oldestUnassignedDays,
      stalledReviews: s.stalledReviewCount,
      oldestStalledReviewDays: s.oldestStalledReviewDays
    })), null, 2)}

    Highlight the journals with 'critical' status first. Suggest general actions (e.g., "Follow up with editors of Journal X").
    Keep the tone constructive but urgent for critical items.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
          temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    return "Unable to generate summary at this time. Please check your API key and connection.";
  }
};
