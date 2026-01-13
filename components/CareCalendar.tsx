import React, { useState, useEffect } from 'react';
import { CARE_SCHEDULE } from '../constants';
import CalendarIcon from './icons/CalendarIcon';

const CareCalendar: React.FC = () => {
  const [opDate, setOpDate] = useState<Date | null>(() => {
    const savedDate = localStorage.getItem('opDate');
    return savedDate ? new Date(savedDate) : null;
  });

  const [tempDate, setTempDate] = useState<string>('');

  useEffect(() => {
    if (opDate) {
      localStorage.setItem('opDate', opDate.toISOString());
    }
  }, [opDate]);

  const handleStartJourney = () => {
    if (tempDate) {
      setOpDate(new Date(tempDate));
    }
  };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Helper to format date nicely
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' }).format(date);
  };

  if (!opDate) {
    return (
      <div className="flex flex-col items-center justify-center pt-8 px-2 animate-fade-in h-full">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white w-full max-w-sm text-center relative overflow-hidden">
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 rounded-tr-full -ml-8 -mb-8 z-0"></div>

          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 transform rotate-3">
              <CalendarIcon className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Hoş Geldiniz</h2>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed px-4">
              İyileşme sürecinizi takip etmek ve size özel bakım planınızı oluşturmak için operasyon tarihinizi seçin.
            </p>
            
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400">📅</span>
                </div>
                <input
                  type="date"
                  onChange={(e) => setTempDate(e.target.value)}
                  className={`block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:ring-0 focus:border-blue-500 outline-none transition-all cursor-pointer appearance-none text-center h-16 ${!tempDate ? 'text-transparent' : 'text-slate-800'}`}
                  placeholder="Tarih Seçin"
                />
                {!tempDate && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 font-medium">
                    Tarih Seçiniz
                  </div>
                )}
              </div>

              <button
                onClick={handleStartJourney}
                disabled={!tempDate}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none transition-all duration-200 transform active:scale-[0.98]"
              >
                Takvimi Oluştur
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto pb-8">
      {/* Header Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 flex items-center justify-between animate-slide-in-up">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Operasyon Tarihi</p>
          <p className="text-lg font-bold text-slate-800">{opDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <button 
          onClick={() => setOpDate(null)} 
          className="bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 px-4 py-2 rounded-xl text-xs font-bold transition-colors duration-200"
        >
          Değiştir
        </button>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-6 px-2 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
        Bakım Süreci
      </h3>

      {/* Timeline Container */}
      <div className="relative border-l-2 border-dashed border-blue-100 ml-4 md:ml-6 space-y-10">
        {CARE_SCHEDULE.map((task, index) => {
          const taskDate = new Date(opDate);
          taskDate.setDate(opDate.getDate() + task.day - 1);
          
          // Reset hours for accurate comparison
          taskDate.setHours(0, 0, 0, 0);
          
          const isToday = taskDate.getTime() === today.getTime();
          const isPast = taskDate.getTime() < today.getTime();
          
          return (
            <div 
              key={task.day} 
              className={`relative pl-8 md:pl-10 transition-all duration-500 ${isPast ? 'opacity-50 grayscale' : 'opacity-100'}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Timeline Dot/Icon */}
              <div className={`absolute -left-[14px] top-0 flex items-center justify-center w-7 h-7 rounded-full border-4 border-gray-50 transition-all duration-300 z-10
                ${isToday ? 'bg-blue-600 scale-125 ring-4 ring-blue-100' : isPast ? 'bg-gray-300' : 'bg-white border-blue-200'}`}>
                {isPast ? (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isToday ? (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                ) : (
                  <div className="w-2 h-2 bg-blue-100 rounded-full"></div>
                )}
              </div>

              {/* Date Label (Floating above card on mobile, or next to dot) */}
              <div className={`absolute -top-6 left-8 text-xs font-bold ${isToday ? 'text-blue-600' : 'text-gray-400'}`}>
                {formatDate(taskDate)}
              </div>

              {/* Content Card */}
              <div className={`rounded-3xl p-6 border transition-all duration-300
                ${isToday 
                  ? 'bg-white shadow-xl shadow-blue-200/40 border-blue-100 scale-[1.02] transform' 
                  : 'bg-white shadow-sm border-transparent hover:border-gray-100'
                }
              `}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-black tracking-widest uppercase mb-1 
                      ${isToday ? 'text-blue-600' : 'text-gray-400'}`}>
                      {task.day}. GÜN
                    </span>
                    <h4 className={`text-lg font-bold leading-tight
                      ${isToday ? 'text-slate-800' : 'text-slate-600'}`}>
                      {task.title}
                    </h4>
                  </div>
                  <div className={`text-2xl p-3 rounded-2xl ${isToday ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                    {task.icon}
                  </div>
                </div>
                
                <p className={`text-sm leading-relaxed ${isToday ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                  {task.description}
                </p>

                {isToday && (
                  <div className="mt-4 flex items-center gap-2 pt-2 border-t border-blue-50">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-500/30">
                      Bugün
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CareCalendar;