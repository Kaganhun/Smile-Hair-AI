import React from 'react';
import { Tab } from '../types';
import CalendarIcon from './icons/CalendarIcon';
import ChatIcon from './icons/ChatIcon';
import CameraIcon from './icons/CameraIcon';
import WandIcon from './icons/WandIcon';

interface NavbarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  // Changed from emerald to blue
  const activeClasses = 'text-blue-600 scale-105';
  const inactiveClasses = 'text-slate-400 hover:text-blue-500';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full p-2 transition-all duration-300 ease-in-out ${isActive ? activeClasses : inactiveClasses}`}
    >
      <div className={`${isActive ? 'bg-blue-50 rounded-xl px-4 py-1' : ''} transition-all duration-300`}>
        {icon}
      </div>
      <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </button>
  );
};

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-around h-20 z-20 pb-4 pt-2 transition-colors duration-300">
      <NavItem
        label="Takvim"
        icon={<CalendarIcon />}
        isActive={activeTab === Tab.Calendar}
        onClick={() => setActiveTab(Tab.Calendar)}
      />
      <NavItem
        label="AI Koç"
        icon={<ChatIcon />}
        isActive={activeTab === Tab.Chat}
        onClick={() => setActiveTab(Tab.Chat)}
      />
      <NavItem
        label="Kontrol"
        icon={<CameraIcon />}
        isActive={activeTab === Tab.Check}
        onClick={() => setActiveTab(Tab.Check)}
      />
      <NavItem
        label="Editör"
        icon={<WandIcon />}
        isActive={activeTab === Tab.ImageEditor}
        onClick={() => setActiveTab(Tab.ImageEditor)}
      />
    </nav>
  );
};

export default Navbar;