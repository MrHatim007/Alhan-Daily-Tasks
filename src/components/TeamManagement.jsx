import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, UserPlus, Mail, CheckCircle2, ClipboardList, Shield, X, ShieldAlert } from 'lucide-react';

export default function TeamManagement() {
  const { users, tasks, currentUser, addUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('staff');
  const [avatar, setAvatar] = useState('☕');
  const [email, setEmail] = useState('');

  const avatarOptions = ['☕', '☀️', '🌙', '📦', '🧁', '💳', '🛠️', '👨‍🍳', '👩‍💼', '📈', '🍩'];

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addUser({ name, role, avatar, email });

    setName('');
    setRole('staff');
    setAvatar('☕');
    setEmail('');
    setShowForm(false);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'owner': return 'صاحب الكافيه';
      case 'manager': return 'مدير فرعي';
      default: return 'موظف';
    }
  };

  // Compute stats for a user
  const getUserStats = (userId) => {
    const userTasks = tasks.filter(t => t.assignedTo === userId);
    const total = userTasks.length;
    const completed = userTasks.filter(t => t.status === 'completed').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, rate };
  };

  const isOwnerOrManager = currentUser.role === 'owner' || currentUser.role === 'manager';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users style={{ color: 'var(--gold-primary)' }} />
            فريق عمل كافيه ألحان
          </h3>
          <p style={{ fontSize: '13px', color: 'rgba(245,240,235,0.5)', marginTop: '4px' }}>
            متابعة إحصائيات الأداء اليومي ومعدل إنجاز المهام لكل فرد في الفريق
          </p>
        </div>

        {isOwnerOrManager && (
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(!showForm)}
          >
            <UserPlus size={16} />
            {showForm ? 'إغلاق النموذج' : 'إضافة عضو جديد'}
          </button>
        )}
      </div>

      {/* Add Member Form */}
      {showForm && (
        <div className="glass-panel animate-slide-in" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '16px', color: 'var(--gold-primary)' }}>إضافة موظف/مدير جديد لفريق ألحان</h4>
            <button 
              onClick={() => setShowForm(false)} 
              className="btn-danger-text"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleAddMember} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>الاسم الكامل:</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: يحيى النجار" 
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>الدور الوظيفي والصلاحيات:</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="form-select"
              >
                <option value="manager">مدير قسم / فرع (إسناد ومتابعة)</option>
                <option value="staff">موظف باريستا / كاشير (تنفيذ مهام فقط)</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>البريد الإلكتروني (اختياري):</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yihya@alhan.com" 
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>اختر الرمز التعبيري (الأفاتار):</label>
              <div className="avatar-selector">
                {avatarOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    className={`avatar-option ${avatar === emoji ? 'selected' : ''}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowForm(false)}
              >
                إلغاء
              </button>
              <button type="submit" className="btn btn-primary">
                إضافة للفريق
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Team Cards Grid */}
      <div className="team-grid">
        {users.map((user) => {
          const stats = getUserStats(user.id);
          const isCurrentUser = currentUser.id === user.id;

          return (
            <div key={user.id} className="glass-panel team-card animate-slide-in" style={{
              border: isCurrentUser ? '1px solid rgba(223, 183, 108, 0.3)' : '1px solid var(--glass-border)',
              backgroundColor: isCurrentUser ? 'rgba(223, 183, 108, 0.03)' : 'var(--glass-bg)'
            }}>
              {isCurrentUser && (
                <span className="badge badge-critical" style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '9px', backgroundColor: 'var(--gold-dim)', color: 'var(--gold-primary)', borderColor: 'var(--gold-primary)' }}>
                  أنت
                </span>
              )}
              
              <div className="team-card-avatar">
                {user.avatar}
              </div>

              <span className="team-card-name">{user.name}</span>
              <span className="team-card-role">{getRoleLabel(user.role)}</span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'rgba(245,240,235,0.4)', marginBottom: '16px' }}>
                <Mail size={12} />
                <span style={{ direction: 'ltr' }}>{user.email}</span>
              </div>

              {/* Individual Stats Grid */}
              <div className="team-card-stats">
                <div className="team-card-stat">
                  <span className="team-card-stat-val" style={{ color: 'var(--gold-primary)' }}>{stats.total}</span>
                  <span className="team-card-stat-lbl">المهام الموكلة</span>
                </div>
                <div className="team-card-stat" style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="team-card-stat-val" style={{ color: 'var(--color-success)' }}>{stats.rate}%</span>
                  <span className="team-card-stat-lbl">نسبة الإنجاز</span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-espresso-light)', borderRadius: '2px', overflow: 'hidden', marginTop: '12px' }}>
                <div 
                  style={{ 
                    width: `${stats.rate}%`, 
                    height: '100%', 
                    backgroundColor: stats.rate === 100 ? 'var(--color-success)' : 'var(--gold-primary)',
                    borderRadius: '2px',
                    transition: 'width 0.5s ease'
                  }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
