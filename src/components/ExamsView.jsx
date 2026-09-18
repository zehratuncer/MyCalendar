import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  Award,
  Timer,
  BookOpen,
  Edit2,
  CheckCircle2,
  ListTodo,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { formatTurkishShortDate } from '../utils/dateUtils';
import ExamModal from './ExamModal';
import ExamTopicsModal from './ExamTopicsModal';

export const ExamsView = ({ exams, setExams, courses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [selectedExamForTopics, setSelectedExamForTopics] = useState(null);

  const handleSave = (item) => {
    if (editingExam) {
      setExams(exams.map((e) => (e.id === item.id ? item : e)));
    } else {
      setExams([...exams, item]);
    }
  };

  const handleDelete = (id) => {
    setExams(exams.filter((e) => e.id !== id));
    if (selectedExamForTopics?.id === id) {
      setSelectedExamForTopics(null);
    }
  };

  const handleUpdateExam = (updatedExam) => {
    setExams(exams.map((e) => (e.id === updatedExam.id ? updatedExam : e)));
    setSelectedExamForTopics(updatedExam);
  };

  const handleOpenEditFromTopics = (exam) => {
    setSelectedExamForTopics(null);
    setEditingExam(exam);
    setIsModalOpen(true);
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
            Sınav Takvimi & Çıkacak Konular
          </h1>
          <p className="view-subtitle">
            Vize, Final ve Quiz tarihlerinizi takip edin; her derse özel çıkacak konuları madde madde listeleyip kontrol edin.
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

      {/* Exam Cards Grid */}
      {sortedExams.length === 0 ? (
        <div className="glass-panel" style={{ padding: '50px', textAlign: 'center' }}>
          <Calendar size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 12px auto' }} />
          <h4 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Kayıtlı sınav bulunmuyor</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '18px' }}>
            Vize veya final tarihlerinizi ekleyerek geri sayım sayacını ve çıkacak konular listesini başlatın.
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '18px' }}>
          {sortedExams.map((exam) => {
            const countdown = getExamCountdown(exam.date, exam.time);
            const topicList = exam.topicList || [];
            const completedCount = topicList.filter((t) => t.completed).length;
            const totalCount = topicList.length;
            const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div
                key={exam.id}
                onClick={() => setSelectedExamForTopics(exam)}
                className="glass-panel exam-card-container"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: 'pointer',
                  borderTop: `4px solid ${exam.type === 'Final' ? '#ef4444' : exam.type === 'Vize' ? '#6366f1' : '#f59e0b'}`
                }}
              >
                <div>
                  {/* Top Badges & Edit Button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="exam-countdown-box">
                        <Timer size={14} />
                        <span>{countdown.text}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingExam(exam);
                          setIsModalOpen(true);
                        }}
                        className="btn-icon"
                        style={{ width: '30px', height: '30px' }}
                        title="Sınavı Düzenle"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Course Title */}
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '6px' }}>
                    {exam.courseName}
                  </h3>

                  {/* Exam Date & Room */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
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

                  {/* Çıkacak Konular & İlerleme Kart Alanı */}
                  <div className="exam-topics-preview-box">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ListTodo size={14} color="var(--primary)" />
                        <span>Çıkacak Konular:</span>
                      </span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: progressPercent === 100 && totalCount > 0 ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                        {totalCount > 0 ? `${completedCount}/${totalCount} Tamamlandı (%${progressPercent})` : 'Konu Eklenmedi'}
                      </span>
                    </div>

                    {totalCount > 0 ? (
                      <div>
                        {/* Mini Progress bar */}
                        <div className="exam-progress-bar-bg" style={{ height: '6px', marginBottom: '8px' }}>
                          <div
                            className="exam-progress-bar-fill"
                            style={{
                              width: `${progressPercent}%`,
                              background: 'linear-gradient(90deg, #10b981, #34d399)',
                              boxShadow: progressPercent > 0 ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none'
                            }}
                          />
                        </div>

                        {/* Top 2 topics preview */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {topicList.slice(0, 2).map((top) => (
                            <div key={top.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: top.completed ? 'var(--text-muted)' : 'var(--text-secondary)' }}>
                              <span style={{ color: top.completed ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                                {top.completed ? '✓' : '•'}
                              </span>
                              <span style={{ textDecoration: top.completed ? 'line-through' : 'none' }}>
                                {top.title}
                              </span>
                            </div>
                          ))}
                          {totalCount > 2 && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
                              +{totalCount - 2} konu maddesi daha...
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Konuları madde madde girmek ve işaretlemek için tıklayın ➔
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Link */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Çıkacak Konuları Yönet</span>
                    <ArrowRight size={13} />
                  </span>
                  <span className="badge badge-info" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                    {totalCount} Madde
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 1. Exam Topics Checklist Modal (Çıkacak Konular Kontrol Listesi) */}
      <ExamTopicsModal
        isOpen={Boolean(selectedExamForTopics)}
        onClose={() => setSelectedExamForTopics(null)}
        exam={selectedExamForTopics}
        onUpdateExam={handleUpdateExam}
        onOpenEditModal={handleOpenEditFromTopics}
      />

      {/* 2. Exam Modal (Sınav Ekleme / Genel Bilgileri Düzenleme) */}
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
