import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlusCircle, AlertTriangle, ShieldAlert, Clock, Check } from 'lucide-react';

export default function TaskForm() {
  const { users, currentUser, addTask } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('preparations');
  const [assignedTo, setAssignedTo] = useState('');
  const [isCritical, setIsCritical] = useState(false);
  const [dueTime, setDueTime] = useState('12:00');
  const [successMsg, setSuccessMsg] = useState(false);

  // Check if current user has permission to add tasks
  const canAssign = currentUser.role === 'owner' || currentUser.role === 'manager';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !assignedTo) return;

    addTask({
      title,
      description,
      category,
      assignedTo,
      isCritical,
      dueTime
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setCategory('preparations');
    setAssignedTo('');
    setIsCritical(false);
    setDueTime('12:00');

    // Show temporary success feedback
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'preparations': return 'تجهيز وتحضير ☕';
      case 'cleaning': return 'نظافة وتعقيم 🧼';
      case 'inventory': return 'جرد ومخزون 📦';
      case 'customer_service': return 'خدمة وكاشير 💳';
      case 'closing': return 'إغلاق الكافيه 🔒';
      default: return 'أخرى 📝';
    }
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
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.avatar} {u.name} ({u.role === 'owner' ? 'صاحب الكافيه' : u.role === 'manager' ? 'مدير' : 'موظف'})
              </option>
            ))}
          </select>
        </div>

        {/* Category & Due Time Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>تصنيف المهمة:</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
            >
              <option value="preparations">تجهيز وتحضير</option>
              <option value="cleaning">نظافة وتعقيم</option>
              <option value="inventory">جرد ومخزون</option>
              <option value="customer_service">خدمة وكاشير</option>
              <option value="closing">إغلاق الكافيه</option>
              <option value="other">أخرى</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} /> وقت التسليم المستهدف:
            </label>
            <input 
              type="time" 
              value={dueTime} 
              onChange={(e) => setDueTime(e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Critical Task Checkbox */}
        <div className="form-group" style={{ marginTop: '8px', marginBottom: '16px' }}>
          <label className="form-checkbox-container">
            <input 
              type="checkbox" 
              checked={isCritical} 
              onChange={(e) => setIsCritical(e.target.checked)}
            />
            <span className="form-custom-checkbox" style={{ borderColor: isCritical ? 'var(--color-critical)' : 'rgba(223, 183, 108, 0.3)' }}>
              {isCritical && <Check size={14} style={{ color: 'var(--bg-espresso-black)' }} />}
            </span>
            <span style={{ color: isCritical ? 'var(--color-critical)' : 'rgba(245, 240, 235, 0.8)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isCritical && <AlertTriangle size={14} className="animate-pulse" />}
              هذه مهمة حرجة للغاية (Critical Task) ⚠️
            </span>
          </label>
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
