// src/services/aiService.js
import axios from 'axios';

// Updated system prompt that instructs the AI how to format the notes with both bullet points and hyphens
const DEFAULT_SYSTEM_PROMPT = `
Convert the following text into concise, well-structured study notes.
FORMAT INSTRUCTIONS (follow exactly):
1. Each main concept should have its own heading (e.g., "Tetrahedral Geometry")
2. Use a mix of bullet points (*) and hyphens (-) for list items:
   * Use bullet points (*) for main points
   - Use hyphens (-) for sub-points or examples
3. Format key terms like this: "Term:" (with the colon)
4. Each main term should be on its own line, followed by its definition
5. Keep formatting simple - don't use too many special characters
6. Reduce wordiness while maintaining clarity
7. Organize information hierarchically
8. Preserve all important terminology and concepts
`;

/**
 * Processes text through Gemini API to generate structured notes
 * @param {string} inputText - The original text to be converted
 * @param {object} options - Additional options for customizing the output
 * @returns {Promise<string>} - The generated notes
 */
export const generateNotes = async (inputText, options = {}) => {
  const {
    systemPrompt = DEFAULT_SYSTEM_PROMPT,
    temperature = 0.3,
    maxTokens = 2048,
  } = options;

  // Get API key from environment variables - using Vite's env variable format
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  // If no API key is available, return a mock response for development
  if (!API_KEY) {
    console.warn('No Gemini API key found. Using mock response for development.');
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    
    return `Tetrahedral Geometry

* Definition: Arrangement with four groups attached to a central atom, maximizing separation.

* Central Atom: Typically smaller than in square planar geometry.

* Isomers: No cis/trans isomers possible. All groups have the same relationship to each other.

* Example: Dichlorodimethylsilane (SiCl2(CH3)2)
  - Only one arrangement of the two chlorine and two methyl groups around the silicon atom
  - No isomers possible`;
  }

  try {
    // Updated to use Gemini 1.5 Pro model
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
    
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\nOriginal text:\n${inputText}` }
            ]
          }
        ],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating notes with Gemini:', error);
    throw new Error(
      error.response?.data?.error?.message || 
      'Failed to generate notes. Please check your Gemini API key and try again.'
    );
  }
};