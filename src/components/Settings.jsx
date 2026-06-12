import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, Plus, Trash2, Check, Tag, Shield, AlertTriangle, Image, Pencil } from 'lucide-react';

export default function Settings() {
  const { 
    categories, addCategory, deleteCategory, updateCategory,
    priorities, addPriority, deletePriority, updatePriority,
    roles, addRole, deleteRole, updateRole,
    currentUser,
    systemLogo, updateSystemLogo
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('categories');
  const [logoUrlInput, setLogoUrlInput] = useState('');


  // Editing state variables
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingPriority, setEditingPriority] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  // Category Edit Click & Cancel Handlers
  const handleEditCategoryClick = (cat) => {
    setEditingCategory(cat);
    setCatLabel(cat.label);
    setCatEmoji(cat.emoji);
  };
  const handleCancelCategoryEdit = () => {
    setEditingCategory(null);
    setCatLabel('');
    setCatEmoji('☕');
  };

  // Priority Edit Click & Cancel Handlers
  const handleEditPriorityClick = (pri) => {
    setEditingPriority(pri);
    setPriLabel(pri.label);
    setPriColor(pri.color);
  };
  const handleCancelPriorityEdit = () => {
    setEditingPriority(null);
    setPriLabel('');
    setPriColor('#10b981');
  };

  // Role Edit Click & Cancel Handlers
  const handleEditRoleClick = (role) => {
    setEditingRole(role);
    setRoleLabel(role.label);
    setRolePermission(role.permission);
  };
  const handleCancelRoleEdit = () => {
    setEditingRole(null);
    setRoleLabel('');
    setRolePermission('staff');
  };

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
    if (editingCategory) {
      updateCategory(editingCategory.id, { label: catLabel.trim(), emoji: catEmoji });
      setEditingCategory(null);
    } else {
      addCategory({ label: catLabel.trim(), emoji: catEmoji });
    }
    setCatLabel('');
    setCatEmoji('☕');
  };

  const handleAddPriority = (e) => {
    e.preventDefault();
    if (!priLabel.trim()) return;
    if (editingPriority) {
      updatePriority(editingPriority.id, { label: priLabel.trim(), color: priColor });
      setEditingPriority(null);
    } else {
      addPriority({ label: priLabel.trim(), color: priColor });
    }
    setPriLabel('');
    setPriColor('#10b981');
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (!roleLabel.trim()) return;
    if (editingRole) {
      updateRole(editingRole.id, { label: roleLabel.trim(), permission: rolePermission });
      setEditingRole(null);
    } else {
      addRole({ label: roleLabel.trim(), permission: rolePermission });
    }
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
        <button 
          className={`filter-tab-btn ${activeSubTab === 'logo' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('logo')}
        >
          <Image size={14} style={{ marginLeft: '4px' }} />
          هوية وشعار النظام
        </button>
      </div>

      {/* Categories Tab */}
      {activeSubTab === 'categories' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="dashboard-grid">
          {/* Add Category Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--gold-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {editingCategory ? <Pencil size={16} /> : <Plus size={16} />}
              {editingCategory ? 'تعديل تصنيف المهام' : 'إضافة تصنيف مهام جديد'}
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

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                  {editingCategory ? <Check size={16} /> : <Plus size={16} />}
                  {editingCategory ? 'حفظ التغييرات' : 'حفظ وإضافة التصنيف'}
                </button>
                {editingCategory && (
                  <button type="button" onClick={handleCancelCategoryEdit} className="btn btn-secondary" style={{ flex: 1 }}>
                    إلغاء التعديل
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Current Categories List */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '16px' }}>التصنيفات المتاحة حالياً في النظام:</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
              {categories.map(cat => (
                <div key={cat.id} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.01)', borderColor: editingCategory && editingCategory.id === cat.id ? 'var(--gold-primary)' : 'var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{cat.emoji}</span>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{cat.label}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      onClick={() => handleEditCategoryClick(cat)}
                      className="btn-danger-text"
                      title="تعديل هذا التصنيف"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', color: 'var(--gold-primary)' }}
                      type="button"
                    >
                      <Pencil size={15} />
                    </button>
                    {categories.length > 1 && (
                      <button 
                        onClick={() => deleteCategory(cat.id)}
                        className="btn-danger-text"
                        title="حذف هذا التصنيف"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }}
                        type="button"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
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
              {editingPriority ? <Pencil size={16} /> : <Plus size={16} />}
              {editingPriority ? 'تعديل مستوى الأهمية' : 'إضافة مستوى أهمية جديد'}
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

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                  {editingPriority ? <Check size={16} /> : <Plus size={16} />}
                  {editingPriority ? 'حفظ التغييرات' : 'حفظ وإضافة مستوى الأهمية'}
                </button>
                {editingPriority && (
                  <button type="button" onClick={handleCancelPriorityEdit} className="btn btn-secondary" style={{ flex: 1 }}>
                    إلغاء التعديل
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Current Priorities List */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '16px' }}>مستويات الأهمية الحالية:</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
              {priorities.map(pri => (
                <div key={pri.id} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.01)', borderRight: `3px solid ${pri.color}`, borderColor: editingPriority && editingPriority.id === pri.id ? 'var(--gold-primary)' : 'var(--glass-border)' }}>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{pri.label}</span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      onClick={() => handleEditPriorityClick(pri)}
                      className="btn-danger-text"
                      title="تعديل مستوى الأهمية"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', color: 'var(--gold-primary)' }}
                      type="button"
                    >
                      <Pencil size={15} />
                    </button>
                    {priorities.length > 1 && (
                      <button 
                        onClick={() => deletePriority(pri.id)}
                        className="btn-danger-text"
                        title="حذف مستوى الأهمية"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }}
                        type="button"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
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
              {editingRole ? <Pencil size={16} /> : <Plus size={16} />}
              {editingRole ? 'تعديل الدور الوظيفي' : 'إضافة دور وظيفي جديد'}
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

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                  {editingRole ? <Check size={16} /> : <Plus size={16} />}
                  {editingRole ? 'حفظ التغييرات' : 'حفظ وإضافة الدور'}
                </button>
                {editingRole && (
                  <button type="button" onClick={handleCancelRoleEdit} className="btn btn-secondary" style={{ flex: 1 }}>
                    إلغاء التعديل
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Current Roles List */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '16px' }}>أدوار الموظفين الحالية:</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
              {roles.map(role => (
                <div key={role.id} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.01)', borderColor: editingRole && editingRole.id === role.id ? 'var(--gold-primary)' : 'var(--glass-border)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{role.label}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(245,240,235,0.4)' }}>{getPermissionLabel(role.permission)}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      onClick={() => handleEditRoleClick(role)}
                      className="btn-danger-text"
                      title="تعديل هذا الدور"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', color: 'var(--gold-primary)' }}
                      type="button"
                    >
                      <Pencil size={15} />
                    </button>
                    {roles.length > 1 && (
                      <button 
                        onClick={() => deleteRole(role.id)}
                        className="btn-danger-text"
                        title="حذف هذا الدور"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }}
                        type="button"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Logo Tab */}
      {activeSubTab === 'logo' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="settings-grid">
          {/* Change Logo Card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--gold-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Image size={16} /> رفع وتعديل شعار الكافيه
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Option 1: File Upload */}
              <div className="form-group">
                <label style={{ fontWeight: 600, fontSize: '13px' }}>رفع صورة الشعار من جهازك (يفضل بخلفية شفافة):</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '8px'
                }}>
                  <label className="btn btn-secondary" style={{ 
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: 0
                  }}>
                    <span>اختر ملف الصورة</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            updateSystemLogo(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span style={{ fontSize: '11px', color: 'rgba(245,240,235,0.4)' }}>
                    PNG, JPG, WEBP, SVG
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(245,240,235,0.2)' }}>
                <div style={{ flex: 1, height: '1px', background: 'currentColor' }} />
                <span style={{ fontSize: '11px' }}>أو</span>
                <div style={{ flex: 1, height: '1px', background: 'currentColor' }} />
              </div>

              {/* Option 2: Image URL */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontWeight: 600, fontSize: '13px' }}>إدخال رابط صورة الشعار مباشرة (URL):</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="https://example.com/logo.png" 
                    value={logoUrlInput} 
                    onChange={(e) => setLogoUrlInput(e.target.value)}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button 
                    onClick={() => {
                      if (logoUrlInput.trim()) {
                        updateSystemLogo(logoUrlInput.trim());
                      }
                    }}
                    className="btn btn-primary"
                    style={{ padding: '10px 16px' }}
                    type="button"
                  >
                    تطبيق
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Logo Preview Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '15px', color: '#fff', alignSelf: 'flex-start', marginBottom: '8px' }}>معاينة الشعار الحالي:</h4>
            
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '24px',
              border: '2px solid rgba(223, 183, 108, 0.2)',
              background: 'rgba(7, 4, 3, 0.6)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              position: 'relative'
            }}>
              {systemLogo ? (
                <img 
                  src={systemLogo} 
                  alt="Cafe Logo" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <div style={{ fontSize: '48px' }}>☕</div>
              )}
            </div>

            <div>
              <strong style={{ fontSize: '14px', display: 'block', color: systemLogo ? 'var(--gold-primary)' : 'rgba(245,240,235,0.4)' }}>
                {systemLogo ? 'شعار الكافيه مخصص ونشط' : 'شعار كافيه ألحان الافتراضي (☕)'}
              </strong>
              <p style={{ fontSize: '11px', color: 'rgba(245,240,235,0.4)', marginTop: '4px', lineHeight: '1.5' }}>
                سيتم استبدال فنجان القهوة الافتراضي بشعار الكافيه الخاص بك في شاشة المزامنة والتحميل، صفحة الدخول، القوائم الجانبية للهاتف والكمبيوتر.
              </p>
            </div>

            {systemLogo && (
              <button 
                onClick={() => {
                  updateSystemLogo('');
                  setLogoUrlInput('');
                }}
                className="btn btn-secondary"
                style={{ 
                  color: 'var(--color-critical)',
                  borderColor: 'rgba(244, 63, 94, 0.25)',
                  background: 'rgba(244, 63, 94, 0.02)',
                  padding: '8px 16px',
                  fontSize: '12px'
                }}
                type="button"
              >
                <Trash2 size={12} /> حذف الشعار واستعادة الافتراضي
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
