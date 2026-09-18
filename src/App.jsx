import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import ScheduleView from './components/ScheduleView';
import AssignmentsView from './components/AssignmentsView';
import NotesView from './components/NotesView';
import GpaCalculatorView from './components/GpaCalculatorView';
import ExamsView from './components/ExamsView';

import { loadAppData, saveAppData } from './utils/storage';
import { checkUpcomingDeadlines, checkUpcomingExams } from './utils/notificationUtils';
import './App.css';

export default function App() {
  const [data, setData] = useState(() => loadAppData());
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule', 'assignments', 'notes', 'gpa', 'exams'

  // Sync theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', data.theme || 'dark');
  }, [data.theme]);

  // Persist state to localStorage on changes
  useEffect(() => {
    saveAppData(data);
  }, [data]);

  // Check upcoming assignments and exams for browser notifications
  useEffect(() => {
    const runNotificationChecks = () => {
      checkUpcomingDeadlines(data.assignments);
      checkUpcomingExams(data.exams);
    };

    runNotificationChecks();
    const interval = setInterval(runNotificationChecks, 30 * 60 * 1000); // Check every 30 minutes
    return () => clearInterval(interval);
  }, [data.assignments, data.exams]);

  const toggleTheme = () => {
    const nextTheme = data.theme === 'dark' ? 'light' : 'dark';
    setData((prev) => ({ ...prev, theme: nextTheme }));
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
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'schedule' && (
          <ScheduleView
            courses={data.courses}
            setCourses={(newCourses) =>
              setData((prev) => ({
                ...prev,
                courses: typeof newCourses === 'function' ? newCourses(prev.courses) : newCourses
              }))
            }
            assignments={data.assignments}
            setAssignments={(newAssignments) =>
              setData((prev) => ({
                ...prev,
                assignments: typeof newAssignments === 'function' ? newAssignments(prev.assignments) : newAssignments
              }))
            }
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsView
            assignments={data.assignments}
            setAssignments={(newAssignments) =>
              setData((prev) => ({
                ...prev,
                assignments: typeof newAssignments === 'function' ? newAssignments(prev.assignments) : newAssignments
              }))
            }
            courses={data.courses}
          />
        )}

        {activeTab === 'notes' && (
          <NotesView
            notes={data.notes}
            setNotes={(newNotes) =>
              setData((prev) => ({
                ...prev,
                notes: typeof newNotes === 'function' ? newNotes(prev.notes) : newNotes
              }))
            }
            todos={data.todos}
            setTodos={(newTodos) =>
              setData((prev) => ({
                ...prev,
                todos: typeof newTodos === 'function' ? newTodos(prev.todos) : newTodos
              }))
            }
            scratchpad={data.scratchpad}
            setScratchpad={(newScratchpad) => setData((prev) => ({ ...prev, scratchpad: newScratchpad }))}
            courses={data.courses}
          />
        )}

        {activeTab === 'gpa' && (
          <GpaCalculatorView
            semesters={data.semesters}
            setSemesters={(newSemesters) =>
              setData((prev) => ({
                ...prev,
                semesters: typeof newSemesters === 'function' ? newSemesters(prev.semesters) : newSemesters
              }))
            }
            courses={data.courses}
          />
        )}

        {activeTab === 'exams' && (
          <ExamsView
            exams={data.exams}
            setExams={(newExams) =>
              setData((prev) => ({
                ...prev,
                exams: typeof newExams === 'function' ? newExams(prev.exams) : newExams
              }))
            }
            courses={data.courses}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
