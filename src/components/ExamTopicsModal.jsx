import React, { useState } from 'react';
import {
  X,
  Plus,
  Check,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Edit2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ListTodo,
  Timer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatTurkishShortDate } from '../utils/dateUtils';

export default function ExamTopicsModal({
  isOpen,
  onClose,
  exam,
  onUpdateExam,
  onOpenEditModal
}) {
  const [newTopicText, setNewTopicText] = useState('');

  if (!isOpen || !exam) return null;

  const topicList = exam.topicList || [];
  const completedCount = topicList.filter((t) => t.completed).length;
  const totalCount = topicList.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddTopic = (e) => {
    e.preventDefault();
    const text = newTopicText.trim();
    if (!text) return;

    const newTopic = {
      id: `topic-${Date.now()}`,
      title: text,
      completed: false
    };

    const updatedExam = {
      ...exam,
      topicList: [...topicList, newTopic]
    };

    onUpdateExam(updatedExam);
    setNewTopicText('');
  };

  const handleToggleTopic = (topicId) => {
    const updatedList = topicList.map((t) => {
      if (t.id === topicId) {
        const nextCompleted = !t.completed;
        if (nextCompleted && completedCount + 1 === totalCount) {
          // All topics finished 🎉
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.7 }
          });
        }
        return { ...t, completed: nextCompleted };
      }
      return t;
    });

    onUpdateExam({
      ...exam,
      topicList: updatedList
    });
  };

  const handleDeleteTopic = (topicId, e) => {
    e.stopPropagation();
    const updatedList = topicList.filter((t) => t.id !== topicId);
    onUpdateExam({
      ...exam,
      topicList: updatedList
    });
  };

  const handleMarkAll = (completedState) => {
    const updatedList = topicList.map((t) => ({ ...t, completed: completedState }));
    if (completedState) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
    onUpdateExam({
      ...exam,
      topicList: updatedList
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content exam-topics-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="exam-topics-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                className="badge"
                style={{
                  background: exam.type === 'Final' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                  color: exam.type === 'Final' ? '#f87171' : '#818cf8',
                  fontSize: '0.78rem'
                }}
              >
                {exam.type} {exam.weight ? `(${exam.weight})` : ''}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {formatTurkishShortDate(exam.date)} • {exam.time}
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {exam.courseName}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
              🎯 Sınavda Çıkacak Konular & Çalışma Kontrol Listesi
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenEditModal(exam);
              }}
              className="btn-icon"
              title="Sınav Genel Bilgilerini Düzenle"
            >
              <Edit2 size={16} />
            </button>
            <button type="button" onClick={onClose} className="btn-icon" title="Kapat">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Progress Bar & Stats */}
        <div className="exam-progress-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ListTodo size={16} color="var(--accent-emerald)" />
              <span>Konu İlerlemesi:</span>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 800 }}>
                {completedCount} / {totalCount} Konu Tamamlandı
              </span>
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              %{progressPercent}
            </span>
          </div>

          <div className="exam-progress-bar-bg">
            <div
              className="exam-progress-bar-fill"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #10b981, #34d399)',
                boxShadow: progressPercent > 0 ? '0 0 12px rgba(16, 185, 129, 0.5)' : 'none'
              }}
            />
          </div>

          {progressPercent === 100 && totalCount > 0 && (
            <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--accent-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} />
              <span>Harika! Bu sınavın tüm konularını başarıyla tamamladınız! Başarılar 🎓</span>
            </div>
          )}
        </div>

        {/* Add New Topic Input */}
        <form onSubmit={handleAddTopic} className="add-topic-form">
          <input
            type="text"
            placeholder="Sınavda çıkacak yeni bir konu veya soru tipi ekleyin... (Enter'a basın)"
            value={newTopicText}
            onChange={(e) => setNewTopicText(e.target.value)}
            className="form-input"
            style={{ flex: 1, padding: '10px 14px', fontSize: '0.9rem' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '10px 16px', flexShrink: 0 }}>
            <Plus size={16} />
            <span>Madde Ekle</span>
          </button>
        </form>

        {/* Topics Checklist */}
        <div className="exam-topics-list-container">
          {topicList.length === 0 ? (
            <div className="exam-topics-empty">
              <BookOpen size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 10px auto' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>
                Henüz çıkacak konu maddesi eklenmedi
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Hocanızın derste belirttiği vize/final konularını yukarıdaki alana yazarak tek tek listeleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="exam-topics-list">
              {topicList.map((topic, index) => (
                <div
                  key={topic.id}
                  onClick={() => handleToggleTopic(topic.id)}
                  className={`exam-topic-item ${topic.completed ? 'completed' : ''}`}
                >
                  <div
                    className={`custom-checkbox ${topic.completed ? 'checked' : ''}`}
                    title={topic.completed ? 'Tamamlandı' : 'Tamamla'}
                  >
                    {topic.completed && <Check size={14} strokeWidth={3} />}
                  </div>

                  <span className="exam-topic-index">{index + 1}.</span>

                  <span className={`exam-topic-title ${topic.completed ? 'strikethrough' : ''}`}>
                    {topic.title}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteTopic(topic.id, e)}
                    className="topic-delete-btn"
                    title="Bu konuyu sil"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="exam-topics-footer">
          <div style={{ display: 'flex', gap: '8px' }}>
            {totalCount > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => handleMarkAll(true)}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  <CheckCircle2 size={13} />
                  <span>Tümünü Tamamla</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll(false)}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  <span>Sıfırla</span>
                </button>
              </>
            )}
          </div>

          <button type="button" onClick={onClose} className="btn-primary" style={{ padding: '8px 18px' }}>
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
}
