import React from 'react';
import { Calendar, BookOpen, StickyNote, Calculator, Award } from 'lucide-react';

export default function MobileNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'schedule', label: 'Dersler', icon: Calendar },
    { id: 'assignments', label: 'Ödevler', icon: BookOpen },
    { id: 'notes', label: 'Notlar', icon: StickyNote },
    { id: 'gpa', label: 'Ortalama', icon: Calculator },
    { id: 'exams', label: 'Sınavlar', icon: Award }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="nav-icon-wrapper">
              <Icon size={20} />
            </div>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
