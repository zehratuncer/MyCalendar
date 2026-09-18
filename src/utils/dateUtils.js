export const DAYS_TR = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar'
];

export const DAYS_SHORT_TR = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

// Convert JS getDay() (0=Sunday, 1=Monday... 6=Saturday) to our Turkish day string
export const getCurrentDayName = (date = new Date()) => {
  const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday
  const map = {
    0: 'Pazar',
    1: 'Pazartesi',
    2: 'Salı',
    3: 'Çarşamba',
    4: 'Perşembe',
    5: 'Cuma',
    6: 'Cumartesi'
  };
  return map[dayIndex];
};

export const formatTurkishDate = (date = new Date()) => {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('tr-TR', options);
};

export const formatTurkishShortDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
};

// Check if a time string "HH:mm" is between start and end
export const isTimeBetween = (time, start, end) => {
  return time >= start && time <= end;
};

// Calculate countdown badge for assignments and exams
export const getDueDateStatus = (dueDateStr, dueTimeStr = '23:59') => {
  if (!dueDateStr) return { label: 'Tarih Yok', status: 'normal', color: 'gray' };
  
  const dueDateTime = new Date(`${dueDateStr}T${dueTimeStr || '23:59'}:00`);
  const now = new Date();
  
  const diffMs = dueDateTime - now;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffMs < 0) {
    return {
      label: 'Süresi Doldu',
      status: 'overdue',
      color: '#ef4444',
      badgeClass: 'badge-danger'
    };
  }

  if (diffHours < 24) {
    if (diffHours <= 1) {
      return {
        label: 'Son 1 saat!',
        status: 'urgent',
        color: '#ef4444',
        badgeClass: 'badge-danger'
      };
    }
    return {
      label: `Bugün (${diffHours} saat kaldı)`,
      status: 'urgent',
      color: '#f97316',
      badgeClass: 'badge-warning'
    };
  }

  if (diffDays === 1) {
    return {
      label: 'Yarın teslim',
      status: 'upcoming',
      color: '#f59e0b',
      badgeClass: 'badge-warning'
    };
  }

  if (diffDays <= 3) {
    return {
      label: `${diffDays} gün kaldı`,
      status: 'soon',
      color: '#3b82f6',
      badgeClass: 'badge-info'
    };
  }

  return {
    label: `${diffDays} gün kaldı`,
    status: 'normal',
    color: '#10b981',
    badgeClass: 'badge-success'
  };
};

// Find current active course or next upcoming course today
export const getTodayScheduleStatus = (courses = []) => {
  const currentDay = getCurrentDayName();
  const todayCourses = courses
    .filter((c) => c.day === currentDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${currentHours}:${currentMinutes}`;

  const activeCourse = todayCourses.find((c) =>
    isTimeBetween(currentTime, c.startTime, c.endTime)
  );

  if (activeCourse) {
    return {
      status: 'active',
      course: activeCourse,
      message: `Şu an derstesiniz: ${activeCourse.name} (${activeCourse.room || 'Derslik'})`
    };
  }

  const nextCourse = todayCourses.find((c) => c.startTime > currentTime);
  if (nextCourse) {
    return {
      status: 'upcoming',
      course: nextCourse,
      message: `Sıradaki ders: ${nextCourse.name} (${nextCourse.startTime})`
    };
  }

  return {
    status: 'done',
    course: null,
    message: todayCourses.length > 0 ? 'Bugünkü tüm dersler tamamlandı 🎉' : 'Bugün dersiniz yok ☕'
  };
};

// Detailed Widget Schedule Information (for Phone & Tablet Widget)
export const getWidgetScheduleInfo = (courses = []) => {
  const currentDay = getCurrentDayName();
  const todayCourses = courses
    .filter((c) => c.day === currentDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${currentHours}:${currentMinutes}`;

  const activeCourse = todayCourses.find((c) =>
    isTimeBetween(currentTime, c.startTime, c.endTime)
  );

  const upcomingCourses = todayCourses.filter((c) => c.startTime > currentTime);
  const nextCourse = upcomingCourses[0] || null;

  return {
    currentDay,
    currentTime,
    todayCourses,
    activeCourse,
    nextCourse,
    upcomingCourses,
    totalTodayCount: todayCourses.length
  };
};

// Detailed Widget Assignments Information (for Phone & Tablet Widget)
export const getWidgetAssignmentsInfo = (assignments = []) => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const pendingAssignments = assignments.filter((a) => !a.completed);

  // Today's assignments
  const todayAssignments = pendingAssignments.filter((a) => a.dueDate === todayStr);

  // Future / upcoming assignments
  const upcomingAssignments = pendingAssignments
    .filter((a) => a.dueDate && a.dueDate > todayStr)
    .sort((a, b) => {
      const dateA = new Date(`${a.dueDate}T${a.dueTime || '23:59'}`);
      const dateB = new Date(`${b.dueDate}T${b.dueTime || '23:59'}`);
      return dateA - dateB;
    });

  // Overdue
  const overdueAssignments = pendingAssignments.filter((a) => a.dueDate && a.dueDate < todayStr);

  return {
    todayStr,
    pendingTotal: pendingAssignments.length,
    todayAssignments,
    upcomingAssignments,
    overdueAssignments
  };
};

