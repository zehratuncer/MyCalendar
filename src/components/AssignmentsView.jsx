import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, AlertTriangle, BookOpen, Filter, Search, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getDueDateStatus, formatTurkishShortDate } from '../utils/dateUtils';
import AssignmentModal from './AssignmentModal';

export const AssignmentsView = ({ assignments, setAssignments, courses }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'urgent', 'completed'
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const toggleComplete = (id) => {
    setAssignments(
      assignments.map((a) => {
        if (a.id === id) {
          const nextState = !a.completed;
          if (nextState) {
            // Trigger Confetti! 🎉
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.8 }
            });
          }
          return { ...a, completed: nextState };
        }
        return a;
      })
    );
  };

  const handleSave = (item) => {
    if (editingAssignment) {
      setAssignments(assignments.map((a) => (a.id === item.id ? item : a)));
    } else {
      setAssignments([item, ...assignments]);
    }
  };

  const handleDelete = (id) => {
    setAssignments(assignments.filter((a) => a.id !== id));
  };

  const filteredAssignments = assignments.filter((a) => {
    // Course filter
    if (selectedCourseId !== 'all' && a.courseId !== selectedCourseId) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title?.toLowerCase().includes(q);
      const matchDesc = a.description?.toLowerCase().includes(q);
      const matchCourse = a.courseName?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCourse) return false;
    }

    // Status filter
    const status = getDueDateStatus(a.dueDate, a.dueTime);
    if (filter === 'completed') return a.completed;
    if (filter === 'pending') return !a.completed;
    if (filter === 'urgent') return !a.completed && (status.status === 'urgent' || status.status === 'overdue');

    return true;
  });

  const pendingCount = assignments.filter((a) => !a.completed).length;
  const completedCount = assignments.filter((a) => a.completed).length;

  return (
    <div>
      {/* Header */}
      <div className="view-header">
        <div className="view-title-group">
          <h1>
            <BookOpen className="text-primary" size={28} />
            Ödevler & Görevler
          </h1>
          <p className="view-subtitle">
            Teslim tarihlerini kaçırmayın. Toplam {pendingCount} aktif, {completedCount} tamamlanmış görev bulunuyor.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingAssignment(null);
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus size={18} />
          <span>Yeni Ödev Ekle</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Status Pills */}
          <div className="filter-pills-bar">
            {[
              { id: 'all', label: `Tümü (${assignments.length})` },
              { id: 'pending', label: `Yapılacaklar (${pendingCount})` },
              { id: 'urgent', label: `🔥 Acil / Yaklaşanlar` },
              { id: 'completed', label: `Tamamlananlar (${completedCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`filter-pill ${filter === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Course filter dropdown */}
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '180px', padding: '6px 12px', fontSize: '0.85rem' }}
          >
            <option value="all">📚 Tüm Dersler</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Search input */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Ödev başlığı veya ders ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      {/* Assignment Cards Grid */}
      {filteredAssignments.length === 0 ? (
        <div className="glass-panel" style={{ padding: '50px', textAlign: 'center' }}>
          <CheckCircle2 size={48} style={{ color: 'var(--accent-emerald)', margin: '0 auto 12px auto' }} />
          <h4 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Harika! Görev bulunmuyor</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '18px' }}>
            Seçili filtrelere uygun ödev veya yapılacak iş bulunamadı.
          </p>
          <button
            onClick={() => {
              setEditingAssignment(null);
              setIsModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus size={16} />
            <span>Yeni Ödev Ekle</span>
          </button>
        </div>
      ) : (
        <div className="assignments-grid">
          {filteredAssignments.map((assignment) => {
            const dueStatus = getDueDateStatus(assignment.dueDate, assignment.dueTime);
            return (
              <div
                key={assignment.id}
                className={`assignment-card ${assignment.completed ? 'completed' : ''}`}
              >
                <div>
                  <div className="assignment-checkbox-wrapper">
                    <div
                      onClick={() => toggleComplete(assignment.id)}
                      className={`custom-checkbox ${assignment.completed ? 'checked' : ''}`}
                      title={assignment.completed ? 'Tamamlandı olarak işaretlendi' : 'Tamamla'}
                    >
                      {assignment.completed && <Check size={14} strokeWidth={3} />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        onClick={() => {
                          setEditingAssignment(assignment);
                          setIsModalOpen(true);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <h3 className="assignment-title">{assignment.title}</h3>
                        {assignment.courseName && (
                          <span className="assignment-course-tag">{assignment.courseName}</span>
                        )}
                      </div>

                      {assignment.description && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
                          {assignment.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Meta & Countdown Footer */}
                <div className="assignment-meta-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="var(--text-muted)" />
                    <span>{formatTurkishShortDate(assignment.dueDate)} • {assignment.dueTime || '23:59'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {assignment.priority === 'high' && (
                      <span className="badge badge-danger">🔥 Acil</span>
                    )}
                    {!assignment.completed && (
                      <span className={`badge ${dueStatus.badgeClass}`}>
                        {dueStatus.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        editingAssignment={editingAssignment}
        courses={courses}
      />
    </div>
  );
};

export default AssignmentsView;
