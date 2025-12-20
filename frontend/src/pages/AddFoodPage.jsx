import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconSearch, IconEdit, IconPlus } from '@tabler/icons-react';
import { foodApi } from '../api/foodApi';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MealTypeSelector from '@/components/food/MealTypeSelector';
import SearchTab from '@/components/food/SearchTab';
import ManualEntryTab from '@/components/food/ManualEntryTab';
import { searchFoods, categories } from '../data/foodDatabase';

const AddFoodPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('search');
    const [selectedMealType, setSelectedMealType] = useState('breakfast');

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searching, setSearching] = useState(false);

    // Manual Entry State
    const [customFood, setCustomFood] = useState({
        name: '',
        quantity: '',
        unit: 'g',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
    });

    // Handle search
    const handleSearch = () => {
        if (searchQuery.length < 2) {
            toast.error('Please enter at least 2 characters');
            return;
        }

        setSearching(true);
        
        // Simulate search delay for better UX
        setTimeout(() => {
            const results = searchFoods(searchQuery);
            setSearchResults(results);
            
            if (results.length === 0) {
                toast.info('No results found. Try manual entry!');
            }
            setSearching(false);
        }, 300);
    };

    // Handle manual food submission
    const handleCustomFoodSubmit = async (e) => {
        e.preventDefault();
        try {
            const foodData = {
                name: customFood.name,
                quantity: parseFloat(customFood.quantity),
                servingSize: `${customFood.quantity}${customFood.unit}`,
                calories: parseFloat(customFood.calories),
                protein: parseFloat(customFood.protein) || 0,
                carbs: parseFloat(customFood.carbs) || 0,
                fats: parseFloat(customFood.fats) || 0,
                mealType: selectedMealType,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            };

            await foodApi.addFood(foodData);
            toast.success(`${customFood.name} added to ${selectedMealType}!`);
            
            // Reset form
            setCustomFood({
                name: '',
                quantity: '',
                unit: 'g',
                calories: '',
                protein: '',
                carbs: '',
                fats: '',
            });
            
            // Navigate back
            setTimeout(() => navigate('/nutrition'), 500);
        } catch (error) {
            console.error('Error adding food:', error);
            toast.error(error.response?.data?.message || 'Failed to add food');
        }
    };

    // Add food from search results
    const handleAddFood = async (food) => {
        try {
            // Parse serving size to get quantity
            const servingMatch = food.serving.match(/(\d+)/);
            const quantity = servingMatch ? parseFloat(servingMatch[0]) : 100;
            
            const foodData = {
                name: food.name,
                quantity: quantity,
                servingSize: food.serving,
                calories: food.calories,
                protein: food.protein,
                carbs: food.carbs,
                fats: food.fats,
                mealType: selectedMealType,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            };

            await foodApi.addFood(foodData);
            toast.success(`${food.name} added to ${selectedMealType}!`);
            setTimeout(() => navigate('/nutrition'), 500);
        } catch (error) {
            console.error('Error adding food:', error);
            toast.error(error.response?.data?.message || 'Failed to add food');
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20 pb-8 pt-16">
            {/* Modern Header */}
            <div className="bg-linear-to-r from-primary via-primary/90 to-accent text-white px-4 py-8 sticky top-16 z-10 shadow-lg">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => navigate('/nutrition')}
                            className="p-2.5 hover:bg-white/20 rounded-xl transition-all hover:scale-105 active:scale-95"
                        >
                            <IconArrowLeft className="w-6 h-6" stroke={2.5} />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-1 tracking-tight">Add Food</h1>
                            <p className="text-white/80 text-sm">Search our database or add manually</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 mt-6">
                {/* Meal Type Selection */}
                <MealTypeSelector
                    selectedMealType={selectedMealType}
                    onMealTypeChange={setSelectedMealType}
                />

                {/* Tabs for different input methods */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="search" className="flex items-center gap-2">
                            <IconSearch className="w-4 h-4" stroke={2} />
                            <span>Search Database</span>
                        </TabsTrigger>
                        <TabsTrigger value="manual" className="flex items-center gap-2">
                            <IconEdit className="w-4 h-4" stroke={2} />
                            <span>Manual Entry</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="search">
                        <SearchTab
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onSearch={handleSearch}
                            searchResults={searchResults}
                            searching={searching}
                            onAddFood={handleAddFood}
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                        />
                    </TabsContent>

                    <TabsContent value="manual">
                        <ManualEntryTab
                            customFood={customFood}
                            onCustomFoodChange={setCustomFood}
                            onSubmit={handleCustomFoodSubmit}
                            selectedMealType={selectedMealType}
                        />
                    </TabsContent>
                </Tabs>

                {/* Quick Add Suggestions */}
                {activeTab === 'search' && !searchQuery && searchResults.length === 0 && (
                    <div className="mt-6">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Popular for {selectedMealType}</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {searchFoods(selectedMealType === 'breakfast' ? 'oatmeal' : 
                                          selectedMealType === 'lunch' ? 'chicken' :
                                          selectedMealType === 'dinner' ? 'salmon' : 'protein')
                                .slice(0, 4)
                                .map((food, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAddFood(food)}
                                        className="p-3 bg-card border border-border rounded-xl hover:border-primary hover:shadow-md transition-all text-left"
                                    >
                                        <p className="font-medium text-sm mb-1">{food.name}</p>
                                        <p className="text-xs text-muted-foreground">{food.calories} cal • {food.serving}</p>
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddFoodPage;
