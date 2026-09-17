import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Pin } from 'lucide-react';

const NOTE_COLORS = [
  '#fef3c7', // Warm Yellow
  '#e0e7ff', // Soft Indigo
  '#fee2e2', // Soft Rose
  '#dcfce7', // Soft Emerald
  '#f3e8ff', // Soft Purple
  '#ffedd5', // Soft Orange
  '#e0f2fe'  // Soft Sky Blue
];

const CATEGORIES = ['Ders Notu', 'Fikir', 'Hatırlatma', 'Proje', 'Genel'];

export default function NoteModal({ isOpen, onClose, onSave, onDelete, editingNote }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Genel',
    color: '#fef3c7',
    pinned: false
  });

  useEffect(() => {
    if (editingNote) {
      setFormData(editingNote);
    } else {
      setFormData({
        title: '',
        content: '',
        category: 'Genel',
        color: '#fef3c7',
        pinned: false
      });
    }
  }, [editingNote, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() && !formData.content.trim()) {
      return alert('Lütfen bir başlık veya not içeriği giriniz.');
    }
    onSave({
      ...formData,
      id: editingNote ? editingNote.id : `note-${Date.now()}`,
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {editingNote ? 'Notu Düzenle' : 'Yeni Not Yaz'}
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div className="form-group">
            <label className="form-label">Not Başlığı</label>
            <input
              type="text"
              placeholder="Örn: Algoritma Dersi Vize Konuları"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sabitleme</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, pinned: !formData.pinned })}
                className="btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  background: formData.pinned ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-input)',
                  borderColor: formData.pinned ? 'var(--primary)' : 'var(--border-subtle)',
                  color: formData.pinned ? 'var(--primary)' : 'var(--text-secondary)'
                }}
              >
                <Pin size={16} />
                <span>{formData.pinned ? '📌 Başa Sabitlendi' : 'Sabitlenmedi'}</span>
              </button>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Not Rengi</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {NOTE_COLORS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: col })}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: col,
                      border: formData.color === col ? '3px solid #6366f1' : '1px solid rgba(0,0,0,0.1)',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Not İçeriği</label>
              <textarea
                rows="6"
                placeholder="Aklınıza gelen fikirleri, ders notlarını veya yapılacakları buraya yazın..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="form-textarea"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
            {editingNote && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Bu notu silmek istediğinize emin misiniz?')) {
                    onDelete(editingNote.id);
                    onClose();
                  }
                }}
                className="btn-secondary"
                style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              >
                <Trash2 size={16} />
                <span>Notu Sil</span>
              </button>
            )}
            <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                İptal
              </button>
              <button type="submit" className="btn-primary">
                <Save size={16} />
                <span>{editingNote ? 'Kaydet' : 'Notu Ekle'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
