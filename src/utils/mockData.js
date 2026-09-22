// Initial courses data for 2026-2027 Güz Dönemi (Kariyer Planlama hariç)
export const INITIAL_COURSES = [
  {
    id: 'course-bmb375-mon',
    name: 'Derin Öğrenme',
    code: 'BMB 375',
    instructor: '',
    room: 'AMFI 6',
    day: 'Pazartesi',
    startTime: '11:00',
    endTime: '12:45',
    color: '#6366f1',
    credits: 3,
    notes: ''
  },
  {
    id: 'course-bmb309-mon',
    name: 'Veri Tabanı Yönetimi',
    code: 'BMB 309',
    instructor: '',
    room: 'BİLİŞİM LABORATUVARI-1',
    day: 'Pazartesi',
    startTime: '13:00',
    endTime: '14:45',
    color: '#8b5cf6',
    credits: 4,
    notes: ''
  },
  {
    id: 'course-bmb371-tue',
    name: 'Görüntü İşleme',
    code: 'BMB 371',
    instructor: '',
    room: 'AMFI 6',
    day: 'Salı',
    startTime: '09:00',
    endTime: '11:45',
    color: '#06b6d4',
    credits: 3,
    notes: ''
  },
  {
    id: 'course-muh301-wed-1',
    name: 'Mesleki İngilizce',
    code: 'MUH 301',
    instructor: '',
    room: 'C304',
    day: 'Çarşamba',
    startTime: '11:00',
    endTime: '11:45',
    color: '#3b82f6',
    credits: 2,
    notes: ''
  },
  {
    id: 'course-bmb309-wed',
    name: 'Veri Tabanı Yönetimi',
    code: 'BMB 309',
    instructor: '',
    room: 'C102',
    day: 'Çarşamba',
    startTime: '14:00',
    endTime: '15:45',
    color: '#8b5cf6',
    credits: 4,
    notes: ''
  },
  {
    id: 'course-muh301-wed-2',
    name: 'Mesleki İngilizce',
    code: 'MUH 301',
    instructor: '',
    room: 'AMFİ-2',
    day: 'Çarşamba',
    startTime: '16:00',
    endTime: '17:45',
    color: '#3b82f6',
    credits: 2,
    notes: ''
  },
  {
    id: 'course-bmb375-thu',
    name: 'Derin Öğrenme',
    code: 'BMB 375',
    instructor: '',
    room: 'AMFI 6',
    day: 'Perşembe',
    startTime: '13:00',
    endTime: '14:45',
    color: '#6366f1',
    credits: 3,
    notes: ''
  },
  {
    id: 'course-mudu113-thu',
    name: 'Dijital Pazarlama',
    code: 'MUDU 113',
    instructor: '',
    room: 'C219',
    day: 'Perşembe',
    startTime: '16:00',
    endTime: '17:45',
    color: '#f59e0b',
    credits: 3,
    notes: ''
  },
  {
    id: 'course-bmb303-fri',
    name: 'Bilgisayar Mimarisi',
    code: 'BMB 303',
    instructor: '',
    room: 'ONL',
    day: 'Cuma',
    startTime: '09:00',
    endTime: '11:45',
    color: '#10b981',
    credits: 4,
    notes: 'Online (ONL)'
  }
];

export const INITIAL_ASSIGNMENTS = [];

export const INITIAL_NOTES = [];

export const INITIAL_EXAMS = [];

export const INITIAL_TODOS = [];

