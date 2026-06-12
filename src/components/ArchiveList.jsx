import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Archive, Trash2, RotateCcw, Clock, CheckSquare, Search, Tag, Coffee, Sparkles, Package, CreditCard, Lock, HelpCircle } from 'lucide-react';

export default function ArchiveList() {
  const { tasks, users, unarchiveTask, deleteTask } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'preparations': return <Coffee size={14} />;
      case 'cleaning': return <Sparkles size={14} />;
      case 'inventory': return <Package size={14} />;
      case 'customer_service': return <CreditCard size={14} />;
      case 'closing': return <Lock size={14} />;
      default: return <HelpCircle size={14} />;
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'preparations': return 'تحضير';
      case 'cleaning': return 'تنظيف';
      case 'inventory': return 'جرد ومخزون';
      case 'customer_service': return 'خدمة وكاشير';
      case 'closing': return 'إغلاق';
      default: return 'أخرى';
    }
  };

  const getUserById = (id) => users.find(u => u.id === id) || { name: 'مستخدم محذوف', avatar: '❓' };

  // Filter only archived tasks matching search and category
  const archivedTasks = tasks.filter(task => {
    if (!task.isArchived) return false;

    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }) + ' ' + date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="main-dashboard-container">
      {/* Header */}
      <div>
        <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Archive style={{ color: 'var(--gold-primary)' }} />
          أرشيف المهام اليومية المكتملة
        </h3>
        <p style={{ fontSize: '13px', color: 'rgba(245,240,235,0.5)', marginTop: '4px' }}>
          استعراض المهام اليومية المكتملة المؤرشفة والقدرة على إدارتها أو حذفها نهائياً
        </p>
      </div>

      {/* Filters Panel */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,240,235,0.4)' }} />
          <input
            type="text"
            placeholder="ابحث في الأرشيف عن مهمة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingRight: '40px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Tag size={14} style={{ color: 'var(--gold-primary)' }} />
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select"
            style={{ padding: '6px 12px', fontSize: '12px', width: 'auto', minWidth: '150px' }}
          >
            <option value="all">كل التصنيفات</option>
            <option value="preparations">تجهيز وتحضير</option>
            <option value="cleaning">نظافة وتعقيم</option>
            <option value="inventory">جرد ومخزون</option>
            <option value="customer_service">خدمة وكاشير</option>
            <option value="closing">إغلاق</option>
          </select>
        </div>
      </div>

      {/* Archive List Cards */}
      <div className="tasks-cards-list">
        {archivedTasks.length === 0 ? (
          <div className="glass-panel no-tasks-state">
            <Archive className="no-tasks-icon" size={48} />
            <h3>الأرشيف فارغ حالياً</h3>
            <p style={{ fontSize: '13px' }}>لم يتم أرشفة أي مهام مكتملة بعد.</p>
          </div>
        ) : (
          archivedTasks.map((task) => {
            const assignee = getUserById(task.assignedTo);
            const assigner = getUserById(task.assignedBy);
            const completer = task.completedBy ? getUserById(task.completedBy) : null;

            return (
              <div 
                key={task.id} 
                className="glass-panel task-card completed animate-slide-in"
                style={{ opacity: 0.8 }}
              >
                <div className="task-card-header">
                  <div className="task-card-title-sec" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="task-card-title">{task.title}</span>
                      <span className="badge badge-normal" style={{ fontSize: '10px' }}>
                        {getCategoryIcon(task.category)}
                        <span style={{ marginRight: '4px' }}>{getCategoryLabel(task.category)}</span>
                      </span>
                    </div>
                    {task.description && (
                      <p className="task-card-desc" style={{ marginTop: '6px' }}>{task.description}</p>
                    )}
                  </div>

                  {/* Archive actions: Restore & Delete permanently */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => unarchiveTask(task.id)}
                      title="استعادة المهمة للقائمة النشطة"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', color: 'var(--color-success)', display: 'flex', alignItems: 'center' }}
                    >
                      <RotateCcw size={16} />
                    </button>
                    
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="btn-danger-text"
                      title="حذف المهمة نهائياً"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="task-card-footer">
                  <div className="task-meta-group">
                    <span className="task-meta-item">
                      <Clock size={12} />
                      تاريخ الأرشفة: {formatDateTime(task.createdAt)}
                    </span>
                    <span className="user-badge-tag">
                      <span>المنفذ:</span>
                      <span style={{ fontSize: '13px' }}>{assignee.avatar}</span>
                      <strong>{assignee.name}</strong>
                    </span>
                  </div>

                  <div style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: '11px' }}>
                    تم الإنجاز بواسطة {completer ? completer.name : 'غير معروف'} في {formatDateTime(task.completedAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
