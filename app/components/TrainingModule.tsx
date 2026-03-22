'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface Lesson {
  id: string;
  title: string;
  type: 'content' | 'video' | 'quiz';
  content?: string; // HTML or ProseMirror JSON
  videoUrl?: string;
  questions?: QuizQuestion[];
  duration?: number; // minutes
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessons: Lesson[];
  requiredFor?: string[]; // roles
  dueInDays?: number;
  icon?: string;
}

interface UserProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  quizScore?: number;
  quizAnswers?: number[];
}

interface UserCourseData {
  courseId: string;
  enrolled: boolean;
  enrolledAt: string;
  progress: UserProgress[];
}

interface Props {
  dark: boolean;
  storageKey: string;
  portalType: 'employee' | 'operations';
}

// ── Default Courses ────────────────────────────────────────────────────────

const EMPLOYEE_COURSES: Course[] = [
  {
    id: 'onboarding-101',
    title: 'New Employee Onboarding',
    description: 'Everything you need to get started at Tumlinson Electric — company overview, policies, benefits, and your first-week checklist.',
    category: 'Onboarding',
    difficulty: 'beginner',
    icon: '🚀',
    requiredFor: ['all'],
    dueInDays: 7,
    lessons: [
      { id: 'onb-1', title: 'Welcome to Tumlinson Electric', type: 'content', duration: 5, content: '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Welcome to the Team!"}]},{"type":"paragraph","content":[{"type":"text","text":"Tumlinson Electric is a full-service electrical contractor providing construction services throughout Texas. Founded by Kenneth and Suanna Tumlinson, our company brings decades of leadership, experience, and integrity to every project."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Our Mission"}]},{"type":"paragraph","content":[{"type":"text","text":"We are committed to devoting the necessary time and resources needed to complete every project safely, on schedule, and within budget."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"What Makes Us Different"}]},{"type":"bullet_list","content":[{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Woman-Owned Business Enterprise (WBE)"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Full-service DIV 26 (Electrical) and DIV 27 (Low Voltage)"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Technology-driven project management"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Zero-incident safety culture"}]}]}]}]}' },
      { id: 'onb-2', title: 'Company Policies Overview', type: 'content', duration: 10, content: '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Company Policies"}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Work Hours"}]},{"type":"paragraph","content":[{"type":"text","text":"Standard work hours are Monday–Friday. Field schedules vary by project. All overtime must be pre-approved by your supervisor."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"PTO Policy"}]},{"type":"paragraph","content":[{"type":"text","text":"Submit PTO requests through the Employee Portal at least 2 weeks in advance. Emergency leave should be communicated to your supervisor and HR immediately."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Drug & Alcohol Policy"}]},{"type":"paragraph","content":[{"type":"text","text":"Tumlinson Electric maintains a strict zero-tolerance drug and alcohol policy. Random and project-specific testing may be required."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"AMEX Card Policy"}]},{"type":"paragraph","content":[{"type":"text","text":"Company AMEX cards are for business purchases only. All receipts must be submitted within 5 business days. Personal use is strictly prohibited."}]}]}' },
      { id: 'onb-3', title: 'Benefits & HR', type: 'content', duration: 8, content: '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Employee Benefits"}]},{"type":"bullet_list","content":[{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Health, Dental, and Vision Insurance"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"401(k) Retirement Plan"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Paid Time Off (PTO)"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Life Insurance"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"WellWorks Wellness Program"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"TE Bucks Reward Program"}]}]}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"HR Contacts"}]},{"type":"paragraph","content":[{"type":"text","text":"For all HR inquiries, email TE_HRPAYROLL@tumlinsonelectric.com"}]}]}' },
      { id: 'onb-4', title: 'IT & Software Setup', type: 'content', duration: 10, content: '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Getting Set Up"}]},{"type":"paragraph","content":[{"type":"text","text":"Contact IT Support at lcoker@tumlinsonelectric.com or support@tumlinsonelectric.com for setup assistance."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Required Software"}]},{"type":"bullet_list","content":[{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Microsoft 365 (Outlook, Teams, OneDrive)"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"DUO MFA (Multi-Factor Authentication)"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Autodesk Build"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Bluebeam Revu"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"eSUB (Field)"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Computer Ease"}]}]}]}]}' },
      { id: 'onb-quiz', title: 'Onboarding Quiz', type: 'quiz', duration: 5, questions: [
        { id: 'q1', question: 'Tumlinson Electric is recognized as what type of business enterprise?', options: ['Minority-Owned', 'Woman-Owned', 'Veteran-Owned', 'Small Business'], correctIndex: 1, explanation: 'Tumlinson Electric is a state of Texas recognized Woman-Owned Business Enterprise.' },
        { id: 'q2', question: 'What are the two main divisions at Tumlinson Electric?', options: ['DIV 25 and DIV 26', 'DIV 26 and DIV 27', 'DIV 27 and DIV 28', 'DIV 16 and DIV 17'], correctIndex: 1, explanation: 'Division 26 (Electrical) and Division 27 (Low Voltage / Telecommunications).' },
        { id: 'q3', question: 'How far in advance should PTO requests be submitted?', options: ['1 week', '2 weeks', '1 month', '48 hours'], correctIndex: 1, explanation: 'PTO requests should be submitted at least 2 weeks in advance.' },
        { id: 'q4', question: 'Who should you contact for IT support?', options: ['HR Department', 'Your Supervisor', 'Logan Coker / support@tumlinsonelectric.com', 'The main office'], correctIndex: 2 },
        { id: 'q5', question: 'What is Tumlinson Electric\'s drug and alcohol policy?', options: ['First offense warning', 'Zero tolerance', 'Manager discretion', 'No policy'], correctIndex: 1 },
      ]},
    ],
  },
  {
    id: 'safety-101',
    title: 'Safety Fundamentals',
    description: 'Required safety training covering PPE, hazard identification, reporting procedures, and emergency protocols.',
    category: 'Safety',
    difficulty: 'beginner',
    icon: '🦺',
    requiredFor: ['all'],
    dueInDays: 3,
    lessons: [
      { id: 'saf-1', title: 'Safety Culture at TE', type: 'content', duration: 5, content: '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Safety First — Always"}]},{"type":"paragraph","content":[{"type":"text","text":"At Tumlinson Electric, safety is not just a priority — it\'s a core value. Every team member is empowered and expected to stop work if conditions are unsafe."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Key Principles"}]},{"type":"bullet_list","content":[{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Daily toolbox talks before work begins"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Weekly safety audits on all active jobsites"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Continuous OSHA training for all field personnel"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Incident reporting within 24 hours — no exceptions"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Stop Work Authority for ALL employees"}]}]}]}]}' },
      { id: 'saf-2', title: 'PPE Requirements', type: 'content', duration: 8, content: '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Personal Protective Equipment"}]},{"type":"paragraph","content":[{"type":"text","text":"PPE is required on ALL jobsites at ALL times. Tumlinson Electric provides the following PPE:"}]},{"type":"bullet_list","content":[{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Hard hat (ANSI Z89.1 compliant)"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Safety glasses (ANSI Z87.1)"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"High-visibility vest (Class 2 minimum)"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Steel-toe or composite-toe boots"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Hearing protection when required"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Arc-flash rated clothing for electrical work"}]}]}]}]}' },
      { id: 'saf-quiz', title: 'Safety Quiz', type: 'quiz', duration: 5, questions: [
        { id: 'sq1', question: 'When should you wear PPE on a jobsite?', options: ['Only during electrical work', 'When your supervisor is watching', 'At ALL times', 'Only in hazardous areas'], correctIndex: 2 },
        { id: 'sq2', question: 'Who has Stop Work Authority?', options: ['Only supervisors', 'Only safety managers', 'ALL employees', 'Only project managers'], correctIndex: 2 },
        { id: 'sq3', question: 'How quickly must incidents be reported?', options: ['Within 1 week', 'Within 48 hours', 'Within 24 hours', 'End of the month'], correctIndex: 2 },
      ]},
    ],
  },
];

