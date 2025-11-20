export interface MacroBreakdown {
  protein: number;
  carbs: number;
  fat: number;
}

export interface Ingredient {
  name: string;
  estimatedCalories: number;
}

export interface FoodAnalysisResult {
  foodName: string;
  description: string;
  totalCalories: number;
  macros: MacroBreakdown;
  ingredients: Ingredient[];
  confidenceScore: number; // 0-1
}

export interface FoodEntry extends FoodAnalysisResult {
  id: string;
  timestamp: number;
  imageUrl: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CAMERA = 'CAMERA',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
}