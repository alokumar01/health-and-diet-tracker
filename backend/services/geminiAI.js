import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';

// Initialize Gemini AI with the API key
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

// Available Gemini models as specified by the user
const modelNames = ['gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-pro'];

/**
 * Get personalized food recommendations based on user profile
 * @param {Object} userProfile - User's health and dietary information
 * @param {String} mealType - Type of meal (breakfast, lunch, dinner, snacks)
 * @param {String} modelName - Gemini model to use (default: gemini-2.0-flash-exp)
 * @returns {Promise<Object>} - AI-generated food recommendations
 */
export const getFoodRecommendations = async (userProfile, mealType = 'any', modelName = 'gemini-2.0-flash-exp') => {
  try {
    // Validate model name
    if (!modelNames.includes(modelName)) {
      modelName = 'gemini-2.0-flash-exp';
    }

    const model = genAI.getGenerativeModel({ model: modelName });

    // Construct the prompt based on user profile
    const prompt = `
You are a professional nutritionist AI assistant. Based on the following user profile, provide personalized food recommendations.

User Profile:
- Age: ${userProfile.age || 'Not specified'}
- Gender: ${userProfile.gender || 'Not specified'}
- Weight: ${userProfile.weight || 'Not specified'} kg
- Height: ${userProfile.height || 'Not specified'} cm
- BMI: ${userProfile.bmi ? userProfile.bmi.toFixed(2) : 'Not calculated'}
- BMR: ${userProfile.bmr ? userProfile.bmr.toFixed(0) : 'Not calculated'} kcal/day
- Activity Level: ${userProfile.goals?.activityLevel || 'Not specified'}
- Weight Goal: ${userProfile.goals?.weightGoal || 'Not specified'} kg
- Daily Calorie Goal: ${userProfile.goals?.calorieGoal || 'Not specified'} kcal
- Diet Type: ${userProfile.dietaryPreferences?.dietType || 'No preference'}
- Allergies: ${userProfile.dietaryPreferences?.allergies?.length ? userProfile.dietaryPreferences.allergies.join(', ') : 'None'}
- Dislikes: ${userProfile.dietaryPreferences?.dislikes?.length ? userProfile.dietaryPreferences.dislikes.join(', ') : 'None'}
- Medical Conditions: ${userProfile.medicalConditions?.length ? userProfile.medicalConditions.join(', ') : 'None'}

Meal Type: ${mealType}

Please provide 5-7 personalized food recommendations suitable for ${mealType}. For each recommendation, provide:
1. Food name
2. Brief description (one sentence)
3. Estimated calories (per standard serving)
4. Protein content (in grams)
5. Carbohydrates content (in grams)
6. Fats content (in grams)
7. Serving size
8. Why it's good for this user (one sentence)

Format your response as a valid JSON array with the following structure:
[
  {
    "name": "Food Name",
    "description": "Brief description",
    "calories": 250,
    "protein": 20,
    "carbs": 30,
    "fats": 8,
    "servingSize": "100g",
    "recommendation": "Why this is good for you"
  }
]

IMPORTANT: Return ONLY the JSON array, no additional text or explanation.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      // Clean the response to extract only the JSON array
      let jsonText = text.trim();
      
      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Try to find JSON array in the response
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      const recommendations = JSON.parse(jsonText);
      
      return {
        success: true,
        data: recommendations,
        model: modelName,
        mealType: mealType
      };
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response:', text);
      
      // Return a fallback response
      return {
        success: false,
        error: 'Failed to parse AI response',
        rawResponse: text,
        model: modelName
      };
    }
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error(`AI recommendation failed: ${error.message}`);
  }
};

/**
 * Analyze a food item and provide nutritional information
 * @param {String} foodName - Name of the food item
 * @param {String} modelName - Gemini model to use
 * @returns {Promise<Object>} - Nutritional information
 */
export const analyzeFoodItem = async (foodName, modelName = 'gemini-2.0-flash-exp') => {
  try {
    if (!modelNames.includes(modelName)) {
      modelName = 'gemini-2.0-flash-exp';
    }

    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `
You are a nutrition database AI. Provide detailed nutritional information for the following food item: "${foodName}"

Return the information as a valid JSON object with this exact structure:
{
  "name": "Standardized food name",
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fats": 0,
  "servingSize": "100g",
  "fiber": 0,
  "sugar": 0,
  "sodium": 0,
  "description": "Brief nutritional description"
}

IMPORTANT: Return ONLY the JSON object, no additional text. All numeric values should be per 100g serving unless otherwise specified.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      let jsonText = text.trim();
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      const nutritionData = JSON.parse(jsonText);
      
      return {
        success: true,
        data: nutritionData,
        model: modelName
      };
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return {
        success: false,
        error: 'Failed to parse AI response',
        rawResponse: text
      };
    }
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error(`Food analysis failed: ${error.message}`);
  }
};

/**
 * Search for foods based on a query
 * @param {String} query - Search query
 * @param {Object} userProfile - User's dietary preferences
 * @param {String} modelName - Gemini model to use
 * @returns {Promise<Object>} - Search results
 */
export const searchFoods = async (query, userProfile = {}, modelName = 'gemini-2.0-flash-exp') => {
  try {
    if (!modelNames.includes(modelName)) {
      modelName = 'gemini-2.0-flash-exp';
    }

    const model = genAI.getGenerativeModel({ model: modelName });

    const dietaryInfo = userProfile.dietaryPreferences ? `
User Dietary Preferences:
- Diet Type: ${userProfile.dietaryPreferences.dietType || 'No preference'}
- Allergies: ${userProfile.dietaryPreferences.allergies?.join(', ') || 'None'}
- Dislikes: ${userProfile.dietaryPreferences.dislikes?.join(', ') || 'None'}
` : '';

    const prompt = `
You are a food search AI. Find foods matching this query: "${query}"

${dietaryInfo}

Provide 5-10 food items that match the search query. For each item, provide:
1. Name
2. Brand (if applicable, otherwise "Generic")
3. Calories per serving
4. Protein, Carbs, and Fats
5. Standard serving size
6. Whether it's verified/common (true/false)

Format as a JSON array:
[
  {
    "name": "Food Name",
    "brand": "Brand or Generic",
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fats": 0,
    "servingSize": "100g",
    "verified": true
  }
]

IMPORTANT: Return ONLY the JSON array, no additional text. Prioritize foods that match the user's dietary preferences.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      let jsonText = text.trim();
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      const searchResults = JSON.parse(jsonText);
      
      return {
        success: true,
        data: searchResults,
        model: modelName,
        query: query
      };
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return {
        success: false,
        error: 'Failed to parse AI response',
        rawResponse: text
      };
    }
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error(`Food search failed: ${error.message}`);
  }
};

export default {
  getFoodRecommendations,
  analyzeFoodItem,
  searchFoods,
  modelNames
};
