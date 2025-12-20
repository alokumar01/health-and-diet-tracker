import { IconSparkles, IconFlame, IconMeat, IconBread, IconDroplet, IconLoader2, IconPlus } from '@tabler/icons-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';

const AIRecommendationsTab = ({
    selectedMealType,
    aiModel,
    onModelChange,
    aiRecommendations,
    loadingAI,
    onLoadRecommendations,
    onAddFood
}) => {
    const aiModels = [
        { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash (Fast)', icon: '⚡' },
        { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Balanced)', icon: '⚖️' },
        { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Best)', icon: '🏆' },
    ];

    return (
        <div className="space-y-4">
            {!aiRecommendations.length ? (
                <Card className="border-2 border-primary/20 bg-linear-to-br from-primary/5 to-accent/5">
                    <CardContent className="p-8 text-center">
                        <div className="mb-6">
                            <div className="w-20 h-20 mx-auto mb-4 bg-linear-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                                <IconSparkles className="w-10 h-10 text-primary" stroke={2} />
                            </div>
                            <CardTitle className="text-2xl mb-2">AI-Powered Recommendations</CardTitle>
                            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                Let AI suggest healthy foods perfect for your {selectedMealType}
                            </p>
                            <button
                                onClick={onLoadRecommendations}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-primary to-accent text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                            >
                                <IconSparkles className="w-5 h-5" stroke={2} />
                                Get AI Recommendations
                            </button>
                        </div>

                        <div className="pt-6 border-t border-border/50">
                            <label className="block text-sm font-medium mb-2">AI Model</label>
                            <Select value={aiModel} onValueChange={onModelChange}>
                                <SelectTrigger className="w-full max-w-xs mx-auto">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {aiModels.map((model) => (
                                        <SelectItem key={model.value} value={model.value}>
                                            <span className="flex items-center gap-2">
                                                <span>{model.icon}</span>
                                                {model.label}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">AI Suggestions for {selectedMealType}</h3>
                        <Select value={aiModel} onValueChange={onModelChange}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {aiModels.map((model) => (
                                    <SelectItem key={model.value} value={model.value}>
                                        {model.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {loadingAI ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <IconLoader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" stroke={2} />
                                <p className="text-muted-foreground">AI is analyzing your profile...</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {aiRecommendations.map((food, index) => (
                                <Card key={index} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg mb-1">{food.name}</CardTitle>
                                                <CardDescription className="text-sm">
                                                    {food.reason}
                                                </CardDescription>
                                            </div>
                                            <button
                                                onClick={() => onAddFood(food)}
                                                className="ml-4 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition shrink-0"
                                            >
                                                <IconPlus className="w-5 h-5" stroke={2.5} />
                                            </button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                <IconFlame className="w-3 h-3" />
                                                {food.calories} cal
                                            </Badge>
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                <IconMeat className="w-3 h-3" />
                                                P: {food.protein}g
                                            </Badge>
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                <IconBread className="w-3 h-3" />
                                                C: {food.carbs}g
                                            </Badge>
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                <IconDroplet className="w-3 h-3" />
                                                F: {food.fats}g
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AIRecommendationsTab;
