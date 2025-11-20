import React from 'react';
import { Plus, Utensils } from 'lucide-react';
import { FoodEntry } from '../types';
import MacroChart from './MacroChart';

interface DashboardProps {
  entries: FoodEntry[];
  onOpenCamera: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ entries, onOpenCamera }) => {
  
  const today = new Date();
  const todayEntries = entries.filter(e => {
    const date = new Date(e.timestamp);
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  });

  const totalCalories = todayEntries.reduce((acc, curr) => acc + curr.totalCalories, 0);
  const totalProtein = todayEntries.reduce((acc, curr) => acc + curr.macros.protein, 0);
  const totalCarbs = todayEntries.reduce((acc, curr) => acc + curr.macros.carbs, 0);
  const totalFat = todayEntries.reduce((acc, curr) => acc + curr.macros.fat, 0);

  return (
    <div className="min-h-screen pb-24">
        {/* Header Area */}
        <div className="bg-emerald-600 text-white pt-12 pb-16 px-6 rounded-b-[2.5rem] shadow-lg shadow-emerald-100">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-emerald-100 font-medium mb-1">Today's Intake</h2>
                    <h1 className="text-4xl font-bold">{totalCalories} <span className="text-xl font-normal text-emerald-200">kcal</span></h1>
                </div>
                <div className="bg-emerald-500/30 p-2 rounded-lg backdrop-blur-sm">
                    <Utensils size={24} className="text-emerald-50" />
                </div>
            </div>

            <div className="flex gap-4">
                <div className="bg-emerald-700/40 flex-1 rounded-xl p-3 backdrop-blur-sm">
                    <div className="text-xs text-emerald-200 uppercase tracking-wider mb-1">Protein</div>
                    <div className="font-bold text-xl">{totalProtein.toFixed(0)}g</div>
                </div>
                <div className="bg-emerald-700/40 flex-1 rounded-xl p-3 backdrop-blur-sm">
                    <div className="text-xs text-emerald-200 uppercase tracking-wider mb-1">Carbs</div>
                    <div className="font-bold text-xl">{totalCarbs.toFixed(0)}g</div>
                </div>
                <div className="bg-emerald-700/40 flex-1 rounded-xl p-3 backdrop-blur-sm">
                    <div className="text-xs text-emerald-200 uppercase tracking-wider mb-1">Fat</div>
                    <div className="font-bold text-xl">{totalFat.toFixed(0)}g</div>
                </div>
            </div>
        </div>

        {/* List */}
        <div className="px-6 -mt-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[200px]">
                <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-800">Recent Meals</h3>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{todayEntries.length} items</span>
                </div>
                
                {entries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                            <Utensils size={32} />
                        </div>
                        <p>No meals tracked yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {entries.sort((a,b) => b.timestamp - a.timestamp).map(entry => (
                            <div key={entry.id} className="p-4 flex gap-4 items-center hover:bg-slate-50 transition-colors">
                                <img src={entry.imageUrl} alt={entry.foodName} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-slate-900 truncate">{entry.foodName}</h4>
                                    <p className="text-xs text-slate-500 truncate">{new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {entry.totalCalories} kcal</p>
                                </div>
                                <div className="shrink-0">
                                    <MacroChart macros={entry.macros} size="sm" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* FAB */}
        <button 
            onClick={onOpenCamera}
            className="fixed bottom-6 right-6 w-16 h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-emerald-300 shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-30"
        >
            <Plus size={32} />
        </button>
    </div>
  );
};

export default Dashboard;