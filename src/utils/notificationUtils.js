// Browser and Web Notification helper
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    alert('Bu tarayıcı bildirimleri desteklemiyor.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        ...options
      });
      return notification;
    } catch (e) {
      console.warn('Bildirim gönderilemedi:', e);
    }
  }
};

export const checkUpcomingDeadlines = (assignments = []) => {
  const pending = assignments.filter((a) => !a.completed && a.dueDate);
  const now = new Date();

  pending.forEach((assignment) => {
    const dueDateTime = new Date(`${assignment.dueDate}T${assignment.dueTime || '23:59'}:00`);
    const diffHours = (dueDateTime - now) / (1000 * 60 * 60);

    // Notify if due in less than 24 hours and not overdue
    if (diffHours > 0 && diffHours <= 24) {
      sendNotification(`⏰ Ödev Hatırlatıcısı: ${assignment.title}`, {
        body: `${assignment.courseName || 'Ders'} ödevi için son ${Math.round(diffHours)} saat! Teslim saati: ${assignment.dueTime || '23:59'}`
      });
    }
  });
};
