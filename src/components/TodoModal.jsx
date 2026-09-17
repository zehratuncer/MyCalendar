import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, CheckCircle2, Clock, Calendar, AlertCircle, BookOpen } from 'lucide-react';

const TIMEFRAMES = [
  { id: 'today', label: '🌟 Bugün', desc: 'Günün acil hedefleri' },
  { id: 'this_week', label: '📅 Bu Hafta', desc: 'Önümüzdeki 7 gün' },
  { id: 'this_month', label: '🗓️ Bu Ay', desc: 'Ay sonuna kadar' },
  { id: 'someday', label: '📌 Planlanan / Genel', desc: 'Tarihsiz veya genel' }
];

const PRIORITIES = [
  { id: 'high', label: 'Yüksek Öncelik', color: '#ef4444' },
  { id: 'medium', label: 'Orta Öncelik', color: '#f59e0b' },
  { id: 'low', label: 'Düşük Öncelik', color: '#3b82f6' }
];

export default function TodoModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingTodo,
  courses = [],
  defaultTimeframe = 'today'
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeframe: 'today',
    dueDate: '',
    dueTime: '',
    priority: 'medium',
    courseId: '',
    courseName: '',
    completed: false
  });

  useEffect(() => {
    if (editingTodo) {
      setFormData(editingTodo);
    } else {
      setFormData({
        title: '',
        description: '',
        timeframe: defaultTimeframe || 'today',
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '23:59',
        priority: 'medium',
        courseId: '',
        courseName: '',
        completed: false
      });
    }
  }, [editingTodo, isOpen, defaultTimeframe]);

  if (!isOpen) return null;

  const handleCourseChange = (courseId) => {
    if (!courseId) {
      setFormData((prev) => ({ ...prev, courseId: '', courseName: '' }));
      return;
    }
    const found = courses.find((c) => c.id === courseId);
    setFormData((prev) => ({
      ...prev,
      courseId,
      courseName: found ? found.name : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      return alert('Lütfen görev başlığı giriniz.');
    }

    onSave({
      ...formData,
      id: editingTodo ? editingTodo.id : `todo-${Date.now()}`,
      createdAt: editingTodo ? editingTodo.createdAt : new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {editingTodo ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Zaman dilimi ve önceliğe göre yapılacaklarınızı planlayın
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Görev Başlığı */}
          <div className="form-group">
            <label className="form-label">Görev Başlığı *</label>
            <input
              type="text"
              placeholder="Örn: Algoritma 3. slaytları tekrar et ve ödevi tamamla"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
              required
              autoFocus
            />
          </div>

          {/* Zaman Dilimi Seçimi (Timeframe Pills) */}
          <div className="form-group">
            <label className="form-label">Zaman Dilimi (Ne Zaman Yapılacak?)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {TIMEFRAMES.map((tf) => {
                const isSelected = formData.timeframe === tf.id;
                return (
                  <button
                    key={tf.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, timeframe: tf.id })}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-input)',
                      color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.9rem' }}>{tf.label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{tf.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* İki Kolon: Ders & Öncelik */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">İlişkili Ders (Opsiyonel)</label>
              <select
                value={formData.courseId || ''}
                onChange={(e) => handleCourseChange(e.target.value)}
                className="form-select"
              >
                <option value="">Genel (Ders Yok)</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Öncelik Derecesi</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="form-select"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tarih ve Saat (Opsiyonel) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Bitiş Tarihi (Opsiyonel)</label>
              <input
                type="date"
                value={formData.dueDate || ''}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bitiş Saati (Opsiyonel)</label>
              <input
                type="time"
                value={formData.dueTime || ''}
                onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          {/* Açıklama / Notlar */}
          <div className="form-group">
            <label className="form-label">Açıklama veya Detay Notları (Opsiyonel)</label>
            <textarea
              rows="3"
              placeholder="Görevle ilgili ipuçları, linkler veya alt adımlar..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
            />
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px' }}>
            {editingTodo ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Bu görevi silmek istediğinize emin misiniz?')) {
                    onDelete(editingTodo.id);
                    onClose();
                  }
                }}
                className="btn-secondary"
                style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              >
                <Trash2 size={16} />
                <span>Görevi Sil</span>
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                İptal
              </button>
              <button type="submit" className="btn-primary">
                <Save size={16} />
                <span>{editingTodo ? 'Güncelle' : 'Görevi Kaydet'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