const OPS_COURSES: Course[] = [
  {
    id: 'pm-setup',
    title: 'Project Setup & Handoff',
    description: 'Complete guide to setting up a new project — from handoff meeting through startup activities and turnover.',
    category: 'PM Manual',
    difficulty: 'intermediate',
    icon: '📋',
    lessons: [
      { id: 'pm-1', title: 'Handoff Meeting Checklist', type: 'content', duration: 15, content: '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Project Handoff Meeting"}]},{"type":"paragraph","content":[{"type":"text","text":"The handoff meeting is the critical transition from estimating to operations. All project information must be transferred accurately."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Required Attendees"}]},{"type":"bullet_list","content":[{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Estimator who won the project"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Assigned Project Manager"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"General Superintendent"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"BIM Manager (if applicable)"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Director of Pre-Construction"}]}]}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Key Topics"}]},{"type":"ordered_list","content":[{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Contract scope review and exclusions"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Budget breakdown by task code"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Schedule milestones and critical dates"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Manpower plan and crew composition"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Material procurement strategy"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Submittal requirements and deadlines"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Known risks and owner concerns"}]}]}]}]}' },
      { id: 'pm-2', title: 'Autodesk Build Setup', type: 'content', duration: 20, content: '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Setting Up Autodesk Build"}]},{"type":"paragraph","content":[{"type":"text","text":"Every project must be set up in Autodesk Build within 48 hours of the handoff meeting. This includes document structure, member access, and notification settings."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Folder Structure"}]},{"type":"paragraph","content":[{"type":"text","text":"Follow the standard TE folder structure for all projects. Refer to the PM Templates section for the complete folder template."}]}]}' },
      { id: 'pm-quiz', title: 'Project Setup Quiz', type: 'quiz', duration: 5, questions: [
        { id: 'pq1', question: 'Within how many hours must Autodesk Build be set up after handoff?', options: ['24 hours', '48 hours', '1 week', '2 weeks'], correctIndex: 1 },
        { id: 'pq2', question: 'Who must attend the handoff meeting?', options: ['Only the PM', 'PM and Estimator only', 'Estimator, PM, GS, BIM, and Dir. of Pre-Con', 'The entire team'], correctIndex: 2 },
      ]},
    ],
  },
  {
    id: 'bluebeam-training',
    title: 'Bluebeam Revu Training',
    description: 'Complete Bluebeam Revu training — markups, takeoffs, document comparison, and studio sessions.',
    category: 'Software',
    difficulty: 'intermediate',
    icon: '📐',
    lessons: [
      { id: 'bb-1', title: 'Bluebeam Basics', type: 'content', duration: 15, content: '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Getting Started with Bluebeam Revu"}]},{"type":"paragraph","content":[{"type":"text","text":"Bluebeam Revu is our primary tool for PDF markup, takeoffs, and document collaboration. Every PM and estimator must be proficient in Bluebeam."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Key Features"}]},{"type":"bullet_list","content":[{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"PDF markup and annotations"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Measurement tools for takeoffs"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Document comparison (overlay)"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Studio Sessions for real-time collaboration"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Custom tool sets and templates"}]}]}]}]}' },
    ],
  },
  {
    id: 'field-ops-101',
    title: 'Field Operations Essentials',
    description: 'Field procedures, daily reporting, time entry, tool management, and quality assurance.',
    category: 'Field',
    difficulty: 'beginner',
    icon: '🔧',
    requiredFor: ['field', 'superintendent', 'foreman'],
    dueInDays: 5,
    lessons: [
      { id: 'fo-1', title: 'Daily Reporting', type: 'content', duration: 10, content: '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Daily Reporting Requirements"}]},{"type":"paragraph","content":[{"type":"text","text":"Every superintendent and foreman must submit a daily log by end of each work day. This is non-negotiable."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Daily Log Must Include"}]},{"type":"bullet_list","content":[{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Manpower count by trade"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Work completed today (specific areas/tasks)"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Work planned for tomorrow"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Safety observations or incidents"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Material deliveries and issues"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Weather conditions"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"Photos (minimum 3 per day)"}]}]}]}]}' },
      { id: 'fo-quiz', title: 'Field Ops Quiz', type: 'quiz', duration: 5, questions: [
        { id: 'fq1', question: 'When must daily logs be submitted?', options: ['Weekly on Friday', 'By end of each work day', 'Within 48 hours', 'Monthly'], correctIndex: 1 },
        { id: 'fq2', question: 'What is the minimum number of photos required per daily log?', options: ['1', '2', '3', '5'], correctIndex: 2 },
      ]},
    ],
  },
];

