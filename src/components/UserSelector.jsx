import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, User, Shield, Users, X } from 'lucide-react';

export default function UserSelector() {
  const { users, currentUser, switchUser, addUser } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('staff');
  const [newUserAvatar, setNewUserAvatar] = useState('☕');

  const avatarOptions = ['☕', '☀️', '🌙', '📦', '🧁', '💳', '🛠️', '👨‍🍳', '👩‍💼'];

  const handleSubmitUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    addUser({
      name: newUserName,
      role: newUserRole,
      avatar: newUserAvatar
    });

    // Reset Form
    setNewUserName('');
    setNewUserRole('staff');
    setNewUserAvatar('☕');
    setShowAddModal(false);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'owner': return 'صاحب الكافيه';
      case 'manager': return 'مدير';
      default: return 'موظف';
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} className="text-gold" style={{ color: 'var(--gold-primary)' }} />
          <h3 style={{ fontSize: '15px' }}>محاكي المستخدمين (لتجربة الأدوار والمهام):</h3>
        </div>
        
        <button 
          className="btn btn-secondary" 
          onClick={() => setShowAddModal(true)}
          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--border-radius-sm)' }}
        >
          <Plus size={14} />
          إضافة مدير/موظف جديد
        </button>
      </div>

      <div className="user-switch-bar">
        {users.map((user) => {
          const isActive = currentUser.id === user.id;
          return (
            <button
              key={user.id}
              onClick={() => switchUser(user.id)}
              className={`user-pill ${isActive ? 'active' : ''}`}
            >
              <span className="user-pill-avatar">{user.avatar}</span>
              <span>{user.name}</span>
              <span className="user-pill-role">{getRoleLabel(user.role)}</span>
            </button>
          );
        })}
      </div>

      <div className="simulation-banner">
        <Shield size={16} style={{ color: 'var(--gold-primary)' }} />
        <span>
          أنت الآن تتصفح وتتحكم بصفة: <strong>{currentUser.name}</strong> ({getRoleLabel(currentUser.role)})
          {currentUser.role === 'staff' && ' - يمكنك استلام وإنجاز مهامك فقط.'}
          {currentUser.role === 'manager' && ' - يمكنك إسناد مهام ومتابعتها وتغيير حالتها.'}
          {currentUser.role === 'owner' && ' - لديك صلاحيات كاملة لمتابعة كافة التفاصيل والتحكم بالنظام.'}
        </span>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-slide-in">
            <div className="modal-header">
              <h3>إضافة مستخدم جديد للنظام</h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="btn-danger-text"
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitUser}>
              <div className="form-group">
                <label>اسم المستخدم / الموظف:</label>
                <input 
                  type="text" 
                  value={newUserName} 
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="مثال: محمد علي" 
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>الدور / الصلاحية:</label>
                <select 
                  value={newUserRole} 
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="form-select"
                >
                  <option value="manager">مدير فرعي / قسم</option>
                  <option value="staff">موظف (باريستا، كاشير، إلخ)</option>
                </select>
              </div>

              <div className="form-group">
                <label>اختر رمزاً تعبيرياً (Avatar):</label>
                <div className="avatar-selector">
                  {avatarOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewUserAvatar(emoji)}
                      className={`avatar-option ${newUserAvatar === emoji ? 'selected' : ''}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddModal(false)}
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  إضافة المستخدم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
