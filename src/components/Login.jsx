import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Coffee, Mail, Lock, AlertCircle, Key, ChevronDown, ChevronUp } from 'lucide-react';

export default function Login() {
  const { users, loginUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('يرجى ملء كافة الحقول المطلوبة!');
      return;
    }

    const res = loginUser(email, password);
    if (!res.success) {
      setError(res.error);
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'owner': return 'صاحب الكافيه';
      case 'manager': return 'مدير فرعي';
      default: return 'موظف';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Decorative Espresso cups background or glows */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(223, 183, 108, 0.08) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(44, 26, 20, 0.2) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      {/* Main Login Card */}
      <div className="glass-panel animate-slide-in" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '36px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Brand Logo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <div className="logo-icon" style={{ width: '60px', height: '60px', fontSize: '26px' }}>
            <Coffee size={32} />
          </div>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 800,
              background: 'linear-gradient(to left, #ffffff, var(--gold-primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>كافيه ألحان | Alhan Cafe</h1>
            <p style={{ fontSize: '13px', color: 'rgba(245, 240, 235, 0.5)', marginTop: '4px' }}>
              نظام إدارة ومتابعة المهام اليومية المطور
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="animate-slide-in" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--color-critical-bg)',
            color: 'var(--color-critical)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            padding: '12px',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={13} style={{ color: 'var(--gold-primary)' }} />
              البريد الإلكتروني:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@alhan.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={13} style={{ color: 'var(--gold-primary)' }} />
              كلمة المرور:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }}>
            تسجيل الدخول للنظام
          </button>
        </form>
      </div>

      {/* Demo Accounts Quick Fill Panel */}
      <div className="glass-panel animate-slide-in" style={{
        width: '100%',
        maxWidth: '440px',
        marginTop: '16px',
        padding: '16px 20px',
        zIndex: 10
      }}>
        <button
          onClick={() => setShowDemoAccounts(!showDemoAccounts)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: 'rgba(245, 240, 235, 0.7)',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Key size={14} style={{ color: 'var(--gold-primary)' }} />
            حسابات تجريبية للاختبار السريع (اضغط للتعبئة)
          </span>
          {showDemoAccounts ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showDemoAccounts && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '12px',
            maxHeight: '220px',
            overflowY: 'auto'
          }}>
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleDemoFill(user.email, user.password)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: 'var(--border-radius-sm)',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  textAlign: 'right',
                  color: '#f5f0eb',
                  transition: 'var(--transition-smooth)'
                }}
                className="user-pill-hover"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(223, 183, 108, 0.3)';
                  e.currentTarget.style.backgroundColor = 'rgba(223, 183, 108, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{user.avatar}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>{user.name}</span>
                    <span style={{ fontSize: '10px', opacity: 0.5 }}>{user.email}</span>
                  </div>
                </div>
                <span className="badge badge-normal" style={{ fontSize: '10px', backgroundColor: 'var(--gold-dim)', color: 'var(--gold-primary)' }}>
                  {getRoleLabel(user.role)} (باسوورد: {user.password})
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
