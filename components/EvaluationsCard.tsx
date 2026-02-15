
import React from 'react';
import { Evaluation } from '../types';

interface EvaluationsCardProps {
  evaluations: Evaluation[];
  onAddEvaluation?: () => void;
  onEditEvaluation?: (evaluation: Evaluation) => void;
  onViewAll?: () => void;
}

const EvaluationsCard: React.FC<EvaluationsCardProps> = ({ 
  evaluations, 
  onAddEvaluation, 
  onEditEvaluation,
  onViewAll 
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <h3 className="font-bold text-lg dark:text-white">Recent Evaluations</h3>
           <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-500">{evaluations.length} total</span>
        </div>
        <button 
          onClick={onViewAll}
          className="text-sm font-semibold text-primary hover:text-blue-700 transition-colors flex items-center gap-1 group"
        >
          View All
          <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
        </button>
      </div>
      
      <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
        {evaluations.slice(0, 5).map((evalItem) => (
          <div 
            key={evalItem.id} 
            onClick={() => onEditEvaluation?.(evalItem)}
            className="bg-white dark:bg-[#1a202c] rounded-xl border border-[#e5e7eb] dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all duration-300 animate-in slide-in-from-top-4 cursor-pointer group hover:border-primary/50 relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-primary text-sm">edit</span>
            </div>

            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm font-semibold text-[#111318] dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{evalItem.title}</p>
                <p className="text-[10px] font-bold text-[#616f89] uppercase tracking-wider">{evalItem.date}</p>
              </div>
              <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold dark:bg-green-900/30 dark:text-green-300">
                {evalItem.score.toFixed(1)} <span className="material-symbols-outlined text-xs filled">star</span>
              </div>
            </div>

            {evalItem.skills && (
              <div className="flex gap-1 mb-3">
                {(Object.values(evalItem.skills) as (number | null)[]).map((val, idx) => (
                  <div 
                    key={idx} 
                    className="h-1 flex-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
                    title={val === null ? "N/A" : `Skill Metric ${idx + 1}`}
                  >
                    {val !== null && (
                      <div 
                        className={`h-full rounded-full ${val >= 4 ? 'bg-green-500' : val >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${(val / 5) * 100}%` }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-[#4b5563] dark:text-gray-300 leading-relaxed italic line-clamp-2">
              "{evalItem.comment}"
            </p>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="size-5 rounded-full bg-cover bg-center border border-gray-100 dark:border-gray-600" 
                  style={{ backgroundImage: `url('${evalItem.evaluator.avatar}')` }}
                ></div>
                <span className="text-[10px] font-medium text-[#616f89]">{evalItem.evaluator.name}</span>
              </div>
              {evalItem.conditions && evalItem.conditions.length > 0 && (
                <span className="text-[9px] font-bold text-primary uppercase tracking-tighter">
                  +{evalItem.conditions.length} Diagnoses
                </span>
              )}
            </div>
          </div>
        ))}
        {evaluations.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm italic">
            No evaluations recorded yet.
          </div>
        )}
      </div>
      
      <button 
        onClick={onAddEvaluation}
        className="w-full py-3 bg-primary text-white rounded-lg font-bold shadow-md hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined">edit_square</span>
        New Evaluation
      </button>
    </div>
  );
};

export default EvaluationsCard;
