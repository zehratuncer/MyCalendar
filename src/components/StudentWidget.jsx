import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ListTodo
} from 'lucide-react';
import {
  getWidgetScheduleInfo,
  getWidgetAssignmentsInfo,
  formatTurkishShortDate,
  DAYS_TR
} from '../utils/dateUtils';

export default function StudentWidget({
  courses = [],
  assignments = [],
  onNavigateTab,
  isStandalone = false
}) {
  const [activeWidgetTab, setActiveWidgetTab] = useState('schedule'); // 'schedule' | 'assignments'

  const scheduleInfo = getWidgetScheduleInfo(courses);
  const assignmentsInfo = getWidgetAssignmentsInfo(assignments);

  const { activeCourse, nextCourse, todayCourses, currentDay } = scheduleInfo;
  const { todayAssignments, upcomingAssignments, pendingTotal } = assignmentsInfo;

  return (
    <div className={`student-widget-card ${isStandalone ? 'standalone-widget-mode' : ''}`}>
      {/* Widget Header & Switcher Tabs */}
      <div className="student-widget-header">
        <div className="student-widget-title-row">
          <div className="student-widget-badge">
            <Sparkles size={13} />
            <span>Öğrenci Asistanı Widget</span>
          </div>
          <span className="student-widget-date-pill">{currentDay}</span>
        </div>

        {/* 2 Primary Mode Buttons */}
        <div className="student-widget-buttons">
          <button
            type="button"
            onClick={() => setActiveWidgetTab('schedule')}
            className={`widget-tab-button ${activeWidgetTab === 'schedule' ? 'active' : ''}`}
          >
            <Calendar size={15} />
            <span>Bugünkü Dersler</span>
            {todayCourses.length > 0 && (
              <span className="widget-counter-pill">{todayCourses.length}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveWidgetTab('assignments')}
            className={`widget-tab-button ${activeWidgetTab === 'assignments' ? 'active' : ''}`}
          >
            <BookOpen size={15} />
            <span>Ödevler & Teslimler</span>
            {pendingTotal > 0 && (
              <span className="widget-counter-pill warning">{pendingTotal}</span>
            )}
          </button>
        </div>
      </div>

      {/* Widget Body Content */}
      <div className="student-widget-body">
        {/* ============================================================
            TAB 1: BUGÜNKÜ DERSLER (ŞUAN HANGİ DERSTEYİM, SIRADAKİ DERS NE)
            ============================================================ */}
        {activeWidgetTab === 'schedule' && (
          <div className="widget-content-section animate-fade">
            {/* Live Active Course Banner */}
            {activeCourse ? (
              <div
                className="widget-live-course-banner"
                onClick={() => onNavigateTab && onNavigateTab('schedule')}
                title="Ders programını açmak için tıklayın"
              >
                <div className="widget-live-badge-row">
                  <span className="widget-live-dot" />
                  <span className="widget-live-label">ŞU AN DERSTESİNİZ</span>
                  <span className="widget-time-range">
                    {activeCourse.startTime} - {activeCourse.endTime}
                  </span>
                </div>
                <h4 className="widget-course-title">{activeCourse.name}</h4>
                <div className="widget-course-meta">
                  {activeCourse.room && (
                    <span className="widget-meta-item">
                      <MapPin size={13} /> {activeCourse.room}
                    </span>
                  )}
                  {activeCourse.instructor && (
                    <span className="widget-meta-item">
                      👨‍🏫 {activeCourse.instructor}
                    </span>
                  )}
                </div>
              </div>
            ) : nextCourse ? (
              <div
                className="widget-next-course-banner"
                onClick={() => onNavigateTab && onNavigateTab('schedule')}
                title="Ders programını açmak için tıklayın"
              >
                <div className="widget-next-badge-row">
                  <Clock size={13} color="var(--primary)" />
                  <span className="widget-next-label">SIRADAKİ DERS</span>
                  <span className="widget-time-range font-bold">{nextCourse.startTime}</span>
                </div>
                <h4 className="widget-course-title">{nextCourse.name}</h4>
                <div className="widget-course-meta">
                  {nextCourse.room && (
                    <span className="widget-meta-item">
                      <MapPin size={13} /> {nextCourse.room}
                    </span>
                  )}
                  <span className="widget-meta-item">
                    ⏱️ Bitiş: {nextCourse.endTime}
                  </span>
                </div>
              </div>
            ) : (
              <div className="widget-empty-state">
                <p className="widget-empty-text">
                  {todayCourses.length > 0
                    ? '🎉 Bugünkü tüm dersleriniz tamamlandı!'
                    : '☕ Bugün programınızda kayıtlı ders bulunmuyor.'}
                </p>
              </div>
            )}

            {/* List of today's remaining or all courses */}
            {todayCourses.length > 0 && (
              <div className="widget-courses-mini-list">
                <div className="widget-mini-list-header">
                  <span>Bugünün Tüm Programı ({todayCourses.length} Ders)</span>
                </div>
                <div className="widget-courses-scroll-row">
                  {todayCourses.map((c) => {
                    const isCurrent = activeCourse?.id === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => onNavigateTab && onNavigateTab('schedule')}
                        className={`widget-mini-course-item ${isCurrent ? 'active' : ''}`}
                      >
                        <span className="widget-mini-time">{c.startTime}</span>
                        <span className="widget-mini-name">{c.name}</span>
                        {c.room && <span className="widget-mini-room">{c.room}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Footer Button -> Opens Schedule Page */}
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('schedule')}
              className="widget-action-footer-btn"
            >
              <span>Ders Programı Sayfasını Aç</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* ============================================================
            TAB 2: ÖDEVLER (BUGÜN ÖDEV VAR MI, GELECEKTEKİ ÖDEVLER HANGİ GÜN/SAAT)
            ============================================================ */}
        {activeWidgetTab === 'assignments' && (
          <div className="widget-content-section animate-fade">
            {/* Today's Due Assignments */}
            <div className="widget-assignment-group">
              <div className="widget-group-label">
                <AlertCircle size={14} color="#f97316" />
                <span>Bugün Teslim Edilecekler ({todayAssignments.length})</span>
              </div>

              {todayAssignments.length === 0 ? (
                <div className="widget-today-clean-box">
                  <CheckCircle2 size={16} color="var(--accent-emerald)" />
                  <span>Bugün teslim edilecek acil ödeviniz yok.</span>
                </div>
              ) : (
                <div className="widget-assign-items-list">
                  {todayAssignments.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => onNavigateTab && onNavigateTab('assignments')}
                      className="widget-assign-card today"
                    >
                      <div className="widget-assign-card-left">
                        <span className="widget-assign-course-tag">{a.courseName || 'Ders'}</span>
                        <h5 className="widget-assign-name">{a.title}</h5>
                      </div>
                      <div className="widget-assign-card-right">
                        <span className="widget-due-badge urgent">
                          <Clock size={11} /> {a.dueTime || '23:59'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming / Future Assignments */}
            <div className="widget-assignment-group" style={{ marginTop: '12px' }}>
              <div className="widget-group-label">
                <ListTodo size={14} color="var(--primary)" />
                <span>Gelecekteki Ödevler & Görevler ({upcomingAssignments.length})</span>
              </div>

              {upcomingAssignments.length === 0 ? (
                <div className="widget-today-clean-box">
                  <span>Yaklaşan başka ödeviniz bulunmuyor.</span>
                </div>
              ) : (
                <div className="widget-assign-items-list">
                  {upcomingAssignments.slice(0, 3).map((a) => (
                    <div
                      key={a.id}
                      onClick={() => onNavigateTab && onNavigateTab('assignments')}
                      className="widget-assign-card upcoming"
                    >
                      <div className="widget-assign-card-left">
                        <span className="widget-assign-course-tag">{a.courseName || 'Ders'}</span>
                        <h5 className="widget-assign-name">{a.title}</h5>
                      </div>
                      <div className="widget-assign-card-right">
                        <span className="widget-due-badge">
                          📅 {formatTurkishShortDate(a.dueDate)} • {a.dueTime || '23:59'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {upcomingAssignments.length > 3 && (
                    <div className="widget-more-notice">
                      +{upcomingAssignments.length - 3} ödev daha var...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Footer Button -> Opens Assignments Page */}
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('assignments')}
              className="widget-action-footer-btn"
            >
              <span>Ödevler Sayfasını Aç</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
