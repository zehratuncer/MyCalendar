import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  StickyNote,
  Pin,
  Search,
  Copy,
  Check,
  Sparkles,
  Calendar,
  Clock,
  BookOpen,
  Filter,
  CheckSquare,
  Flame,
  AlertTriangle
} from 'lucide-react';
import NoteModal from './NoteModal';
import TodoModal from './TodoModal';

export const NotesView = ({
  notes = [],
  setNotes,
  todos = [],
  setTodos,
  scratchpad,
  setScratchpad,
  courses = []
}) => {
  // Main view mode: 'todos' | 'notes'
  const [activeMode, setActiveMode] = useState('todos');

  // Todo State
  const [todoFilter, setTodoFilter] = useState('today'); // 'today' | 'this_week' | 'this_month' | 'all' | 'completed'
  const [quickTodoTitle, setQuickTodoTitle] = useState('');
  const [quickPriority, setQuickPriority] = useState('medium');
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  // Note State
  const [selectedNoteCategory, setSelectedNoteCategory] = useState('all');
  const [noteSearchQuery, setNoteSearchQuery] = useState('');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [copiedNoteId, setCopiedNoteId] = useState(null);

  // ==========================================
  // TO-DO LOGIC & HANDLERS
  // ==========================================

  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleSaveTodo = (item) => {
    if (editingTodo) {
      setTodos(todos.map((t) => (t.id === item.id ? item : t)));
    } else {
      setTodos([item, ...todos]);
    }
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const handleQuickAddTodo = (e) => {
    e.preventDefault();
    if (!quickTodoTitle.trim()) return;

    const newTodo = {
      id: `todo-${Date.now()}`,
      title: quickTodoTitle.trim(),
      description: '',
      timeframe: todoFilter === 'completed' || todoFilter === 'all' ? 'today' : todoFilter,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '23:59',
      priority: quickPriority,
      courseId: '',
      courseName: '',
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTodos([newTodo, ...todos]);
    setQuickTodoTitle('');
  };

  // Helper date filtering
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTodos = todos.filter((item) => {
    if (todoFilter === 'completed') {
      return item.completed;
    }
    if (todoFilter === 'all') {
      return true;
    }
    if (todoFilter === 'today') {
      return (
        !item.completed &&
        (item.timeframe === 'today' || item.dueDate === todayStr)
      );
    }
    if (todoFilter === 'this_week') {
      return (
        !item.completed &&
        (item.timeframe === 'this_week' || item.timeframe === 'today')
      );
    }
    if (todoFilter === 'this_month') {
      return (
        !item.completed &&
        (item.timeframe === 'this_month' || item.timeframe === 'this_week' || item.timeframe === 'today')
      );
    }
    return true;
  });

  // Calculate statistics for Today
  const todayTodos = todos.filter(
    (t) => t.timeframe === 'today' || t.dueDate === todayStr
  );
  const completedTodayCount = todayTodos.filter((t) => t.completed).length;
  const todayTotalCount = todayTodos.length;
  const todayPercent =
    todayTotalCount > 0
      ? Math.round((completedTodayCount / todayTotalCount) * 100)
      : 0;

  // Counts for tabs
  const countToday = todos.filter(
    (t) => !t.completed && (t.timeframe === 'today' || t.dueDate === todayStr)
  ).length;
  const countWeek = todos.filter(
    (t) => !t.completed && (t.timeframe === 'this_week' || t.timeframe === 'today')
  ).length;
  const countMonth = todos.filter(
    (t) =>
      !t.completed &&
      (t.timeframe === 'this_month' || t.timeframe === 'this_week' || t.timeframe === 'today')
  ).length;
  const countCompleted = todos.filter((t) => t.completed).length;

  // ==========================================
  // NOTE LOGIC & HANDLERS
  // ==========================================

  const handleSaveNote = (item) => {
    if (editingNote) {
      setNotes(notes.map((n) => (n.id === item.id ? item : n)));
    } else {
      setNotes([item, ...notes]);
    }
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedNoteId(id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  const filteredNotes = notes
    .filter((n) => {
      if (selectedNoteCategory !== 'all' && n.category !== selectedNoteCategory)
        return false;
      if (noteSearchQuery.trim()) {
        const q = noteSearchQuery.toLowerCase();
        const matchTitle = n.title?.toLowerCase().includes(q);
        const matchContent = n.content?.toLowerCase().includes(q);
        return matchTitle || matchContent;
      }
      return true;
    })
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const noteCategories = [
    'all',
    'Ders Notu',
    'Fikir',
    'Hatırlatma',
    'Proje',
    'Genel'
  ];

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="priority-badge high">Yüksek</span>;
      case 'low':
        return <span className="priority-badge low">Düşük</span>;
      case 'medium':
      default:
        return <span className="priority-badge medium">Orta</span>;
    }
  };

  const getTimeframeLabel = (tf) => {
    switch (tf) {
      case 'today':
        return '🌟 Bugün';
      case 'this_week':
        return '📅 Bu Hafta';
      case 'this_month':
        return '🗓️ Bu Ay';
      default:
        return '📌 Planlanan';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="view-header">
        <div className="view-title-group">
          <h1>
            <CheckSquare className="text-primary" size={28} />
            Yapılacaklar & Notlar
          </h1>
          <p className="view-subtitle">
            Günlük, haftalık ve aylık hedeflerinizi organize edin; ders notlarınızı ve anlık fikirlerinizi kaydedin.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {activeMode === 'todos' ? (
            <button
              onClick={() => {
                setEditingTodo(null);
                setIsTodoModalOpen(true);
              }}
              className="btn-primary"
            >
              <Plus size={18} />
              <span>Yeni Görev Ekle</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingNote(null);
                setIsNoteModalOpen(true);
              }}
              className="btn-primary"
            >
              <Plus size={18} />
              <span>Yeni Not Yaz</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Mode Switcher Tabs */}
      <div className="tab-switcher-wrapper" style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setActiveMode('todos')}
          className={`tab-switch-btn ${activeMode === 'todos' ? 'active' : ''}`}
        >
          <CheckSquare size={18} />
          <span>Yapılacaklar (To-Do List)</span>
          {countToday > 0 && <span className="tab-badge">{countToday}</span>}
        </button>

        <button
          onClick={() => setActiveMode('notes')}
          className={`tab-switch-btn ${activeMode === 'notes' ? 'active' : ''}`}
        >
          <StickyNote size={18} />
          <span>Renkli Notlar & Karalama</span>
          <span className="tab-badge secondary">{notes.length}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. TO-DO LIST VIEW MODE                                                  */}
      {/* ========================================================================= */}
      {activeMode === 'todos' && (
        <div className="todo-module-container">
          {/* Today Progress Overview Card */}
          <div className="todo-progress-card">
            <div className="todo-progress-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="progress-icon-box">
                  <Flame size={20} color="#f59e0b" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                    Günün Hedefleri ve İlerleme
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Bugün için planlanan {todayTotalCount} görevden {completedTodayCount} tanesi tamamlandı.
                  </p>
                </div>
              </div>

              <div className="progress-percentage-pill">
                %{todayPercent} Tamamlandı
              </div>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${todayPercent}%` }}
              />
            </div>
          </div>

          {/* Timeframe Filter Bar */}
          <div className="timeframe-nav-bar">
            <button
              onClick={() => setTodoFilter('today')}
              className={`timeframe-pill ${todoFilter === 'today' ? 'active' : ''}`}
            >
              <span>🌟 Bugün</span>
              {countToday > 0 && <span className="pill-count">{countToday}</span>}
            </button>

            <button
              onClick={() => setTodoFilter('this_week')}
              className={`timeframe-pill ${todoFilter === 'this_week' ? 'active' : ''}`}
            >
              <span>📅 Bu Hafta</span>
              {countWeek > 0 && <span className="pill-count">{countWeek}</span>}
            </button>

            <button
              onClick={() => setTodoFilter('this_month')}
              className={`timeframe-pill ${todoFilter === 'this_month' ? 'active' : ''}`}
            >
              <span>🗓️ Bu Ay</span>
              {countMonth > 0 && <span className="pill-count">{countMonth}</span>}
            </button>

            <button
              onClick={() => setTodoFilter('all')}
              className={`timeframe-pill ${todoFilter === 'all' ? 'active' : ''}`}
            >
              <span>📌 Tüm Görevler</span>
              <span className="pill-count">{todos.length}</span>
            </button>

            <button
              onClick={() => setTodoFilter('completed')}
              className={`timeframe-pill ${todoFilter === 'completed' ? 'active' : ''}`}
            >
              <span>✅ Tamamlananlar</span>
              {countCompleted > 0 && (
                <span className="pill-count success">{countCompleted}</span>
              )}
            </button>
          </div>

          {/* Quick Add Bar */}
          <form onSubmit={handleQuickAddTodo} className="quick-add-bar">
            <div className="quick-add-input-wrapper">
              <Plus size={18} className="quick-add-icon" />
              <input
                type="text"
                value={quickTodoTitle}
                onChange={(e) => setQuickTodoTitle(e.target.value)}
                placeholder={
                  todoFilter === 'today'
                    ? "Bugün için yeni bir yapılacak görev yaz ve Enter'a bas..."
                    : todoFilter === 'this_week'
                    ? "Bu hafta için yapılacak görevi yaz ve Enter'a bas..."
                    : todoFilter === 'this_month'
                    ? "Bu ay için hedef görevi yaz ve Enter'a bas..."
                    : "Yeni görev yaz ve Enter'a bas..."
                }
                className="quick-add-input"
              />
            </div>

            <div className="quick-add-controls">
              <select
                value={quickPriority}
                onChange={(e) => setQuickPriority(e.target.value)}
                className="quick-add-select"
                title="Öncelik Seçimi"
              >
                <option value="high">🔴 Yüksek</option>
                <option value="medium">🟡 Orta</option>
                <option value="low">🔵 Düşük</option>
              </select>

              <button type="submit" className="btn-primary quick-add-btn">
                <span>Ekle</span>
              </button>
            </div>
          </form>

          {/* Todo Item Cards List */}
          {filteredTodos.length === 0 ? (
            <div className="glass-panel empty-state-box">
              <CheckCircle2 size={48} className="empty-state-icon text-muted" />
              <h4>Bu filtrede henüz görev yok</h4>
              <p>
                {todoFilter === 'completed'
                  ? 'Tamamladığınız görevler burada listelenir.'
                  : 'Yukarıdaki hızlı ekleme kutusundan anında yeni bir yapılacak iş ekleyebilirsiniz.'}
              </p>
            </div>
          ) : (
            <div className="todo-items-list">
              {filteredTodos.map((todo) => {
                const isCompleted = todo.completed;
                return (
                  <div
                    key={todo.id}
                    className={`todo-card ${isCompleted ? 'completed' : ''}`}
                  >
                    <div className="todo-card-left">
                      <button
                        type="button"
                        onClick={() => handleToggleTodo(todo.id)}
                        className={`todo-checkbox ${isCompleted ? 'checked' : ''}`}
                        aria-label={isCompleted ? 'Görevi geri al' : 'Görevi tamamla'}
                      >
                        {isCompleted ? <Check size={14} /> : null}
                      </button>

                      <div className="todo-text-group">
                        <div
                          className="todo-title"
                          onClick={() => {
                            setEditingTodo(todo);
                            setIsTodoModalOpen(true);
                          }}
                        >
                          {todo.title}
                        </div>

                        {todo.description && (
                          <p className="todo-description">{todo.description}</p>
                        )}

                        <div className="todo-badges-row">
                          {/* Timeframe badge */}
                          <span className="todo-meta-tag timeframe">
                            {getTimeframeLabel(todo.timeframe)}
                          </span>

                          {/* Due Date & Time */}
                          {todo.dueDate && (
                            <span className="todo-meta-tag date">
                              <Calendar size={12} />
                              <span>{todo.dueDate}</span>
                              {todo.dueTime && <span>• {todo.dueTime}</span>}
                            </span>
                          )}

                          {/* Priority badge */}
                          {getPriorityBadge(todo.priority)}

                          {/* Associated Course Tag */}
                          {todo.courseName && (
                            <span className="todo-meta-tag course">
                              <BookOpen size={12} />
                              <span>{todo.courseName}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="todo-card-actions">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTodo(todo);
                          setIsTodoModalOpen(true);
                        }}
                        className="btn-text-action"
                        title="Düzenle"
                      >
                        Düzenle
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STICKY NOTES & SCRATCHPAD VIEW MODE                                    */}
      {/* ========================================================================= */}
      {activeMode === 'notes' && (
        <div className="notes-module-container">
          {/* Instant Scratchpad */}
          <div className="scratchpad-box">
            <div className="scratchpad-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--primary)" />
                <span>⚡ Anlık Hızlı Karalama Defteri (Otomatik Kaydedilir)</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Cihazlar arası anında senkronize
              </span>
            </div>
            <textarea
              value={scratchpad}
              onChange={(e) => setScratchpad(e.target.value)}
              placeholder="Aklınıza gelen fikirleri, ders notu taslaklarını veya geçici bilgileri hemen buraya yazın..."
              className="scratchpad-textarea"
            />
          </div>

          {/* Filter & Search Bar for Notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="filter-pills-bar">
                {noteCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedNoteCategory(cat)}
                    className={`filter-pill ${selectedNoteCategory === cat ? 'active' : ''}`}
                  >
                    {cat === 'all' ? `Tüm Notlar (${notes.length})` : cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                type="text"
                placeholder="Not başlıklarında veya içeriğinde ara..."
                value={noteSearchQuery}
                onChange={(e) => setNoteSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '38px', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          {/* Notes Grid */}
          {filteredNotes.length === 0 ? (
            <div className="glass-panel empty-state-box">
              <StickyNote size={48} className="empty-state-icon text-muted" />
              <h4>Not bulunamadı</h4>
              <p>Yeni bir ders notu veya fikir eklemek için butona tıklayın.</p>
              <button
                onClick={() => {
                  setEditingNote(null);
                  setIsNoteModalOpen(true);
                }}
                className="btn-primary"
                style={{ marginTop: '12px' }}
              >
                <Plus size={16} />
                <span>Yeni Not Yaz</span>
              </button>
            </div>
          ) : (
            <div className="notes-grid">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="note-card"
                  style={{ backgroundColor: note.color || '#fef3c7' }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <h3
                        className="note-card-title"
                        onClick={() => {
                          setEditingNote(note);
                          setIsNoteModalOpen(true);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {note.title || 'Başlıksız Not'}
                      </h3>
                      {note.pinned && (
                        <Pin size={16} color="#d97706" style={{ fill: '#d97706', flexShrink: 0 }} />
                      )}
                    </div>

                    <p
                      className="note-card-content"
                      onClick={() => {
                        setEditingNote(note);
                        setIsNoteModalOpen(true);
                      }}
                      style={{ cursor: 'pointer', marginTop: '8px' }}
                    >
                      {note.content}
                    </p>
                  </div>

                  <div className="note-card-footer">
                    <span style={{ fontWeight: 600, background: 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
                      {note.category || 'Genel'}
                    </span>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(note.content, note.id)}
                      title="Metni Kopyala"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: copiedNoteId === note.id ? '#16a34a' : '#475569',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: 'rgba(255,255,255,0.6)'
                      }}
                    >
                      {copiedNoteId === note.id ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedNoteId === note.id ? 'Kopyalandı' : 'Kopyala'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Todo Modal */}
      <TodoModal
        isOpen={isTodoModalOpen}
        onClose={() => setIsTodoModalOpen(false)}
        onSave={handleSaveTodo}
        onDelete={handleDeleteTodo}
        editingTodo={editingTodo}
        courses={courses}
        defaultTimeframe={todoFilter === 'completed' || todoFilter === 'all' ? 'today' : todoFilter}
      />

      {/* Note Modal */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
        editingNote={editingNote}
      />
    </div>
  );
};

export default NotesView;
