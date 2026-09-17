import React from 'react';
import { Calendar, Sun, Moon, Bell, Download, Upload, Sparkles, BookOpen, Cloud, User } from 'lucide-react';
import { formatTurkishDate, getTodayScheduleStatus } from '../utils/dateUtils';
import { requestNotificationPermission } from '../utils/notificationUtils';

export default function Navbar({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  courses,
  onOpenBackupModal,
  onOpenAuthModal,
  user
}) {
  const scheduleStatus = getTodayScheduleStatus(courses);

  const handleNotificationClick = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      alert('🔔 Bildirimler başarıyla etkinleştirildi! Yaklaşan ödev ve sınavlar için hatırlatma alacaksınız.');
    }
  };

  const navItems = [
    { id: 'schedule', label: 'Ders Programı', icon: Calendar },
    { id: 'assignments', label: 'Ödevler & Görevler', icon: BookOpen },
    { id: 'notes', label: 'Hızlı Notlar', icon: Sparkles },
    { id: 'gpa', label: 'Not Hesapla (GPA)', icon: Sparkles },
    { id: 'exams', label: 'Sınav Takvimi', icon: Calendar }
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

        {/* Desktop Tabs */}
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

        {/* Actions (Cloud Auth, Backup, Notifications, Theme toggle) */}
        <div className="header-actions">
          {/* Supabase Cloud Sync / User Button */}
          <button
            onClick={onOpenAuthModal}
            className="btn-icon"
            style={{
              borderColor: user ? 'var(--accent-emerald)' : 'var(--border-subtle)',
              color: user ? 'var(--accent-emerald)' : 'var(--text-secondary)'
            }}
            title={user ? `Giriş Yapıldı (${user.email}) - Bulut Aktif` : "Bulut Girişi / Senkronizasyon (Supabase)"}
            aria-label="Bulut Hesabı"
          >
            {user ? <User size={18} /> : <Cloud size={18} />}
          </button>

          <button
            onClick={handleNotificationClick}
            className="btn-icon"
            title="Bildirimleri Aç / Ayarla"
            aria-label="Bildirimler"
          >
            <Bell size={18} />
          </button>

          <button
            onClick={onOpenBackupModal}
            className="btn-icon"
            title="Cihazlar Arası Eşitleme & Yedekleme (Laptop / Telefon / Tablet)"
            aria-label="Yedekleme ve Cihaz Eşitleme"
          >
            <Upload size={18} />
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
