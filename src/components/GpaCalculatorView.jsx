import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  Award,
  Target,
  Sparkles,
  BookOpen,
  GraduationCap,
  Layers,
  CheckCircle2,
  TrendingUp,
  FileText,
  Percent,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  GRADE_SCALE,
  GRADE_KEYS,
  calculateGradePoints,
  convertGpaTo100
} from '../utils/dateUtils';

export const GpaCalculatorView = ({ semesters = [], setSemesters, courses = [] }) => {
  // Active selected semester tab or 'all' for cumulative transcript
  const [selectedSemesterId, setSelectedSemesterId] = useState(() => {
    return semesters.length > 0 ? semesters[0].id : 'all';
  });

  // Midterm weight percentage for table inline calculations (Default 40%)
  const [midtermWeight, setMidtermWeight] = useState(40);

  // ==========================================
  // CALCULATIONS (YANO, GANO, ECTS, POINTS)
  // ==========================================

  const calculateSemesterStats = (semester) => {
    let totalEcts = 0;
    let totalCredits = 0;
    let totalPoints = 0;
    let countedEcts = 0;

    (semester.courses || []).forEach((c) => {
      const ects = Number(c.ects) || 0;
      const credits = Number(c.credits) || 0;
      totalEcts += ects;
      totalCredits += credits;

      const gradeInfo = GRADE_SCALE[c.letterGrade] || { gpa: 0, countsInGpa: false };
      if (gradeInfo.countsInGpa) {
        const point = ects * gradeInfo.gpa;
        totalPoints += point;
        countedEcts += ects;
      }
    });

    const yano = countedEcts > 0 ? (totalPoints / countedEcts).toFixed(2) : '0.00';

    let statusBadge = 'Normal';
    const numYano = Number(yano);
    if (numYano >= 3.50) statusBadge = 'Yüksek Onur';
    else if (numYano >= 3.00) statusBadge = 'Onur';
    else if (numYano >= 2.00) statusBadge = 'Başarılı';
    else statusBadge = 'Şartlı / Sınırda';

    return {
      totalEcts,
      totalCredits,
      totalPoints: Math.round(totalPoints * 100) / 100,
      countedEcts,
      yano,
      statusBadge
    };
  };

  const calculateCumulativeGano = (upToIndex = semesters.length - 1) => {
    let cumPoints = 0;
    let cumEcts = 0;
    let cumCredits = 0;

    for (let i = 0; i <= upToIndex && i < semesters.length; i++) {
      const s = semesters[i];
      (s.courses || []).forEach((c) => {
        const ects = Number(c.ects) || 0;
        const credits = Number(c.credits) || 0;
        cumCredits += credits;

        const gradeInfo = GRADE_SCALE[c.letterGrade] || { gpa: 0, countsInGpa: false };
        if (gradeInfo.countsInGpa) {
          cumPoints += ects * gradeInfo.gpa;
          cumEcts += ects;
        }
      });
    }

    const gano = cumEcts > 0 ? (cumPoints / cumEcts).toFixed(2) : '0.00';
    return {
      cumPoints: Math.round(cumPoints * 100) / 100,
      cumEcts,
      cumCredits,
      gano
    };
  };

  const totalOverallStats = calculateCumulativeGano(semesters.length - 1);
  const overall100Scale = convertGpaTo100(totalOverallStats.gano);

  // Active semester
  const activeSemesterIndex = semesters.findIndex((s) => s.id === selectedSemesterId);
  const activeSemester = activeSemesterIndex >= 0 ? semesters[activeSemesterIndex] : null;
  const activeSemesterStats = activeSemester ? calculateSemesterStats(activeSemester) : null;
  const activeCumulativeStats = activeSemesterIndex >= 0 ? calculateCumulativeGano(activeSemesterIndex) : null;

  // ==========================================
  // HANDLERS (COURSE & SEMESTER MODIFICATIONS)
  // ==========================================

  const handleAddCourse = () => {
    if (!activeSemester) return;
    const newCourse = {
      id: `c-${Date.now()}`,
      code: 'DERS 101',
      name: 'Yeni Ders',
      type: 'Z',
      ects: 5.0,
      credits: 3,
      letterGrade: 'B',
      gpa: 3.00,
      midterm: 75,
      final: 75
    };

    setSemesters(
      semesters.map((s) =>
        s.id === activeSemester.id
          ? { ...s, courses: [...(s.courses || []), newCourse] }
          : s
      )
    );
  };

  const handleUpdateCourse = (courseId, field, value) => {
    if (!activeSemester) return;
    setSemesters(
      semesters.map((s) => {
        if (s.id !== activeSemester.id) return s;
        const updatedCourses = (s.courses || []).map((c) => {
          if (c.id !== courseId) return c;
          const updated = { ...c, [field]: value };

          // If midterm/final changed, recalculate letterGrade and GPA
          if (field === 'midterm' || field === 'final') {
            const m = field === 'midterm' ? value : c.midterm;
            const f = field === 'final' ? value : c.final;
            if (m !== '' && f !== '') {
              const res = calculateGradePoints(m, f, midtermWeight);
              updated.letterGrade = res.letterGrade;
              updated.gpa = res.gpa;
            }
          }

          // If letterGrade changed directly from dropdown, update gpa
          if (field === 'letterGrade') {
            const info = GRADE_SCALE[value] || { gpa: 0 };
            updated.gpa = info.gpa;
          }

          return updated;
        });
        return { ...s, courses: updatedCourses };
      })
    );
  };

  const handleDeleteCourse = (courseId) => {
    if (!activeSemester) return;
    setSemesters(
      semesters.map((s) =>
        s.id === activeSemester.id
          ? { ...s, courses: (s.courses || []).filter((c) => c.id !== courseId) }
          : s
      )
    );
  };

  const handleAddNewSemester = () => {
    const semName = prompt('Yeni Dönem Adını Giriniz (Örn: 2026-2027 Güz):', '2026-2027 Güz');
    if (!semName) return;

    const newSem = {
      id: `sem-${Date.now()}`,
      name: semName,
      status: 'Onur',
      courses: [
        {
          id: `c-${Date.now()}-1`,
          code: 'CENG 301',
          name: 'Yazılım Mühendisliği',
          type: 'Z',
          ects: 6.0,
          credits: 4,
          letterGrade: 'A',
          gpa: 4.00,
          midterm: 90,
          final: 90
        }
      ]
    };

    setSemesters([...semesters, newSem]);
    setSelectedSemesterId(newSem.id);
  };

  const handleDeleteSemester = (semId) => {
    if (semesters.length <= 1) {
      return alert('En az bir dönem bulunmalıdır.');
    }
    if (confirm('Bu dönemi ve içindeki tüm dersleri silmek istediğinize emin misiniz?')) {
      const remaining = semesters.filter((s) => s.id !== semId);
      setSemesters(remaining);
      setSelectedSemesterId(remaining[0].id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="view-header">
        <div className="view-title-group">
          <h1>
            <GraduationCap className="text-primary" size={28} />
            Transkript & Not Ortalaması (GPA/GANO)
          </h1>
          <p className="view-subtitle">
            Üniversite Kredi ve AKTS (ECTS) sistemine tam uyumlu dönemlik (YANO) ve genel (GANO) akademik başarı hesaplayıcısı.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {selectedSemesterId !== 'all' && (
            <button onClick={handleAddCourse} className="btn-primary">
              <Plus size={18} />
              <span>Bu Döneme Ders Ekle</span>
            </button>
          )}
          <button onClick={handleAddNewSemester} className="btn-secondary">
            <Plus size={16} />
            <span>Yeni Dönem Ekle</span>
          </button>
        </div>
      </div>

      {/* Main Cumulative GPA & Stats Card */}
      <div className="gpa-summary-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            Genel Ağırlıklı Not Ortalaması (GANO / CGPA)
          </div>
          <div className="gpa-score-display">
            {totalOverallStats.gano}{' '}
            <span style={{ fontSize: '1.4rem', opacity: 0.8 }}>/ 4.00</span>
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.95, display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '4px' }}>
            <span>Toplam {totalOverallStats.cumEcts} AKTS (ECTS)</span>
            <span>•</span>
            <span>{totalOverallStats.cumCredits} Yerel Kredi</span>
            <span>•</span>
            <span>Toplam Puan: {totalOverallStats.cumPoints}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Yüzlük Not Kutusu */}
          <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: 600 }}>Yüzlük Sistem Karşılığı</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {overall100Scale} <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>/ 100</span>
            </div>
          </div>

          {/* Akademik Onur Durumu */}
          <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '14px 20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={18} />
              <span>Akademik Derece</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
              {Number(totalOverallStats.gano) >= 3.50 ? '🌟 Yüksek Onur' :
                Number(totalOverallStats.gano) >= 3.00 ? '🎯 Onur Öğrencisi' :
                  Number(totalOverallStats.gano) >= 2.00 ? '✅ Başarılı' : '⚠️ Sınırda / Şartlı'}
            </div>
          </div>
        </div>
      </div>

      {/* Semester Tabs Bar */}
      <div className="semester-tabs-container" style={{ marginBottom: '20px' }}>
        <div className="semester-tabs-scroll">
          {semesters.map((sem, idx) => {
            const stats = calculateSemesterStats(sem);
            const isSelected = selectedSemesterId === sem.id;
            return (
              <button
                key={sem.id}
                onClick={() => setSelectedSemesterId(sem.id)}
                className={`semester-tab-btn ${isSelected ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} />
                  <span>{sem.name}</span>
                </div>
                <div className="semester-tab-badge">
                  YANO: {stats.yano} {stats.statusBadge === 'Yüksek Onur' ? '🌟' : stats.statusBadge === 'Onur' ? '🎯' : ''}
                </div>
              </button>
            );
          })}

          <button
            onClick={() => setSelectedSemesterId('all')}
            className={`semester-tab-btn ${selectedSemesterId === 'all' ? 'active' : ''}`}
          >
            <Layers size={14} />
            <span>Tüm Transkript Özeti</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TEK DÖNEM TABLO GÖRÜNÜMÜ                                              */}
      {/* ========================================================================= */}
      {selectedSemesterId !== 'all' && activeSemester && (
        <div>
          {/* Active Semester Stats Header Banner */}
          <div className="semester-stats-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{activeSemester.name}</div>
              <span className={`badge ${activeSemesterStats.statusBadge === 'Yüksek Onur' ? 'badge-success' : activeSemesterStats.statusBadge === 'Onur' ? 'badge-info' : 'badge-warning'}`}>
                {activeSemesterStats.statusBadge}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', fontSize: '0.88rem' }}>
              <div>
                <strong>Dönem ECTS:</strong> {activeSemesterStats.totalEcts}
              </div>
              <div>
                <strong>Dönem Kredi:</strong> {activeSemesterStats.totalCredits}
              </div>
              <div>
                <strong>Dönem Puanı:</strong> {activeSemesterStats.totalPoints}
              </div>
              <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1rem' }}>
                <strong>YANO:</strong> {activeSemesterStats.yano}
              </div>
              <div style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '1rem' }}>
                <strong>GANO:</strong> {activeCumulativeStats?.gano}
              </div>

              <button
                type="button"
                onClick={() => handleDeleteSemester(activeSemester.id)}
                className="btn-text-action"
                style={{ color: '#ef4444', marginLeft: 'auto' }}
                title="Dönemi Sil"
              >
                <Trash2 size={15} />
                <span>Dönemi Sil</span>
              </button>
            </div>
          </div>

          {/* Grades Table */}
          <div className="grades-table-container" style={{ marginBottom: '24px' }}>
            <table className="grades-table">
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>Ders Kodu</th>
                  <th style={{ minWidth: '180px' }}>Ders Adı</th>
                  <th style={{ width: '70px', textAlign: 'center' }}>Tür</th>
                  <th style={{ width: '95px', textAlign: 'center' }}>ECTS (AKTS)</th>
                  <th style={{ width: '90px', textAlign: 'center' }}>Kredi</th>
                  <th style={{ width: '95px', textAlign: 'center' }}>Vize (%{midtermWeight})</th>
                  <th style={{ width: '95px', textAlign: 'center' }}>Final (%{100 - midtermWeight})</th>
                  <th style={{ width: '130px' }}>Harf Notu</th>
                  <th style={{ width: '85px', textAlign: 'center' }}>Puan</th>
                  <th style={{ width: '45px' }}></th>
                </tr>
              </thead>
              <tbody>
                {(activeSemester.courses || []).map((course) => {
                  const ectsVal = Number(course.ects) || 0;
                  const gradeInfo = GRADE_SCALE[course.letterGrade] || { gpa: 0, countsInGpa: false };
                  const point = gradeInfo.countsInGpa ? (ectsVal * gradeInfo.gpa).toFixed(1) : '0.0';

                  return (
                    <tr key={course.id}>
                      {/* Code */}
                      <td>
                        <input
                          type="text"
                          value={course.code}
                          onChange={(e) => handleUpdateCourse(course.id, 'code', e.target.value)}
                          className="form-input table-input"
                          placeholder="BMB 101"
                          style={{ fontWeight: 600 }}
                        />
                      </td>

                      {/* Name */}
                      <td>
                        <input
                          type="text"
                          value={course.name}
                          onChange={(e) => handleUpdateCourse(course.id, 'name', e.target.value)}
                          className="form-input table-input"
                          placeholder="Ders adı..."
                        />
                      </td>

                      {/* Type (Z/S) */}
                      <td>
                        <select
                          value={course.type || 'Z'}
                          onChange={(e) => handleUpdateCourse(course.id, 'type', e.target.value)}
                          className="form-select table-input"
                          style={{ textAlign: 'center', fontWeight: 600 }}
                        >
                          <option value="Z">Z</option>
                          <option value="S">S</option>
                        </select>
                      </td>

                      {/* ECTS */}
                      <td>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="30"
                          value={course.ects}
                          onChange={(e) => handleUpdateCourse(course.id, 'ects', Number(e.target.value))}
                          className="form-input table-input"
                          style={{ textAlign: 'center', fontWeight: 700 }}
                        />
                      </td>

                      {/* Kredi */}
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="15"
                          value={course.credits}
                          onChange={(e) => handleUpdateCourse(course.id, 'credits', Number(e.target.value))}
                          className="form-input table-input"
                          style={{ textAlign: 'center', fontWeight: 700 }}
                        />
                      </td>

                      {/* Vize */}
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={course.midterm !== undefined ? course.midterm : ''}
                          onChange={(e) => handleUpdateCourse(course.id, 'midterm', e.target.value === '' ? '' : Number(e.target.value))}
                          className="form-input table-input"
                          placeholder="-"
                          style={{ textAlign: 'center' }}
                        />
                      </td>

                      {/* Final */}
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={course.final !== undefined ? course.final : ''}
                          onChange={(e) => handleUpdateCourse(course.id, 'final', e.target.value === '' ? '' : Number(e.target.value))}
                          className="form-input table-input"
                          placeholder="-"
                          style={{ textAlign: 'center' }}
                        />
                      </td>

                      {/* Harf Notu */}
                      <td>
                        <select
                          value={course.letterGrade || 'A'}
                          onChange={(e) => handleUpdateCourse(course.id, 'letterGrade', e.target.value)}
                          className="form-select table-input"
                          style={{
                            fontWeight: 700,
                            color: ['A', 'A-', 'B+', 'B'].includes(course.letterGrade)
                              ? '#10b981'
                              : ['B-', 'C+', 'C'].includes(course.letterGrade)
                                ? '#3b82f6'
                                : course.letterGrade === 'IP' || course.letterGrade === 'S'
                                  ? '#8b5cf6'
                                  : '#ef4444'
                          }}
                        >
                          {GRADE_KEYS.map((gk) => (
                            <option key={gk} value={gk}>
                              {gk} ({GRADE_SCALE[gk].gpa.toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Puan (ECTS * Katsayı) */}
                      <td style={{ textAlign: 'center', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {point}
                      </td>

                      {/* Sil */}
                      <td>
                        <button
                          type="button"
                          onClick={() => handleDeleteCourse(course.id)}
                          style={{ color: '#ef4444', opacity: 0.8, cursor: 'pointer', background: 'none', border: 'none' }}
                          title="Dersi Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TÜM DÖNEMLER TRANSKRİPT ÖZETİ (CUMULATIVE VIEW)                       */}
      {/* ========================================================================= */}
      {selectedSemesterId === 'all' && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {semesters.map((sem, idx) => {
              const semStats = calculateSemesterStats(sem);
              const cumStats = calculateCumulativeGano(idx);
              return (
                <div key={sem.id} className="transcript-sem-card">
                  <div className="transcript-sem-header">
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{sem.name}</h3>
                      <span className={`badge ${semStats.statusBadge === 'Yüksek Onur' ? 'badge-success' : semStats.statusBadge === 'Onur' ? 'badge-info' : 'badge-warning'}`}>
                        {semStats.statusBadge}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>YANO (Dönem)</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                        {semStats.yano}
                      </div>
                    </div>
                  </div>

                  {/* Course Mini List */}
                  <div className="transcript-course-list">
                    {(sem.courses || []).map((c) => (
                      <div key={c.id} className="transcript-course-item">
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{c.code}</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{c.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.ects} ECTS</span>
                          <span className={`grade-pill ${['A', 'A-', 'B+', 'B'].includes(c.letterGrade) ? 'high' : ['B-', 'C+', 'C'].includes(c.letterGrade) ? 'mid' : 'low'}`}>
                            {c.letterGrade}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Semester Footer Summary */}
                  <div className="transcript-sem-footer">
                    <div>
                      <span>Alınan ECTS: <strong>{semStats.totalEcts}</strong></span>
                      <span style={{ marginLeft: '10px' }}>Puan: <strong>{semStats.totalPoints}</strong></span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
                        GANO: {cumStats.gano}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GpaCalculatorView;
