import { IconSearch, IconLoader2, IconFlame, IconMeat, IconBread, IconDroplet, IconPlus, IconSparkles } from '@tabler/icons-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { getFoodsByCategory } from '../../data/foodDatabase';

const SearchTab = ({
    searchQuery,
    onSearchChange,
    onSearch,
    searchResults,
    searching,
    onAddFood,
    categories,
    selectedCategory,
    onCategoryChange
}) => {
    const displayResults = searchResults.length > 0 ? searchResults : 
                          selectedCategory !== 'All' ? getFoodsByCategory(selectedCategory) : [];

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" stroke={2} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                                placeholder="Search for food items..."
                                className="w-full pl-10 pr-4 py-3 bg-background border-2 border-border rounded-xl focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>
                        <button
                            onClick={onSearch}
                            disabled={!searchQuery || searching}
                            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {searching ? (
                                <IconLoader2 className="w-5 h-5 animate-spin" stroke={2} />
                            ) : (
                                <>
                                    <IconSearch className="w-5 h-5" stroke={2} />
                                    Search
                                </>
                            )}
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Category Filter */}
            {!searchQuery && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => onCategoryChange(category)}
                            className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                                selectedCategory === category
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-card border border-border hover:border-primary'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}

            {/* Results */}
            {searching ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <IconLoader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" stroke={2} />
                        <p className="text-muted-foreground">Searching for "{searchQuery}"...</p>
                    </CardContent>
                </Card>
            ) : displayResults.length > 0 ? (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {searchQuery ? `Found ${displayResults.length} results` : `${selectedCategory} foods`}
                        </p>
                    </div>
                    <div className="grid gap-3">
                        {displayResults.map((food, index) => (
                            <Card key={index} className="hover:shadow-lg transition-all hover:scale-[1.01]">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-base truncate">{food.name}</h3>
                                                {food.category && (
                                                    <Badge variant="outline" className="text-xs shrink-0">
                                                        {food.category}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-3">
                                                Per {food.serving}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                                    <IconFlame className="w-3 h-3" />
                                                    {food.calories} cal
                                                </Badge>
                                                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                                    <IconMeat className="w-3 h-3" />
                                                    P: {food.protein}g
                                                </Badge>
                                                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                                    <IconBread className="w-3 h-3" />
                                                    C: {food.carbs}g
                                                </Badge>
                                                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                                    <IconDroplet className="w-3 h-3" />
                                                    F: {food.fats}g
                                                </Badge>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onAddFood(food)}
                                            className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shrink-0"
                                            title="Add to meal"
                                        >
                                            <IconPlus className="w-5 h-5" stroke={2.5} />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : searchQuery ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <IconSearch className="w-16 h-16 mx-auto mb-4 text-muted-foreground" stroke={1.5} />
                        <p className="text-muted-foreground mb-2">No results found for "{searchQuery}"</p>
                        <p className="text-sm text-muted-foreground">Try a different search or use manual entry</p>
                    </CardContent>
                </Card>
            ) : null}
        </div>
    );
};

export default SearchTab;
