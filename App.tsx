import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Dashboard from './components/Dashboard';
import CameraCapture from './components/CameraCapture';
import ResultCard from './components/ResultCard';
import { analyzeFoodImage } from './services/geminiService';
import { ViewState, FoodEntry, FoodAnalysisResult } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<FoodAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('snapcal_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load entries", e);
      }
    }
  }, []);

  // Save to local storage whenever entries change
  useEffect(() => {
    localStorage.setItem('snapcal_entries', JSON.stringify(entries));
  }, [entries]);

  const handleCapture = async (imageData: string) => {
    setCurrentImage(imageData);
    setView(ViewState.RESULT);
    setIsAnalyzing(true);
    setCurrentAnalysis(null);

    try {
      const result = await analyzeFoodImage(imageData);
      setCurrentAnalysis(result);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze image. Please try again.");
      setView(ViewState.DASHBOARD); // Or back to camera
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveEntry = () => {
    if (currentAnalysis && currentImage) {
      const newEntry: FoodEntry = {
        ...currentAnalysis,
        id: uuidv4(),
        timestamp: Date.now(),
        imageUrl: currentImage,
      };
      setEntries(prev => [newEntry, ...prev]);
      setView(ViewState.DASHBOARD);
      setCurrentImage(null);
      setCurrentAnalysis(null);
    }
  };

  const handleDiscard = () => {
    setView(ViewState.DASHBOARD);
    setCurrentImage(null);
    setCurrentAnalysis(null);
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden">
      
      {view === ViewState.DASHBOARD && (
        <Dashboard 
          entries={entries} 
          onOpenCamera={() => setView(ViewState.CAMERA)} 
        />
      )}

      {view === ViewState.CAMERA && (
        <CameraCapture 
          onCapture={handleCapture} 
          onClose={() => setView(ViewState.DASHBOARD)} 
        />
      )}

      {view === ViewState.RESULT && currentImage && (
        <ResultCard
          imageSrc={currentImage}
          analysis={currentAnalysis}
          loading={isAnalyzing}
          onSave={handleSaveEntry}
          onDiscard={handleDiscard}
        />
      )}

    </div>
  );
};

export default App;