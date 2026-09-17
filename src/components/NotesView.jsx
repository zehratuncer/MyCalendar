import React, { useState } from 'react';
import { Plus, StickyNote, Pin, Search, Copy, Check, Sparkles } from 'lucide-react';
import NoteModal from './NoteModal';

export const NotesView = ({ notes, setNotes, scratchpad, setScratchpad }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleSave = (item) => {
    if (editingNote) {
      setNotes(notes.map((n) => (n.id === item.id ? item : n)));
    } else {
      setNotes([item, ...notes]);
    }
  };

  const handleDelete = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNotes = notes
    .filter((n) => {
      if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = n.title?.toLowerCase().includes(q);
        const matchContent = n.content?.toLowerCase().includes(q);
        return matchTitle || matchContent;
      }
      return true;
    })
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const categories = ['all', 'Ders Notu', 'Fikir', 'Hatırlatma', 'Proje', 'Genel'];

  return (
    <div>
      {/* Header */}
      <div className="view-header">
        <div className="view-title-group">
          <h1>
            <StickyNote className="text-primary" size={28} />
            Hızlı Notlar & Karalama Panosu
          </h1>
          <p className="view-subtitle">
            Aklınıza gelen fikirleri, ders içi önemli noktaları ve hatırlatıcıları anında kaydedin.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingNote(null);
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus size={18} />
          <span>Yeni Not Yaz</span>
        </button>
      </div>

      {/* Instant Scratchpad (Hızlı Karalama Defteri) */}
      <div className="scratchpad-box">
        <div className="scratchpad-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--primary)" />
            <span>⚡ Anlık Hızlı Not / Scratchpad (Otomatik Kaydedilir)</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Cihazlar arası anında senkronize
          </span>
        </div>
        <textarea
          value={scratchpad}
          onChange={(e) => setScratchpad(e.target.value)}
          placeholder="Aklınıza gelen bir şeyi anında buraya yazın..."
          className="scratchpad-textarea"
        />
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Category Pills */}
          <div className="filter-pills-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat === 'all' ? `Tüm Notlar (${notes.length})` : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Notlar veya başlıklar arasında ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="glass-panel" style={{ padding: '50px', textAlign: 'center' }}>
          <StickyNote size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 12px auto' }} />
          <h4 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Not bulunamadı</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '18px' }}>
            Yeni bir not veya fikir eklemek için butona tıklayın.
          </p>
          <button
            onClick={() => {
              setEditingNote(null);
              setIsModalOpen(true);
            }}
            className="btn-primary"
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
                      setIsModalOpen(true);
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
                    setIsModalOpen(true);
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
                    color: copiedId === note.id ? '#16a34a' : '#475569',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.6)'
                  }}
                >
                  {copiedId === note.id ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedId === note.id ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        editingNote={editingNote}
      />
    </div>
  );
};

export default NotesView;
