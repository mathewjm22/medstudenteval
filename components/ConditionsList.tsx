import React, { useState } from 'react';
import { ConditionSection, ConditionTopic } from '../data/conditionsData';

interface ConditionsListProps {
  data: ConditionSection[];
  checkedConditions: string[];
  onToggle: (id: string) => void;
}

const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const renderedLines: React.ReactNode[] = [];

  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = (keyPrefix: string) => {
    if (inList) {
      renderedLines.push(
        <ul key={`${keyPrefix}-list`} className="list-disc pl-5 mb-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      inList = true;
      const text = trimmed.substring(2);
      // Simple bold parsing
      const parts = text.split(/(\*\*.*?\*\*)/g);
      const children = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-gray-800 dark:text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      listItems.push(<li key={`li-${idx}`}>{children}</li>);
    } else {
      flushList(`flush-${idx}`);
      if (trimmed === '') return;

      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
      const children = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-gray-800 dark:text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      renderedLines.push(<p key={`p-${idx}`} className="mb-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>);
    }
  });
  flushList('flush-end');

  return <div>{renderedLines}</div>;
};

const ConditionsList: React.FC<ConditionsListProps> = ({ data, checkedConditions, onToggle }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id);
  };

  const toggleTopic = (id: string) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Calculate progress for each section
  const getProgress = (section: ConditionSection) => {
    const total = section.topics.length;
    const checked = section.topics.filter(t => checkedConditions.includes(t.id)).length;
    return { checked, total, percent: total === 0 ? 0 : Math.round((checked / total) * 100) };
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6 max-w-4xl mx-auto pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-black dark:text-white">Clinical Conditions & Topics</h2>
        <p className="text-[#616f89] dark:text-gray-400">
          Track exposure to core medical conditions and high-yield topics.
        </p>
      </div>

      <div className="space-y-4">
        {data.map(section => {
          const { checked, total, percent } = getProgress(section);
          const isExpanded = expandedSection === section.id;

          return (
            <div key={section.id} className={`bg-white dark:bg-[#1a202c] rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-primary shadow-lg' : 'border-gray-200 dark:border-gray-700 shadow-sm hover:border-gray-300 dark:hover:border-gray-600'}`}>

              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`size-10 rounded-full flex items-center justify-center transition-colors ${percent === 100 ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
                    <span className="material-symbols-outlined">
                      {percent === 100 ? 'check_circle' : 'medical_services'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold dark:text-white">{section.title}</h3>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {section.percentage && <span className="mr-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-400">{section.percentage}</span>}
                      {checked} of {total} Completed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                   {/* Progress Ring or Bar */}
                  <div className="hidden sm:flex flex-col items-end min-w-[60px]">
                    <span className={`text-xl font-black ${percent === 100 ? 'text-green-600' : 'text-primary'}`}>{percent}%</span>
                  </div>
                  <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                </div>
              </button>

              {/* Progress Bar Line */}
              <div className="h-1 w-full bg-gray-100 dark:bg-gray-800">
                <div
                  className={`h-full transition-all duration-1000 ${percent === 100 ? 'bg-green-500' : 'bg-primary'}`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>

              {/* Topics List */}
              {isExpanded && (
                <div className="p-4 sm:p-6 bg-gray-50/50 dark:bg-gray-800/20 space-y-3 animate-in slide-in-from-top-2">
                  {section.topics.map(topic => {
                    const isChecked = checkedConditions.includes(topic.id);
                    const isTopicExpanded = expandedTopics.has(topic.id);

                    return (
                      <div key={topic.id} className={`bg-white dark:bg-gray-800 rounded-xl border transition-all ${isChecked ? 'border-green-200 bg-green-50/30 dark:border-green-900/30 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
                        <div className="flex items-start p-4 gap-4">
                          <button
                            onClick={() => onToggle(topic.id)}
                            className={`mt-1 size-6 rounded-md border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600 hover:border-primary text-transparent'}`}
                          >
                            <span className="material-symbols-outlined text-sm font-bold">check</span>
                          </button>

                          <div className="flex-1">
                            <div
                              onClick={() => toggleTopic(topic.id)}
                              className="cursor-pointer group select-none"
                            >
                              <div className="flex items-center justify-between">
                                <h4 className={`text-base font-bold transition-colors ${isChecked ? 'text-green-800 dark:text-green-400' : 'text-gray-800 dark:text-white group-hover:text-primary'}`}>
                                  {topic.title}
                                </h4>
                                <span className="material-symbols-outlined text-gray-400 text-sm group-hover:text-primary transition-colors">
                                  {isTopicExpanded ? 'expand_less' : 'expand_more'}
                                </span>
                              </div>

                              {!isTopicExpanded && (
                                <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                  Click to view clinical details...
                                </p>
                              )}
                            </div>

                            {isTopicExpanded && (
                              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-in fade-in">
                                <SimpleMarkdown content={topic.details} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConditionsList;
