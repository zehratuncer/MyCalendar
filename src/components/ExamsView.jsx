import React, { useState } from 'react';
import { Calendar, Plus, Clock, MapPin, Award, Timer, BookOpen } from 'lucide-react';
import { formatTurkishShortDate } from '../utils/dateUtils';
import ExamModal from './ExamModal';

export const ExamsView = ({ exams, setExams, courses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const handleSave = (item) => {
    if (editingExam) {
      setExams(exams.map((e) => (e.id === item.id ? item : e)));
    } else {
      setExams([...exams, item]);
    }
  };

  const handleDelete = (id) => {
    setExams(exams.filter((e) => e.id !== id));
  };

  // Helper for countdown
  const getExamCountdown = (dateStr, timeStr = '10:00') => {
    const examDate = new Date(`${dateStr}T${timeStr}:00`);
    const now = new Date();
    const diffMs = examDate - now;

    if (diffMs <= 0) {
      return { text: 'Sınav Tamamlandı', isPast: true };
    }

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);

    if (diffDays === 0) {
      return { text: `Bugün! (${diffHours} saat kaldı)`, isToday: true };
    }
    return { text: `${diffDays} gün ${diffHours} saat kaldı`, days: diffDays };
  };

  // Sort upcoming exams first
  const sortedExams = [...exams].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || '10:00'}`);
    const dateB = new Date(`${b.date}T${b.time || '10:00'}`);
    return dateA - dateB;
  });

  return (
    <div>
      {/* Header */}
      <div className="view-header">
        <div className="view-title-group">
          <h1>
            <Award className="text-primary" size={28} />
            Sınav Takvimi & Geri Sayım
          </h1>
          <p className="view-subtitle">
            Vize, Final ve Quiz tarihlerinizi takip edin, geri sayım sayaçlarıyla sınavlara hazırlanın.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingExam(null);
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus size={18} />
          <span>Sınav Ekle</span>
        </button>
      </div>

      {/* Exam Cards */}
      {sortedExams.length === 0 ? (
        <div className="glass-panel" style={{ padding: '50px', textAlign: 'center' }}>
          <Calendar size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 12px auto' }} />
          <h4 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Kayıtlı sınav bulunmuyor</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '18px' }}>
            Vize veya final tarihlerinizi ekleyerek geri sayım sayacını başlatın.
          </p>
          <button
            onClick={() => {
              setEditingExam(null);
              setIsModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus size={16} />
            <span>Sınav Ekle</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {sortedExams.map((exam) => {
            const countdown = getExamCountdown(exam.date, exam.time);
            return (
              <div
                key={exam.id}
                onClick={() => {
                  setEditingExam(exam);
                  setIsModalOpen(true);
                }}
                className="glass-panel"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  cursor: 'pointer',
                  borderTop: `4px solid ${exam.type === 'Final' ? '#ef4444' : exam.type === 'Vize' ? '#6366f1' : '#f59e0b'}`
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span
                      className="badge"
                      style={{
                        background: exam.type === 'Final' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                        color: exam.type === 'Final' ? '#f87171' : '#818cf8',
                        fontSize: '0.82rem'
                      }}
                    >
                      {exam.type} {exam.weight ? `(${exam.weight})` : ''}
                    </span>

                    <div className="exam-countdown-box">
                      <Timer size={14} />
                      <span>{countdown.text}</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '4px' }}>
                    {exam.courseName}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="var(--primary)" />
                      <span>{formatTurkishShortDate(exam.date)} • {exam.time} ({exam.durationMinutes} Dk)</span>
                    </div>

                    {exam.room && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} color="var(--accent-emerald)" />
                        <span>{exam.room}</span>
                      </div>
                    )}
                  </div>

                  {exam.topics && (
                    <div style={{ marginTop: '12px', fontSize: '0.85rem', background: 'var(--bg-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      📝 {exam.topics}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Exam Modal */}
      <ExamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        editingExam={editingExam}
        courses={courses}
      />
    </div>
  );
};

export default ExamsView;
