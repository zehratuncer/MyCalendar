import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';

export default function AssignmentModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingAssignment,
  courses
}) {
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    courseName: '',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '23:59',
    priority: 'medium', // 'high', 'medium', 'low'
    completed: false,
    description: '',
    tags: []
  });

  useEffect(() => {
    if (editingAssignment) {
      setFormData(editingAssignment);
    } else {
      setFormData({
        title: '',
        courseId: courses[0]?.id || '',
        courseName: courses[0]?.name || '',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dueTime: '23:59',
        priority: 'medium',
        completed: false,
        description: '',
        tags: []
      });
    }
  }, [editingAssignment, isOpen, courses]);

  if (!isOpen) return null;

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    const selectedCourse = courses.find((c) => c.id === courseId);
    setFormData({
      ...formData,
      courseId,
      courseName: selectedCourse ? selectedCourse.name : ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert('Lütfen ödev başlığını giriniz.');
    onSave({
      ...formData,
      id: editingAssignment ? editingAssignment.id : `assign-${Date.now()}`
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {editingAssignment ? 'Ödevi Düzenle' : 'Yeni Ödev & Görev Ekle'}
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div className="form-group">
            <label className="form-label">Ödev / Görev Başlığı *</label>
            <input
              type="text"
              required
              placeholder="Örn: BST Ağacı C++ Ödevi"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">İlgili Ders</label>
              <select
                value={formData.courseId}
                onChange={handleCourseChange}
                className="form-select"
              >
                <option value="">-- Ders Seçiniz (Opsiyonel) --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.code ? `(${c.code})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Son Teslim Tarihi</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Teslim Saati</label>
              <input
                type="time"
                value={formData.dueTime}
                onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Öncelik Seviyesi</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { id: 'high', label: '🔥 Yüksek', color: '#ef4444' },
                  { id: 'medium', label: '⚡ Orta', color: '#f59e0b' },
                  { id: 'low', label: '🌱 Düşük', color: '#10b981' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p.id })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      background: formData.priority === p.id ? 'var(--bg-subtle)' : 'var(--bg-input)',
                      border: formData.priority === p.id ? `2px solid ${p.color}` : '1px solid var(--border-subtle)',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      color: formData.priority === p.id ? p.color : 'var(--text-secondary)'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Açıklama / Notlar / Link</label>
              <textarea
                rows="3"
                placeholder="Ödev gereksinimleri, teslim portal linki veya grup arkadaşları..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-textarea"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
            {editingAssignment && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Bu ödevi silmek istediğinize emin misiniz?')) {
                    onDelete(editingAssignment.id);
                    onClose();
                  }
                }}
                className="btn-secondary"
                style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              >
                <Trash2 size={16} />
                <span>Ödevi Sil</span>
              </button>
            )}
            <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                İptal
              </button>
              <button type="submit" className="btn-primary">
                <Save size={16} />
                <span>{editingAssignment ? 'Kaydet' : 'Ödevi Ekle'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