// ── Helper Components ──────────────────────────────────────────────────────

function ProgressBar({ pct, size = 'md', color = 'bg-te-teal' }: { pct: number; size?: 'sm' | 'md'; color?: string }) {
  return (
    <div className={`w-full rounded-full overflow-hidden ${size === 'sm' ? 'h-1' : 'h-2'} bg-white/10`}>
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  );
}

function QuizView({ questions, onComplete, dark }: { questions: QuizQuestion[]; onComplete: (score: number, answers: number[]) => void; dark: boolean }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const q = questions[current];
  const isLast = current === questions.length - 1;
  const isCorrect = selected === q?.correctIndex;

  function submitAnswer() {
    if (selected === null) return;
    setSubmitted(true);
    setAnswers(prev => [...prev, selected]);
  }

  function next() {
    if (isLast) {
      const finalAnswers = [...answers];
      const score = finalAnswers.reduce((s, a, i) => s + (a === questions[i].correctIndex ? 1 : 0), 0);
      setShowResult(true);
      onComplete(Math.round((score / questions.length) * 100), finalAnswers);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setSubmitted(false);
    }
  }

  if (showResult) {
    const score = answers.reduce((s, a, i) => s + (a === questions[i].correctIndex ? 1 : 0), 0);
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 80;
    return (
      <div className="text-center py-8">
        <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
          <span className="text-3xl">{passed ? '🎉' : '📚'}</span>
        </div>
        <h3 className={`text-xl font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{passed ? 'Congratulations!' : 'Keep Learning'}</h3>
        <p className={`text-3xl font-black mb-2 ${passed ? 'text-emerald-400' : 'text-red-400'}`}>{pct}%</p>
        <p className={dark ? 'text-gray-400' : 'text-gray-600'}>{score}/{questions.length} correct {passed ? '— You passed!' : '— 80% required to pass'}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Question {current + 1} of {questions.length}</span>
        <ProgressBar pct={(current / questions.length) * 100} size="sm" />
      </div>

      <h3 className={`text-lg font-semibold mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>{q.question}</h3>

      <div className="space-y-2 mb-6">
        {q.options.map((opt, i) => {
          let cls = `w-full text-left px-4 py-3 rounded-xl text-sm transition-all border `;
          if (submitted) {
            if (i === q.correctIndex) cls += dark ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : 'border-emerald-500 bg-emerald-50 text-emerald-700';
            else if (i === selected && i !== q.correctIndex) cls += dark ? 'border-red-500 bg-red-500/10 text-red-300' : 'border-red-500 bg-red-50 text-red-700';
            else cls += dark ? 'border-white/5 text-gray-500' : 'border-gray-200 text-gray-400';
          } else {
            if (selected === i) cls += dark ? 'border-te-teal bg-te-teal/10 text-white' : 'border-te-teal bg-te-teal/5 text-gray-900';
            else cls += dark ? 'border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50';
          }
          return <button key={i} onClick={() => !submitted && setSelected(i)} disabled={submitted} className={cls}>{opt}</button>;
        })}
      </div>

      {submitted && q.explanation && (
        <div className={`rounded-xl p-3 mb-4 text-sm ${dark ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300' : 'bg-blue-50 border border-blue-200 text-blue-700'}`}>
          {q.explanation}
        </div>
      )}

      <div className="flex justify-end">
        {!submitted ? (
          <button onClick={submitAnswer} disabled={selected === null} className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-te-teal hover:bg-te-teal-light disabled:opacity-40 transition-colors">
            Check Answer
          </button>
        ) : (
          <button onClick={next} className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-te-teal hover:bg-te-teal-light transition-colors">
            {isLast ? 'See Results' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Training Module ───────────────────────────────────────────────────

export default function TrainingModule({ dark, storageKey, portalType }: Props) {
  const [progressData, setProgressData] = useState<UserCourseData[]>([]);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [adminMode, setAdminMode] = useState(false);
  const [customCourses, setCustomCourses] = useState<Course[]>([]);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseCat, setNewCourseCat] = useState('');

  const baseCourses = portalType === 'employee' ? EMPLOYEE_COURSES : OPS_COURSES;
  const allCourses = [...baseCourses, ...customCourses];

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}-training-progress`);
      if (saved) setProgressData(JSON.parse(saved));
      const savedCourses = localStorage.getItem(`${storageKey}-custom-courses`);
      if (savedCourses) setCustomCourses(JSON.parse(savedCourses));
    } catch {}
  }, [storageKey]);

  const saveProgress = useCallback((data: UserCourseData[]) => {
    setProgressData(data);
    localStorage.setItem(`${storageKey}-training-progress`, JSON.stringify(data));
  }, [storageKey]);

  const saveCourses = useCallback((courses: Course[]) => {
    setCustomCourses(courses);
    localStorage.setItem(`${storageKey}-custom-courses`, JSON.stringify(courses));
  }, [storageKey]);

  // Course progress helpers
  function getCourseProgress(courseId: string): UserCourseData | undefined {
    return progressData.find(p => p.courseId === courseId);
  }

  function getCourseCompletionPct(course: Course): number {
    const prog = getCourseProgress(course.id);
    if (!prog) return 0;
    const completed = prog.progress.filter(p => p.completed).length;
    return Math.round((completed / course.lessons.length) * 100);
  }

  function markLessonComplete(courseId: string, lessonId: string, quizScore?: number) {
    const existing = progressData.find(p => p.courseId === courseId);
    const lessonProgress: UserProgress = { lessonId, completed: true, completedAt: new Date().toISOString(), quizScore };

    if (existing) {
      const updated = progressData.map(p => {
        if (p.courseId !== courseId) return p;
        const progs = p.progress.filter(pp => pp.lessonId !== lessonId);
        return { ...p, progress: [...progs, lessonProgress] };
      });
      saveProgress(updated);
    } else {
      saveProgress([...progressData, { courseId, enrolled: true, enrolledAt: new Date().toISOString(), progress: [lessonProgress] }]);
    }
  }

  function isLessonComplete(courseId: string, lessonId: string): boolean {
    const prog = getCourseProgress(courseId);
    return prog?.progress.some(p => p.lessonId === lessonId && p.completed) || false;
  }

  // Active course/lesson
  const activeCourse = allCourses.find(c => c.id === activeCourseId);
  const activeLesson = activeCourse?.lessons[activeLessonIdx];

  // Stats
  const totalCourses = allCourses.length;
  const completedCourses = allCourses.filter(c => getCourseCompletionPct(c) === 100).length;
  const totalLessons = allCourses.reduce((s, c) => s + c.lessons.length, 0);
  const completedLessons = progressData.reduce((s, p) => s + p.progress.filter(pp => pp.completed).length, 0);

  // Categories
  const categories = [...new Set(allCourses.map(c => c.category))];

  const bg = dark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-gray-200 shadow-sm';
  const textPrimary = dark ? 'text-white' : 'text-gray-900';
  const textSecondary = dark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = dark ? 'text-gray-500' : 'text-gray-400';
  const inputCls = `w-full px-3 py-2 rounded-lg text-sm outline-none ${dark ? 'bg-white/5 border border-white/10 text-white focus:border-te-teal' : 'bg-gray-50 border border-gray-200 text-gray-900 focus:border-te-teal'}`;

  // ── Course Detail View ─────────────────────────────────────────────

  if (activeCourse && activeLesson) {
    const pct = getCourseCompletionPct(activeCourse);
    const isComplete = isLessonComplete(activeCourse.id, activeLesson.id);

    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Back */}
        <button onClick={() => { setActiveCourseId(null); setActiveLessonIdx(0); }} className={`flex items-center gap-1.5 text-xs mb-6 ${textSecondary} hover:text-te-teal transition-colors`}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          Back to Training
        </button>

        {/* Course header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{activeCourse.icon}</span>
            <h2 className={`text-xl font-bold ${textPrimary}`}>{activeCourse.title}</h2>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <ProgressBar pct={pct} />
            <span className={`text-xs font-medium tabular-nums ${textMuted}`}>{pct}%</span>
          </div>
        </div>

        {/* Lesson tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {activeCourse.lessons.map((lesson, i) => {
            const done = isLessonComplete(activeCourse.id, lesson.id);
            return (
              <button key={lesson.id} onClick={() => setActiveLessonIdx(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap shrink-0 transition-all ${activeLessonIdx === i ? `font-medium ${dark ? 'bg-te-teal/20 text-white' : 'bg-te-teal/10 text-gray-900'}` : `${textMuted} ${dark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}`}>
                {done && <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" d="M5 13l4 4L19 7" /></svg>}
                {lesson.type === 'quiz' ? '📝' : lesson.type === 'video' ? '🎥' : '📄'} {lesson.title}
              </button>
            );
          })}
        </div>

        {/* Lesson content */}
        <div className={`rounded-xl p-6 border ${bg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${textPrimary}`}>{activeLesson.title}</h3>
            {activeLesson.duration && <span className={`text-xs ${textMuted}`}>{activeLesson.duration} min</span>}
          </div>

          {activeLesson.type === 'quiz' && activeLesson.questions ? (
            <QuizView questions={activeLesson.questions} dark={dark} onComplete={(score, answers) => {
              markLessonComplete(activeCourse.id, activeLesson.id, score);
            }} />
          ) : activeLesson.type === 'video' && activeLesson.videoUrl ? (
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe src={activeLesson.videoUrl} className="w-full h-full" allowFullScreen />
            </div>
          ) : activeLesson.content ? (
            <div>
              {(() => {
                // Import the PM renderer from Portal
                try {
                  const doc = JSON.parse(activeLesson.content);
                  // Simple inline renderer for training content
                  function renderNode(node: any, key: number): any {
                    if (!node) return null;
                    if (node.type === 'text') {
                      let el: any = node.text || '';
                      (node.marks || []).forEach((m: any) => {
                        if (m.type === 'bold') el = <strong className={textPrimary}>{el}</strong>;
                        if (m.type === 'italic') el = <em>{el}</em>;
                      });
                      return el;
                    }
                    const ch = (node.content || []).map((c: any, i: number) => renderNode(c, i));
                    switch (node.type) {
                      case 'doc': return <>{ch}</>;
                      case 'paragraph': return <p key={key} className="mb-3">{ch}</p>;
                      case 'heading': return <div key={key} className={`${node.attrs?.level === 1 ? 'text-xl font-bold mt-6 mb-3' : node.attrs?.level === 2 ? 'text-lg font-bold mt-5 mb-2' : 'text-base font-semibold mt-4 mb-2'} ${textPrimary}`}>{ch}</div>;
                      case 'bullet_list': return <ul key={key} className="mb-4 space-y-1.5 ml-1">{ch}</ul>;
                      case 'ordered_list': return <ol key={key} className="mb-4 space-y-1.5 ml-5 list-decimal">{ch}</ol>;
                      case 'list_item': return <li key={key} className="flex items-start gap-2"><span className="text-te-teal mt-1.5 text-[8px]">●</span><span className="flex-1">{(node.content || []).map((c: any, i: number) => c.type === 'paragraph' ? <span key={i}>{(c.content || []).map((cc: any, j: number) => renderNode(cc, j))}</span> : renderNode(c, i))}</span></li>;
                      default: return ch.length > 0 ? <div key={key}>{ch}</div> : null;
                    }
                  }
                  return <div className={`text-sm leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{renderNode(doc, 0)}</div>;
                } catch { return <p className={textSecondary}>{activeLesson.content}</p>; }
              })()}

              {!isComplete && (
                <button onClick={() => markLessonComplete(activeCourse.id, activeLesson.id)}
                  className="mt-6 w-full py-2.5 rounded-lg text-sm font-medium text-white bg-te-teal hover:bg-te-teal-light transition-colors">
                  Mark as Complete ✓
                </button>
              )}
              {isComplete && (
                <div className={`mt-6 py-2.5 rounded-lg text-sm font-medium text-center ${dark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                  ✓ Completed
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Next/Prev */}
        <div className="flex justify-between mt-6">
          <button disabled={activeLessonIdx === 0} onClick={() => setActiveLessonIdx(i => i - 1)}
            className={`px-4 py-2 rounded-lg text-xs font-medium disabled:opacity-20 ${textSecondary} ${dark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>← Previous</button>
          <button disabled={activeLessonIdx >= activeCourse.lessons.length - 1} onClick={() => setActiveLessonIdx(i => i + 1)}
            className={`px-4 py-2 rounded-lg text-xs font-medium disabled:opacity-20 ${textSecondary} ${dark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>Next →</button>
        </div>
      </div>
    );
  }

  // ── Course List View ───────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          [String(totalCourses), 'Courses', 'text-te-teal'],
          [String(completedCourses), 'Completed', 'text-emerald-400'],
          [String(totalLessons), 'Total Lessons', 'text-blue-400'],
          [`${totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0}%`, 'Overall Progress', 'text-te-teal'],
        ].map(([val, label, color]) => (
          <div key={label} className={`rounded-xl p-4 border ${bg} text-center`}>
            <p className={`text-2xl font-bold ${color}`}>{val}</p>
            <p className={`text-[10px] uppercase tracking-wider ${textMuted}`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Admin controls */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${textPrimary}`}>Training Courses</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setAdminMode(!adminMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${adminMode ? 'bg-yellow-500/20 text-yellow-400' : `${dark ? 'text-gray-500 hover:bg-white/5' : 'text-gray-400 hover:bg-gray-100'}`}`}>
            {adminMode ? 'Done' : 'Manage'}
          </button>
          {adminMode && <button onClick={() => setShowCreateCourse(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-te-teal hover:bg-te-teal-light">+ New Course</button>}
        </div>
      </div>

      {/* Create course form */}
      {showCreateCourse && (
        <div className={`rounded-xl p-4 mb-6 border ${bg}`}>
          <h3 className={`text-sm font-semibold mb-3 ${textPrimary}`}>Create New Course</h3>
          <div className="grid sm:grid-cols-3 gap-3 mb-3">
            <input value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} placeholder="Course title" className={inputCls} />
            <input value={newCourseDesc} onChange={e => setNewCourseDesc(e.target.value)} placeholder="Description" className={inputCls} />
            <input value={newCourseCat} onChange={e => setNewCourseCat(e.target.value)} placeholder="Category" className={inputCls} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => {
              if (!newCourseTitle.trim()) return;
              saveCourses([...customCourses, {
                id: `custom-${Date.now()}`, title: newCourseTitle, description: newCourseDesc, category: newCourseCat || 'Custom',
                difficulty: 'beginner', icon: '📘', lessons: [{ id: `lesson-${Date.now()}`, title: 'Introduction', type: 'content', content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Start writing your course content here..."}]}]}' }],
              }]);
              setShowCreateCourse(false); setNewCourseTitle(''); setNewCourseDesc(''); setNewCourseCat('');
            }} className="px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-te-teal hover:bg-te-teal-light">Create</button>
            <button onClick={() => setShowCreateCourse(false)} className={`px-4 py-1.5 rounded-lg text-xs ${textMuted}`}>Cancel</button>
          </div>
        </div>
      )}

      {/* Course cards by category */}
      {categories.map(cat => {
        const catCourses = allCourses.filter(c => c.category === cat);
        return (
          <div key={cat} className="mb-8">
            <h3 className={`text-xs uppercase tracking-[0.2em] font-bold mb-3 ${textMuted}`}>{cat}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {catCourses.map(course => {
                const pct = getCourseCompletionPct(course);
                const isCustom = customCourses.some(c => c.id === course.id);
                return (
                  <div key={course.id} onClick={() => { setActiveCourseId(course.id); setActiveLessonIdx(0); }}
                    className={`rounded-xl p-5 border cursor-pointer transition-all group ${bg} hover:border-te-teal/30`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{course.icon}</span>
                        <div>
                          <h4 className={`text-sm font-bold group-hover:text-te-teal transition-colors ${textPrimary}`}>{course.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${course.difficulty === 'beginner' ? 'bg-green-500/10 text-green-400' : course.difficulty === 'intermediate' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>{course.difficulty}</span>
                            <span className={`text-[10px] ${textMuted}`}>{course.lessons.length} lessons</span>
                          </div>
                        </div>
                      </div>
                      {adminMode && isCustom && (
                        <button onClick={e => { e.stopPropagation(); saveCourses(customCourses.filter(c => c.id !== course.id)); }}
                          className="text-red-400 hover:text-red-300 p-1" title="Delete">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>
                    <p className={`text-xs mb-3 line-clamp-2 ${textSecondary}`}>{course.description}</p>
                    <div className="flex items-center gap-2">
                      <ProgressBar pct={pct} size="sm" color={pct === 100 ? 'bg-emerald-400' : 'bg-te-teal'} />
                      <span className={`text-[10px] font-medium tabular-nums ${pct === 100 ? 'text-emerald-400' : textMuted}`}>{pct}%</span>
                    </div>
                    {course.requiredFor && (
                      <div className="mt-2 flex items-center gap-1">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${dark ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-red-50 text-red-600 border border-red-200'}`}>Required</span>
                        {course.dueInDays && <span className={`text-[9px] ${textMuted}`}>Due in {course.dueInDays} days</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