export const INITIAL_SEMESTERS = [
  {
    id: 'sem-2024-fall',
    name: '2024-2025 Güz',
    status: 'Onur',
    courses: [
      { id: 'c-1', code: 'ATA 101', name: 'Atatürk İlkeleri ve İnkılap Tarihi I', type: 'Z', ects: 2.0, credits: 2, letterGrade: 'B', gpa: 3.00, midterm: 75, final: 75 },
      { id: 'c-2', code: 'BMB 101', name: 'Algoritma ve Programlama I', type: 'Z', ects: 6.0, credits: 3, letterGrade: 'A-', gpa: 3.70, midterm: 88, final: 85 },
      { id: 'c-3', code: 'BMB 103', name: 'Bilgisayar Mühendisliğine Giriş', type: 'Z', ects: 6.0, credits: 3, letterGrade: 'B', gpa: 3.00, midterm: 78, final: 74 },
      { id: 'c-4', code: 'FZK 121', name: 'Fizik I', type: 'Z', ects: 6.0, credits: 4, letterGrade: 'C', gpa: 2.00, midterm: 60, final: 60 },
      { id: 'c-5', code: 'ING 101', name: 'İngilizce I', type: 'Z', ects: 2.0, credits: 2, letterGrade: 'C+', gpa: 2.30, midterm: 68, final: 65 },
      { id: 'c-6', code: 'KRY 001', name: 'Kariyer Planlama', type: 'Z', ects: 2.0, credits: 1, letterGrade: 'A', gpa: 4.00, midterm: 95, final: 95 },
      { id: 'c-7', code: 'MAT 121', name: 'Matematik I', type: 'Z', ects: 6.0, credits: 4, letterGrade: 'A', gpa: 4.00, midterm: 92, final: 94 },
      { id: 'c-8', code: 'TRD 101', name: 'Türk Dili I', type: 'Z', ects: 2.0, credits: 2, letterGrade: 'A-', gpa: 3.70, midterm: 85, final: 86 }
    ]
  },
  {
    id: 'sem-2024-spring',
    name: '2024-2025 Bahar',
    status: 'Onur',
    courses: [
      { id: 'c-9', code: 'ATA 102', name: 'Atatürk İlkeleri ve İnkılap Tarihi II', type: 'Z', ects: 2.0, credits: 2, letterGrade: 'B-', gpa: 2.70, midterm: 70, final: 72 },
      { id: 'c-10', code: 'BMB 102', name: 'Algoritma ve Programlama II', type: 'Z', ects: 6.0, credits: 3, letterGrade: 'A-', gpa: 3.70, midterm: 86, final: 88 },
      { id: 'c-11', code: 'FZK 122', name: 'Fizik II', type: 'Z', ects: 6.0, credits: 4, letterGrade: 'C-', gpa: 1.70, midterm: 55, final: 56 },
      { id: 'c-12', code: 'ING 102', name: 'İngilizce II', type: 'Z', ects: 2.0, credits: 2, letterGrade: 'B+', gpa: 3.30, midterm: 80, final: 82 },
      { id: 'c-13', code: 'MAT 122', name: 'Matematik II', type: 'Z', ects: 6.0, credits: 4, letterGrade: 'A', gpa: 4.00, midterm: 96, final: 95 },
      { id: 'c-14', code: 'MAT 124', name: 'Doğrusal Cebir', type: 'Z', ects: 5.0, credits: 3, letterGrade: 'B', gpa: 3.00, midterm: 76, final: 78 },
      { id: 'c-15', code: 'TRD 102', name: 'Türk Dili II', type: 'Z', ects: 2.0, credits: 2, letterGrade: 'B+', gpa: 3.30, midterm: 80, final: 81 }
    ]
  },
  {
    id: 'sem-2025-fall',
    name: '2025-2026 Güz',
    status: 'Onur',
    courses: [
      { id: 'c-16', code: 'MUDU 042', name: 'Sosyal Sorumluluk Projesi', type: 'S', ects: 3.0, credits: 2, letterGrade: 'A', gpa: 4.00, midterm: 92, final: 95 },
      { id: 'c-17', code: 'BMB 201', name: 'Veri Yapıları', type: 'Z', ects: 5.0, credits: 4, letterGrade: 'B-', gpa: 2.70, midterm: 72, final: 70 },
      { id: 'c-18', code: 'BMB 203', name: 'Nesne Tabanlı Programlama', type: 'Z', ects: 5.0, credits: 4, letterGrade: 'A', gpa: 4.00, midterm: 90, final: 94 },
      { id: 'c-19', code: 'BMB 207', name: 'Ayrık Yapılar Matematiği', type: 'Z', ects: 5.0, credits: 3, letterGrade: 'B', gpa: 3.00, midterm: 78, final: 76 },
      { id: 'c-20', code: 'BMB 473', name: 'Veri Bilimi', type: 'S', ects: 5.0, credits: 3, letterGrade: 'A', gpa: 4.00, midterm: 95, final: 90 },
      { id: 'c-21', code: 'ISG 201', name: 'İş Sağlığı ve Güvenliği I', type: 'Z', ects: 2.0, credits: 2, letterGrade: 'B+', gpa: 3.30, midterm: 82, final: 80 },
      { id: 'c-22', code: 'MAT 225', name: 'Olasılık ve İstatistik', type: 'Z', ects: 5.0, credits: 3, letterGrade: 'A-', gpa: 3.70, midterm: 86, final: 87 }
    ]
  },
  {
    id: 'sem-2025-spring',
    name: '2025-2026 Bahar',
    status: 'Yüksek Onur',
    courses: [
      { id: 'c-23', code: 'BMB 200', name: 'Staj', type: 'Z', ects: 5.0, credits: 0, letterGrade: 'IP', gpa: 0.00, midterm: 0, final: 0 },
      { id: 'c-24', code: 'BMB 202', name: 'İşletim Sistemleri', type: 'Z', ects: 5.0, credits: 3, letterGrade: 'A', gpa: 4.00, midterm: 94, final: 96 },
      { id: 'c-25', code: 'BMB 204', name: 'Programlama Dilleri', type: 'Z', ects: 5.0, credits: 4, letterGrade: 'B', gpa: 3.00, midterm: 78, final: 76 },
      { id: 'c-26', code: 'BMB 206', name: 'Yapay Öğrenme', type: 'Z', ects: 5.0, credits: 3, letterGrade: 'A', gpa: 4.00, midterm: 92, final: 95 },
      { id: 'c-27', code: 'EEM 208', name: 'Sayısal Elektronik', type: 'Z', ects: 5.0, credits: 4, letterGrade: 'B+', gpa: 3.30, midterm: 82, final: 84 },
      { id: 'c-28', code: 'ISG 202', name: 'İş Sağlığı ve Güvenliği II', type: 'Z', ects: 2.0, credits: 2, letterGrade: 'B+', gpa: 3.30, midterm: 80, final: 85 },
      { id: 'c-29', code: 'MAT 222', name: 'Sayısal Analiz', type: 'Z', ects: 5.0, credits: 3, letterGrade: 'A', gpa: 4.00, midterm: 95, final: 92 }
    ]
  }
];

export const INITIAL_GRADES = [
  { id: 'grade-1', courseName: 'Veri Yapıları', code: 'CENG201', credits: 4, ects: 5, midterm: 82, final: 88, letterGrade: 'A-', gpa: 3.7 },
  { id: 'grade-2', courseName: 'Lineer Cebir', code: 'MATH104', credits: 3, ects: 5, midterm: 70, final: 75, letterGrade: 'B', gpa: 3.0 },
  { id: 'grade-3', courseName: 'Web Programlama', code: 'CENG312', credits: 4, ects: 6, midterm: 90, final: 95, letterGrade: 'A', gpa: 4.0 },
  { id: 'grade-4', courseName: 'Yapay Zeka', code: 'CENG435', credits: 3, ects: 5, midterm: 65, final: 70, letterGrade: 'B-', gpa: 2.7 },
  { id: 'grade-5', courseName: 'Olasılık & İstatistik', code: 'STAT202', credits: 3, ects: 5, midterm: 78, final: 82, letterGrade: 'B+', gpa: 3.3 }
];