// University Letter Grade Scale (Mudanya Üniversitesi ve Standart Harf Notu Tablosu)
export const GRADE_SCALE = {
  'A': { gpa: 4.00, label: 'A (4.00)', minScore: 90, countsInGpa: true },
  'A-': { gpa: 3.70, label: 'A- (3.70)', minScore: 85, countsInGpa: true },
  'B+': { gpa: 3.30, label: 'B+ (3.30)', minScore: 80, countsInGpa: true },
  'B': { gpa: 3.00, label: 'B (3.00)', minScore: 75, countsInGpa: true },
  'B-': { gpa: 2.70, label: 'B- (2.70)', minScore: 70, countsInGpa: true },
  'C+': { gpa: 2.30, label: 'C+ (2.30)', minScore: 65, countsInGpa: true },
  'C': { gpa: 2.00, label: 'C (2.00)', minScore: 60, countsInGpa: true },
  'C-': { gpa: 1.70, label: 'C- (1.70)', minScore: 55, countsInGpa: true },
  'D+': { gpa: 1.30, label: 'D+ (1.30)', minScore: 50, countsInGpa: true },
  'D': { gpa: 1.00, label: 'D (1.00)', minScore: 45, countsInGpa: true },
  'F': { gpa: 0.00, label: 'F (0.00)', minScore: 0, countsInGpa: true },
  'IP': { gpa: 0.00, label: 'IP (Devam Eden/Staj)', minScore: 0, countsInGpa: false },
  'S': { gpa: 0.00, label: 'S (Başarılı/Kredisiz)', minScore: 0, countsInGpa: false },
  'U': { gpa: 0.00, label: 'U (Başarısız)', minScore: 0, countsInGpa: false },
  'EX': { gpa: 0.00, label: 'EX (Muaf)', minScore: 0, countsInGpa: false },
  'W': { gpa: 0.00, label: 'W (Çekildi)', minScore: 0, countsInGpa: false },
  'NA': { gpa: 0.00, label: 'NA (Devamsız)', minScore: 0, countsInGpa: true }
};

export const GRADE_KEYS = Object.keys(GRADE_SCALE);

// Calculate letter grade & GPA from midterm and final
export const calculateGradePoints = (midterm, final, midtermWeight = 40) => {
  const finalWeight = 100 - midtermWeight;
  const rawScore = (Number(midterm) * midtermWeight + Number(final) * finalWeight) / 100;
  
  let letterGrade = 'F';
  let gpa = 0.0;

  if (rawScore >= 90) { letterGrade = 'A'; gpa = 4.0; }
  else if (rawScore >= 85) { letterGrade = 'A-'; gpa = 3.7; }
  else if (rawScore >= 80) { letterGrade = 'B+'; gpa = 3.3; }
  else if (rawScore >= 75) { letterGrade = 'B'; gpa = 3.0; }
  else if (rawScore >= 70) { letterGrade = 'B-'; gpa = 2.7; }
  else if (rawScore >= 65) { letterGrade = 'C+'; gpa = 2.3; }
  else if (rawScore >= 60) { letterGrade = 'C'; gpa = 2.0; }
  else if (rawScore >= 55) { letterGrade = 'C-'; gpa = 1.7; }
  else if (rawScore >= 50) { letterGrade = 'D+'; gpa = 1.3; }
  else if (rawScore >= 45) { letterGrade = 'D'; gpa = 1.0; }
  else { letterGrade = 'F'; gpa = 0.0; }

  return { rawScore: Math.round(rawScore * 10) / 10, letterGrade, gpa };
};

// Check if an assignment belongs to a course (smart matching by ID, code, or name)
export const isAssignmentForCourse = (assignment, course) => {
  if (!assignment || !course) return false;

  // 1. Direct ID Match
  if (assignment.courseId && (String(assignment.courseId) === String(course.id) || String(assignment.courseId) === String(course.code))) {
    return true;
  }

  // 2. Course Code Match (e.g. CENG201)
  if (course.code && assignment.courseName) {
    const cleanCode = String(course.code).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const cleanAssignCourse = String(assignment.courseName).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (cleanCode && cleanAssignCourse.includes(cleanCode)) {
      return true;
    }
  }

  // 3. Name Match with case-insensitive & Turkish locale support
  if (assignment.courseName && course.name) {
    const normAssign = String(assignment.courseName).trim().toLocaleLowerCase('tr-TR');
    const normCourse = String(course.name).trim().toLocaleLowerCase('tr-TR');
    if (normAssign === normCourse || normAssign.includes(normCourse) || normCourse.includes(normAssign)) {
      return true;
    }
  }

  return false;
};

// Convert 4.00 GPA to 100-scale (YÖK ve Üniversite Dönüşüm Formülü)
export const convertGpaTo100 = (gpa) => {
  const numGpa = Number(gpa) || 0;
  if (numGpa <= 0) return 0;
  const converted = (numGpa * 23.5) + 9.5;
  return Math.min(100, Math.max(0, Math.round(converted * 10) / 10));
};
