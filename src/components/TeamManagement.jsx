import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Users, UserPlus, Mail, X, Trash2, AlertTriangle, Pencil } from 'lucide-react';

export default function TeamManagement() {
  const { users, tasks, currentUser, addUser, deleteUser, updateUser, roles } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState('☕');
  const [email, setEmail] = useState('');
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);
  const [password, setPassword] = useState('123');

  const currentUserRole = roles.find(r => r.id === currentUser.role);
  const userPermission = currentUserRole ? currentUserRole.permission : currentUser.role;

  useEffect(() => {
    if (roles.length > 0 && !role) {
      setRole(roles[0].id);
    }
  }, [roles, role]);

  const avatarOptions = [
    { emoji: '☕', name: 'باريستا / قهوة' },
    { emoji: '☀️', name: 'صباحي' },
    { emoji: '🌙', name: 'مسائي' },
    { emoji: '📦', name: 'مخزون / مستودع' },
    { emoji: '🧁', name: 'حلويات / مطبخ' },
    { emoji: '💳', name: 'كاشير / حسابات' },
    { emoji: '🛠️', name: 'صيانة / فني' },
    { emoji: '👨‍🍳', name: 'طباخ / شيف' },
    { emoji: '👩‍💼', name: 'إدارة / سكرتارية' },
    { emoji: '📈', name: 'تسويق / مبيعات' },
    { emoji: '🍩', name: 'مخبوزات / دونات' }
  ];

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!name.trim() || !role) return;

    if (editingUser) {
      updateUser(editingUser.id, { name, role, avatar, email, password });
    } else {
      addUser({ name, role, avatar, email, password });
    }

    setName('');
    setRole(roles[0]?.id || '');
    setAvatar('☕');
    setEmail('');
    setPassword('123');
    setEditingUser(null);
    setShowForm(false);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setName(user.name);
    setRole(user.role);
    setAvatar(user.avatar);
    setEmail(user.email);
    setPassword(user.password || '123');
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setName('');
    setRole(roles[0]?.id || '');
    setAvatar('☕');
    setEmail('');
    setPassword('123');
    setEditingUser(null);
    setShowForm(false);
  };

  // Compute stats for a user
  const getUserStats = (userId) => {
    const userTasks = tasks.filter(t => t.assignedTo === userId);
    const total = userTasks.length;
    const completed = userTasks.filter(t => t.status === 'completed').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, rate };
  };

  const isOwnerOrManager = userPermission === 'owner' || userPermission === 'manager';

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
            <h4 style={{ fontSize: '16px', color: 'var(--gold-primary)' }}>
              {editingUser ? `تعديل بيانات العضو: ${editingUser.name}` : 'إضافة موظف/مدير جديد لفريق ألحان'}
            </h4>
            <button 
              onClick={handleCancelForm} 
              className="btn-danger-text"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleAddMember} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="dashboard-grid">
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
                disabled={editingUser && editingUser.id === currentUser.id}
                required
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>البريد الإلكتروني (اختياري):</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yihya@alhan.com" 
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>كلمة مرور الحساب:</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="تعيين كلمة مرور..." 
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>اختر الرمز التعبيري (الأفاتار):</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {avatarOptions.map((opt) => (
                  <button
                    key={opt.emoji}
                    type="button"
                    onClick={() => setAvatar(opt.emoji)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      borderRadius: 'var(--border-radius-sm)',
                      border: avatar === opt.emoji ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.05)',
                      backgroundColor: avatar === opt.emoji ? 'rgba(223,183,108,0.1)' : 'rgba(255,255,255,0.02)',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{opt.emoji}</span>
                    <span>{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleCancelForm}
              >
                إلغاء
              </button>
              <button type="submit" className="btn btn-primary">
                {editingUser ? 'حفظ التعديلات' : 'إضافة للفريق'}
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
          const uRole = roles.find(r => r.id === user.role) || { label: user.role };

          return (
            <div key={user.id} className="glass-panel team-card animate-slide-in" style={{
              border: isCurrentUser ? '1px solid rgba(223, 183, 108, 0.3)' : '1px solid var(--glass-border)',
              backgroundColor: isCurrentUser ? 'rgba(223, 183, 108, 0.03)' : 'var(--glass-bg)',
              position: 'relative'
            }}>
              {isCurrentUser && (
                <span className="badge badge-critical" style={{ position: 'absolute', top: '12px', right: '12px', left: 'auto', fontSize: '9px', backgroundColor: 'var(--gold-dim)', color: 'var(--gold-primary)', borderColor: 'var(--gold-primary)' }}>
                  أنت
                </span>
              )}
              
              {userPermission === 'owner' && !isCurrentUser && (
                <button
                  onClick={() => setConfirmDeleteUser(user)}
                  className="btn-danger-text"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '50%'
                  }}
                  title="حذف هذا العضو"
                >
                  <Trash2 size={15} />
                </button>
              )}

              {userPermission === 'owner' && (
                <button
                  onClick={() => handleEditClick(user)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: isCurrentUser ? '12px' : '36px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '50%',
                    color: 'var(--gold-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="تعديل بيانات العضو"
                >
                  <Pencil size={15} />
                </button>
              )}
              
              <div className="team-card-avatar">
                {user.avatar}
              </div>

              <span className="team-card-name">{user.name}</span>
              <span className="team-card-role">{uRole.label}</span>

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

      {/* Custom Confirmation Modal */}
      {confirmDeleteUser && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-slide-in" style={{ borderColor: 'var(--color-critical)', maxWidth: '400px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-critical-bg)',
                color: 'var(--color-critical)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }} className="pulse-critical-badge">
                <AlertTriangle size={24} />
              </div>
              
              <div>
                <h3 style={{ fontSize: '16px', color: '#fff' }}>تأكيد حذف عضو الفريق</h3>
                <p style={{ fontSize: '13px', color: 'rgba(245,240,235,0.6)', marginTop: '8px', lineHeight: '1.6' }}>
                  هل أنت متأكد من حذف العضو <strong>{confirmDeleteUser.name}</strong> نهائياً من نظام كافيه ألحان؟
                  <br />
                  <span style={{ color: 'var(--color-critical)', fontWeight: 600, fontSize: '12px' }}>تحذير: لا يمكن التراجع عن هذا الإجراء!</span>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '8px' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setConfirmDeleteUser(null)}
                  style={{ flex: 1 }}
                >
                  إلغاء
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    deleteUser(confirmDeleteUser.id);
                    setConfirmDeleteUser(null);
                  }}
                  style={{ 
                    flex: 1, 
                    background: 'linear-gradient(135deg, var(--color-critical) 0%, #c2185b 100%)', 
                    color: '#fff', 
                    boxShadow: '0 4px 15px rgba(244, 63, 94, 0.25)' 
                  }}
                >
                  تأكيد الحذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
