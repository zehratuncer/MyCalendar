import React, { useRef } from 'react';
import { X, Download, Upload, Smartphone, Laptop, Tablet, RefreshCw, CheckCircle2, Cloud } from 'lucide-react';
import { exportBackupJSON, importBackupJSON, resetToDefaults } from '../utils/storage';

export default function BackupModal({ isOpen, onClose, appData, onDataReloaded }) {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportBackupJSON(appData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const result = importBackupJSON(content);
        if (result.success) {
          alert('✅ Verileriniz başarıyla yüklendi ve senkronize edildi!');
          onDataReloaded(result.data);
          onClose();
        } else {
          alert('❌ Hata: ' + result.error);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Tüm verileri varsayılan örnek verilere sıfırlamak istediğinize emin misiniz?')) {
      const defaultData = resetToDefaults();
      onDataReloaded(defaultData);
      alert('Tüm veriler varsayılana sıfırlandı.');
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Laptop size={20} color="var(--primary)" />
            <Tablet size={20} color="var(--primary)" />
            <Smartphone size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginLeft: '4px' }}>
              Cihazlar Arası Erişim & Yedekleme
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Section 1: JSON Export & Import */}
          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Download size={18} color="var(--primary)" />
              <span>1. Anlık Veri Aktarımı (JSON)</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
              Laptopta girdiğiniz tüm ders programını, ödevleri ve notları tek tıkla indirip telefonunuza veya tabletinize yükleyebilirsiniz.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={handleExport} className="btn-primary" style={{ fontSize: '0.88rem' }}>
                <Download size={16} />
                <span>Yedeği İndir (JSON)</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary"
                style={{ fontSize: '0.88rem' }}
              >
                <Upload size={16} />
                <span>Yedek Dosyası Yükle</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Section 2: Mobile & Tablet Installation Guide */}
          <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Smartphone size={18} color="var(--accent-emerald)" />
              <span>2. Telefon & Tablete Uygulama Olarak Ekleme (PWA)</span>
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.4 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>📱 iPhone / iPad (Safari):</span>
                <span>Paylaş butonuna (kare içinde yukarı ok) basın ve <strong>"Ana Ekrana Ekle"</strong> seçeneğini seçin.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>🤖 Android / Tablet (Chrome):</span>
                <span>Sağ üstteki 3 noktaya basın ve <strong>"Uygulamayı Yükle"</strong> veya <strong>"Ana Ekrana Ekle"</strong> deyin.</span>
              </div>
            </div>
          </div>

          {/* Section 3: Cloud Sync Future info */}
          <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
              <Cloud size={18} />
              <span>3. Otomatik Bulut Senkronizasyonu (Gelecek Aşama)</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              İleriki güncellemede kullanıcı girişi (Supabase / Firebase) eklendiğinde hiçbir dosya indirmeden anlık olarak tüm cihazlarınız otomatik senkronize olacaktır.
            </p>
          </div>

          {/* Reset button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
            <button
              type="button"
              onClick={handleReset}
              style={{ color: '#ef4444', fontSize: '0.82rem', background: 'none', textDecoration: 'underline' }}
            >
              Varsayılan Örnek Verilere Sıfırla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
