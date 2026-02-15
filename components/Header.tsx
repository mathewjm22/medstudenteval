
import React from 'react';
import { Preceptor } from '../types';

export type View = 'Dashboard' | 'Students' | 'Schedule' | 'Resources' | 'Concepts' | 'AI Summary';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onExport?: () => void;
  onImport?: () => void;
  preceptor: Preceptor;
  onEditProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onNavigate, 
  onExport, 
  onImport, 
  preceptor, 
  onEditProfile 
}) => {
  const navItems: View[] = ['Dashboard', 'Students', 'Concepts', 'AI Summary', 'Schedule', 'Resources'];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#1a202c] border-b border-[#f0f2f4] dark:border-gray-700 px-6 py-3 shadow-sm no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => onNavigate('Dashboard')}
          >
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined">local_hospital</span>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight dark:text-white">MedTrack Preceptor</h2>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => onNavigate(item)}
                className={`text-sm font-medium transition-colors px-2 py-1 rounded-md ${
                  currentView === item 
                    ? 'text-primary bg-primary/5 font-bold' 
                    : 'text-[#616f89] hover:text-primary dark:text-gray-400 dark:hover:text-primary'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 sm:pr-4 mr-1">
            <button 
              onClick={onExport}
              className="p-2 text-[#616f89] hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all flex flex-col items-center group relative"
              title="Export Student Data"
            >
              <span className="material-symbols-outlined text-xl">cloud_download</span>
              <span className="hidden lg:block text-[10px] font-bold mt-0.5">EXPORT</span>
            </button>
            <button 
              onClick={onImport}
              className="p-2 text-[#616f89] hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all flex flex-col items-center group relative"
              title="Import Student Data"
            >
              <span className="material-symbols-outlined text-xl">cloud_upload</span>
              <span className="hidden lg:block text-[10px] font-bold mt-0.5">IMPORT</span>
            </button>
          </div>
          
          <button 
            aria-label="Preceptor Profile" 
            onClick={onEditProfile}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <div 
              className="size-10 rounded-full bg-cover bg-center border border-gray-200 dark:border-gray-700" 
              style={{ backgroundImage: `url('${preceptor.avatar}')` }}
            ></div>
            <span className="material-symbols-outlined text-gray-400 hidden sm:block">arrow_drop_down</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
