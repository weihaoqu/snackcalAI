import React from 'react';
import { Check, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { FoodAnalysisResult } from '../types';
import MacroChart from './MacroChart';

interface ResultCardProps {
  imageSrc: string;
  analysis: FoodAnalysisResult | null;
  loading: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ imageSrc, analysis, loading, onSave, onDiscard }) => {
  return (
    <div className="fixed inset-0 bg-white z-40 flex flex-col overflow-y-auto animate-in slide-in-from-bottom duration-300">
      {/* Image Header */}
      <div className="relative h-72 w-full shrink-0">
        <img src={imageSrc} alt="Captured Food" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            {loading ? (
                 <div className="flex items-center text-white/90 gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span className="text-lg font-medium">Analyzing your meal...</span>
                 </div>
            ) : (
                <h1 className="text-3xl font-bold text-white">{analysis?.foodName || "Unknown Dish"}</h1>
            )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-white -mt-6 rounded-t-3xl relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-500">
             <div className="w-full space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                <div className="h-32 bg-gray-50 rounded-xl w-full animate-pulse mt-8"></div>
             </div>
          </div>
        ) : analysis ? (
          <div className="space-y-8 pb-24">
            
            {/* Overview Stats */}
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{analysis.totalCalories}</div>
                    <div className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Calories</div>
                </div>
                 <div className="h-8 w-px bg-slate-200"></div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{analysis.macros.protein}g</div>
                    <div className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Protein</div>
                </div>
                 <div className="h-8 w-px bg-slate-200"></div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analysis.macros.carbs}g</div>
                    <div className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Carbs</div>
                </div>
                 <div className="h-8 w-px bg-slate-200"></div>
                 <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">{analysis.macros.fat}g</div>
                    <div className="text-xs uppercase font-semibold text-slate-500 tracking-wider">Fat</div>
                </div>
            </div>

            {/* Macro Chart */}
            <div className="flex items-center justify-center py-2">
                <MacroChart macros={analysis.macros} size="lg" />
            </div>

            {/* Details */}
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Ingredients Breakdown</h3>
                <ul className="space-y-3">
                    {analysis.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-slate-700 font-medium">{ing.name}</span>
                            <span className="text-slate-500">~{ing.estimatedCalories} kcal</span>
                        </li>
                    ))}
                </ul>
            </div>

            {analysis.confidenceScore < 0.6 && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-800 rounded-xl text-sm">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <p>The AI wasn't entirely sure about this image. Please verify the nutritional values.</p>
                </div>
            )}

          </div>
        ) : (
             <div className="text-center py-10 text-red-500">
                <AlertCircle className="mx-auto mb-2" size={32}/>
                <p>Could not analyze image. Please try again.</p>
            </div>
        )}
      </div>

      {/* Footer Actions */}
      {!loading && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 flex gap-4 items-center z-50 pb-6 safe-area-bottom">
            <button 
                onClick={onDiscard}
                className="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors flex justify-center items-center gap-2"
            >
                <Trash2 size={20} />
                Discard
            </button>
            <button 
                onClick={onSave}
                disabled={!analysis}
                className="flex-1 py-4 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Check size={20} />
                Log Meal
            </button>
          </div>
      )}
    </div>
  );
};

export default ResultCard;