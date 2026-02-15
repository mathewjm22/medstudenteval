
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import Header, { View } from './components/Header';
import ProfileHeader from './components/ProfileHeader';
import CompetenciesCard from './components/CompetenciesCard';
import EvaluationsCard from './components/EvaluationsCard';
import RightSidebar from './components/RightSidebar';
import { Student, Phase, Competency, Evaluation, Assignment, EvaluationSkills, EvaluationSkillComments } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('Students');
  const [activePhase, setActivePhase] = useState<Phase>('mid');
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [isAllEvalsModalOpen, setIsAllEvalsModalOpen] = useState(false);
  const [evalSearch, setEvalSearch] = useState('');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      skills: {
        historyTaking: 4,
        physicalExam: 5,
        reasoning: 3,
        diagnostics: 4,
        treatmentPlan: 4
      },
      skillComments: {
        historyTaking: "Very thorough, inclusive of family history.",
        reasoning: "Needs more work on narrowing differentials."
      },
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
      skills: {
        historyTaking: 5,
        physicalExam: 4,
        reasoning: 5,
        diagnostics: 5,
        treatmentPlan: 5
      },
      evaluator: {
        name: "Dr. David Chen",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCc5TyV6hjONVHhaASBdgm-ptO0sizLYXAfn0K9XZYcuSLVoz-4NZ_jn0fBb4hdVM5-84BOyv-Cj62VwIfnMy11slnhsfBdrVcAWvR428pptkfMIQ51HM6a0TJ9GogCNylFuyFcju9mxS2v1zh-UJL0oQk-F2SO5ISe3h2a8veuLbxRjw38SbKBiZ7HigJoHyUSKEtEE58wX3fJT2mdcOy2ZWwaurt23ShhRCH-mh8ss9LLxY4pIopSOPHfZzmnw08sOZA8uzLMr8jv"
      }
    }
  ]);

  const student: Student = {
    name: "Alex Lockwood",
    year: "MS3",
    status: "Active",
    rotation: "Outpatient Internal Medicine Rotation",
    startDate: "Jan 4",
    endDate: "Feb 15",
    week: 3,
    patientsCount: evaluations.length,
    avgEval: Number((evaluations.reduce((acc, curr) => acc + curr.score, 0) / evaluations.length).toFixed(1)),
    progressPercent: 68,
    weeksRemaining: 4,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDg63s5VzT-QBwYhSmVQHIUkYILtCa8XsPy9WXSWvgBsp2YgOu80Xxu1igJO1eVy9WxSu8MIGmlQ9QwooIo-j5DtJN5cEu2qELWHQL-IZjW7G7_hua8PaS2BGZQGGfqNVEyC08RB_iIZfXjdelMYYni6yJrqxdW7bVLivcrmO1UZYjiXWJlu-J_97o5G1t-PA7jlDfQAmGZPl3H8E5RuL8VxVjEYK0-OaEjaAtOrgEdhoulu6RS81I-wpTS8Q1WdAJDxnuYewZxbwf-"
  };

  const generateAISummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a medical education expert writing a clinical rotation summary for a student named ${student.name}. 
      Based on the following evaluation data, provide a professional "One-Page" summary.
      
      Evaluation Data:
      ${evaluations.map(e => `- Date: ${e.date}, Score: ${e.score}, Feedback: ${e.comment}, Taught: ${e.taughtConcepts?.join(', ') || 'N/A'}`).join('\n')}
      
      The summary should be structured in professional Markdown with these sections:
      1. Executive Overview (Professional and encouraging)
      2. Clinical Strengths (Synthesized from multiple evaluations)
      3. Focus Areas for Improvement (Constructive)
      4. Taught Concepts Index (A list of high-yield topics covered)
      5. Final Recommendation (Ready for clerkship director review)
      
      Keep the tone official, academic, and clinical. Organize it so it looks like a printed PDF report.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      setAiSummary(response.text || 'Unable to generate summary at this time.');
    } catch (error) {
      console.error("AI Generation Error:", error);
      setAiSummary("Error generating summary. Please ensure you have evaluations saved.");
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
      skills: {
        historyTaking: 4,
        physicalExam: 4,
        reasoning: 4,
        diagnostics: 4,
        treatmentPlan: 4
      },
      skillComments: {
        historyTaking: '',
        physicalExam: '',
        reasoning: '',
        diagnostics: '',
        treatmentPlan: ''
      }
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
      skills: evaluation.skills ? { ...evaluation.skills } : {
        historyTaking: 4,
        physicalExam: 4,
        reasoning: 4,
        diagnostics: 4,
        treatmentPlan: 4
      },
      skillComments: evaluation.skillComments ? { 
        historyTaking: evaluation.skillComments.historyTaking || '',
        physicalExam: evaluation.skillComments.physicalExam || '',
        reasoning: evaluation.skillComments.reasoning || '',
        diagnostics: evaluation.skillComments.diagnostics || '',
        treatmentPlan: evaluation.skillComments.treatmentPlan || ''
      } : {
        historyTaking: '',
        physicalExam: '',
        reasoning: '',
        diagnostics: '',
        treatmentPlan: ''
      }
    });
    setIsEvalModalOpen(true);
  };

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalForm.comment) return;

    const score = parseFloat(evalForm.score);
    const splitConditions = evalForm.conditions.split(',').map(c => c.trim()).filter(c => c !== '');
    const splitConcepts = evalForm.taughtConcepts.split(',').map(c => c.trim()).filter(c => c !== '');

    const displayDate = new Date(evalForm.date + 'T12:00:00').toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });

    if (editingEvalId) {
      setEvaluations(prev => prev.map(ev => 
        ev.id === editingEvalId 
          ? {
              ...ev,
              title: evalForm.title,
              date: displayDate,
              score: isNaN(score) ? 4.0 : Math.min(5, Math.max(1, score)),
              comment: evalForm.comment,
              conditions: splitConditions,
              taughtConcepts: splitConcepts,
              skills: { ...evalForm.skills },
              skillComments: { ...evalForm.skillComments }
            }
          : ev
      ));
    } else {
      const newEval: Evaluation = {
        id: Date.now().toString(),
        title: evalForm.title,
        date: displayDate,
        score: isNaN(score) ? 4.0 : Math.min(5, Math.max(1, score)),
        comment: evalForm.comment,
        conditions: splitConditions,
        taughtConcepts: splitConcepts,
        skills: { ...evalForm.skills },
        skillComments: { ...evalForm.skillComments },
        evaluator: {
          name: "Dr. Preceptor (You)",
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAu_bA54j7E6jHFqEr44Dh7hoeMipzwNO5SAsYcZ5ZGmNFADIgn685yOJigN8VfHo_2yuoGMg3BHVXz4wJpXBYhA8Jh5DJ_2v9-OTD0FhiqPNoU7W1pK5T7IdSRdTsnta6FN5qzN-KZErGa0oCo6lN_w9fRatQXnF81CjUH4LUp13xquR3nYCcH_ylWA9vZz_-nIidgsPYjG1MeznQRUY71svahsV1Eck_gGDd3lDdIB4daCqGrKzmvUQslvPHNIvgR6xHN_w4ODkIu"
        }
      };
      setEvaluations([newEval, ...evaluations]);
    }

    setIsEvalModalOpen(false);
  };

  const updateSkill = (skill: keyof EvaluationSkills, value: number | null) => {
    setEvalForm(prev => ({
      ...prev,
      skills: { ...prev.skills, [skill]: value }
    }));
  };

  const updateSkillComment = (skill: keyof EvaluationSkillComments, value: string) => {
    setEvalForm(prev => ({
      ...prev,
      skillComments: { ...prev.skillComments, [skill]: value }
    }));
  };

  // State update handlers
  const handleToggleCompetency = (id: string) => {
    setCompetencies(prev => ({
      ...prev,
      [activePhase]: prev[activePhase].map(comp => 
        comp.id === id ? { ...comp, isDone: !comp.isDone } : comp
      )
    }));
  };

  const handleToggleAssignment = (id: string) => {
    setAssignments(prev => prev.map(a => 
      a.id === id 
        ? { 
            ...a, 
            status: a.status === 'done' ? 'pending' : 'done',
            completedDate: a.status === 'pending' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : undefined
          } 
        : a
    ));
  };

  const handleAddCondition = (label: string) => {
    setConditions(prev => [...prev, { label, theme: 'gray' }]);
  };

  const handleAddGoal = () => {
    const title = prompt("Enter custom goal title:");
    if (title) {
      const newGoal: Competency = {
        id: Date.now().toString(),
        title,
        isDone: false
      };
      setCompetencies(prev => ({
        ...prev,
        [activePhase]: [...prev[activePhase], newGoal]
      }));
    }
  };

  const renderContent = () => {
    if (currentView === 'Concepts') {
      const allConcepts = evaluations
        .filter(e => e.taughtConcepts && e.taughtConcepts.length > 0)
        .flatMap(e => (e.taughtConcepts || []).map(concept => ({ concept, date: e.date, encounter: e.title })));

      return (
        <div className="animate-in fade-in duration-300">
          <div className="mb-8">
            <h2 className="text-2xl font-bold dark:text-white">Teaching History</h2>
            <p className="text-[#616f89] dark:text-gray-400">A track of all medical concepts and pearls provided to {student.name}.</p>
          </div>
          <div className="grid gap-4">
            {allConcepts.length > 0 ? (
              allConcepts.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between group hover:border-primary transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined">lightbulb</span>
                    </div>
                    <div>
                      <h4 className="font-bold dark:text-white">{item.concept}</h4>
                      <p className="text-xs text-gray-500">Linked to: {item.encounter}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white dark:bg-[#1a202c] rounded-2xl border border-dashed border-gray-300">
                <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">school</span>
                <p className="text-gray-500">No concepts documented yet. Add them in your evaluations!</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (currentView === 'AI Summary') {
      return (
        <div className="animate-in fade-in duration-300">
          <div className="flex justify-between items-end mb-8 no-print">
            <div>
              <h2 className="text-2xl font-bold dark:text-white">Clinical Performance Report</h2>
              <p className="text-[#616f89] dark:text-gray-400">AI-generated clerkship summary based on active evaluations.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={generateAISummary}
                disabled={isGeneratingSummary}
                className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isGeneratingSummary ? 'Analyzing...' : <><span className="material-symbols-outlined text-lg">auto_awesome</span> Generate Summary</>}
              </button>
              {aiSummary && (
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-200"
                >
                  <span className="material-symbols-outlined text-lg">print</span>
                </button>
              )}
            </div>
          </div>

          {aiSummary ? (
            <div className="bg-white dark:bg-[#1a202c] p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 print:shadow-none print:border-none print:p-0">
              <div className="flex justify-between items-start mb-10 border-b-2 border-primary pb-6">
                <div>
                  <h1 className="text-3xl font-black text-primary mb-1">CLINICAL ROTATION SUMMARY</h1>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Internal Medicine Clerkship</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Student: <strong>{student.name}</strong></p>
                  <p>Rotation: <strong>{student.rotation}</strong></p>
                  <p>Date Generated: <strong>{new Date().toLocaleDateString()}</strong></p>
                </div>
              </div>
              <div className="prose prose-blue max-w-none dark:prose-invert">
                <div className="grid grid-cols-1 gap-6 whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                  {aiSummary}
                </div>
              </div>
              <div className="mt-20 flex justify-between border-t border-gray-100 pt-8 text-xs text-gray-400 font-bold uppercase tracking-widest no-print">
                <span>MedTrack Preceptor AI-Engine</span>
                <span>Clerkship Evaluation Form</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <div className="size-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="material-symbols-outlined text-primary text-4xl">description</span>
              </div>
              <h3 className="text-xl font-bold dark:text-white mb-2">No Summary Generated</h3>
              <p className="text-[#616f89] dark:text-gray-400 max-w-sm mx-auto">
                Click "Generate Summary" above to have AI compile all student feedback into a one-page printable report.
              </p>
            </div>
          )}
        </div>
      );
    }

    if (currentView !== 'Students') {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="size-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-gray-400">
              {currentView === 'Dashboard' ? 'dashboard' : currentView === 'Schedule' ? 'event' : 'library_books'}
            </span>
          </div>
          <h2 className="text-2xl font-bold dark:text-white mb-2">{currentView} Content</h2>
          <button 
            onClick={() => setCurrentView('Students')}
            className="mt-8 px-6 py-2 bg-primary text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition-colors"
          >
            Go Back to Alex Lockwood
          </button>
        </div>
      );
    }

    return (
      <>
        <ProfileHeader student={student} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold dark:text-white">Progress History</h2>
          <div className="flex bg-[#eef0f3] dark:bg-gray-800 p-1 rounded-lg">
            {(['early', 'mid', 'late'] as Phase[]).map((phase) => (
              <button 
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                  activePhase === phase 
                    ? 'bg-white dark:bg-primary dark:text-white text-primary shadow-sm ring-1 ring-black/5 dark:ring-0 font-bold' 
                    : 'text-[#616f89] hover:text-[#111318] dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {phase === 'early' ? 'Early Phase' : phase === 'mid' ? 'Mid Phase' : 'Late Phase'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 h-full">
            <CompetenciesCard 
              competencies={competencies[activePhase]} 
              onToggle={handleToggleCompetency} 
              onAddGoal={handleAddGoal} 
              phaseName={activePhase}
            />
          </div>
          
          <div className="lg:col-span-4 h-full">
            <EvaluationsCard 
              evaluations={evaluations} 
              onAddEvaluation={handleOpenEvalModal}
              onEditEvaluation={handleEditEval}
              onViewAll={() => setIsAllEvalsModalOpen(true)}
            />
          </div>

          <div className="lg:col-span-4 h-full">
            <RightSidebar 
              assignments={assignments} 
              onToggleAssignment={handleToggleAssignment} 
              conditions={conditions}
              onAddCondition={handleAddCondition}
            />
          </div>
        </div>
      </>
    );
  };

  const skillLabels: Record<keyof EvaluationSkills, string> = {
    historyTaking: "History Taking",
    physicalExam: "Physical Exam",
    reasoning: "Clinical Reasoning / DDX",
    diagnostics: "Labs / Diagnostics Consideration",
    treatmentPlan: "Treatment Plan"
  };

  return (
    <div className="min-h-screen flex flex-col font-display">
      <Header 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onExport={() => {}}
        onImport={() => {}}
      />
      
      {/* Evaluation Creation/Edit Modal */}
      {isEvalModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a202c] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-[#1a202c] z-10 shadow-sm">
              <h3 className="text-xl font-bold dark:text-white">
                {editingEvalId ? 'Edit Evaluation' : 'New Evaluation'}
              </h3>
              <button onClick={() => setIsEvalModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmitEvaluation} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Encounter Date</label>
                  <input type="date" required value={evalForm.date} onChange={e => setEvalForm(prev => ({...prev, date: e.target.value}))} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 text-primary">Overall Rating (1.0 - 5.0)</label>
                  <input type="number" step="0.1" min="1" max="5" required value={evalForm.score} onChange={e => setEvalForm(prev => ({...prev, score: e.target.value}))} className="w-full px-4 py-2 rounded-lg border border-primary/30 dark:border-primary/50 dark:bg-gray-800 dark:text-white font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Encounter Type</label>
                <input type="text" required value={evalForm.title} onChange={e => setEvalForm(prev => ({...prev, title: e.target.value}))} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="e.g. Clinical Rounds, Case Presentation" />
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                  Clinical Skill Metrics
                </h4>
                <div className="space-y-6">
                  {(Object.keys(skillLabels) as Array<keyof EvaluationSkills>).map((skill) => (
                    <div key={skill} className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{skillLabels[skill]}</span>
                        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button key={val} type="button" onClick={() => updateSkill(skill, val)} className={`size-8 shrink-0 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${evalForm.skills[skill] === val ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary/50'}`}>{val}</button>
                          ))}
                          <button type="button" onClick={() => updateSkill(skill, null)} className={`px-3 h-8 shrink-0 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all uppercase tracking-wider ${evalForm.skills[skill] === null ? 'bg-gray-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700'}`}>N/A</button>
                        </div>
                      </div>
                      <textarea rows={2} value={evalForm.skillComments[skill as keyof EvaluationSkillComments] || ''} onChange={(e) => updateSkillComment(skill as keyof EvaluationSkillComments, e.target.value)} className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none resize-none" placeholder={`Specific comments for ${skillLabels[skill].toLowerCase()}...`}></textarea>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Teaching Points / Concepts Discussed</label>
                <textarea rows={2} value={evalForm.taughtConcepts} onChange={e => setEvalForm(prev => ({...prev, taughtConcepts: e.target.value}))} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none" placeholder="e.g. approach to dyspnea, interpret EKG findings..."></textarea>
                <p className="text-[10px] text-gray-400 mt-1 italic">Comma separated list. These will be tracked in the 'Concepts' tab.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Overall Feedback</label>
                <textarea required rows={3} value={evalForm.comment} onChange={e => setEvalForm(prev => ({...prev, comment: e.target.value}))} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none" placeholder="Summarize overall student's performance..."></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEvalModalOpen(false)} className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
                <button type="submit" className="flex-1 py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg">{editingEvalId ? 'Update Evaluation' : 'Save Evaluation'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View All Evaluations Modal */}
      {isAllEvalsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a202c] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-[#2d3748]">
              <div>
                <h3 className="text-2xl font-bold dark:text-white">All Evaluations</h3>
                <p className="text-sm text-[#616f89] dark:text-gray-400">Showing {evaluations.length} total encounters for {student.name}</p>
              </div>
              <button onClick={() => setIsAllEvalsModalOpen(false)} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background-light dark:bg-gray-900">
              {evaluations.map((evalItem) => (
                <div key={evalItem.id} onClick={() => { setIsAllEvalsModalOpen(false); handleEditEval(evalItem); }} className="bg-white dark:bg-[#1a202c] rounded-xl border border-[#e5e7eb] dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-primary relative">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-[#111318] dark:text-white group-hover:text-primary transition-colors">{evalItem.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                         <span>{evalItem.date}</span> • <span>{evalItem.evaluator.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-2xl font-bold dark:bg-green-900/30 dark:text-green-300">
                      {evalItem.score.toFixed(1)} <span className="material-symbols-outlined filled text-xl">star</span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic mb-4">"{evalItem.comment}"</p>
                  {evalItem.taughtConcepts && evalItem.taughtConcepts.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {evalItem.taughtConcepts.map((tag, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 no-print">
        <nav className="flex items-center text-sm text-[#616f89] dark:text-gray-400 mb-6">
          <button onClick={() => setCurrentView('Dashboard')} className="hover:text-primary transition-colors">Dashboard</button>
          <span className="material-symbols-outlined mx-2 text-base">chevron_right</span>
          <button onClick={() => setCurrentView('Students')} className="hover:text-primary transition-colors">My Students</button>
          <span className="material-symbols-outlined mx-2 text-base">chevron_right</span>
          <span className="font-medium text-[#111318] dark:text-white">{currentView === 'Students' ? student.name : currentView}</span>
        </nav>

        {renderContent()}
      </main>

      {/* Printer CSS */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .max-w-7xl { max-width: 100% !important; margin: 0 !important; }
          #root { background: white !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
