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
  const activeClasses = 'text-emerald-500 scale-105';
  const inactiveClasses = 'text-slate-500 hover:text-emerald-500';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full p-2 transition-all duration-300 ease-in-out ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className={`text-xs mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </button>
  );
};

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-t-lg flex justify-around h-16 z-20">
      <NavItem
        label="Bakım Takvimi"
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
        label="Durum Kontrolü"
        icon={<CameraIcon />}
        isActive={activeTab === Tab.Check}
        onClick={() => setActiveTab(Tab.Check)}
      />
      <NavItem
        label="Görsel Editör"
        icon={<WandIcon />}
        isActive={activeTab === Tab.ImageEditor}
        onClick={() => setActiveTab(Tab.ImageEditor)}
      />
    </nav>
  );
};

export default Navbar;