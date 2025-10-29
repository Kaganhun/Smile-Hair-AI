import React, { useState } from 'react';
import { Tab } from './types';
import Navbar from './components/Navbar';
import CareCalendar from './components/CareCalendar';
import AiCoachChat from './components/AiCoachChat';
import StatusCheck from './components/StatusCheck';
import ImageEditor from './components/ImageEditor';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Calendar);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Calendar:
        return <CareCalendar />;
      case Tab.Chat:
        return <AiCoachChat />;
      case Tab.Check:
        return <StatusCheck />;
      case Tab.ImageEditor:
        return <ImageEditor />;
      default:
        return <CareCalendar />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <header className="p-4 bg-white shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center text-emerald-600">
          Smile Hair AI Coach
        </h1>
      </header>
      
      <main className="flex-grow container mx-auto p-4 pb-24">
        <div key={activeTab} className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
      
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;