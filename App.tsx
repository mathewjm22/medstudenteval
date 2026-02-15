
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import Header, { View } from './components/Header';
import ProfileHeader from './components/ProfileHeader';
import CompetenciesCard from './components/CompetenciesCard';
import EvaluationsCard from './components/EvaluationsCard';
import RightSidebar from './components/RightSidebar';
import { Student, Phase, Competency, Evaluation, Assignment, EvaluationSkills, EvaluationSkillComments } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('Dashboard');
  const [activePhase, setActivePhase] = useState<Phase>('mid');
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [isAllEvalsModalOpen, setIsAllEvalsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  
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

  // Clinical Conditions State
  const [conditions, setConditions] = useState([
    { label: '#Hypertension', theme: 'blue' as const },
    { label: '#Type 2 Diabetes', theme: 'purple' as const },
    { label: '#COPD', theme: 'gray' as const },
    { label: '#Anxiety', theme: 'gray' as const },
    { label: '#Gastroenteritis', theme: 'gray' as const },
    { label: '#Back Pain', theme: 'gray' as const },
  ]);

  // State for dynamic content
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

  const students: Student[] = [
    {
      name: "Alex Lockwood",
      year: "MS3",
      status: "Active",
      rotation: "Outpatient Internal Medicine Rotation",
      startDate: "Jan 4",
      endDate: "Feb 15",
      week: 3,
      patientsCount: evaluations.length,
      avgEval: 4.5,
      progressPercent: 68,
      weeksRemaining: 4,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDg63s5VzT-QBwYhSmVQHIUkYILtCa8XsPy9WXSWvgBsp2YgOu80Xxu1igJO1eVy9WxSu8MIGmlQ9QwooIo-j5DtJN5cEu2qELWHQL-IZjW7G7_hua8PaS2BGZQGGfqNVEyC08RB_iIZfXjdelMYYni6yJrqxdW7bVLivcrmO1UZYjiXWJlu-J_97o5G1t-PA7jlDfQAmGZPl3H8E5RuL8VxVjEYK0-OaEjaAtOrgEdhoulu6RS81I-wpTS8Q1WdAJDxnuYewZxbwf-"
    },
    {
      name: "Jamie Vance",
      year: "MS4",
      status: "Active",
      rotation: "Outpatient Internal Medicine Rotation",
      startDate: "Jan 10",
      endDate: "Feb 28",
      week: 2,
      patientsCount: 8,
      avgEval: 4.8,
      progressPercent: 42,
      weeksRemaining: 6,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCc5TyV6hjONVHhaASBdgm-ptO0sizLYXAfn0K9XZYcuSLVoz-4NZ_jn0fBb4hdVM5-84BOyv-Cj62VwIfnMy11slnhsfBdrVcAWvR428pptkfMIQ51HM6a0TJ9GogCNylFuyFcju9mxS2v1zh-UJL0oQk-F2SO5ISe3h2a8veuLbxRjw38SbKBiZ7HigJoHyUSKEtEE58wX3fJT2mdcOy2ZWwaurt23ShhRCH-mh8ss9LLxY4pIopSOPHfZzmnw08sOZA8uzLMr8jv"
    }
  ];

  const student = students[0]; // Default student for details

  const generateAISummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a medical education expert writing a clinical rotation summary for a student named ${student.name}. 
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
    const score = parseFloat(evalForm.score);
    const splitConditions = evalForm.conditions.split(',').map(c => c.trim()).filter(c => c !== '');
    const splitConcepts = evalForm.taughtConcepts.split(',').map(c => c.trim()).filter(c => c !== '');
    const displayDate = new Date(evalForm.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (editingEvalId) {
      setEvaluations(prev => prev.map(ev => ev.id === editingEvalId ? { ...ev, title: evalForm.title, date: displayDate, score: isNaN(score) ? 4.0 : score, comment: evalForm.comment, conditions: splitConditions, taughtConcepts: splitConcepts, skills: { ...evalForm.skills }, skillComments: { ...evalForm.skillComments } } : ev));
    } else {
      setEvaluations([{ id: Date.now().toString(), title: evalForm.title, date: displayDate, score: isNaN(score) ? 4.0 : score, comment: evalForm.comment, conditions: splitConditions, taughtConcepts: splitConcepts, skills: { ...evalForm.skills }, skillComments: { ...evalForm.skillComments }, evaluator: { name: "Dr. Preceptor (You)", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAu_bA54j7E6jHFqEr44Dh7hoeMipzwNO5SAsYcZ5ZGmNFADIgn685yOJigN8VfHo_2yuoGMg3BHVXz4wJpXBYhA8Jh5DJ_2v9-OTD0FhiqPNoU7W1pK5T7IdSRdTsnta6FN5qzN-KZErGa0oCo6lN_w9fRatQXnF81CjUH4LUp13xquR3nYCcH_ylWA9vZz_-nIidgsPYjG1MeznQRUY71svahsV1Eck_gGDd3lDdIB4daCqGrKzmvUQslvPHNIvgR6xHN_w4ODkIu" } }, ...evaluations]);
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
          <p className="text-[#616f89] dark:text-gray-400">Welcome back, Dr. Preceptor. Here is your team's status.</p>
        </div>
        <div className="flex gap-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="size-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Students</p>
              <p className="text-xl font-black dark:text-white">2</p>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="size-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined">avg_pace</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Team Avg</p>
              <p className="text-xl font-black dark:text-white">4.6</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((s, idx) => (
          <div 
            key={idx}
            onClick={() => { setCurrentView('Students'); setSelectedStudentId(s.name); }}
            className="group bg-white dark:bg-[#1a202c] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-primary">open_in_new</span>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="size-16 rounded-full bg-cover bg-center border-2 border-primary/10" style={{ backgroundImage: `url('${s.avatar}')` }}></div>
              <div>
                <h3 className="text-xl font-extrabold dark:text-white">{s.name}</h3>
                <p className="text-sm text-gray-500 font-medium">{s.year} • {s.rotation}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end text-sm">
                <span className="font-bold text-gray-400 uppercase tracking-tighter">Progress</span>
                <span className="font-black text-primary">{s.progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full">
                <div className="h-full bg-primary rounded-full" style={{ width: `${s.progressPercent}%` }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Avg Eval</p>
                  <p className="text-lg font-black text-primary">{s.avgEval}</p>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Week</p>
                  <p className="text-lg font-black dark:text-white">{s.week}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-2xl font-black dark:text-white mb-6">Rotation Schedule</h2>
      <div className="bg-white dark:bg-[#1a202c] rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-7 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 min-h-[500px]">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="p-4 border-r border-b border-gray-100 dark:border-gray-700 min-h-[100px] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <span className="text-xs font-bold text-gray-300">{(i % 31) + 1}</span>
              {i === 17 && (
                <div className="mt-2 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-[10px] font-black text-primary uppercase">2:00 PM</p>
                  <p className="text-[10px] font-bold dark:text-white line-clamp-1">Alex Feedback Session</p>
                </div>
              )}
              {i === 20 && (
                <div className="mt-2 p-2 bg-green-100 border border-green-200 rounded-lg">
                  <p className="text-[10px] font-black text-green-700 uppercase">9:00 AM</p>
                  <p className="text-[10px] font-bold text-green-800 line-clamp-1">Clinical Rounds</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'Dashboard': return renderDashboard();
      case 'Schedule': return renderSchedule();
      case 'Concepts': return (
        <div className="animate-in fade-in duration-300">
          <div className="mb-8">
            <h2 className="text-2xl font-bold dark:text-white">Teaching History</h2>
            <p className="text-[#616f89] dark:text-gray-400">A track of medical concepts covered with {student.name}.</p>
          </div>
          <div className="grid gap-4">
            {evaluations.flatMap(e => e.taughtConcepts || []).length > 0 ? (
              evaluations.flatMap(e => (e.taughtConcepts || []).map(c => ({ c, date: e.date, encounter: e.title }))).map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between group hover:border-primary transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined">lightbulb</span>
                    </div>
                    <div><h4 className="font-bold dark:text-white">{item.c}</h4><p className="text-xs text-gray-500">{item.encounter}</p></div>
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">{item.date}</span>
                </div>
              ))
            ) : <p className="text-center py-20 text-gray-500">No concepts documented yet.</p>}
          </div>
        </div>
      );
      case 'AI Summary': return (
        <div className="animate-in fade-in duration-300">
          <div className="flex justify-between items-end mb-8 no-print">
            <div><h2 className="text-2xl font-bold dark:text-white">Performance Report</h2><p className="text-[#616f89] dark:text-gray-400">AI-generated summary based on evaluations.</p></div>
            <button onClick={generateAISummary} disabled={isGeneratingSummary} className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
              {isGeneratingSummary ? 'Analyzing...' : <><span className="material-symbols-outlined text-lg">auto_awesome</span> Generate Summary</>}
            </button>
          </div>
          {aiSummary ? (
            <div className="bg-white dark:bg-[#1a202c] p-10 rounded-2xl shadow-xl border border-gray-100 print:p-0">
              <div className="border-b-2 border-primary pb-6 mb-10"><h1 className="text-3xl font-black text-primary">ROTATION SUMMARY: {student.name}</h1></div>
              <div className="prose prose-blue max-w-none dark:prose-invert whitespace-pre-wrap leading-relaxed">{aiSummary}</div>
            </div>
          ) : <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200">No summary generated. Click the button above.</div>}
        </div>
      );
      case 'Students': return (
        <>
          <ProfileHeader student={student} />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold dark:text-white">Progress History</h2>
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {(['early', 'mid', 'late'] as Phase[]).map((phase) => (
                <button key={phase} onClick={() => setActivePhase(phase)} className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${activePhase === phase ? 'bg-white dark:bg-primary dark:text-white text-primary shadow-sm font-bold' : 'text-[#616f89]'}`}>
                  {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4"><CompetenciesCard competencies={competencies[activePhase]} onToggle={handleToggleCompetency} phaseName={activePhase} /></div>
            <div className="lg:col-span-4"><EvaluationsCard evaluations={evaluations} onAddEvaluation={handleOpenEvalModal} onEditEvaluation={handleEditEval} onViewAll={() => setIsAllEvalsModalOpen(true)} /></div>
            <div className="lg:col-span-4"><RightSidebar assignments={assignments} onToggleAssignment={handleToggleAssignment} conditions={conditions} onAddCondition={(label) => setConditions([...conditions, { label, theme: 'gray' }])} /></div>
          </div>
        </>
      );
      default: return null;
    }
  };

  const skillLabels: Record<keyof EvaluationSkills, string> = { historyTaking: "History Taking", physicalExam: "Physical Exam", reasoning: "Clinical Reasoning", diagnostics: "Diagnostics", treatmentPlan: "Treatment Plan" };

  return (
    <div className="min-h-screen flex flex-col font-display selection:bg-primary/20">
      <Header currentView={currentView} onNavigate={setCurrentView} />
      
      {isEvalModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a202c] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-[#1a202c] z-10">
              <h3 className="text-xl font-bold dark:text-white">{editingEvalId ? 'Edit' : 'New'} Evaluation</h3>
              <button onClick={() => setIsEvalModalOpen(false)}><span className="material-symbols-outlined text-gray-400">close</span></button>
            </div>
            <form onSubmit={handleSubmitEvaluation} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold">Date</label><input type="date" required value={evalForm.date} onChange={e => setEvalForm({ ...evalForm, date: e.target.value })} className="w-full rounded-lg border-gray-300 dark:bg-gray-800" /></div>
                <div><label className="text-sm font-bold">Rating (1-5)</label><input type="number" step="0.1" max="5" min="1" required value={evalForm.score} onChange={e => setEvalForm({ ...evalForm, score: e.target.value })} className="w-full rounded-lg border-primary/30 dark:bg-gray-800" /></div>
              </div>
              <div><label className="text-sm font-bold">Feedback</label><textarea required rows={4} value={evalForm.comment} onChange={e => setEvalForm({ ...evalForm, comment: e.target.value })} className="w-full rounded-lg border-gray-300 dark:bg-gray-800" placeholder="Summary..."></textarea></div>
              <div className="flex gap-3"><button type="button" onClick={() => setIsEvalModalOpen(false)} className="flex-1 py-3 border rounded-lg">Cancel</button><button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-lg shadow-lg">Save</button></div>
            </form>
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 no-print">
        <nav className="flex items-center text-sm text-[#616f89] mb-6">
          <button onClick={() => setCurrentView('Dashboard')} className="hover:text-primary transition-colors">MedTrack</button>
          <span className="material-symbols-outlined mx-2 text-base">chevron_right</span>
          <span className="font-medium text-[#111318] dark:text-white">{currentView}</span>
        </nav>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
