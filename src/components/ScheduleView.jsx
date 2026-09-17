import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  User,
  LayoutGrid,
  List,
  BookOpen,
  CheckCircle2,
  Check,
  Edit2,
  AlertCircle,
  Flame,
  Zap,
  Leaf
} from 'lucide-react';
import { DAYS_TR, getCurrentDayName, getDueDateStatus } from '../utils/dateUtils';
import CourseModal from './CourseModal';
import AssignmentModal from './AssignmentModal';

// Time slots from 08:00 to 20:00
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export const ScheduleView = ({
  courses = [],
  setCourses,
  assignments = [],
  setAssignments
}) => {
  const currentDay = getCurrentDayName();
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'daily'

  // Selected Course for showing its assignments and details below
  const [selectedCourseId, setSelectedCourseId] = useState(() => {
    const todayFirst = courses.find((c) => c.day === currentDay);
    return todayFirst ? todayFirst.id : courses[0]?.id || null;
  });

  // Course Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Assignment Modal State
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Active selected course object
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0] || null;

  // Assignments belonging to the selected course
  const selectedCourseAssignments = selectedCourse
    ? assignments.filter(
        (a) =>
          a.courseId === selectedCourse.id ||
          (a.courseName && a.courseName.toLowerCase() === selectedCourse.name.toLowerCase())
      )
    : [];

  // Course Handlers
  const handleSaveCourse = (courseData) => {
    if (editingCourse) {
      setCourses(courses.map((c) => (c.id === courseData.id ? courseData : c)));
    } else {
      setCourses([...courses, courseData]);
    }
    setSelectedCourseId(courseData.id);
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(courses.filter((c) => c.id !== courseId));
    if (selectedCourseId === courseId) {
      const remaining = courses.filter((c) => c.id !== courseId);
      setSelectedCourseId(remaining[0]?.id || null);
    }
  };

  // Assignment Handlers
  const handleSaveAssignment = (assignmentData) => {
    if (editingAssignment) {
      setAssignments(
        assignments.map((a) => (a.id === assignmentData.id ? assignmentData : a))
      );
    } else {
      setAssignments([assignmentData, ...assignments]);
    }
  };

  const handleDeleteAssignment = (assignmentId) => {
    setAssignments(assignments.filter((a) => a.id !== assignmentId));
  };

  const handleToggleAssignment = (assignmentId, e) => {
    e.stopPropagation();
    setAssignments(
      assignments.map((a) =>
        a.id === assignmentId ? { ...a, completed: !a.completed } : a
      )
    );
  };

  const openAddCourseModal = () => {
    setEditingCourse(null);
    setIsCourseModalOpen(true);
  };

  const handleCourseClick = (course) => {
    setSelectedCourseId(course.id);
    setEditingCourse(course);
    setIsCourseModalOpen(true);
  };

  const openAddAssignmentForCourse = (course) => {
    setIsCourseModalOpen(false);
    setEditingAssignment({
      id: '',
      title: '',
      courseId: course.id,
      courseName: course.name,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueTime: '23:59',
      priority: 'medium',
      completed: false,
      description: '',
      tags: ['Ödev']
    });
    setIsAssignmentModalOpen(true);
  };

  const openEditAssignmentModal = (assignment) => {
    setIsCourseModalOpen(false);
    setEditingAssignment(assignment);
    setIsAssignmentModalOpen(true);
  };

  const filteredDayCourses = courses
    .filter((c) => c.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="badge badge-danger" style={{ fontSize: '0.72rem' }}>
            <Flame size={12} /> Yüksek
          </span>
        );
      case 'low':
        return (
          <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
            <Leaf size={12} /> Düşük
          </span>
        );
      case 'medium':
      default:
        return (
          <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
            <Zap size={12} /> Orta
          </span>
        );
    }
  };

  return (
    <div>
      {/* View Header */}
      <div className="view-header">
        <div className="view-title-group">
          <h1>
            <Calendar className="text-primary" size={28} />
            Ders Programı
          </h1>
          <p className="view-subtitle">
            Haftalık ve günlük derslerinizi takip edin; derse tıklayarak ilgili ödev ve görevleri anında görüntüleyin.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Grid / Daily Switch */}
          <div className="glass-panel" style={{ display: 'flex', padding: '4px', gap: '4px' }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`nav-tab-btn ${viewMode === 'grid' ? 'active' : ''}`}
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
              title="Haftalık Tablo Görünümü"
            >
              <LayoutGrid size={16} />
              <span>Haftalık Tablo</span>
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`nav-tab-btn ${viewMode === 'daily' ? 'active' : ''}`}
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
              title="Günlük Akış Görünümü"
            >
              <List size={16} />
              <span>Günlük Akış</span>
            </button>
          </div>

          <button onClick={openAddCourseModal} className="btn-primary">
            <Plus size={18} />
            <span>Ders Ekle</span>
          </button>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="schedule-controls">
        <div className="day-pills-container">
          {DAYS_TR.map((day) => {
            const isSelected = selectedDay === day;
            const isToday = currentDay === day;
            const count = courses.filter((c) => c.day === day).length;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`day-pill ${isSelected ? 'active' : ''} ${isToday ? 'today-pill' : ''}`}
              >
                {day} {isToday && '• Bugün'} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: WEEKLY GRID VIEW */}
      {viewMode === 'grid' ? (
        <div className="weekly-grid-container">
          <table className="weekly-grid-table">
            <thead>
              <tr>
                <th className="time-col">Saat</th>
                {DAYS_TR.slice(0, 5).map((day) => (
                  <th key={day} className={day === currentDay ? 'today-col' : ''}>
                    <div>{day}</div>
                    {day === currentDay && <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>(Bugün)</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((timeSlot) => {
                const hour = parseInt(timeSlot.split(':')[0], 10);
                return (
                  <tr key={timeSlot}>
                    <td className="time-col">{timeSlot}</td>
                    {DAYS_TR.slice(0, 5).map((day) => {
                      const slotCourses = courses.filter((c) => {
                        if (c.day !== day) return false;
                        const startHour = parseInt(c.startTime.split(':')[0], 10);
                        return startHour === hour;
                      });

                      return (
                        <td key={day} className={day === currentDay ? 'today-col' : ''}>
                          {slotCourses.map((course) => {
                            const isSelected = selectedCourse?.id === course.id;
                            const courseAssigns = assignments.filter(
                              (a) =>
                                a.courseId === course.id ||
                                (a.courseName && a.courseName.toLowerCase() === course.name.toLowerCase())
                            );

                            return (
                              <div
                                key={course.id}
                                onClick={() => handleCourseClick(course)}
                                className={`course-card-compact ${isSelected ? 'selected-course-card' : ''}`}
                                style={{
                                  backgroundColor: course.color || '#6366f1',
                                  borderLeft: '4px solid rgba(255,255,255,0.8)'
                                }}
                              >
                                <div className="course-title">{course.name}</div>
                                <div className="course-meta">
                                  <Clock size={12} />
                                  <span>{course.startTime} - {course.endTime}</span>
                                </div>
                                {course.room && (
                                  <div className="course-meta" style={{ marginTop: '2px' }}>
                                    <MapPin size={12} />
                                    <span>{course.room}</span>
                                  </div>
                                )}
                                {courseAssigns.length > 0 && (
                                  <div className="course-assignment-count-pill">
                                    📝 {courseAssigns.length} Ödev
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* VIEW 2: DAILY TIMELINE VIEW */
        <div>
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {selectedDay} Günü Dersleri ({filteredDayCourses.length} Ders)
            </h3>
            {filteredDayCourses.length === 0 && (
              <button onClick={() => openAddCourseModal()} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
                <Plus size={14} />
                <span>Bu güne ders ekle</span>
              </button>
            )}
          </div>

          {filteredDayCourses.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <BookOpen size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Bu gün için planlanmış ders bulunmuyor</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '18px' }}>
                Dinlenebilir veya diğer derslerinizin ödevlerini tamamlayabilirsiniz!
              </p>
              <button onClick={() => openAddCourseModal()} className="btn-primary">
                <Plus size={16} />
                <span>Ders Ekle</span>
              </button>
            </div>
          ) : (
            <div className="daily-timeline-list">
              {filteredDayCourses.map((course) => {
                const isSelected = selectedCourse?.id === course.id;
                const courseAssigns = assignments.filter(
                  (a) =>
                    a.courseId === course.id ||
                    (a.courseName && a.courseName.toLowerCase() === course.name.toLowerCase())
                );

                return (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course)}
                    className={`timeline-item-card ${isSelected ? 'selected-course-card' : ''}`}
                    style={{ borderLeftColor: course.color || '#6366f1', cursor: 'pointer' }}
                  >
                    <div className="timeline-time-box">
                      <span>{course.startTime}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{course.endTime}</span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{course.name}</h4>
                        {course.code && <span className="badge badge-info">{course.code}</span>}
                        {course.credits && <span className="badge badge-warning">{course.credits} AKTS</span>}
                        {courseAssigns.length > 0 && (
                          <span className="badge badge-success" style={{ marginLeft: 'auto' }}>
                            📝 {courseAssigns.length} Ödev
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                        {course.room && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={14} color="var(--primary)" />
                            <span>{course.room}</span>
                          </div>
                        )}
                        {course.instructor && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={14} color="var(--accent-emerald)" />
                            <span>{course.instructor}</span>
                          </div>
                        )}
                      </div>

                      {course.notes && (
                        <div style={{ marginTop: '10px', fontSize: '0.85rem', background: 'var(--bg-subtle)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>
                          💬 {course.notes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SELECTED COURSE & ASSIGNMENTS PANEL (TAKILAN DERSİN ÖDEVLERİ VE DETAYLARI)*/}
      {/* ========================================================================= */}
      {selectedCourse && (
        <div className="course-detail-panel glass-panel" style={{ marginTop: '28px', padding: '24px' }}>
          {/* Panel Header */}
          <div className="course-detail-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: selectedCourse.color || '#6366f1',
                  boxShadow: `0 0 10px ${selectedCourse.color || '#6366f1'}`
                }}
              />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {selectedCourse.name}
              </h2>
              {selectedCourse.code && <span className="badge badge-info">{selectedCourse.code}</span>}
              {selectedCourse.credits && <span className="badge badge-warning">{selectedCourse.credits} AKTS</span>}
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => handleCourseClick(selectedCourse)}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
              >
                <Edit2 size={14} />
                <span>Dersi Düzenle</span>
              </button>

              <button
                type="button"
                onClick={() => openAddAssignmentForCourse(selectedCourse)}
                className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '6px 14px' }}
              >
                <Plus size={15} />
                <span>+ Bu Derse Ödev Ekle</span>
              </button>
            </div>
          </div>

          {/* Course Metadata Row */}
          <div className="course-info-meta-row">
            <div className="meta-info-item">
              <Clock size={15} color="var(--primary)" />
              <span><strong>{selectedCourse.day}</strong> • {selectedCourse.startTime} - {selectedCourse.endTime}</span>
            </div>
            {selectedCourse.room && (
              <div className="meta-info-item">
                <MapPin size={15} color="#f59e0b" />
                <span>{selectedCourse.room}</span>
              </div>
            )}
            {selectedCourse.instructor && (
              <div className="meta-info-item">
                <User size={15} color="#10b981" />
                <span>{selectedCourse.instructor}</span>
              </div>
            )}
          </div>

          {/* Assignments Sub-Section */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} color="var(--primary)" />
                <span>Bu Derse Ait Ödevler & Görevler</span>
                <span className="pill-count" style={{ background: 'var(--bg-subtle)' }}>
                  {selectedCourseAssignments.length}
                </span>
              </h3>
            </div>

            {selectedCourseAssignments.length === 0 ? (
              <div className="empty-course-assignments-box">
                <CheckCircle2 size={32} color="#10b981" style={{ opacity: 0.8 }} />
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Bu ders için bekleyen veya kayıtlı bir ödev yok.
                </p>
                <button
                  type="button"
                  onClick={() => openAddAssignmentForCourse(selectedCourse)}
                  className="btn-secondary"
                  style={{ fontSize: '0.82rem', marginTop: '6px' }}
                >
                  <Plus size={14} />
                  <span>Yeni Ödev Ekle</span>
                </button>
              </div>
            ) : (
              <div className="course-assignments-grid">
                {selectedCourseAssignments.map((assign) => {
                  const isCompleted = assign.completed;
                  const dueStatus = getDueDateStatus(assign.dueDate, assign.dueTime);

                  return (
                    <div
                      key={assign.id}
                      onClick={() => openEditAssignmentModal(assign)}
                      className={`course-assign-card ${isCompleted ? 'completed' : ''}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={(e) => handleToggleAssignment(assign.id, e)}
                          className={`custom-checkbox ${isCompleted ? 'checked' : ''}`}
                          style={{ marginTop: '2px' }}
                          title={isCompleted ? 'Tamamlanmadı olarak işaretle' : 'Tamamlandı olarak işaretle'}
                        >
                          {isCompleted && <Check size={14} />}
                        </button>

                        <div style={{ flex: 1 }}>
                          <h4
                            className="course-assign-title"
                            style={{
                              fontSize: '0.95rem',
                              fontWeight: 700,
                              textDecoration: isCompleted ? 'line-through' : 'none',
                              color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)'
                            }}
                          >
                            {assign.title}
                          </h4>

                          {assign.description && (
                            <p
                              style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-secondary)',
                                marginTop: '4px',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {assign.description}
                            </p>
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                            <span className={`badge ${dueStatus.badgeClass}`} style={{ fontSize: '0.72rem' }}>
                              <Clock size={11} />
                              <span>{dueStatus.label}</span>
                            </span>

                            {getPriorityBadge(assign.priority)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Course Modal */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSave={handleSaveCourse}
        onDelete={handleDeleteCourse}
        editingCourse={editingCourse}
        assignments={assignments}
        onOpenAssignmentModal={openEditAssignmentModal}
        onAddAssignmentForCourse={openAddAssignmentForCourse}
      />

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        onSave={handleSaveAssignment}
        onDelete={handleDeleteAssignment}
        editingAssignment={editingAssignment}
        courses={courses}
      />
    </div>
  );
};

export default ScheduleView;
