import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import ScheduleView from './components/ScheduleView';
import AssignmentsView from './components/AssignmentsView';
import NotesView from './components/NotesView';
import GpaCalculatorView from './components/GpaCalculatorView';
import ExamsView from './components/ExamsView';
import BackupModal from './components/BackupModal';
import AuthModal from './components/AuthModal';

import { loadAppData, saveAppData } from './utils/storage';
import { checkUpcomingDeadlines } from './utils/notificationUtils';
import { supabase, isSupabaseConfigured } from './utils/supabaseClient';
import './App.css';

export default function App() {
  const [data, setData] = useState(() => loadAppData());
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule', 'assignments', 'notes', 'gpa', 'exams'
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Sync theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', data.theme || 'dark');
  }, [data.theme]);

  // Persist state to localStorage on changes
  useEffect(() => {
    saveAppData(data);
  }, [data]);

  // Listen to Supabase Auth state if configured
  useEffect(() => {
    if (supabase && isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setCurrentUser(session?.user ?? null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setCurrentUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Check upcoming assignments for notification triggers periodically
  useEffect(() => {
    checkUpcomingDeadlines(data.assignments);
    const interval = setInterval(() => {
      checkUpcomingDeadlines(data.assignments);
    }, 60 * 60 * 1000); // Every hour
    return () => clearInterval(interval);
  }, [data.assignments]);

  const toggleTheme = () => {
    const nextTheme = data.theme === 'dark' ? 'light' : 'dark';
    setData((prev) => ({ ...prev, theme: nextTheme }));
  };

  const handleDataReloaded = (newData) => {
    setData(newData);
  };

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={data.theme}
        toggleTheme={toggleTheme}
        courses={data.courses}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        user={currentUser}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'schedule' && (
          <ScheduleView
            courses={data.courses}
            setCourses={(newCourses) => setData((prev) => ({ ...prev, courses: typeof newCourses === 'function' ? newCourses(prev.courses) : newCourses }))}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsView
            assignments={data.assignments}
            setAssignments={(newAssignments) => setData((prev) => ({ ...prev, assignments: typeof newAssignments === 'function' ? newAssignments(prev.assignments) : newAssignments }))}
            courses={data.courses}
          />
        )}

        {activeTab === 'notes' && (
          <NotesView
            notes={data.notes}
            setNotes={(newNotes) => setData((prev) => ({ ...prev, notes: typeof newNotes === 'function' ? newNotes(prev.notes) : newNotes }))}
            scratchpad={data.scratchpad}
            setScratchpad={(newScratchpad) => setData((prev) => ({ ...prev, scratchpad: newScratchpad }))}
          />
        )}

        {activeTab === 'gpa' && (
          <GpaCalculatorView
            grades={data.grades}
            setGrades={(newGrades) => setData((prev) => ({ ...prev, grades: typeof newGrades === 'function' ? newGrades(prev.grades) : newGrades }))}
            courses={data.courses}
          />
        )}

        {activeTab === 'exams' && (
          <ExamsView
            exams={data.exams}
            setExams={(newExams) => setData((prev) => ({ ...prev, exams: typeof newExams === 'function' ? newExams(prev.exams) : newExams }))}
            courses={data.courses}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Multi-Device Backup & Sync Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        appData={data}
        onDataReloaded={handleDataReloaded}
      />

      {/* Supabase Auth / Cloud Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={currentUser}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />
    </div>
  );
}
