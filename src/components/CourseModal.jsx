import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, BookOpen, Plus, Clock, Flame, Zap, Leaf } from 'lucide-react';
import { DAYS_TR, getDueDateStatus, isAssignmentForCourse } from '../utils/dateUtils';

const COLOR_OPTIONS = [
  '#6366f1', // Indigo
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#ef4444', // Red
  '#14b8a6'  // Teal
];

export default function CourseModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingCourse,
  assignments = [],
  onOpenAssignmentModal,
  onAddAssignmentForCourse
}) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    instructor: '',
    room: '',
    day: 'Pazartesi',
    startTime: '09:00',
    endTime: '11:45',
    color: '#6366f1',
    credits: 3,
    notes: ''
  });

  useEffect(() => {
    if (editingCourse) {
      setFormData(editingCourse);
    } else {
      setFormData({
        name: '',
        code: '',
        instructor: '',
        room: '',
        day: 'Pazartesi',
        startTime: '09:00',
        endTime: '11:45',
        color: '#6366f1',
        credits: 3,
        notes: ''
      });
    }
  }, [editingCourse, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('Lütfen ders adını giriniz.');
    onSave({
      ...formData,
      id: editingCourse ? editingCourse.id : `course-${Date.now()}`
    });
    onClose();
  };

  // Filter assignments for this specific course using robust matching
  const courseAssignments = editingCourse
    ? assignments.filter((a) => isAssignmentForCourse(a, editingCourse))
    : [];

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="badge badge-danger" style={{ fontSize: '0.72rem' }}>
            <Flame size={11} /> Yüksek
          </span>
        );
      case 'low':
        return (
          <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
            <Leaf size={11} /> Düşük
          </span>
        );
      case 'medium':
      default:
        return (
          <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
            <Zap size={11} /> Orta
          </span>
        );
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content course-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="course-modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {editingCourse ? 'Dersi Düzenle' : 'Yeni Ders Ekle'}
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="course-modal-form">
          <div className="course-modal-grid">
            <div className="form-group grid-span-full">
              <label className="form-label">Ders Adı *</label>
              <input
                type="text"
                required
                placeholder="Örn: Veri Yapıları ve Algoritmalar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ders Kodu</label>
              <input
                type="text"
                placeholder="Örn: CENG201"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kredi / AKTS</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Öğretim Üyesi / Hoca</label>
              <input
                type="text"
                placeholder="Örn: Prof. Dr. Ahmet Yılmaz"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Derslik / Amfi</label>
              <input
                type="text"
                placeholder="Örn: Amfi 3 / D-204"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group grid-span-full">
              <label className="form-label">Ders Günü</label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="form-select"
              >
                {DAYS_TR.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Başlangıç Saati</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bitiş Saati</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Color Picker */}
            <div className="form-group grid-span-full">
              <label className="form-label">Ders Renk Etiketi</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c })}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: c,
                      border: formData.color === c ? '3px solid #ffffff' : 'none',
                      boxShadow: formData.color === c ? '0 0 0 2px ' + c : 'none',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="form-group grid-span-full">
              <label className="form-label">Ders Notları / Açıklama</label>
              <textarea
                rows="2"
                placeholder="Ödev formatı, devamsızlık durumu vb."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="form-textarea"
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ASSIGNMENTS SECTION INSIDE COURSE MODAL (DERSE BAĞLI ÖDEVLER)             */}
          {/* ========================================================================= */}
          {editingCourse && (
            <div className="course-modal-assignments-section">
              <div className="course-modal-assignments-header">
                <h3 className="course-modal-assignments-title">
                  <BookOpen size={18} color="var(--primary)" />
                  <span>Bu Derse Ait Ödevler</span>
                  <span className="pill-count" style={{ background: 'var(--bg-subtle)' }}>
                    {courseAssignments.length}
                  </span>
                </h3>

                {onAddAssignmentForCourse && (
                  <button
                    type="button"
                    onClick={() => onAddAssignmentForCourse(editingCourse)}
                    className="btn-secondary btn-add-assign-course"
                  >
                    <Plus size={13} />
                    <span>Ödev Ekle</span>
                  </button>
                )}
              </div>

              {courseAssignments.length === 0 ? (
                <div className="course-modal-assignments-empty">
                  Bu ders için kayıtlı bir ödev bulunmuyor.
                </div>
              ) : (
                <div className="course-modal-assignments-list">
                  {courseAssignments.map((assign) => {
                    const dueStatus = getDueDateStatus(assign.dueDate, assign.dueTime);
                    return (
                      <div
                        key={assign.id}
                        onClick={() => onOpenAssignmentModal && onOpenAssignmentModal(assign)}
                        className="modal-assign-item"
                      >
                        <div className="modal-assign-info">
                          <div
                            className="modal-assign-item-title"
                            style={{
                              textDecoration: assign.completed ? 'line-through' : 'none',
                              color: assign.completed ? 'var(--text-muted)' : 'var(--text-primary)'
                            }}
                          >
                            {assign.title}
                          </div>
                          {assign.description && (
                            <div className="modal-assign-desc">
                              {assign.description.substring(0, 60)}...
                            </div>
                          )}
                        </div>

                        <div className="modal-assign-badges-row">
                          <span className={`badge ${dueStatus.badgeClass}`} style={{ fontSize: '0.7rem' }}>
                            <Clock size={10} />
                            <span>{dueStatus.label}</span>
                          </span>
                          {getPriorityBadge(assign.priority)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="course-modal-footer">
            {editingCourse && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Bu dersi silmek istediğinize emin misiniz?')) {
                    onDelete(editingCourse.id);
                    onClose();
                  }
                }}
                className="btn-secondary btn-delete-course"
              >
                <Trash2 size={16} />
                <span>Dersi Sil</span>
              </button>
            )}
            <div className="course-modal-footer-right">
              <button type="button" onClick={onClose} className="btn-secondary">
                İptal
              </button>
              <button type="submit" className="btn-primary">
                <Save size={16} />
                <span>{editingCourse ? 'Kaydet' : 'Dersi Ekle'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
