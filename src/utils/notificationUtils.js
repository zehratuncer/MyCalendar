// Browser and Web Notification helper
const notifiedCache = new Set();

export const isNotificationSupported = () => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermissionState = () => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission; // 'granted', 'denied', or 'default'
};

export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    alert('Bu tarayıcı web bildirimlerini desteklemiyor.');
    return false;
  }

  if (Notification.permission === 'granted') {
    sendNotification('🔔 Bildirimler Zaten Aktif!', {
      body: 'Yaklaşan ödevler, sınavlar ve ders başlangıç saatleri için bildirim alacaksınız.'
    });
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        sendNotification('🎉 Bildirimler Etkinleştirildi!', {
          body: 'MyCalendar yaklaşan ödev ve sınavlarınızı size zamanında hatırlatacak.'
        });
        return true;
      }
    } catch (e) {
      console.warn('Bildirim izni istenirken hata:', e);
    }
  } else {
    alert('Bildirim izni tarayıcınızda engellenmiş. Tarayıcı ayarlarından (kilit simgesine tıklayarak) izin verebilirsiniz.');
  }

  return false;
};

export const sendNotification = (title, options = {}) => {
  if (isNotificationSupported() && Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        silent: false,
        ...options
      });
      return notification;
    } catch (e) {
      console.warn('Bildirim gönderilemedi:', e);
    }
  }
};

// Check upcoming assignment deadlines (< 24h)
export const checkUpcomingDeadlines = (assignments = []) => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;

  const pending = assignments.filter((a) => !a.completed && a.dueDate);
  const now = new Date();

  pending.forEach((assignment) => {
    const dueDateTime = new Date(`${assignment.dueDate}T${assignment.dueTime || '23:59'}:00`);
    const diffHours = (dueDateTime - now) / (1000 * 60 * 60);

    // If due in less than 24 hours and not overdue
    if (diffHours > 0 && diffHours <= 24) {
      const cacheKey = `assignment-${assignment.id}-${assignment.dueDate}`;
      if (!notifiedCache.has(cacheKey)) {
        notifiedCache.add(cacheKey);
        sendNotification(`⏰ Ödev Teslimi Yaklaşıyor: ${assignment.title}`, {
          body: `${assignment.courseName || 'Ders'} ödevi için son ${Math.round(diffHours)} saat! Teslim saati: ${assignment.dueTime || '23:59'}`
        });
      }
    }
  });
};

// Check upcoming exams (<= 2 days)
export const checkUpcomingExams = (exams = []) => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;

  const now = new Date();
  exams.forEach((exam) => {
    const examDateTime = new Date(`${exam.date}T${exam.time || '10:00'}:00`);
    const diffHours = (examDateTime - now) / (1000 * 60 * 60);
    const diffDays = Math.ceil(diffHours / 24);

    if (diffHours > 0 && diffDays <= 2) {
      const cacheKey = `exam-${exam.id}-${exam.date}`;
      if (!notifiedCache.has(cacheKey)) {
        notifiedCache.add(cacheKey);
        sendNotification(`📝 Sınav Hatırlatıcısı: ${exam.courseName} (${exam.type})`, {
          body: `Sınava ${diffDays === 1 ? '1 gün' : `${diffDays} gün`} kaldı! Salon: ${exam.room || 'Derslik'} - Saat: ${exam.time || '10:00'}`
        });
      }
    }
  });
};
