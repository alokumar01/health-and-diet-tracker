import axiosClient from './axiosClient';

export const foodApi = {
  // Add food
  addFood: async (data) => {
    const response = await axiosClient.post('/user/food', data);
    return response.data;
  },

  // Get food entries for a specific date
  getFoodByDate: async (date) => {
    const response = await axiosClient.get(`/user/food/date?date=${date}`);
    return response.data;
  },

  // Get food entries for a date range
  getFoodRange: async (startDate, endDate) => {
    const response = await axiosClient.get(
      `/user/food/range?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  // Update food
  updateFood: async (id, data) => {
    const response = await axiosClient.put(`/user/food/${id}`, data);
    return response.data;
  },

  // Delete food
  deleteFood: async (id) => {
    const response = await axiosClient.delete(`/user/food/${id}`);
    return response.data;
  },

  // AI-powered food recommendations
  getAIRecommendations: async (mealType = 'any', model = 'gemini-2.0-flash-exp') => {
    const response = await axiosClient.get(
      `/user/food/ai/recommendations?mealType=${mealType}&model=${model}`
    );
    return response.data;
  },

  // AI-powered food search
  searchFoodsAI: async (query, model = 'gemini-2.0-flash-exp') => {
    const response = await axiosClient.get(
      `/user/food/ai/search?query=${encodeURIComponent(query)}&model=${model}`
    );
    return response.data;
  },

  // Analyze food using AI
  analyzeFoodAI: async (foodName, model = 'gemini-2.0-flash-exp') => {
    const response = await axiosClient.post('/user/food/ai/analyze', {
      foodName,
      model
    });
    return response.data;
  }
};

export default foodApi;
