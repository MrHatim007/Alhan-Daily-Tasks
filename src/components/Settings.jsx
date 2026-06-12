import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, Plus, Trash2, Check, Tag, Shield, AlertTriangle } from 'lucide-react';

export default function Settings() {
  const { 
    categories, addCategory, deleteCategory,
    priorities, addPriority, deletePriority,
    roles, addRole, deleteRole,
    currentUser
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('categories');

  // Categories Form State
  const [catLabel, setCatLabel] = useState('');
  const [catEmoji, setCatEmoji] = useState('☕');

  // Priorities Form State
  const [priLabel, setPriLabel] = useState('');
  const [priColor, setPriColor] = useState('#10b981'); // default green

  // Roles Form State
  const [roleLabel, setRoleLabel] = useState('');
  const [rolePermission, setRolePermission] = useState('staff');

  const emojiOptions = [
    { emoji: '☕', name: '☕ قهوة / باريستا' },
    { emoji: '🧼', name: '🧼 نظافة / تعقيم' },
    { emoji: '📦', name: '📦 مخزون / جرد' },
    { emoji: '💳', name: '💳 كاشير / معاملات' },
    { emoji: '🔒', name: '🔒 إغلاق / حماية' },
    { emoji: '🧁', name: '🧁 حلويات / مطبخ' },
    { emoji: '🛠️', name: '🛠️ صيانة / تشغيل' },
    { emoji: '👨‍🍳', name: '👨‍🍳 طباخ / تحضير' },
    { emoji: '👩‍💼', name: '👩‍💼 سكرتارية / إدارة' },
    { emoji: '🍩', name: '🍩 مخبوزات / دونات' },
    { emoji: '🧹', name: '🧹 كنس / غسيل' },
    { emoji: '❓', name: '❓ أخرى / عام' }
  ];

  const colorOptions = [
    { color: '#f43f5e', name: '🔴 أحمر (عاجل جداً)' },
    { color: '#f59e0b', name: '🟠 برتقالي (مرتفع)' },
    { color: '#10b981', name: '🟢 أخضر (عادي)' },
    { color: '#3b82f6', name: '🔵 أزرق (منخفض)' },
    { color: '#6b7280', name: '⚪ رمادي (منخفض جداً)' }
  ];

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!catLabel.trim()) return;
    addCategory({ label: catLabel.trim(), emoji: catEmoji });
    setCatLabel('');
    setCatEmoji('☕');
  };

  const handleAddPriority = (e) => {
    e.preventDefault();
    if (!priLabel.trim()) return;
    addPriority({ label: priLabel.trim(), color: priColor });
    setPriLabel('');
    setPriColor('#10b981');
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (!roleLabel.trim()) return;
    addRole({ label: roleLabel.trim(), permission: rolePermission });
    setRoleLabel('');
    setRolePermission('staff');
  };

  const getPermissionLabel = (perm) => {
    switch (perm) {
      case 'owner': return 'صلاحية كاملة (صاحب الكافيه)';
      case 'manager': return 'صلاحية إسناد ومتابعة (مدير)';
      default: return 'صلاحية تنفيذ مهام (موظف)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div>
        <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders style={{ color: 'var(--gold-primary)' }} />
          إعدادات النظام وتخصيص الخيارات
        </h3>
        <p style={{ fontSize: '13px', color: 'rgba(245,240,235,0.5)', marginTop: '4px' }}>
          تخصيص تصنيفات المهام اليومية، مستويات الأهمية، والأدوار الوظيفية لفريق كافيه ألحان
        </p>
      </div>

      {/* Sub tabs nav */}
      <div className="filter-tabs" style={{ alignSelf: 'flex-start' }}>
        <button 
          className={`filter-tab-btn ${activeSubTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('categories')}
        >
          <Tag size={14} style={{ marginLeft: '4px' }} />
          تصنيفات المهام ({categories.length})
        </button>
        <button 
          className={`filter-tab-btn ${activeSubTab === 'priorities' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('priorities')}
        >
          <AlertTriangle size={14} style={{ marginLeft: '4px' }} />
          مستويات الأهمية ({priorities.length})
        </button>
        <button 
          className={`filter-tab-btn ${activeSubTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('roles')}
        >
          <Shield size={14} style={{ marginLeft: '4px' }} />
          الأدوار والصلاحيات ({roles.length})
        </button>
      </div>

      {/* Categories Tab */}
      {activeSubTab === 'categories' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="dashboard-grid">
          {/* Add Category Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--gold-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} /> إضافة تصنيف مهام جديد
            </h4>

            <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>اسم التصنيف بالكامل:</label>
                <input 
                  type="text" 
                  value={catLabel} 
                  onChange={(e) => setCatLabel(e.target.value)}
                  placeholder="مثال: تحضير الحلويات والمشروبات الباردة" 
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>اختر الرمز التعبيري (الإيموجي) المناسب:</label>
                <select 
                  value={catEmoji} 
                  onChange={(e) => setCatEmoji(e.target.value)}
                  className="form-select"
                  style={{ fontSize: '13px' }}
                >
                  {emojiOptions.map(opt => (
                    <option key={opt.emoji} value={opt.emoji}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} />
                حفظ وإضافة التصنيف
              </button>
            </form>
          </div>

          {/* Current Categories List */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '16px' }}>التصنيفات المتاحة حالياً في النظام:</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
              {categories.map(cat => (
                <div key={cat.id} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{cat.emoji}</span>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{cat.label}</span>
                  </div>

                  {categories.length > 1 && (
                    <button 
                      onClick={() => deleteCategory(cat.id)}
                      className="btn-danger-text"
                      title="حذف هذا التصنيف"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Priorities Tab */}
      {activeSubTab === 'priorities' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="dashboard-grid">
          {/* Add Priority Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--gold-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} /> إضافة مستوى أهمية جديد
            </h4>

            <form onSubmit={handleAddPriority} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>اسم مستوى الأهمية:</label>
                <input 
                  type="text" 
                  value={priLabel} 
                  onChange={(e) => setPriLabel(e.target.value)}
                  placeholder="مثال: هام جداً وعاجل" 
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>اختر اللون المميز للشارة:</label>
                <select 
                  value={priColor} 
                  onChange={(e) => setPriColor(e.target.value)}
                  className="form-select"
                  style={{ fontSize: '13px' }}
                >
                  {colorOptions.map(opt => (
                    <option key={opt.color} value={opt.color}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} />
                حفظ وإضافة مستوى الأهمية
              </button>
            </form>
          </div>

          {/* Current Priorities List */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '16px' }}>مستويات الأهمية الحالية:</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
              {priorities.map(pri => (
                <div key={pri.id} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.01)', borderRight: `3px solid ${pri.color}` }}>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{pri.label}</span>

                  {priorities.length > 1 && (
                    <button 
                      onClick={() => deletePriority(pri.id)}
                      className="btn-danger-text"
                      title="حذف مستوى الأهمية"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Roles Tab */}
      {activeSubTab === 'roles' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="dashboard-grid">
          {/* Add Role Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--gold-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} /> إضافة دور وظيفي جديد
            </h4>

            <form onSubmit={handleAddRole} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>اسم المسمى الوظيفي:</label>
                <input 
                  type="text" 
                  value={roleLabel} 
                  onChange={(e) => setRoleLabel(e.target.value)}
                  placeholder="مثال: مشرف الصالة / باريستا مبتدئ" 
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>مستوى الصلاحية الممنوح في النظام:</label>
                <select 
                  value={rolePermission} 
                  onChange={(e) => setRolePermission(e.target.value)}
                  className="form-select"
                  style={{ fontSize: '13px' }}
                >
                  <option value="staff">موظف عادي (تنفيذ وعرض مهام فقط)</option>
                  <option value="manager">مدير فرعي (إسناد ومتابعة المهام)</option>
                  <option value="owner">مالك / صاحب الكافيه (صلاحية تصفير وإدارة كاملة)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} />
                حفظ وإضافة الدور
              </button>
            </form>
          </div>

          {/* Current Roles List */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '16px' }}>أدوار الموظفين الحالية:</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
              {roles.map(role => (
                <div key={role.id} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{role.label}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(245,240,235,0.4)' }}>{getPermissionLabel(role.permission)}</span>
                  </div>

                  {roles.length > 1 && (
                    <button 
                      onClick={() => deleteRole(role.id)}
                      className="btn-danger-text"
                      title="حذف هذا الدور"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
