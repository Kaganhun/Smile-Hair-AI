import React, { useState, useEffect } from 'react';
import { CARE_SCHEDULE } from '../constants';

const CareCalendar: React.FC = () => {
  const [opDate, setOpDate] = useState<Date | null>(() => {
    const savedDate = localStorage.getItem('opDate');
    return savedDate ? new Date(savedDate) : null;
  });

  useEffect(() => {
    if (opDate) {
      localStorage.setItem('opDate', opDate.toISOString());
    }
  }, [opDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setOpDate(new Date(e.target.value));
    }
  };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">Kişiselleştirilmiş Bakım Takvimi</h2>
      
      {!opDate ? (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-emerald-100 dark:border-slate-700 animate-scale-in">
          <h3 className="text-lg font-semibold mb-2 text-emerald-600 dark:text-emerald-400">Hoş Geldiniz!</h3>
          <p className="mb-4 text-slate-600 dark:text-slate-300">Bakım takviminizi oluşturmak için lütfen operasyon tarihinizi seçin.</p>
          <input
            type="date"
            onChange={handleDateChange}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      ) : (
        <div>
           <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm mb-6 flex items-center justify-between">
            <div>
              <label htmlFor="op-date-picker" className="block text-sm font-medium text-slate-500 dark:text-slate-400">Operasyon Tarihiniz</label>
              <input
                id="op-date-picker"
                type="date"
                value={opDate.toISOString().split('T')[0]}
                onChange={handleDateChange}
                className="p-1 border-b-2 border-slate-200 dark:border-slate-600 bg-transparent text-slate-900 dark:text-slate-200 focus:border-emerald-500 outline-none"
              />
            </div>
            <button onClick={() => setOpDate(null)} className="text-sm text-red-500 hover:underline">Sıfırla</button>
          </div>

          <div className="space-y-4">
            {CARE_SCHEDULE.map((task, index) => {
              const taskDate = new Date(opDate);
              taskDate.setDate(opDate.getDate() + task.day - 1);
              const isToday = taskDate.getTime() === today.getTime();

              return (
                <div 
                  key={task.day} 
                  className={`p-4 rounded-lg transition-all duration-300 opacity-0 animate-slide-in-up ${isToday ? 'bg-emerald-100 dark:bg-emerald-900/50 shadow-lg border-l-4 border-emerald-500 scale-105' : 'bg-white dark:bg-slate-800 shadow-md'}`}
                  style={{ animationFillMode: 'forwards', animationDelay: `${index * 70}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-emerald-700 dark:text-emerald-400">
                      {task.day}. Gün - {task.title}
                    </h4>
                    <span className="text-2xl">{task.icon}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-2">{task.description}</p>
                   {isToday && <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2">BUGÜN</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareCalendar;