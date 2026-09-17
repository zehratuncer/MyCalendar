// Initial sample mock data for school & student calendar
export const INITIAL_COURSES = [
  {
    id: 'course-1',
    name: 'Veri Yapıları ve Algoritmalar',
    code: 'CENG201',
    instructor: 'Prof. Dr. Ahmet Yılmaz',
    room: 'Amfi 3 (Müh. Fak.)',
    day: 'Pazartesi', // Pazartesi, Salı, Çarşamba, Perşembe, Cuma, Cumartesi, Pazar
    startTime: '09:00',
    endTime: '11:45',
    color: '#6366f1', // Indigo
    credits: 4,
    notes: 'Lab uygulamaları Çarşamba günleri yapılacaktır. Ödevler C++ ile yazılacak.'
  },
  {
    id: 'course-2',
    name: 'Lineer Cebir',
    code: 'MATH104',
    instructor: 'Doç. Dr. Selin Kaya',
    room: 'D-204',
    day: 'Pazartesi',
    startTime: '13:30',
    endTime: '15:15',
    color: '#3b82f6', // Blue
    credits: 3,
    notes: 'Matrisler, determinantlar ve özdeğerler konusu önemli.'
  },
  {
    id: 'course-3',
    name: 'Web Programlama & Tasarım',
    code: 'CENG312',
    instructor: 'Dr. Öğr. Üyesi Mehmet Akif',
    room: 'Lab 201',
    day: 'Salı',
    startTime: '10:00',
    endTime: '12:45',
    color: '#10b981', // Emerald
    credits: 4,
    notes: 'Dönem sonu projesi React & Node.js ile hazırlanacak.'
  },
  {
    id: 'course-4',
    name: 'Yapay Zekaya Giriş',
    code: 'CENG435',
    instructor: 'Prof. Dr. Ayşe Demir',
    room: 'D-102',
    day: 'Çarşamba',
    startTime: '14:00',
    endTime: '16:45',
    color: '#f59e0b', // Amber
    credits: 3,
    notes: 'Arama algoritmaları ve makine öğrenmesi temelleri.'
  },
  {
    id: 'course-5',
    name: 'Olasılık ve İstatistik',
    code: 'STAT202',
    instructor: 'Doç. Dr. Emre Çetin',
    room: 'Amfi 1',
    day: 'Perşembe',
    startTime: '09:30',
    endTime: '12:15',
    color: '#ec4899', // Pink
    credits: 3,
    notes: 'Haftalık problem setleri çözülecek.'
  },
  {
    id: 'course-6',
    name: 'Veritabanı Yönetim Sistemleri',
    code: 'CENG305',
    instructor: 'Dr. Burak Şimşek',
    room: 'Lab 103',
    day: 'Cuma',
    startTime: '13:00',
    endTime: '15:45',
    color: '#8b5cf6', // Purple
    credits: 4,
    notes: 'PostgreSQL ve SQL sorgulama pratikleri.'
  }
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: 'assign-1',
    title: 'İkili Arama Ağacı (BST) Implementasyonu',
    courseId: 'course-1',
    courseName: 'Veri Yapıları ve Algoritmalar',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
    dueTime: '23:59',
    priority: 'high', // 'high', 'medium', 'low'
    completed: false,
    description: 'C++ kullanarak BST ekleme, silme ve gezinme fonksiyonlarını yazınız. GitHub linki teslim edilecek.',
    tags: ['Ödev', 'C++', 'BST']
  },
  {
    id: 'assign-2',
    title: 'React ile Responsive Takvim Bileşeni',
    courseId: 'course-3',
    courseName: 'Web Programlama & Tasarım',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
    dueTime: '17:00',
    priority: 'medium',
    completed: false,
    description: 'Modern CSS ve React hooks kullanarak haftalık görünüm hazırlayınız.',
    tags: ['Proje', 'Frontend']
  },
  {
    id: 'assign-3',
    title: 'Lineer Denklem Sistemleri Problem Seti #3',
    courseId: 'course-2',
    courseName: 'Lineer Cebir',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    dueTime: '12:00',
    priority: 'high',
    completed: false,
    description: 'Kitabın 4. bölüm sonundaki 12-25 arası çift numaralı sorular çözülecek.',
    tags: ['Problem Seti']
  },
  {
    id: 'assign-4',
    title: 'SQL Normalizasyon Alıştırmaları',
    courseId: 'course-6',
    courseName: 'Veritabanı Yönetim Sistemleri',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueTime: '23:59',
    priority: 'low',
    completed: true,
    description: '1NF, 2NF ve 3NF dönüşüm raporu hazırlandı.',
    tags: ['Rapor']
  }
];

export const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: 'Algoritma Dersi Vize Konuları',
    content: '1. Asimptotik Notasyon (Big-O)\n2. Stack & Queue uygulamaları\n3. Recursion ve Master Teoremi\n4. İkili Arama Ağaçları (BST) ve AVL dengeleme',
    category: 'Ders Notu', // 'Ders Notu', 'Fikir', 'Hatırlatma', 'Proje', 'Genel'
    color: '#fef3c7', // warm yellow
    pinned: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'note-2',
    title: 'Proje Fikri: Yapay Zeka ile Not Özetleyici',
    content: 'Ders ses kayıtlarını Whisper ile metne döküp Gemini API ile madde madde özet çıkaran küçük bir mobil arayüz geliştirilebilir. Python + FastAPI backend.',
    category: 'Fikir',
    color: '#e0e7ff', // soft indigo
    pinned: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'note-3',
    title: 'Kütüphane Kitap İade Tarihi',
    content: 'Algoritmaya Giriş (CLRS) kitabını Cuma günü saat 16:00 dan önce merkez kütüphaneye teslim etmeyi unutma!',
    category: 'Hatırlatma',
    color: '#fee2e2', // soft rose
    pinned: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'note-4',
    title: 'Staj Başvuru Evrakları',
    content: '- Güncel Transkript (Öğrenci işlerinden onaylı)\n- İngilizce CV (PDF formatında)\n- Zorunlu Staj Belgesi (Bölüm sekreterliğine imzalatılacak)',
    category: 'Genel',
    color: '#dcfce7', // soft green
    pinned: false,
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_EXAMS = [
  {
    id: 'exam-1',
    courseName: 'Veri Yapıları ve Algoritmalar',
    type: 'Vize', // 'Vize', 'Final', 'Büt', 'Quiz'
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:30',
    durationMinutes: 90,
    room: 'Mühendislik Amfi 1 & 2',
    topics: 'Hafta 1 - Hafta 6 arası tüm konular, Tree gezinmeleri ve kod yazımı.',
    weight: '%30'
  },
  {
    id: 'exam-2',
    courseName: 'Lineer Cebir',
    type: 'Vize',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '14:00',
    durationMinutes: 75,
    room: 'D-204',
    topics: 'Matris işlemleri, Gauss eliminasyonu, Vektör uzayları.',
    weight: '%40'
  },
  {
    id: 'exam-3',
    courseName: 'Web Programlama & Tasarım',
    type: 'Quiz',
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '11:15',
    durationMinutes: 30,
    room: 'Lab 201',
    topics: 'JavaScript ES6+, DOM Manipülasyonu ve Event Handling.',
    weight: '%15'
  }
];

export const INITIAL_TODOS = [
  {
    id: 'todo-1',
    title: 'Veri Yapıları 3. slayt özetini çıkar',
    description: 'Ağaçlar ve ikili arama ağacı bölümünü tekrar et.',
    timeframe: 'today', // 'today', 'this_week', 'this_month', 'someday'
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '18:00',
    priority: 'high', // 'high', 'medium', 'low'
    courseId: 'course-1',
    courseName: 'Veri Yapıları ve Algoritmalar',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'todo-2',
    title: 'Lineer Cebir ödev sorularını çöz',
    description: 'Bölüm sonu çift numaralı sorular.',
    timeframe: 'today',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '21:00',
    priority: 'medium',
    courseId: 'course-2',
    courseName: 'Lineer Cebir',
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'todo-3',
    title: 'Web Tasarım projesi için React bileşenlerini tasarla',
    description: 'Header, ders programı gridi ve modal pencereler.',
    timeframe: 'this_week',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueTime: '23:59',
    priority: 'high',
    courseId: 'course-3',
    courseName: 'Web Programlama & Tasarım',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'todo-4',
    title: 'Kütüphaneden İstatistik soru bankası al',
    description: 'Vize öncesi pratik yapmak için.',
    timeframe: 'this_week',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueTime: '15:30',
    priority: 'low',
    courseId: 'course-5',
    courseName: 'Olasılık ve İstatistik',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'todo-5',
    title: 'Yapay Zeka vize konularını tamamla ve kod pratiği yap',
    description: 'A* ve Minimax algoritmalarının Python implementasyonları.',
    timeframe: 'this_month',
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueTime: '20:00',
    priority: 'high',
    courseId: 'course-4',
    courseName: 'Yapay Zekaya Giriş',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'todo-6',
    title: 'Zorunlu staj başvuru evraklarını bölüm sekreterliğine ver',
    description: 'İmzalı staj kabul formu ve transkript.',
    timeframe: 'this_month',
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueTime: '16:00',
    priority: 'medium',
    courseId: '',
    courseName: '',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_GRADES = [
  { id: 'grade-1', courseName: 'Veri Yapıları', code: 'CENG201', credits: 4, midterm: 82, final: 88, letterGrade: 'AA', gpa: 4.0 },
  { id: 'grade-2', courseName: 'Lineer Cebir', code: 'MATH104', credits: 3, midterm: 70, final: 75, letterGrade: 'BB', gpa: 3.0 },
  { id: 'grade-3', courseName: 'Web Programlama', code: 'CENG312', credits: 4, midterm: 90, final: 95, letterGrade: 'AA', gpa: 4.0 },
  { id: 'grade-4', courseName: 'Yapay Zeka', code: 'CENG435', credits: 3, midterm: 65, final: 70, letterGrade: 'CB', gpa: 2.5 },
  { id: 'grade-5', courseName: 'Olasılık & İstatistik', code: 'STAT202', credits: 3, midterm: 78, final: 82, letterGrade: 'BA', gpa: 3.5 }
];
