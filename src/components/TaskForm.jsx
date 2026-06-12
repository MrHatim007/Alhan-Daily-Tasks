import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PlusCircle, ShieldAlert, Clock, Check } from 'lucide-react';

export default function TaskForm() {
  const { users, currentUser, addTask, categories, priorities, roles } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDateTime, setDueDateTime] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Set default values when categories or priorities load
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].id);
    }
  }, [categories, category]);

  useEffect(() => {
    if (priorities.length > 0 && !priority) {
      setPriority(priorities[0].id);
    }
  }, [priorities, priority]);

  // Check if current user has permission to add tasks
  const currentUserRole = roles.find(r => r.id === currentUser.role);
  const userPermission = currentUserRole ? currentUserRole.permission : currentUser.role;
  const canAssign = userPermission === 'owner' || userPermission === 'manager';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !assignedTo || !category || !priority) return;

    addTask({
      title,
      description,
      category,
      assignedTo,
      priority,
      dueDateTime
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setCategory(categories[0]?.id || '');
    setAssignedTo('');
    setPriority(priorities[0]?.id || '');
    setDueDateTime('');

    // Show temporary success feedback
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  // If user is a staff member, they cannot assign tasks
  if (!canAssign) {
    return (
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justify: 'center', color: 'rgba(245, 240, 235, 0.4)' }}>
          <ShieldAlert size={24} />
        </div>
        <h3 style={{ fontSize: '16px' }}>صلاحية إضافة المهام محدودة</h3>
        <p style={{ fontSize: '13px', color: 'rgba(245, 240, 235, 0.5)', maxWidth: '280px' }}>
          حسابك الحالي مسجل كـ <strong>موظف</strong>. يُسمح فقط للمديرين وصاحب الكافيه بإسناد المهام اليومية. يمكنك تصفح وإنجاز المهام المطلوبة منك بالأسفل.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <PlusCircle size={20} style={{ color: 'var(--gold-primary)' }} />
        <h3 style={{ fontSize: '17px' }}>إسناد مهمة يومية جديدة</h3>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        
        {/* Title */}
        <div className="form-group">
          <label>عنوان المهمة اليومية:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: تعبئة حبوب البن وتجهيز الأكواب" 
            className="form-input"
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>تفاصيل المهمة (اختياري):</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="اكتب تفاصيل إضافية لمساعدة الموظف في إنجاز المهمة بدقة..." 
            className="form-textarea"
          />
        </div>

        {/* Assigned To */}
        <div className="form-group">
          <label>المسؤول عن التنفيذ:</label>
          <select 
            value={assignedTo} 
            onChange={(e) => setAssignedTo(e.target.value)}
            className="form-select"
            required
          >
            <option value="">-- اختر مديراً أو موظفاً --</option>
            {users.map(u => {
              const uRole = roles.find(r => r.id === u.role) || { label: u.role };
              return (
                <option key={u.id} value={u.id}>
                  {u.avatar} {u.name} ({uRole.label})
                </option>
              );
            })}
          </select>
        </div>

        {/* Category & Due Time Row */}
        <div className="form-grid-2col" style={{ gap: '12px' }}>
          <div className="form-group">
            <label>تصنيف المهمة:</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
              required
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} /> تاريخ ووقت التسليم المستهدف:
            </label>
            <input 
              type="datetime-local" 
              value={dueDateTime} 
              onChange={(e) => setDueDateTime(e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Priority Dropdown */}
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label>مستوى الأهمية والسرعة:</label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            className="form-select"
            required
          >
            {priorities.map(pri => (
              <option key={pri.id} value={pri.id}>
                {pri.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          إسناد المهمة اليوم
        </button>

        {successMsg && (
          <div style={{ 
            marginTop: '12px', 
            padding: '10px', 
            borderRadius: 'var(--border-radius-sm)', 
            backgroundColor: 'var(--color-success-bg)', 
            color: 'var(--color-success)', 
            fontSize: '13px', 
            fontWeight: 600, 
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <Check size={16} /> تم إسناد المهمة بنجاح وتنبيه المنفذ!
          </div>
        )}
      </form>
    </div>
  );
}
