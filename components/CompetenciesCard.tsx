
import React from 'react';
import { Competency } from '../types';

interface CompetenciesCardProps {
  competencies: Competency[];
  onToggle: (id: string) => void;
  onAddGoal?: () => void;
  phaseName: string;
}

const CompetenciesCard: React.FC<CompetenciesCardProps> = ({ competencies, onToggle, onAddGoal, phaseName }) => {
  const doneCount = competencies.filter(c => c.isDone).length;
  const capitalizedPhase = phaseName.charAt(0).toUpperCase() + phaseName.slice(1);

  return (
    <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-[#e5e7eb] dark:border-gray-700 p-5 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg dark:text-white">{capitalizedPhase}-Phase Competencies</h3>
        <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded dark:bg-blue-900/30 dark:text-blue-300">
          {doneCount}/{competencies.length} Done
        </span>
      </div>
      <p className="text-sm text-[#616f89] mb-5">Expected goals for this stage of rotation.</p>
      <div className="space-y-3">
        {competencies.map((comp) => (
          <label 
            key={comp.id}
            className={`flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer group ${comp.isHighlighted ? 'bg-blue-50/50 dark:bg-blue-900/10 border border-transparent hover:border-blue-200 dark:hover:border-blue-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <div className="relative flex items-center pt-0.5">
              <input 
                type="checkbox" 
                checked={comp.isDone} 
                onChange={() => onToggle(comp.id)} 
                className="peer size-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer transition-all" 
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-medium transition-all ${comp.isDone ? 'text-gray-400 dark:text-gray-500 line-through decoration-gray-400 decoration-2' : 'text-[#111318] dark:text-white font-bold group-hover:text-primary'}`}>
                {comp.title}
              </span>
              {comp.description && (
                <span className="text-xs text-[#616f89] mt-1">{comp.description}</span>
              )}
            </div>
          </label>
        ))}
      </div>
      <button 
        onClick={onAddGoal}
        className="w-full mt-6 py-2.5 rounded-lg border border-dashed border-gray-300 text-[#616f89] text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 flex items-center justify-center gap-2 transition-colors"
      >
        <span className="material-symbols-outlined text-lg">add</span>
        Add Custom Goal
      </button>
    </div>
  );
};

export default CompetenciesCard;
