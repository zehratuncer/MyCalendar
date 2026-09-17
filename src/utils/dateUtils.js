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

// Calculate letter grade & GPA from midterm and final
export const calculateGradePoints = (midterm, final, midtermWeight = 40) => {
  const finalWeight = 100 - midtermWeight;
  const rawScore = (Number(midterm) * midtermWeight + Number(final) * finalWeight) / 100;
  
  let letterGrade = 'FF';
  let gpa = 0.0;

  if (rawScore >= 90) { letterGrade = 'AA'; gpa = 4.0; }
  else if (rawScore >= 85) { letterGrade = 'BA'; gpa = 3.5; }
  else if (rawScore >= 80) { letterGrade = 'BB'; gpa = 3.0; }
  else if (rawScore >= 75) { letterGrade = 'CB'; gpa = 2.5; }
  else if (rawScore >= 70) { letterGrade = 'CC'; gpa = 2.0; }
  else if (rawScore >= 60) { letterGrade = 'DC'; gpa = 1.5; }
  else if (rawScore >= 50) { letterGrade = 'DD'; gpa = 1.0; }
  else if (rawScore >= 40) { letterGrade = 'FD'; gpa = 0.5; }
  else { letterGrade = 'FF'; gpa = 0.0; }

  return { rawScore: Math.round(rawScore * 10) / 10, letterGrade, gpa };
};
