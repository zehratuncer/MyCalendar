import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus, LogOut, Cloud, ShieldCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export default function AuthModal({ isOpen, onClose, user, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      alert('Supabase henüz yapılandırılmamış. Lütfen .env dosyanıza VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY değerlerinizi giriniz.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        alert('🎉 Kayıt başarılı! E-postanıza gelen doğrulama bağlantısına tıklayarak giriş yapabilirsiniz.');
        onClose();
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        alert('✅ Giriş başarılı! Verileriniz bulut ile senkronize ediliyor.');
        if (onAuthSuccess) onAuthSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'İşlem sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      if (onAuthSuccess) onAuthSuccess(null);
      alert('Çıkış yapıldı. Verileriniz yerel hafızada saklanmaya devam ediyor.');
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cloud size={22} color="var(--primary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              {user ? 'Hesabım & Bulut Senkronizasyon' : isSignUp ? 'Yeni Hesap Oluştur' : 'Bulut Hesabına Giriş'}
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {!isSupabaseConfigured && (
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '12px 14px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.85rem', color: '#fbbf24' }}>
              ⚠️ <strong>Supabase Bağlantısı Bekleniyor:</strong> .env dosyanıza API anahtarlarınızı ekledikten sonra aktif olacaktır. Şu an verileriniz cihazınızda güvenle tutulmaktadır.
            </div>
          )}

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.email}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} />
                    <span>Bulut Eşitlemesi Aktif</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Telefon, tablet veya bilgisayarınızdan aynı e-posta ile giriş yaptığınızda tüm dersleriniz, ödevleriniz ve notlarınız anında ortak görünür.
              </p>

              <button onClick={handleLogout} className="btn-secondary" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', justifyContent: 'center' }}>
                <LogOut size={16} />
                <span>Çıkış Yap</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errorMsg && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '14px', fontSize: '0.85rem', color: '#f87171' }}>
                  {errorMsg}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">E-posta Adresi</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    placeholder="ogrenci@universite.edu.tr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Şifre</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="En az 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
              >
                {loading ? 'İşleniyor...' : isSignUp ? 'Kayıt Ol ve Eşitle' : 'Giriş Yap'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {isSignUp ? 'Zaten hesabınız var mı?' : 'Henüz hesabınız yok mu?'}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  style={{ color: 'var(--primary)', fontWeight: 700, marginLeft: '6px', background: 'none' }}
                >
                  {isSignUp ? 'Giriş Yap' : 'Kayıt Ol'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
