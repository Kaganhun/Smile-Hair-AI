import React, { useState } from 'react';
import { Tab } from './types';
import Navbar from './components/Navbar';
import CareCalendar from './components/CareCalendar';
import AiCoachChat from './components/AiCoachChat';
import StatusCheck from './components/StatusCheck';
import ImageEditor from './components/ImageEditor';
import Logo from './components/icons/Logo';

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
    <div className="min-h-screen bg-gray-50 text-slate-800 flex flex-col font-sans">
      <header className="px-6 py-4 bg-white shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center space-x-3">
             <div className="text-blue-600">
               <Logo className="w-9 h-9" />
             </div>
             <div className="flex flex-col">
                <h1 className="text-lg font-bold text-slate-800 leading-tight tracking-tight">
                  YSF Hair Clinic
                </h1>
                <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-widest">
                  Patient Companion
                </span>
             </div>
          </div>
          {/* Optional: Profile Icon or Notification Bell could go here */}
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 pb-24 max-w-2xl">
        <div key={activeTab} className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
      
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;