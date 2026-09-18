import React, { useState, useEffect } from 'react';
import {
  Calendar,
  BookOpen,
  Clock,
  MapPin,
  User,
  ArrowRight,
  Flame,
  Zap,
  Leaf,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers
} from 'lucide-react';
import { getWidgetData, getDueDateStatus, formatTurkishShortDate } from '../utils/dateUtils';

export default function StudentWidget({ courses = [], assignments = [], onNavigate }) {
  const [activeWidgetTab, setActiveWidgetTab] = useState('courses'); // 'courses' | 'assignments'
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [widgetData, setWidgetData] = useState(() => getWidgetData(courses, assignments));

  // Auto-refresh widget status every 30 seconds for live accuracy
  useEffect(() => {
    const updateData = () => setWidgetData(getWidgetData(courses, assignments));
    updateData();
    const interval = setInterval(updateData, 30000);
    return () => clearInterval(interval);
  }, [courses, assignments]);

  const {
    currentDay,
    currentTime,
    todayCourses,
    activeCourse,
    nextCourse,
    todayAssignments,
    upcomingAssignments,
    pendingAssignments
  } = widgetData;

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="badge badge-danger" style={{ fontSize: '0.68rem', padding: '2px 6px' }}><Flame size={10} /> Acil</span>;
      case 'low':
        return <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '2px 6px' }}><Leaf size={10} /> Normal</span>;
      case 'medium':
      default:
        return <span className="badge badge-warning" style={{ fontSize: '0.68rem', padding: '2px 6px' }}><Zap size={10} /> Önemli</span>;
    }
  };

  return (
    <div className="student-widget-card glass-panel">
      {/* Widget Header & Switcher */}
      <div className="widget-header">
        <div className="widget-mode-buttons">
          {/* Button 1: DERS DURUMU & SIRADAKİ DERS */}
          <button
            type="button"
            onClick={() => setActiveWidgetTab('courses')}
            className={`widget-mode-btn ${activeWidgetTab === 'courses' ? 'active' : ''}`}
          >
            <div className="widget-btn-icon-box">
              <Calendar size={16} />
            </div>
            <div className="widget-btn-text-group">
              <span className="widget-btn-title">Ders Durumu</span>
              <span className="widget-btn-sub">
                {activeCourse ? '🔴 Şu an derste' : nextCourse ? `Sıradaki: ${nextCourse.startTime}` : `${todayCourses.length} Ders`}
              </span>
            </div>
            {activeCourse && <span className="widget-live-indicator" title="Canlı Ders" />}
          </button>

          {/* Button 2: ÖDEVLER & TESLİMLER */}
          <button
            type="button"
            onClick={() => setActiveWidgetTab('assignments')}
            className={`widget-mode-btn ${activeWidgetTab === 'assignments' ? 'active' : ''}`}
          >
            <div className="widget-btn-icon-box">
              <BookOpen size={16} />
            </div>
            <div className="widget-btn-text-group">
              <span className="widget-btn-title">Ödev & Görevler</span>
              <span className="widget-btn-sub">
                {todayAssignments.length > 0
                  ? `🔥 Bugün ${todayAssignments.length} Ödev`
                  : pendingAssignments.length > 0
                  ? `${pendingAssignments.length} Bekleyen`
                  : 'Ödev Yok'}
              </span>
            </div>
            {todayAssignments.length > 0 && (
              <span className="widget-badge-count">{todayAssignments.length}</span>
            )}
          </button>
        </div>

        {/* Collapse / Expand Toggle Button */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="widget-toggle-btn"
          title={isCollapsed ? 'Widgetı Genişlet' : 'Widgetı Daralt'}
          aria-label="Widget boyutu"
        >
          {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>

      {/* Widget Body Content */}
      {!isCollapsed && (
        <div className="widget-content-body">
          {/* ========================================================================= */}
          {/* TAB 1: DERSLER (Şu anki ders + Sıradaki ders)                              */}
          {/* ========================================================================= */}
          {activeWidgetTab === 'courses' && (
            <div className="widget-tab-pane">
              <div className="widget-grid-dual">
                {/* 1. ŞU ANKİ DERS KARTI */}
                <div
                  className={`widget-info-block ${activeCourse ? 'highlight-active' : ''}`}
                  onClick={() => onNavigate('schedule')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="widget-block-header">
                    <span className="widget-block-badge active-tag">
                      <span className="pulse-dot-mini" />
                      {activeCourse ? 'Şu Anki Dersiniz' : 'Şu Anki Durum'}
                    </span>
                    <span className="widget-time-pill">{currentTime}</span>
                  </div>

                  {activeCourse ? (
                    <div className="widget-course-details">
                      <h3 className="widget-course-title" style={{ color: activeCourse.color || 'var(--primary)' }}>
                        {activeCourse.name}
                      </h3>
                      <div className="widget-meta-row">
                        <span className="widget-meta-item">
                          <Clock size={13} />
                          <span>{activeCourse.startTime} - {activeCourse.endTime}</span>
                        </span>
                        {activeCourse.room && (
                          <span className="widget-meta-item">
                            <MapPin size={13} />
                            <span>{activeCourse.room}</span>
                          </span>
                        )}
                        {activeCourse.instructor && (
                          <span className="widget-meta-item">
                            <User size={13} />
                            <span>{activeCourse.instructor}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="widget-empty-block">
                      <p className="widget-empty-text">Şu an aktif bir derste değilsiniz.</p>
                      <span className="widget-sub-note">
                        {todayCourses.length > 0 ? 'Ders aranızın tadını çıkarın ☕' : `${currentDay} günü dersiniz yok 🌴`}
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. SIRADAKİ DERS KARTI */}
                <div
                  className="widget-info-block"
                  onClick={() => onNavigate('schedule')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="widget-block-header">
                    <span className="widget-block-badge next-tag">
                      <Clock size={12} />
                      Sıradaki Ders
                    </span>
                    {nextCourse && (
                      <span className="widget-highlight-time">Başlangıç: {nextCourse.startTime}</span>
                    )}
                  </div>

                  {nextCourse ? (
                    <div className="widget-course-details">
                      <h3 className="widget-course-title">
                        {nextCourse.name}
                      </h3>
                      <div className="widget-meta-row">
                        <span className="widget-meta-item">
                          <Clock size={13} />
                          <span>{nextCourse.startTime} - {nextCourse.endTime}</span>
                        </span>
                        {nextCourse.room && (
                          <span className="widget-meta-item">
                            <MapPin size={13} />
                            <span>{nextCourse.room}</span>
                          </span>
                        )}
                        {nextCourse.instructor && (
                          <span className="widget-meta-item">
                            <User size={13} />
                            <span>{nextCourse.instructor}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="widget-empty-block">
                      <p className="widget-empty-text">
                        {todayCourses.length > 0 ? 'Bugünkü tüm dersler tamamlandı 🎉' : 'Bugün planlı ders bulunmuyor ☕'}
                      </p>
                      <span className="widget-sub-note">Haftalık programa göz atabilirsiniz.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Footer Action */}
              <div className="widget-footer-action">
                <button
                  type="button"
                  onClick={() => onNavigate('schedule')}
                  className="widget-action-link"
                >
                  <span>Ders Programını ve Haftalık Tabloyu Aç</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ÖDEVLER (Bugünkü ödevler + Gelecekteki ödevler)                     */}
          {/* ========================================================================= */}
          {activeWidgetTab === 'assignments' && (
            <div className="widget-tab-pane">
              <div className="widget-grid-dual">
                {/* 1. BUGÜN TESLİM EDİLECEK ÖDEVLER */}
                <div
                  className={`widget-info-block ${todayAssignments.length > 0 ? 'highlight-urgent' : ''}`}
                  onClick={() => onNavigate('assignments')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="widget-block-header">
                    <span className="widget-block-badge urgent-tag">
                      <Flame size={12} />
                      Bugün Teslim Edilecekler ({todayAssignments.length})
                    </span>
                  </div>

                  {todayAssignments.length > 0 ? (
                    <div className="widget-assign-list">
                      {todayAssignments.slice(0, 2).map((assign) => (
                        <div key={assign.id} className="widget-assign-mini-item">
                          <div style={{ flex: 1 }}>
                            <div className="widget-assign-mini-title">{assign.title}</div>
                            <div className="widget-assign-mini-sub">
                              {assign.courseName && <span className="course-name-tag">{assign.courseName}</span>}
                              <span className="due-clock-text">
                                <Clock size={11} />
                                {assign.dueTime || '23:59'} teslim
                              </span>
                            </div>
                          </div>
                          {getPriorityBadge(assign.priority)}
                        </div>
                      ))}
                      {todayAssignments.length > 2 && (
                        <div className="widget-more-note">
                          +{todayAssignments.length - 2} ödev daha var...
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="widget-empty-block">
                      <CheckCircle2 size={24} color="var(--accent-emerald)" style={{ marginBottom: '4px' }} />
                      <p className="widget-empty-text">Bugün teslim edilecek bir ödeviniz yok!</p>
                      <span className="widget-sub-note">Gelecek ödevlerinize hazırlanabilirsiniz.</span>
                    </div>
                  )}
                </div>

                {/* 2. GELECEKTEKİ / YAKLAŞAN ÖDEVLER */}
                <div
                  className="widget-info-block"
                  onClick={() => onNavigate('assignments')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="widget-block-header">
                    <span className="widget-block-badge upcoming-tag">
                      <BookOpen size={12} />
                      Yaklaşan / Gelecek Ödevler ({upcomingAssignments.length})
                    </span>
                  </div>

                  {upcomingAssignments.length > 0 ? (
                    <div className="widget-assign-list">
                      {upcomingAssignments.slice(0, 2).map((assign) => {
                        const status = getDueDateStatus(assign.dueDate, assign.dueTime);
                        return (
                          <div key={assign.id} className="widget-assign-mini-item">
                            <div style={{ flex: 1 }}>
                              <div className="widget-assign-mini-title">{assign.title}</div>
                              <div className="widget-assign-mini-sub">
                                {assign.courseName && <span className="course-name-tag">{assign.courseName}</span>}
                                <span className="due-clock-text">
                                  {formatTurkishShortDate(assign.dueDate)} • {assign.dueTime || '23:59'}
                                </span>
                              </div>
                            </div>
                            <span className={`badge ${status.badgeClass}`} style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                              {status.label}
                            </span>
                          </div>
                        );
                      })}
                      {upcomingAssignments.length > 2 && (
                        <div className="widget-more-note">
                          +{upcomingAssignments.length - 2} yaklaşan ödev daha...
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="widget-empty-block">
                      <p className="widget-empty-text">Yaklaşan başka ödev bulunmuyor.</p>
                      <span className="widget-sub-note">Harika gidiyorsunuz! 🚀</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Footer Action */}
              <div className="widget-footer-action">
                <button
                  type="button"
                  onClick={() => onNavigate('assignments')}
                  className="widget-action-link"
                >
                  <span>Tüm Ödev & Görev Sayfasını Aç</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
