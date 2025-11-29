import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart3, 
  Utensils, 
  Scale, 
  Target, 
  Flame, 
  TrendingUp, 
  FileText, 
  FileSpreadsheet, 
  Mail,
  Trophy,
  Sparkles,
  TrendingDown
} from 'lucide-react';

export default function ReportsPage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('week'); // week or month
  const [showExportModal, setShowExportModal] = useState(false);

  // Mock data
  const weeklyData = {
    caloriesConsumed: [1780, 1950, 1820, 2100, 1890, 1760, 1940],
    caloriesTarget: 2000,
    caloriesBurned: [420, 380, 500, 320, 450, 410, 390],
    weight: [72.5, 72.3, 72.4, 72.2, 72.0, 71.9, 71.8],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    insights: {
      avgCalories: 1891,
      consistency: 86,
      weightChange: -0.7,
      activeDays: 7
    }
  };

  const monthlyData = {
    avgCalories: 1920,
    consistency: 78,
    weightChange: -2.3,
    activeDays: 27,
    bestWeek: 2
  };

  const data = period === 'week' ? weeklyData : null;

  const handleExport = (format) => {
    console.log(`Exporting as ${format}...`);
    setShowExportModal(false);
  };

  const handleEmailReport = () => {
    console.log('Sending email report...');
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Reports</h1>
              </div>
            </div>

            {/* Period Toggle */}
            <div className="flex gap-2">
              {['week', 'month'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    period === p
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {p === 'week' ? 'Weekly' : 'Monthly'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        
        {/* Insights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-linear-to-br from-primary to-accent rounded-xl p-6 text-white animate-fade-in">
            <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Utensils className="w-7 h-7" />
            </div>
            <div className="text-2xl font-bold">{data.insights.avgCalories}</div>
            <div className="text-sm opacity-90">Avg Daily Calories</div>
            <div className="mt-2 text-xs opacity-75 flex items-center gap-1">
              {data.insights.avgCalories > weeklyData.caloriesTarget ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(data.insights.avgCalories - weeklyData.caloriesTarget)} from target
            </div>
          </div>

          <div className="bg-linear-to-br from-chart-4 to-destructive rounded-xl p-6 text-white animate-fade-in delay-100">
            <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Scale className="w-7 h-7" />
            </div>
            <div className="text-2xl font-bold">{data.insights.weightChange} kg</div>
            <div className="text-sm opacity-90">Weight Change</div>
            <div className="mt-2 text-xs opacity-75 flex items-center gap-1">
              {data.insights.weightChange < 0 ? (
                <>
                  <Trophy className="w-3 h-3" />
                  <span>Great progress!</span>
                </>
              ) : (
                <>
                  <Flame className="w-3 h-3" />
                  <span>Keep going!</span>
                </>
              )}
            </div>
          </div>

          <div className="bg-linear-to-br from-accent to-secondary rounded-xl p-6 text-white animate-fade-in delay-200">
            <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Target className="w-7 h-7" />
            </div>
            <div className="text-2xl font-bold">{data.insights.consistency}%</div>
            <div className="text-sm opacity-90">Consistency Score</div>
            <div className="mt-2 text-xs opacity-75 flex items-center gap-1">
              {data.insights.consistency >= 80 ? (
                <>
                  <Sparkles className="w-3 h-3" />
                  <span>Excellent tracking!</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-3 h-3" />
                  <span>Room to improve</span>
                </>
              )}
            </div>
          </div>

          <div className="bg-linear-to-br from-secondary to-primary rounded-xl p-6 text-white animate-fade-in delay-300">
            <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Flame className="w-7 h-7" />
            </div>
            <div className="text-2xl font-bold">{data.insights.activeDays}</div>
            <div className="text-sm opacity-90">Active Days</div>
            <div className="mt-2 text-xs opacity-75 flex items-center gap-1">
              {data.insights.activeDays === 7 ? (
                <>
                  <Trophy className="w-3 h-3" />
                  <span>Perfect week!</span>
                </>
              ) : (
                <span>{7 - data.insights.activeDays} days missed</span>
              )}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Calories Chart */}
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border animate-slide-in-left delay-400">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Calories Consumed vs Target</h3>
            </div>
            
            <div className="space-y-3">
              {data.days.map((day, i) => {
                const consumed = data.caloriesConsumed[i];
                const target = data.caloriesTarget;
                const percentage = (consumed / target) * 100;
                
                return (
                  <div key={day}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{day}</span>
                      <span className="font-medium text-foreground">{consumed} kcal</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ease-out ${
                          percentage > 110 ? 'bg-destructive' :
                          percentage > 90 ? 'bg-primary' :
                          'bg-chart-4'
                        }`}
                        style={{ 
                          width: `${Math.min(percentage, 100)}%`,
                          transitionDelay: `${500 + i * 50}ms`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-muted rounded-lg flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">On track</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-chart-4 rounded-full"></div>
                <span className="text-muted-foreground">Under target</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                <span className="text-muted-foreground">Over target</span>
              </div>
            </div>
          </div>

          {/* Weight Trend Chart */}
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border animate-slide-in-right delay-400">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10">
                <Scale className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Weight Trend</h3>
            </div>
            
            <div className="relative h-48 flex items-end justify-between gap-2">
              {data.weight.map((weight, i) => {
                const maxWeight = Math.max(...data.weight);
                const minWeight = Math.min(...data.weight);
                const height = ((weight - minWeight) / (maxWeight - minWeight)) * 100 || 50;
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-linear-to-t from-accent to-primary rounded-t-lg relative group transition-all duration-500 ease-out"
                      style={{ 
                        height: `${height}%`,
                        transitionDelay: `${600 + i * 50}ms`
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                        {weight} kg
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{data.days[i]}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-3 bg-primary/10 rounded-lg text-center">
              <p className="text-primary font-medium flex items-center justify-center gap-1">
                {data.insights.weightChange < 0 ? (
                  <TrendingDown className="w-4 h-4" />
                ) : (
                  <TrendingUp className="w-4 h-4" />
                )}
                {Math.abs(data.insights.weightChange)} kg this week
              </p>
              <p className="text-sm text-primary/80 mt-1">
                {data.insights.weightChange < 0 
                  ? 'You\'re making great progress!' 
                : 'Keep up the good work!'}
            </p>
          </div>
        </div>

        </div>

        {/* Export Section */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border animate-fade-in delay-400">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Export Data</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setShowExportModal(true)}
              className="py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
            >
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/20">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <span>Export CSV</span>
            </button>
            
            <button
              onClick={() => handleExport('pdf')}
              className="py-3 bg-destructive text-white rounded-lg font-medium hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2"
            >
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/20">
                <FileText className="w-4 h-4" />
              </div>
              <span>Export PDF</span>
            </button>
            
            <button
              onClick={handleEmailReport}
              className="py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/20">
                <Mail className="w-4 h-4" />
              </div>
              <span>Email Report</span>
            </button>
          </div>

          <p className="text-sm text-muted-foreground mt-4 text-center">
            Your data includes nutrition logs, workout history, and progress metrics
          </p>
        </div>

      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-card rounded-xl p-6 max-w-md w-full animate-scale-in">
            <h3 className="text-xl font-bold text-foreground mb-4">Export to CSV</h3>
            
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                <span className="text-foreground">Nutrition data</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                <span className="text-foreground">Workout logs</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                <span className="text-foreground">Weight history</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                <input type="checkbox" className="w-4 h-4 accent-primary" />
                <span className="text-foreground">Progress photos</span>
              </label>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
