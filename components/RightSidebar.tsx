
import React from 'react';
import { Assignment } from '../types';

interface Condition {
  label: string;
  theme: 'blue' | 'purple' | 'gray';
}

interface RightSidebarProps {
  assignments: Assignment[];
  onToggleAssignment: (id: string) => void;
  conditions: Condition[];
  onAddCondition: (label: string) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ 
  assignments, 
  onToggleAssignment, 
  conditions, 
  onAddCondition 
}) => {
  const addCondition = () => {
    const label = prompt("Enter clinical condition:");
    if (label) {
      const formattedLabel = label.startsWith('#') ? label : `#${label}`;
      onAddCondition(formattedLabel);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Reading Assignments */}
      <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-[#e5e7eb] dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#f0f2f4] dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-bold text-base dark:text-white">Reading Assignments</h3>
          <button className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-primary transition-colors">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
        <div className="divide-y divide-[#f0f2f4] dark:divide-gray-700">
          {assignments.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onToggleAssignment(item.id)}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 transition-colors ${item.status === 'done' ? 'text-green-600' : 'text-orange-500 group-hover:text-primary'}`}>
                  <span className={`material-symbols-outlined text-xl ${item.status === 'done' ? 'filled' : ''}`}>
                    {item.status === 'done' ? 'check_circle' : 'menu_book'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold line-clamp-1 transition-all ${item.status === 'done' ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-[#111318] dark:text-white'}`}>
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-[#616f89]">
                      {item.status === 'done' ? `Completed ${item.completedDate}` : `Due: ${item.dueDate}`}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${item.status === 'done' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'}`}>
                      {item.status === 'done' ? 'Done' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conditions Seen */}
      <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-[#e5e7eb] dark:border-gray-700 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base dark:text-white">Conditions Seen</h3>
          <span className="material-symbols-outlined text-[#616f89] cursor-pointer hover:text-primary transition-colors">filter_list</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {conditions.map((c, i) => (
            <span 
              key={i}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border animate-in fade-in zoom-in duration-300 ${
                c.theme === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' : 
                c.theme === 'purple' ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' :
                'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
              }`}
            >
              {c.label}
            </span>
          ))}
          <button 
            onClick={addCondition}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white border border-dashed border-gray-300 text-gray-500 hover:text-primary hover:border-primary transition-colors dark:bg-transparent dark:border-gray-600"
          >
            + Add Condition
          </button>
        </div>
      </div>

      {/* Upcoming Event */}
      <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-5 text-white shadow-md relative overflow-hidden group">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 transition-transform group-hover:scale-110">
          <span className="material-symbols-outlined text-9xl">event</span>
        </div>
        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-2">Upcoming</p>
        <h3 className="font-bold text-lg mb-1">Mid-Point Feedback</h3>
        <p className="text-sm text-blue-100 mb-4">Scheduled with Dr. Lewis</p>
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm p-2 rounded-lg w-fit">
          <span className="material-symbols-outlined text-sm">schedule</span>
          <span className="text-xs font-medium">Feb 5, 2:00 PM</span>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
