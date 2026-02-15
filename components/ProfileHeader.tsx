
import React from 'react';
import { Student } from '../types';

interface ProfileHeaderProps {
  student: Student;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ student }) => {
  return (
    <section className="bg-white dark:bg-[#1a202c] rounded-2xl shadow-sm border border-[#e5e7eb] dark:border-gray-700 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
        <div className="flex flex-1 gap-5">
          <div 
            className="size-24 rounded-full bg-cover bg-center shrink-0 border-4 border-white dark:border-[#2d3748] shadow-md" 
            style={{ backgroundImage: `url('${student.avatar}')` }}
          ></div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold dark:text-white">{student.name}, {student.year}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">{student.status}</span>
            </div>
            <p className="text-[#616f89] dark:text-gray-400 text-lg">{student.rotation}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-[#616f89] dark:text-gray-400">
              <span className="material-symbols-outlined text-base">calendar_today</span>
              <span>{student.startDate} - {student.endDate} (Week {student.week})</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 lg:min-w-[500px]">
          <div className="flex gap-4 flex-1">
            <div className="flex-1 p-3 rounded-xl bg-background-light dark:bg-gray-800 border border-[#f0f2f4] dark:border-gray-700">
              <p className="text-xs font-medium text-[#616f89] uppercase tracking-wider mb-1">Patients</p>
              <p className="text-xl font-bold dark:text-white">{student.patientsCount}</p>
            </div>
            <div className="flex-1 p-3 rounded-xl bg-background-light dark:bg-gray-800 border border-[#f0f2f4] dark:border-gray-700">
              <p className="text-xs font-medium text-[#616f89] uppercase tracking-wider mb-1">Avg Eval</p>
              <p className="text-xl font-bold dark:text-white flex items-center gap-1">{student.avgEval} <span className="material-symbols-outlined text-yellow-500 text-sm filled">star</span></p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-2">
            <div className="flex justify-between items-end">
              <span className="text-sm font-semibold dark:text-white">Rotation Progress</span>
              <span className="text-sm font-bold text-primary">{student.progressPercent}%</span>
            </div>
            <div className="h-2.5 w-full bg-[#dbdfe6] dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${student.progressPercent}%` }}></div>
            </div>
            <p className="text-xs text-[#616f89] text-right">{student.weeksRemaining} weeks remaining</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;