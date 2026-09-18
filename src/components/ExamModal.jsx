import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Calendar, Clock, MapPin } from 'lucide-react';

export default function ExamModal({ isOpen, onClose, onSave, onDelete, editingExam, courses }) {
  const [formData, setFormData] = useState({
    courseName: '',
    type: 'Vize', // 'Vize', 'Final', 'Büt', 'Quiz'
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    durationMinutes: 75,
    room: '',
    topics: '',
    weight: '%40'
  });

  useEffect(() => {
    if (editingExam) {
      setFormData(editingExam);
    } else {
      setFormData({
        courseName: courses[0]?.name || '',
        type: 'Vize',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '10:00',
        durationMinutes: 75,
        room: '',
        topics: '',
        weight: '%40'
      });
    }
  }, [editingExam, isOpen, courses]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.courseName.trim()) return alert('Lütfen ders adını giriniz.');
    onSave({
      ...formData,
      topicList: formData.topicList || editingExam?.topicList || [],
      id: editingExam ? editingExam.id : `exam-${Date.now()}`
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {editingExam ? 'Sınavı Düzenle' : 'Yeni Sınav / Quiz Ekle'}
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div className="form-group">
            <label className="form-label">Ders Adı *</label>
            <input
              type="text"
              required
              placeholder="Örn: Veri Yapıları ve Algoritmalar"
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Sınav Türü</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="form-select"
              >
                <option value="Vize">Vize (Ara Sınav)</option>
                <option value="Final">Final (Dönem Sonu)</option>
                <option value="Büt">Bütünleme</option>
                <option value="Quiz">Quiz / Kısa Sınav</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ağırlık Yüzdesi</label>
              <input
                type="text"
                placeholder="Örn: %40"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sınav Tarihi</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Başlangıç Saati</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Süre (Dakika)</label>
              <input
                type="number"
                min="10"
                max="240"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sınav Yeri / Salon</label>
              <input
                type="text"
                placeholder="Örn: Müh. Amfi 1 & 2"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Sınav Kapsamı / Konular</label>
              <textarea
                rows="3"
                placeholder="Sorumlu olunan haftalar, formül kağıdı izinli mi vs."
                value={formData.topics}
                onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                className="form-textarea"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
            {editingExam && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Bu sınavı silmek istediğinize emin misiniz?')) {
                    onDelete(editingExam.id);
                    onClose();
                  }
                }}
                className="btn-secondary"
                style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              >
                <Trash2 size={16} />
                <span>Sınavı Sil</span>
              </button>
            )}
            <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                İptal
              </button>
              <button type="submit" className="btn-primary">
                <Save size={16} />
                <span>{editingExam ? 'Kaydet' : 'Sınavı Ekle'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
