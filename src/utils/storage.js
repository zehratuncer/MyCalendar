import { INITIAL_COURSES, INITIAL_ASSIGNMENTS, INITIAL_NOTES, INITIAL_EXAMS, INITIAL_GRADES, INITIAL_TODOS } from './mockData';

const KEYS = {
  COURSES: 'mycal_courses_v1',
  ASSIGNMENTS: 'mycal_assignments_v1',
  NOTES: 'mycal_notes_v1',
  TODOS: 'mycal_todos_v1',
  EXAMS: 'mycal_exams_v1',
  GRADES: 'mycal_grades_v1',
  THEME: 'mycal_theme_v1',
  SETTINGS: 'mycal_settings_v1',
  SCRATCHPAD: 'mycal_scratchpad_v1'
};

export const getStoredItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`LocalStorage read error for key: ${key}`, e);
    return fallback;
  }
};

export const setStoredItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`LocalStorage write error for key: ${key}`, e);
  }
};

export const loadAppData = () => {
  return {
    courses: getStoredItem(KEYS.COURSES, INITIAL_COURSES),
    assignments: getStoredItem(KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS),
    notes: getStoredItem(KEYS.NOTES, INITIAL_NOTES),
    todos: getStoredItem(KEYS.TODOS, INITIAL_TODOS),
    exams: getStoredItem(KEYS.EXAMS, INITIAL_EXAMS),
    grades: getStoredItem(KEYS.GRADES, INITIAL_GRADES),
    scratchpad: getStoredItem(KEYS.SCRATCHPAD, '📌 Burası anlık hızlı karalama defteriniz. Aklınıza gelen şeyleri hemen yazın, otomatik kaydedilir!'),
    theme: getStoredItem(KEYS.THEME, 'dark'),
    settings: getStoredItem(KEYS.SETTINGS, {
      notificationsEnabled: false,
      reminderHoursBefore: 24,
      studentName: 'Öğrenci',
      semester: '2026-2027 Güz Dönemi'
    })
  };
};

export const saveAppData = (data) => {
  if (data.courses) setStoredItem(KEYS.COURSES, data.courses);
  if (data.assignments) setStoredItem(KEYS.ASSIGNMENTS, data.assignments);
  if (data.notes) setStoredItem(KEYS.NOTES, data.notes);
  if (data.todos) setStoredItem(KEYS.TODOS, data.todos);
  if (data.exams) setStoredItem(KEYS.EXAMS, data.exams);
  if (data.grades) setStoredItem(KEYS.GRADES, data.grades);
  if (data.scratchpad !== undefined) setStoredItem(KEYS.SCRATCHPAD, data.scratchpad);
  if (data.theme) setStoredItem(KEYS.THEME, data.theme);
  if (data.settings) setStoredItem(KEYS.SETTINGS, data.settings);
};

// JSON Export for Multi-device transfer (phone <-> laptop <-> tablet)
export const exportBackupJSON = (appData) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute("download", `MyCalendar_Yedek_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const importBackupJSON = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.courses && Array.isArray(data.courses)) {
      saveAppData(data);
      return { success: true, data };
    }
    return { success: false, error: 'Geçersiz yedek dosyası formatı.' };
  } catch (err) {
    return { success: false, error: 'JSON dosyası okunamadı: ' + err.message };
  }
};

export const resetToDefaults = () => {
  localStorage.clear();
  return loadAppData();
};
