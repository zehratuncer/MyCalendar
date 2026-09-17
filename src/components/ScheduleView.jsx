import React, { useState } from 'react';
import { Plus, Calendar, Clock, MapPin, User, LayoutGrid, List, BookOpen } from 'lucide-react';
import { DAYS_TR, getCurrentDayName, formatTurkishShortDate } from '../utils/dateUtils';
import CourseModal from './CourseModal';

// Time slots from 08:00 to 20:00
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export const ScheduleView = ({ courses, setCourses }) => {
  const [selectedDay, setSelectedDay] = useState(getCurrentDayName());
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'daily'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const currentDay = getCurrentDayName();

  const handleSaveCourse = (courseData) => {
    if (editingCourse) {
      setCourses(courses.map((c) => (c.id === courseData.id ? courseData : c)));
    } else {
      setCourses([...courses, courseData]);
    }
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(courses.filter((c) => c.id !== courseId));
  };

  const openAddModal = (defaultDay = selectedDay) => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const filteredDayCourses = courses
    .filter((c) => c.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

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
            Haftalık ve günlük derslerinizi saat saat takip edin, derslik ve hoca detaylarını görüntüleyin.
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

          <button onClick={() => openAddModal()} className="btn-primary">
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
                      // Find course starting in this slot or active
                      const slotCourses = courses.filter((c) => {
                        if (c.day !== day) return false;
                        const startHour = parseInt(c.startTime.split(':')[0], 10);
                        return startHour === hour;
                      });

                      return (
                        <td key={day} className={day === currentDay ? 'today-col' : ''}>
                          {slotCourses.map((course) => (
                            <div
                              key={course.id}
                              onClick={() => openEditModal(course)}
                              className="course-card-compact"
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
                            </div>
                          ))}
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
              <button onClick={() => openAddModal(selectedDay)} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
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
                Dinlenebilir veya eksik ödevlerinizi tamamlayabilirsiniz!
              </p>
              <button onClick={() => openAddModal(selectedDay)} className="btn-primary">
                <Plus size={16} />
                <span>Ders Ekle</span>
              </button>
            </div>
          ) : (
            <div className="daily-timeline-list">
              {filteredDayCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => openEditModal(course)}
                  className="timeline-item-card"
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
              ))}
            </div>
          )}
        </div>
      )}

      {/* Course Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCourse}
        onDelete={handleDeleteCourse}
        editingCourse={editingCourse}
      />
    </div>
  );
};

export default ScheduleView;
