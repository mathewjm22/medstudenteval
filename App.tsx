
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import Header, { View } from './components/Header';
import ProfileHeader from './components/ProfileHeader';
import CompetenciesCard from './components/CompetenciesCard';
import EvaluationsCard from './components/EvaluationsCard';
import RightSidebar from './components/RightSidebar';
import { Student, Phase, Competency, Evaluation, Assignment, EvaluationSkills, EvaluationSkillComments, Preceptor } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('Dashboard');
  const [activePhase, setActivePhase] = useState<Phase>('mid');
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [isPreceptorModalOpen, setIsPreceptorModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [viewingEval, setViewingEval] = useState<Evaluation | null>(null);

  // Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Preceptor State
  const [preceptor, setPreceptor] = useState<Preceptor>({
    name: "Dr. Preceptor (You)",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAu_bA54j7E6jHFqEr44Dh7hoeMipzwNO5SAsYcZ5ZGmNFADIgn685yOJigN8VfHo_2yuoGMg3BHVXz4wJpXBYhA8Jh5DJ_2v9-OTD0FhiqPNoU7W1pK5T7IdSRdTsnta6FN5qzN-KZErGa0oCo6lN_w9fRatQXnF81CjUH4LUp13xquR3nYCcH_ylWA9vZz_-nIidgsPYjG1MeznQRUY71svahsV1Eck_gGDd3lDdIB4daCqGrKzmvUQslvPHNIvgR6xHN_w4ODkIu"
  });

  // Re-ordered state definitions to avoid temporal dead zone errors
  const [students, setStudents] = useState<Student[]>([
    {
      name: "Alex Lockwood",
      year: "MS3",
      status: "Active",
      rotation: "Outpatient Internal Medicine Rotation",
      startDate: "Jan 4",
      endDate: "Feb 15",
      week: 3,
      patientsCount: 2,
      avgEval: 4.5,
      progressPercent: 68,
      weeksRemaining: 4,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDg63s5VzT-QBwYhSmVQHIUkYILtCa8XsPy9WXSWvgBsp2YgOu80Xxu1igJO1eVy9WxSu8MIGmlQ9QwooIo-j5DtJN5cEu2qELWHQL-IZjW7G7_hua8PaS2BGZQGGfqNVEyC08RB_iIZfXjdelMYYni6yJrqxdW7bVLivcrmO1UZYjiXWJlu-J_97o5G1t-PA7jlDfQAmGZPl3H8E5RuL8VxVjEYK0-OaEjaAtOrgEdhoulu6RS81I-wpTS8Q1WdAJDxnuYewZxbwf-"
    },
    {
      name: "Jamie Vance",
      year: "MS4",
      status: "Active",
      rotation: "Inpatient Internal Medicine Rotation",
      startDate: "Jan 10",
      endDate: "Feb 28",
      week: 2,
      patientsCount: 8,
      avgEval: 4.8,
      progressPercent: 42,
      weeksRemaining: 6,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCc5TyV6hjONVHhaASBdgm-ptO0sizLYXAfn0K9XZYcuSLVoz-4NZ_jn0fBb4hdVM5-84BOyv-Cj62VwIfnMy11slnhsfBdrVcAWvR428pptkfMIQ51HM6a0TJ9GogCNylFuyFcju9mxS2v1zh-UJL0oQk-F2SO5ISe3h2a8veuLbxRjw38SbKBiZ7HigJoHyUSKEtEE58wX3fJT2mdcOy2ZWwaurt23ShhRCH-mh8ss9LLxY4pIopSOPHfZzmnw08sOZA8uzLMr8jv"
    }
  ]);

  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    {
      id: 'e1',
      title: "Patient Encounter #12",
      date: "Jan 20, 2024",
      score: 4.0,
      comment: "Alex showed great rapport with the patient. History taking was thorough, though focused a bit too much on social history initially. Needs to narrow the differential sooner.",
      conditions: ["#Hypertension", "#Anxiety"],
      taughtConcepts: ["Approach to HTN management", "Anxiety screening in primary care"],
      skills: { historyTaking: 4, physicalExam: 5, reasoning: 3, diagnostics: 4, treatmentPlan: 4 },
      skillComments: { historyTaking: "Very thorough, inclusive of family history.", reasoning: "Needs more work on narrowing differentials." },
      evaluator: {
        name: "Dr. Sarah Smith",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmVtH_YuWs8lWp4tVrjO9vJzvjJzbNh4oT-y5w2KJvTwQ16J1qAk7bihvKLps5j_vBxCUZ3OepfUBA-qTULLTpIPPh-2JnwwpNMBSlhfq73_pL7J8ZnS0WbKc4dJAwyR4gy78EIPWzRRUXryE5pZJ_Fxd1uw3bOheWqdCJvm4xwWpdJfku3oFmHe8IBj1CTXZJ4-9LV7G6C5NhEubOTi5OSZPLBIK6j__29SvNvVHDu3UtKxll1_Uqc-NRbaIuRKvcAjmC_3ZFYCY1"
      }
    },
    {
      id: 'e2',
      title: "Case Presentation: Diabetes",
      date: "Jan 18, 2024",
      score: 5.0,
      comment: "Excellent presentation. Concise and covered all key points of the management plan. Suggested appropriate medication adjustments.",
      conditions: ["#Type 2 Diabetes"],
      taughtConcepts: ["Oral hypoglycemics titration", "Diabetes dietary counseling"],
      skills: { historyTaking: 5, physicalExam: 4, reasoning: 5, diagnostics: 5, treatmentPlan: 5 },
      evaluator: {
        name: "Dr. David Chen",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCc5TyV6hjONVHhaASBdgm-ptO0sizLYXAfn0K9XZYcuSLVoz-4NZ_jn0fBb4hdVM5-84BOyv-Cj62VwIfnMy11slnhsfBdrVcAWvR428pptkfMIQ51HM6a0TJ9GogCNylFuyFcju9mxS2v1zh-UJL0oQk-F2SO5ISe3h2a8veuLbxRjw38SbKBiZ7HigJoHyUSKEtEE58wX3fJT2mdcOy2ZWwaurt23ShhRCH-mh8ss9LLxY4pIopSOPHfZzmnw08sOZA8uzLMr8jv"
      }
    }
  ]);

  const [competencies, setCompetencies] = useState<Record<Phase, Competency[]>>({
    early: [
      { id: 'e1', title: "Orientation to clinic workflow", isDone: true },
      { id: 'e2', title: "Basic patient interview", isDone: true },
    ],
    mid: [
      { id: 'm1', title: "Take a full telemedicine history", isDone: true },
      { id: 'm2', title: "Document encounter in EMR", isDone: true },
      { id: 'm3', title: "Manage acute hypertension", description: "Requires observation of at least 2 cases.", isDone: false, isHighlighted: true },
      { id: 'm4', title: "Present assessment and plan concisely", isDone: false },
      { id: 'm5', title: "Deliver bad news (Simulation)", isDone: false },
    ],
    late: [
      { id: 'l1', title: "Independent patient management", isDone: false },
      { id: 'l2', title: "Complex discharge planning", isDone: false },
    ]
  });

  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 'a1', title: "Harrison's Principles Ch. 12", dueDate: "Feb 2", status: 'pending' },
    { id: 'a2', title: "Guidelines for COPD", completedDate: "Jan 15", status: 'done' },
  ]);

  const currentStudent = students.find(s => s.name === selectedStudentId) || students[0];
  
  // Evaluation Modal Form State
  const [editingEvalId, setEditingEvalId] = useState<string | null>(null);
  const [evalForm, setEvalForm] = useState({
    title: 'Patient Encounter',
    score: '4.0',
    comment: '',
    conditions: '',
    taughtConcepts: '',
    date: new Date().toISOString().split('T')[0],
    skills: {
      historyTaking: 4 as number | null,
      physicalExam: 4 as number | null,
      reasoning: 4 as number | null,
      diagnostics: 4 as number | null,
      treatmentPlan: 4 as number | null
    },
    skillComments: {
      historyTaking: '',
      physicalExam: '',
      reasoning: '',
      diagnostics: '',
      treatmentPlan: ''
    }
  });

  // Automatically calculate Overall Score based on non-N/A skills
  useEffect(() => {
    const activeSkills = Object.values(evalForm.skills).filter(v => v !== null) as number[];
    if (activeSkills.length > 0) {
      const avg = activeSkills.reduce((a, b) => a + b, 0) / activeSkills.length;
      const formattedAvg = avg.toFixed(1);
      // Only update if it's different to avoid loops
      if (evalForm.score !== formattedAvg) {
        setEvalForm(prev => ({ ...prev, score: formattedAvg }));
      }
    }
  }, [evalForm.skills]);

  // Preceptor Modal Form State
  const [preceptorForm, setPreceptorForm] = useState<Preceptor>({ ...preceptor });

  // Clinical Conditions State
  const [conditions, setConditions] = useState([
    { label: '#Hypertension', theme: 'blue' as const },
    { label: '#Type 2 Diabetes', theme: 'purple' as const },
    { label: '#COPD', theme: 'gray' as const },
    { label: '#Anxiety', theme: 'gray' as const },
    { label: '#Gastroenteritis', theme: 'gray' as const },
    { label: '#Back Pain', theme: 'gray' as const },
  ]);

  // Sync conditions from evaluations automatically
  useEffect(() => {
    const allEvalConditions = evaluations.flatMap(e => e.conditions || []);
    if (allEvalConditions.length === 0) return;

    setConditions(prev => {
      const existingLabels = new Set(prev.map(c => c.label));
      let changed = false;
      const mergedConditions = [...prev];
      
      allEvalConditions.forEach(label => {
        if (!existingLabels.has(label)) {
          mergedConditions.push({ label, theme: 'gray' });
          existingLabels.add(label);
          changed = true;
        }
      });
      
      return changed ? mergedConditions : prev;
    });
  }, [evaluations]);

  const handleUpdateAvatar = (newAvatar: string) => {
    setStudents(prev => prev.map(s => 
      s.name === currentStudent.name ? { ...s, avatar: newAvatar } : s
    ));
  };

  const handleExport = () => {
    try {
      const data = {
        preceptor,
        students,
        evaluations,
        competencies,
        assignments,
        conditions,
        exportedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MedTrack_Export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export data", err);
      alert("Failed to export data. Please check your browser permissions.");
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = JSON.parse(event.target?.result as string);
          if (content.preceptor) setPreceptor(content.preceptor);
          if (content.students) setStudents(content.students);
          if (content.evaluations) setEvaluations(content.evaluations);
          if (content.competencies) setCompetencies(content.competencies);
          if (content.assignments) setAssignments(content.assignments);
          if (content.conditions) setConditions(content.conditions);
          alert("Data imported successfully!");
        } catch (err) {
          alert("Failed to parse the file. Please ensure it's a valid MedTrack export.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handlePreceptorAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreceptorForm(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreceptorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPreceptor({ ...preceptorForm });
    setIsPreceptorModalOpen(false);
  };

  const generateAISummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a medical education expert writing a clinical rotation summary for a student named ${currentStudent.name}. 
      Based on the following evaluation data, provide a professional "One-Page" summary.
      
      Evaluation Data:
      ${evaluations.map(e => `- Date: ${e.date}, Score: ${e.score}, Feedback: ${e.comment}, Taught: ${e.taughtConcepts?.join(', ') || 'N/A'}`).join('\n')}
      
      Structure the summary in Markdown with: Executive Overview, Clinical Strengths, Areas for Improvement, Taught Concepts Index, and Final Recommendation.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      setAiSummary(response.text || 'Unable to generate summary at this time.');
    } catch (error) {
      console.error("AI Generation Error:", error);
      setAiSummary("Error generating summary. Please check your API key.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleOpenEvalModal = () => {
    setEditingEvalId(null);
    setEvalForm({
      title: 'Patient Encounter',
      score: '4.0',
      comment: '',
      conditions: '',
      taughtConcepts: '',
      date: new Date().toISOString().split('T')[0],
      skills: { historyTaking: 4, physicalExam: 4, reasoning: 4, diagnostics: 4, treatmentPlan: 4 },
      skillComments: { historyTaking: '', physicalExam: '', reasoning: '', diagnostics: '', treatmentPlan: '' }
    });
    setIsEvalModalOpen(true);
  };

  const handleEditEval = (evaluation: Evaluation) => {
    setEditingEvalId(evaluation.id);
    setEvalForm({
      title: evaluation.title,
      score: evaluation.score.toString(),
      comment: evaluation.comment,
      conditions: evaluation.conditions?.join(', ') || '',
      taughtConcepts: evaluation.taughtConcepts?.join(', ') || '',
      date: new Date(evaluation.date).toISOString().split('T')[0],
      skills: evaluation.skills ? { ...evaluation.skills } : { historyTaking: 4, physicalExam: 4, reasoning: 4, diagnostics: 4, treatmentPlan: 4 },
      skillComments: evaluation.skillComments ? { 
        historyTaking: evaluation.skillComments.historyTaking || '',
        physicalExam: evaluation.skillComments.physicalExam || '',
        reasoning: evaluation.skillComments.reasoning || '',
        diagnostics: evaluation.skillComments.diagnostics || '',
        treatmentPlan: evaluation.skillComments.treatmentPlan || ''
      } : { historyTaking: '', physicalExam: '', reasoning: '', diagnostics: '', treatmentPlan: '' }
    });
    setIsEvalModalOpen(true);
  };

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    const scoreNum = parseFloat(evalForm.score);
    const splitConditions = evalForm.conditions.split(',').map(c => c.trim()).filter(c => c !== '');
    const splitConcepts = evalForm.taughtConcepts.split(',').map(c => c.trim()).filter(c => c !== '');
    const displayDate = new Date(evalForm.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newEval: Evaluation = {
      id: editingEvalId || Date.now().toString(),
      title: evalForm.title,
      date: displayDate,
      score: isNaN(scoreNum) ? 4.0 : scoreNum,
      comment: evalForm.comment,
      conditions: splitConditions,
      taughtConcepts: splitConcepts,
      skills: { ...evalForm.skills },
      skillComments: { ...evalForm.skillComments },
      evaluator: { 
        name: preceptor.name, 
        avatar: preceptor.avatar 
      }
    };

    if (editingEvalId) {
      setEvaluations(prev => prev.map(ev => ev.id === editingEvalId ? newEval : ev));
    } else {
      setEvaluations([newEval, ...evaluations]);
      // Update student patient count
      setStudents(prev => prev.map(s => s.name === currentStudent.name ? { ...s, patientsCount: s.patientsCount + 1 } : s));
    }
    setIsEvalModalOpen(false);
  };

  const handleToggleCompetency = (id: string) => {
    setCompetencies(prev => ({ ...prev, [activePhase]: prev[activePhase].map(comp => comp.id === id ? { ...comp, isDone: !comp.isDone } : comp) }));
  };

  const handleToggleAssignment = (id: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'done' ? 'pending' : 'done', completedDate: a.status === 'pending' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : undefined } : a));
  };

  const renderDashboard = () => (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold dark:text-white">Preceptor Dashboard</h1>
          <p className="text-[#616f89] dark:text-gray-400">Team health and rotation status overview.</p>
        </div>
        <div className="flex gap-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="size-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center"><span className="material-symbols-outlined">groups</span></div>
            <div><p className="text-[10px] font-bold text-gray-400 uppercase">Active</p><p className="text-xl font-black dark:text-white">{students.length}</p></div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="size-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center"><span className="material-symbols-outlined">avg_pace</span></div>
            <div><p className="text-[10px] font-bold text-gray-400 uppercase">Avg Score</p><p className="text-xl font-black dark:text-white">4.6</p></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((s, idx) => (
          <div key={idx} onClick={() => { setSelectedStudentId(s.name); setCurrentView('Students'); }} className="group bg-white dark:bg-[#1a202c] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <div className="size-16 rounded-full bg-cover bg-center border-2 border-primary/10" style={{ backgroundImage: `url('${s.avatar}')` }}></div>
              <div><h3 className="text-xl font-extrabold dark:text-white">{s.name}</h3><p className="text-sm text-gray-500 font-medium">{s.year} • {s.rotation}</p></div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end text-sm"><span className="font-bold text-gray-400">Progress</span><span className="font-black text-primary">{s.progressPercent}%</span></div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full"><div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${s.progressPercent}%` }}></div></div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center"><p className="text-[10px] font-bold text-gray-400 uppercase">Week</p><p className="text-lg font-black dark:text-white">{s.week}</p></div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center"><p className="text-[10px] font-bold text-gray-400 uppercase">Avg Eval</p><p className="text-lg font-black text-primary">{s.avgEval}</p></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const getCalendarDays = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Prev month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, currentMonth: false, month: month - 1, year });
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, currentMonth: true, month, year });
    }
    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, currentMonth: false, month: month + 1, year });
    }
    return days;
  };

  const renderSchedule = () => {
    const days = getCalendarDays();
    const monthName = calendarDate.toLocaleString('default', { month: 'long' });
    const year = calendarDate.getFullYear();

    const changeMonth = (offset: number) => {
      const nextDate = new Date(calendarDate);
      nextDate.setMonth(calendarDate.getMonth() + offset);
      setCalendarDate(nextDate);
    };

    return (
      <div className="animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black dark:text-white">Clinical Schedule</h2>
          <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-primary">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="text-sm font-black dark:text-white uppercase tracking-widest min-w-[150px] text-center">
              {monthName} {year}
            </span>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-primary">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a202c] rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
          <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="p-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 border-collapse">
            {days.map((d, i) => {
              const cellDateStr = new Date(d.year, d.month, d.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const dayEvals = evaluations.filter(ev => ev.date === cellDateStr);
              const isToday = new Date().toDateString() === new Date(d.year, d.month, d.day).toDateString();

              return (
                <div key={i} className={`p-3 border-r border-b border-gray-100 dark:border-gray-700 min-h-[120px] hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors ${!d.currentMonth ? 'opacity-25' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-black ${isToday ? 'bg-primary text-white size-6 flex items-center justify-center rounded-full' : 'text-gray-400'}`}>
                      {d.day}
                    </span>
                  </div>
                  
                  {/* Dynamic Evaluations */}
                  {dayEvals.map(ev => (
                    <button 
                      key={ev.id}
                      onClick={() => setViewingEval(ev)}
                      className="mb-1.5 w-full text-left p-2 bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-all cursor-pointer group shadow-sm"
                    >
                      <p className="text-[10px] font-black text-primary uppercase tracking-tighter">Evaluation</p>
                      <p className="text-[9px] font-bold dark:text-white line-clamp-1 group-hover:text-primary leading-tight">{ev.title}</p>
                    </button>
                  ))}

                  {/* Placeholders for specific dates in Feb/Jan for aesthetic consistency if no evals */}
                  {d.month === 1 && d.day === 12 && d.year === 2024 && (
                    <div className="mt-1 p-2 bg-purple-100 border border-purple-200 rounded-lg shadow-sm">
                      <p className="text-[10px] font-black text-purple-700 uppercase tracking-tighter">12:00 PM</p>
                      <p className="text-[9px] font-bold text-purple-800 line-clamp-1">Grand Rounds</p>
                    </div>
                  )}
                  {d.month === 1 && d.day === 20 && d.year === 2024 && (
                    <div className="mt-1 p-2 bg-green-100 border border-green-200 rounded-lg shadow-sm">
                      <p className="text-[10px] font-black text-green-700 uppercase tracking-tighter">9:00 AM</p>
                      <p className="text-[9px] font-bold text-green-800 line-clamp-1">Clinical Rounds</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderResources = () => (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div><h2 className="text-2xl font-black dark:text-white">Clinical Resources</h2><p className="text-[#616f89] dark:text-gray-400">Essential tools and references for medical education.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: 'clinical_notes', title: 'Clinical Guidelines', items: ['AHA Hypertension 2024', 'ADA Diabetes Care', 'GOLD COPD Guidelines'], color: 'blue' },
          { icon: 'pill', title: 'Pharmacology', items: ['Epocrates', 'Micromedex', 'Antibiotic Sanford Guide'], color: 'green' },
          { icon: 'monitoring', title: 'Imaging & EKG', items: ['Radiopaedia', 'EKG Academy', 'Chest X-Ray Basics'], color: 'purple' },
        ].map((res, i) => (
          <div key={i} className="bg-white dark:bg-[#1a202c] rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className={`size-12 rounded-xl bg-${res.color}-50 dark:bg-${res.color}-900/20 text-${res.color}-600 flex items-center justify-center mb-4`}><span className="material-symbols-outlined text-3xl">{res.icon}</span></div>
            <h3 className="text-xl font-bold dark:text-white mb-4">{res.title}</h3>
            <ul className="space-y-3">
              {res.items.map((item, j) => (
                <li key={j} className="flex items-center gap-3 text-sm text-[#616f89] dark:text-gray-400 hover:text-primary cursor-pointer transition-colors group">
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'Dashboard': return renderDashboard();
      case 'Schedule': return renderSchedule();
      case 'Resources': return renderResources();
      case 'Concepts': return (
        <div className="animate-in fade-in duration-300">
          <div className="mb-8"><h2 className="text-2xl font-bold dark:text-white">Teaching History</h2><p className="text-[#616f89] dark:text-gray-400">Medical concepts covered with {currentStudent.name}.</p></div>
          <div className="grid gap-4">
            {evaluations.flatMap(e => (e.taughtConcepts || []).map(c => ({ c, date: e.date, encounter: e.title }))).map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between group hover:border-primary transition-all">
                <div className="flex items-center gap-4"><div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors"><span className="material-symbols-outlined">lightbulb</span></div><div><h4 className="font-bold dark:text-white">{item.c}</h4><p className="text-xs text-gray-500">{item.encounter}</p></div></div>
                <span className="text-xs font-bold text-gray-400 uppercase">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      );
      case 'AI Summary': return (
        <div className="animate-in fade-in duration-300">
          <div className="flex justify-between items-end mb-8 no-print">
            <div><h2 className="text-2xl font-bold dark:text-white">Performance Report</h2><p className="text-[#616f89] dark:text-gray-400">AI-generated overview for {currentStudent.name}.</p></div>
            <button onClick={generateAISummary} disabled={isGeneratingSummary} className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
              {isGeneratingSummary ? 'Analyzing...' : <><span className="material-symbols-outlined text-lg">auto_awesome</span> Generate Summary</>}
            </button>
          </div>
          {aiSummary ? (
            <div className="bg-white dark:bg-[#1a202c] p-10 rounded-2xl shadow-xl border border-gray-100 print:p-0">
              <div className="border-b-2 border-primary pb-6 mb-10"><h1 className="text-3xl font-black text-primary uppercase">Evaluation Summary: {currentStudent.name}</h1></div>
              <div className="prose prose-blue max-w-none dark:prose-invert whitespace-pre-wrap leading-relaxed">{aiSummary}</div>
            </div>
          ) : <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200">No summary generated. Click "Generate Summary" above.</div>}
        </div>
      );
      case 'Students': return (
        <div className="animate-in fade-in duration-300">
          <ProfileHeader student={currentStudent} onAvatarChange={handleUpdateAvatar} />
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold dark:text-white">Rotation Milestones</h2>
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {(['early', 'mid', 'late'] as Phase[]).map(p => <button key={p} onClick={() => setActivePhase(p)} className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${activePhase === p ? 'bg-white dark:bg-primary dark:text-white shadow-sm font-bold' : 'text-[#616f89]'}`}>{p.charAt(0).toUpperCase() + p.slice(1)} Phase</button>)}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4"><CompetenciesCard competencies={competencies[activePhase]} onToggle={handleToggleCompetency} phaseName={activePhase} /></div>
            <div className="lg:col-span-4"><EvaluationsCard evaluations={evaluations} onAddEvaluation={handleOpenEvalModal} onEditEvaluation={handleEditEval} /></div>
            <div className="lg:col-span-4"><RightSidebar assignments={assignments} onToggleAssignment={handleToggleAssignment} conditions={conditions} onAddCondition={l => setConditions([...conditions, { label: l, theme: 'gray' }])} /></div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-display bg-background-light dark:bg-background-dark">
      <Header 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onExport={handleExport}
        onImport={handleImport}
        preceptor={preceptor}
        onEditProfile={() => {
          setPreceptorForm({ ...preceptor });
          setIsPreceptorModalOpen(true);
        }}
      />

      {isPreceptorModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a202c] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-xl font-bold dark:text-white">Edit Your Profile</h3>
              <button onClick={() => setIsPreceptorModalOpen(false)}><span className="material-symbols-outlined text-gray-400">close</span></button>
            </div>
            <form onSubmit={handlePreceptorSubmit} className="p-6 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div 
                    className="size-24 rounded-full bg-cover bg-center border-4 border-white dark:border-gray-800 shadow-lg"
                    style={{ backgroundImage: `url('${preceptorForm.avatar}')` }}
                  ></div>
                  <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handlePreceptorAvatarChange} />
                  </label>
                </div>
                <p className="text-xs text-gray-400 font-medium">Click to update photo</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-400">Display Name</label>
                <input 
                  type="text" 
                  required 
                  value={preceptorForm.name} 
                  onChange={e => setPreceptorForm({ ...preceptorForm, name: e.target.value })} 
                  className="w-full mt-1 rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                  placeholder="e.g. Dr. Preceptor"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setIsPreceptorModalOpen(false)} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-lg font-bold dark:text-white">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-blue-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEvalModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a202c] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 shrink-0">
              <h3 className="text-xl font-bold dark:text-white">{editingEvalId ? 'Edit Evaluation' : 'New Clinical Evaluation'}</h3>
              <button onClick={() => setIsEvalModalOpen(false)}><span className="material-symbols-outlined text-gray-400">close</span></button>
            </div>
            
            <form onSubmit={handleSubmitEvaluation} className="p-6 space-y-8 overflow-y-auto">
              {/* Section 1: Basic Information */}
              <div>
                <h4 className="text-xs font-black uppercase text-primary tracking-widest mb-4 border-b pb-1 border-primary/20">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="text-xs font-bold uppercase text-gray-400">Encounter Title</label>
                    <input 
                      type="text" 
                      required 
                      value={evalForm.title} 
                      onChange={e => setEvalForm({ ...evalForm, title: e.target.value })} 
                      className="w-full mt-1 rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      placeholder="e.g. Patient Encounter #1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-400">Date</label>
                    <input 
                      type="date" 
                      required 
                      value={evalForm.date} 
                      onChange={e => setEvalForm({ ...evalForm, date: e.target.value })} 
                      className="w-full mt-1 rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-400">Calculated Score</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-lg relative">
                        <div className="absolute top-0 left-0 h-full bg-primary rounded-lg transition-all" style={{ width: `${(parseFloat(evalForm.score) / 5) * 100}%` }}></div>
                      </div>
                      <span className="text-lg font-black text-primary w-8 text-center">{evalForm.score}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold italic">* Auto-calculated from active skills below</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Clinical focus */}
              <div>
                <h4 className="text-xs font-black uppercase text-primary tracking-widest mb-4 border-b pb-1 border-primary/20">Clinical Focus</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-400">Conditions Seen (comma separated)</label>
                    <input 
                      type="text" 
                      value={evalForm.conditions} 
                      onChange={e => setEvalForm({ ...evalForm, conditions: e.target.value })} 
                      className="w-full mt-1 rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      placeholder="#Hypertension, #Diabetes"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-400">Concepts Taught (comma separated)</label>
                    <input 
                      type="text" 
                      value={evalForm.taughtConcepts} 
                      onChange={e => setEvalForm({ ...evalForm, taughtConcepts: e.target.value })} 
                      className="w-full mt-1 rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      placeholder="Management, ECG interpretation"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Narrative */}
              <div>
                <h4 className="text-xs font-black uppercase text-primary tracking-widest mb-4 border-b pb-1 border-primary/20">Evaluation Narrative</h4>
                <label className="text-xs font-bold uppercase text-gray-400">General Feedback</label>
                <textarea 
                  required 
                  rows={4} 
                  value={evalForm.comment} 
                  onChange={e => setEvalForm({ ...evalForm, comment: e.target.value })} 
                  className="w-full mt-1 rounded-lg border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                  placeholder="Describe student performance, strengths, and areas for growth..."
                ></textarea>
              </div>

              {/* Section 4: Detailed Skills Assessment */}
              <div>
                <h4 className="text-xs font-black uppercase text-primary tracking-widest mb-4 border-b pb-1 border-primary/20">Skill-Specific Assessment</h4>
                <div className="space-y-6">
                  {[
                    { key: 'historyTaking', label: 'History Taking' },
                    { key: 'physicalExam', label: 'Physical Examination' },
                    { key: 'reasoning', label: 'Clinical Reasoning' },
                    { key: 'diagnostics', label: 'Diagnostics & Results' },
                    { key: 'treatmentPlan', label: 'Treatment & Management Plan' }
                  ].map((skill) => {
                    const isNA = evalForm.skills[skill.key as keyof EvaluationSkills] === null;
                    return (
                      <div key={skill.key} className={`p-4 rounded-xl border transition-all ${isNA ? 'bg-gray-100 dark:bg-gray-900 border-dashed border-gray-300 dark:border-gray-800' : 'bg-gray-50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-700'}`}>
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                          <div className="w-full md:w-1/3">
                            <div className="flex items-center justify-between mb-2">
                              <label className={`text-xs font-bold uppercase ${isNA ? 'text-gray-400' : 'text-gray-500'}`}>{skill.label}</label>
                              <button 
                                type="button"
                                onClick={() => setEvalForm({
                                  ...evalForm,
                                  skills: { ...evalForm.skills, [skill.key]: isNA ? 4 : null }
                                })}
                                className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all border ${isNA ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 hover:text-primary hover:border-primary'}`}
                              >
                                {isNA ? 'Included' : 'Mark N/A'}
                              </button>
                            </div>
                            <div className={`flex items-center gap-3 ${isNA ? 'opacity-20 pointer-events-none' : ''}`}>
                              <input 
                                type="range" 
                                min="1" max="5" 
                                value={evalForm.skills[skill.key as keyof EvaluationSkills] || 3} 
                                onChange={e => setEvalForm({
                                  ...evalForm,
                                  skills: { ...evalForm.skills, [skill.key]: parseInt(e.target.value) }
                                })}
                                className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                              <span className="font-black text-blue-600 w-4">{evalForm.skills[skill.key as keyof EvaluationSkills] || '-'}</span>
                            </div>
                          </div>
                          <div className="w-full md:w-2/3">
                            <label className={`text-[10px] font-bold uppercase ${isNA ? 'text-gray-300' : 'text-gray-400'}`}>Specific Comments for {skill.label}</label>
                            <input 
                              type="text"
                              value={evalForm.skillComments[skill.key as keyof EvaluationSkillComments] || ''}
                              onChange={e => setEvalForm({
                                ...evalForm,
                                skillComments: { ...evalForm.skillComments, [skill.key]: e.target.value }
                              })}
                              disabled={isNA}
                              className={`w-full mt-1 text-sm rounded-lg border-gray-200 dark:border-gray-700 dark:text-white ${isNA ? 'bg-transparent border-gray-100 dark:border-gray-800 opacity-30' : 'bg-white dark:bg-gray-800'}`}
                              placeholder={isNA ? "N/A" : "Optional specifics..."}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-[#1a202c] py-4">
                <button type="button" onClick={() => setIsEvalModalOpen(false)} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-lg font-bold dark:text-white">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-blue-700">
                  {editingEvalId ? 'Update Evaluation' : 'Save Final Evaluation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingEval && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewingEval(null)}>
          <div className="bg-white dark:bg-[#1a202c] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-xl font-bold dark:text-white">Feedback Details</h3>
              <button onClick={() => setViewingEval(null)}><span className="material-symbols-outlined text-gray-400">close</span></button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{viewingEval.date}</p>
                  <h4 className="text-lg font-bold dark:text-white mt-1">{viewingEval.title}</h4>
                </div>
                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-black dark:bg-green-900/30 dark:text-green-300">
                  {viewingEval.score.toFixed(1)} <span className="material-symbols-outlined text-xs filled">star</span>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2">Preceptor Notes</span>
                <p className="text-sm text-[#4b5563] dark:text-gray-300 leading-relaxed italic">"{viewingEval.comment}"</p>
              </div>

              {viewingEval.skills && (
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Skills Assessment</span>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'historyTaking', label: 'History Taking' },
                      { key: 'physicalExam', label: 'Physical Exam' },
                      { key: 'reasoning', label: 'Reasoning' },
                      { key: 'diagnostics', label: 'Diagnostics' },
                      { key: 'treatmentPlan', label: 'Plan' }
                    ].map((s) => {
                      const val = viewingEval.skills?.[s.key as keyof EvaluationSkills];
                      return (
                        <div key={s.key} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
                          <span className="text-gray-500 font-medium">{s.label}</span>
                          <span className={`font-black ${val === null || val === undefined ? 'text-gray-300 uppercase italic' : 'text-primary'}`}>
                            {val === null || val === undefined ? 'N/A' : `${val}/5`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {viewingEval.taughtConcepts && viewingEval.taughtConcepts.length > 0 && (
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Taught Concepts</span>
                  <div className="flex flex-wrap gap-2">
                    {viewingEval.taughtConcepts.map((c, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg dark:bg-blue-900/30 dark:text-blue-300">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <div 
                  className="size-8 rounded-full bg-cover bg-center border border-gray-100" 
                  style={{ backgroundImage: `url('${viewingEval.evaluator.avatar}')` }}
                ></div>
                <div>
                  <p className="text-xs font-bold dark:text-white">{viewingEval.evaluator.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Evaluator</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
              <button 
                onClick={() => setViewingEval(null)}
                className="w-full py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 no-print">
        <nav className="flex items-center text-sm text-[#616f89] mb-6">
          <button onClick={() => setCurrentView('Dashboard')} className="hover:text-primary">MedTrack</button>
          <span className="material-symbols-outlined mx-2 text-base">chevron_right</span>
          <span className="font-bold text-[#111318] dark:text-white">{currentView}</span>
        </nav>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
