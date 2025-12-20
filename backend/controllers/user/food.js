import Food from '../../models/food.js';
import { getFoodRecommendations, analyzeFoodItem, searchFoods } from '../../services/geminiAI.js';
import User from '../../models/user.js';

// Add food entry
export const addFood = async (req, res, next) => {
  try {
    const {
      name,
      mealType,
      calories,
      protein,
      carbs,
      fats,
      servingSize,
      quantity,
      date,
      time,
      notes,
    } = req.body;

    // Validation
    if (!name || !mealType || !calories || !date) {
      return res.status(400).json({
        success: false,
        message: 'Name, meal type, calories, and date are required',
      });
    }

    const food = await Food.create({
      userId: req.user._id,
      name,
      mealType,
      calories,
      protein: protein || 0,
      carbs: carbs || 0,
      fats: fats || 0,
      servingSize,
      quantity: quantity || 1,
      date: new Date(date),
      time,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Food added successfully',
      data: { food },
    });
  } catch (error) {
    next(error);
  }
};

// Get food entries by date
export const getFoodByDate = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required',
      });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const foods = await Food.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ time: 1, createdAt: -1 });

    // Calculate totals
    const totals = foods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories * food.quantity,
        protein: acc.protein + food.protein * food.quantity,
        carbs: acc.carbs + food.carbs * food.quantity,
        fats: acc.fats + food.fats * food.quantity,
        count: acc.count + 1,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, count: 0 }
    );

    res.status(200).json({
      success: true,
      data: {
        foods,
        totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get food entries for a date range
export const getFoodRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required',
      });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const foods = await Food.find({
      userId: req.user._id,
      date: { $gte: start, $lte: end },
    }).sort({ date: -1, time: 1 });

    // Calculate totals
    const totals = foods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories * food.quantity,
        protein: acc.protein + food.protein * food.quantity,
        carbs: acc.carbs + food.carbs * food.quantity,
        fats: acc.fats + food.fats * food.quantity,
        count: acc.count + 1,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, count: 0 }
    );

    res.status(200).json({
      success: true,
      data: {
        foods,
        totals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update food entry
export const updateFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      mealType,
      calories,
      protein,
      carbs,
      fats,
      servingSize,
      quantity,
      date,
      time,
      notes,
    } = req.body;

    const food = await Food.findOne({ _id: id, userId: req.user._id });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food entry not found',
      });
    }

    // Update fields
    if (name !== undefined) food.name = name;
    if (mealType !== undefined) food.mealType = mealType;
    if (calories !== undefined) food.calories = calories;
    if (protein !== undefined) food.protein = protein;
    if (carbs !== undefined) food.carbs = carbs;
    if (fats !== undefined) food.fats = fats;
    if (servingSize !== undefined) food.servingSize = servingSize;
    if (quantity !== undefined) food.quantity = quantity;
    if (date !== undefined) food.date = new Date(date);
    if (time !== undefined) food.time = time;
    if (notes !== undefined) food.notes = notes;

    await food.save();

    res.status(200).json({
      success: true,
      message: 'Food entry updated successfully',
      data: { food },
    });
  } catch (error) {
    next(error);
  }
};

// Delete food entry
export const deleteFood = async (req, res, next) => {
  try {
    const { id } = req.params;

    const food = await Food.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food entry not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Food entry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get weekly nutrition stats
export const getWeeklyNutritionStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);

    const foods = await Food.find({
      userId: req.user._id,
      date: { $gte: weekAgo, $lte: today },
    });

    const totals = foods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories * food.quantity,
        protein: acc.protein + food.protein * food.quantity,
        carbs: acc.carbs + food.carbs * food.quantity,
        fats: acc.fats + food.fats * food.quantity,
        count: acc.count + 1,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, count: 0 }
    );

    res.status(200).json({
      success: true,
      data: { totals },
    });
  } catch (error) {
    next(error);
  }
};

// AI-powered food recommendations
export const getAIFoodRecommendations = async (req, res, next) => {
  try {
    const { mealType, model } = req.query;
    
    // Get user profile
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get AI recommendations
    const recommendations = await getFoodRecommendations(user, mealType || 'any', model);

    res.status(200).json(recommendations);
  } catch (error) {
    console.error('AI Recommendations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI recommendations',
      error: error.message,
    });
  }
};

// AI-powered food search
export const searchFoodsAI = async (req, res, next) => {
  try {
    const { query, model } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters',
      });
    }

    // Get user profile for dietary preferences
    const user = await User.findById(req.user._id).select('dietaryPreferences');

    // Search using AI
    const searchResults = await searchFoods(query, user || {}, model);

    res.status(200).json(searchResults);
  } catch (error) {
    console.error('AI Search Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search foods',
      error: error.message,
    });
  }
};

// Analyze food item using AI
export const analyzeFoodAI = async (req, res, next) => {
  try {
    const { foodName, model } = req.body;

    if (!foodName) {
      return res.status(400).json({
        success: false,
        message: 'Food name is required',
      });
    }

    // Analyze using AI
    const analysis = await analyzeFoodItem(foodName, model);

    res.status(200).json(analysis);
  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze food',
      error: error.message,
    });
  }
};
