import React, { useState, useEffect } from 'react';
import { Calendar, Sun, Moon, Bell, BookOpen, StickyNote, Calculator, Award } from 'lucide-react';
import { formatTurkishDate, getTodayScheduleStatus } from '../utils/dateUtils';
import { requestNotificationPermission, getNotificationPermissionState } from '../utils/notificationUtils';

export default function Navbar({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  courses
}) {
  const [notificationStatus, setNotificationStatus] = useState('default');
  const scheduleStatus = getTodayScheduleStatus(courses);

  useEffect(() => {
    setNotificationStatus(getNotificationPermissionState());
  }, []);

  const handleNotificationClick = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationStatus('granted');
    }
  };

  const navItems = [
    { id: 'schedule', label: 'Ders Programı', icon: Calendar },
    { id: 'assignments', label: 'Ödevler & Görevler', icon: BookOpen },
    { id: 'notes', label: 'Yapılacaklar & Notlar', icon: StickyNote },
    { id: 'gpa', label: 'Not Hesapla (GPA)', icon: Calculator },
    { id: 'exams', label: 'Sınav Takvimi', icon: Award }
  ];

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <div className="brand-area">
          <div className="brand-logo">
            <Calendar size={24} />
          </div>
          <div>
            <div className="brand-title">MyCalendar</div>
            <div className="brand-subtitle">{formatTurkishDate()}</div>
          </div>
        </div>

        {/* Live Active Course Ticker (Tablet & Desktop) */}
        <div className="status-pill-area">
          <span className="pulse-dot" />
          <span>{scheduleStatus.message}</span>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Header Actions (Cleaned up: Notifications & Theme toggle) */}
        <div className="header-actions">
          <button
            onClick={handleNotificationClick}
            className="btn-icon"
            style={{
              position: 'relative',
              color: notificationStatus === 'granted' ? 'var(--accent-emerald)' : 'var(--text-secondary)'
            }}
            title={
              notificationStatus === 'granted'
                ? '🔔 Bildirimler Aktif (Test etmek veya durumu görmek için tıklayın)'
                : '🔔 Bildirimleri Etkinleştir (Yaklaşan ödev ve sınavlar için)'
            }
            aria-label="Bildirimler"
          >
            <Bell size={18} />
            {notificationStatus === 'granted' && (
              <span
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 6px #10b981'
                }}
              />
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="btn-icon"
            title={`Temayı Değiştir (${theme === 'dark' ? 'Aydınlık' : 'Karanlık'})`}
            aria-label="Tema Değiştir"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
