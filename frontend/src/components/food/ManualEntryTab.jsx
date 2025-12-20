import { IconApple, IconWeight, IconRuler, IconFlame, IconMeat, IconBread, IconDroplet, IconPlus } from '@tabler/icons-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const ManualEntryTab = ({
    customFood,
    onCustomFoodChange,
    onSubmit,
    selectedMealType
}) => {
    const units = ['g', 'ml', 'oz', 'cup', 'tbsp', 'tsp', 'piece'];

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <IconApple className="w-5 h-5 text-primary" stroke={2} />
                        Enter Food Details
                    </CardTitle>
                    <CardDescription>
                        Manually add nutrition information
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Food Name and Quantity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                <IconApple size={14} />
                                Food Name
                            </label>
                            <input
                                type="text"
                                value={customFood.name}
                                onChange={(e) => onCustomFoodChange({ ...customFood, name: e.target.value })}
                                placeholder="e.g., Grilled Chicken"
                                required
                                className="w-full px-4 py-2.5 bg-background border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                    <IconWeight size={14} />
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    value={customFood.quantity}
                                    onChange={(e) => onCustomFoodChange({ ...customFood, quantity: e.target.value })}
                                    placeholder="100"
                                    required
                                    className="w-full px-3 py-2.5 bg-background border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                    <IconRuler size={14} />
                                    Unit
                                </label>
                                <Select
                                    value={customFood.unit}
                                    onValueChange={(value) => onCustomFoodChange({ ...customFood, unit: value })}
                                >
                                    <SelectTrigger className="h-[42px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units.map((unit) => (
                                            <SelectItem key={unit} value={unit}>
                                                {unit}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Calories */}
                    <div>
                        <label className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <IconFlame size={14} />
                            Calories
                        </label>
                        <input
                            type="number"
                            value={customFood.calories}
                            onChange={(e) => onCustomFoodChange({ ...customFood, calories: e.target.value })}
                            placeholder="250"
                            required
                            className="w-full px-4 py-2.5 bg-background border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Macros */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Macronutrients (grams)</label>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                    <IconMeat size={14} />
                                    Protein
                                </label>
                                <input
                                    type="number"
                                    value={customFood.protein}
                                    onChange={(e) => onCustomFoodChange({ ...customFood, protein: e.target.value })}
                                    placeholder="20"
                                    className="w-full px-3 py-2 bg-background border-2 border-border rounded-lg focus:border-primary focus:outline-none text-sm transition-colors"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                    <IconBread size={14} />
                                    Carbs
                                </label>
                                <input
                                    type="number"
                                    value={customFood.carbs}
                                    onChange={(e) => onCustomFoodChange({ ...customFood, carbs: e.target.value })}
                                    placeholder="30"
                                    className="w-full px-3 py-2 bg-background border-2 border-border rounded-lg focus:border-primary focus:outline-none text-sm transition-colors"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                    <IconDroplet size={14} />
                                    Fats
                                </label>
                                <input
                                    type="number"
                                    value={customFood.fats}
                                    onChange={(e) => onCustomFoodChange({ ...customFood, fats: e.target.value })}
                                    placeholder="10"
                                    className="w-full px-3 py-2 bg-background border-2 border-border rounded-lg focus:border-primary focus:outline-none text-sm transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full py-4 bg-linear-to-r from-primary to-accent text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                <IconPlus className="w-5 h-5" stroke={2.5} />
                Add to {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}
            </button>
        </form>
    );
};

export default ManualEntryTab;
