import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, BookOpen, Plus, Clock, Flame, Zap, Leaf, Check } from 'lucide-react';
import { DAYS_TR, getDueDateStatus } from '../utils/dateUtils';

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

  // Filter assignments for this specific course
  const courseAssignments = editingCourse
    ? assignments.filter(
        (a) =>
          a.courseId === editingCourse.id ||
          (a.courseName && a.courseName.toLowerCase() === editingCourse.name.toLowerCase())
      )
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {editingCourse ? 'Dersi Düzenle' : 'Yeni Ders Ekle'}
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', maxHeight: '80vh', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
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

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
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
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
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

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
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
            <div
              style={{
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                  >
                    <Plus size={13} />
                    <span>Ödev Ekle</span>
                  </button>
                )}
              </div>

              {courseAssignments.length === 0 ? (
                <div
                  style={{
                    padding: '16px',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  Bu ders için kayıtlı bir ödev bulunmuyor.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {courseAssignments.map((assign) => {
                    const dueStatus = getDueDateStatus(assign.dueDate, assign.dueTime);
                    return (
                      <div
                        key={assign.id}
                        onClick={() => onOpenAssignmentModal && onOpenAssignmentModal(assign)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        className="modal-assign-item"
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '0.92rem',
                              fontWeight: 600,
                              textDecoration: assign.completed ? 'line-through' : 'none',
                              color: assign.completed ? 'var(--text-muted)' : 'var(--text-primary)'
                            }}
                          >
                            {assign.title}
                          </div>
                          {assign.description && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                              {assign.description.substring(0, 50)}...
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px' }}>
            {editingCourse && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Bu dersi silmek istediğinize emin misiniz?')) {
                    onDelete(editingCourse.id);
                    onClose();
                  }
                }}
                className="btn-secondary"
                style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              >
                <Trash2 size={16} />
                <span>Dersi Sil</span>
              </button>
            )}
            <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
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
