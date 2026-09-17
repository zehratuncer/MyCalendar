import React, { useState } from 'react';
import { Calculator, Plus, Trash2, HelpCircle, Award, Target, Sparkles } from 'lucide-react';
import { calculateGradePoints } from '../utils/dateUtils';

export const GpaCalculatorView = ({ grades, setGrades, courses }) => {
  const [midtermWeight, setMidtermWeight] = useState(40);
  const [targetDesiredGpa, setTargetDesiredGpa] = useState(3.5);

  // Target solver state
  const [targetMidterm, setTargetMidterm] = useState(65);
  const [targetGoalGrade, setTargetGoalGrade] = useState('AA'); // AA=90, BA=85, BB=80, CB=75, CC=70

  const handleUpdateGrade = (id, field, value) => {
    setGrades(
      grades.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'midterm' || field === 'final') {
            const m = field === 'midterm' ? value : item.midterm;
            const f = field === 'final' ? value : item.final;
            const res = calculateGradePoints(m, f, midtermWeight);
            updated.letterGrade = res.letterGrade;
            updated.gpa = res.gpa;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleAddRow = () => {
    const newRow = {
      id: `grade-${Date.now()}`,
      courseName: 'Yeni Ders',
      code: '',
      credits: 3,
      midterm: 70,
      final: 70,
      letterGrade: 'CC',
      gpa: 2.0
    };
    setGrades([...grades, newRow]);
  };

  const handleDeleteRow = (id) => {
    setGrades(grades.filter((g) => g.id !== id));
  };

  // Calculate Weighted GPA (GANO / GNO)
  const totalCredits = grades.reduce((acc, g) => acc + (Number(g.credits) || 0), 0);
  const totalPoints = grades.reduce(
    (acc, g) => acc + (Number(g.credits) || 0) * (Number(g.gpa) || 0),
    0
  );
  const calculatedGpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

  // Solve required final score for target letter grade
  const targetThresholds = { AA: 90, BA: 85, BB: 80, CB: 75, CC: 70, DC: 60, DD: 50 };
  const targetScoreNeeded = targetThresholds[targetGoalGrade] || 70;
  const finalWeight = 100 - midtermWeight;
  const requiredFinalScore = Math.ceil(
    (targetScoreNeeded - (Number(targetMidterm) * midtermWeight) / 100) / (finalWeight / 100)
  );

  return (
    <div>
      {/* Header */}
      <div className="view-header">
        <div className="view-title-group">
          <h1>
            <Calculator className="text-primary" size={28} />
            Not Ortalaması & Harf Notu Hesaplayıcı
          </h1>
          <p className="view-subtitle">
            Vize ve Final notlarınızı girerek dönem ağırlıklı not ortalamanızı (GNO/GANO) anında simüle edin.
          </p>
        </div>

        <button onClick={handleAddRow} className="btn-primary">
          <Plus size={18} />
          <span>Ders Ekle</span>
        </button>
      </div>

      {/* GPA Banner */}
      <div className="gpa-summary-card">
        <div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Dönem Ağırlıklı Not Ortalaması (GNO)
          </div>
          <div className="gpa-score-display">{calculatedGpa} <span style={{ fontSize: '1.4rem', opacity: 0.8 }}>/ 4.00</span></div>
          <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '4px' }}>
            Toplam {totalCredits} Kredi / AKTS üzerinden hesaplandı
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={18} />
            <span>Akademik Durum</span>
          </div>
          <div style={{ fontSize: '0.9rem' }}>
            {Number(calculatedGpa) >= 3.5 ? '🌟 Yüksek Onur Öğrencisi' :
             Number(calculatedGpa) >= 3.0 ? '🎯 Onur Öğrencisi' :
             Number(calculatedGpa) >= 2.0 ? '✅ Başarılı' : '⚠️ Sınırda / Şartlı'}
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="grades-table-container" style={{ marginBottom: '28px' }}>
        <table className="grades-table">
          <thead>
            <tr>
              <th>Ders Adı</th>
              <th style={{ width: '90px' }}>Kredi (AKTS)</th>
              <th style={{ width: '100px' }}>Vize (%{midtermWeight})</th>
              <th style={{ width: '100px' }}>Final (%{100 - midtermWeight})</th>
              <th style={{ width: '100px' }}>Harf Notu</th>
              <th style={{ width: '80px' }}>Katsayı</th>
              <th style={{ width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id}>
                <td>
                  <input
                    type="text"
                    value={grade.courseName}
                    onChange={(e) => handleUpdateGrade(grade.id, 'courseName', e.target.value)}
                    className="form-input"
                    style={{ padding: '6px 10px', fontSize: '0.9rem' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={grade.credits}
                    onChange={(e) => handleUpdateGrade(grade.id, 'credits', Number(e.target.value))}
                    className="form-input"
                    style={{ padding: '6px 10px', textAlign: 'center' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={grade.midterm}
                    onChange={(e) => handleUpdateGrade(grade.id, 'midterm', Number(e.target.value))}
                    className="form-input"
                    style={{ padding: '6px 10px', textAlign: 'center' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={grade.final}
                    onChange={(e) => handleUpdateGrade(grade.id, 'final', Number(e.target.value))}
                    className="form-input"
                    style={{ padding: '6px 10px', textAlign: 'center' }}
                  />
                </td>
                <td>
                  <span className={`badge ${['AA', 'BA', 'BB'].includes(grade.letterGrade) ? 'badge-success' : ['CB', 'CC'].includes(grade.letterGrade) ? 'badge-info' : 'badge-danger'}`} style={{ fontSize: '0.85rem' }}>
                    {grade.letterGrade || 'FF'}
                  </span>
                </td>
                <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {grade.gpa?.toFixed(1) || '0.0'}
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteRow(grade.id)}
                    style={{ color: '#ef4444', opacity: 0.8, cursor: 'pointer' }}
                    title="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Target Final Calculator Widget ("Finalden Kaç Almalıyım?") */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Target size={22} color="var(--primary)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>🎯 "Finalden Kaç Almam Lazım?" Hesaplayıcı</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'center' }}>
          <div>
            <label className="form-label">Vize Notunuz:</label>
            <input
              type="number"
              min="0"
              max="100"
              value={targetMidterm}
              onChange={(e) => setTargetMidterm(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Hedef Harf Notu:</label>
            <select
              value={targetGoalGrade}
              onChange={(e) => setTargetGoalGrade(e.target.value)}
              className="form-select"
            >
              <option value="AA">AA (90+ Puan)</option>
              <option value="BA">BA (85+ Puan)</option>
              <option value="BB">BB (80+ Puan)</option>
              <option value="CB">CB (75+ Puan)</option>
              <option value="CC">CC (70+ Puan)</option>
              <option value="DC">DC (60+ Puan)</option>
              <option value="DD">DD (50+ Geçme)</option>
            </select>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Gereken Final Notu:</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: requiredFinalScore > 100 ? '#ef4444' : 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
              {requiredFinalScore > 100 ? `İmkansız (${requiredFinalScore})` : requiredFinalScore <= 0 ? '0 (Zaten geçtiniz!)' : requiredFinalScore}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GpaCalculatorView;
