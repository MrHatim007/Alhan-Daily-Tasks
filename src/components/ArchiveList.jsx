import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Archive, Trash2, RotateCcw, Clock, Search, Tag, AlertTriangle } from 'lucide-react';

export default function ArchiveList() {
  const { 
    tasks, users, unarchiveTask, deleteTask, 
    categories, priorities 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  const getTaskCategory = (task) => {
    return categories.find(c => c.id === task.category) || { label: 'أخرى', emoji: '📝' };
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

  const formatDueDateTime = (dueDateTimeStr, dueTimeStr) => {
    if (dueDateTimeStr) {
      try {
        if (dueDateTimeStr.length === 10) {
          const [year, month, day] = dueDateTimeStr.split('-').map(Number);
          const localDate = new Date(year, month - 1, day);
          return localDate.toLocaleDateString('ar-EG', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
          });
        }
        const date = new Date(dueDateTimeStr);
        return date.toLocaleDateString('ar-EG', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      } catch (e) {
        return dueDateTimeStr;
      }
    }
    return dueTimeStr ? `الساعة ${dueTimeStr}` : 'غير محدد';
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
        <div>
          <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Archive style={{ color: 'var(--gold-primary)' }} />
            أرشيف المهام اليومية المكتملة
          </h3>
          <p style={{ fontSize: '13px', color: 'rgba(245,240,235,0.5)', marginTop: '4px' }}>
            استعراض المهام اليومية المكتملة المؤرشفة والقدرة على إدارتها أو حذفها نهائياً
          </p>
        </div>

        {tasks.filter(t => t.isArchived).length > 0 && (
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowDeleteAllConfirm(true)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              color: 'var(--color-critical)', 
              borderColor: 'rgba(244, 63, 94, 0.2)',
              backgroundColor: 'rgba(244, 63, 94, 0.05)'
            }}
          >
            <Trash2 size={16} />
            حذف كافة الأرشيف نهائياً
          </button>
        )}
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
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.label}
              </option>
            ))}
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
            const completer = task.completedBy ? getUserById(task.completedBy) : null;
            const taskCategory = getTaskCategory(task);

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
                        <span>{taskCategory.emoji}</span>
                        <span style={{ marginRight: '4px' }}>{taskCategory.label}</span>
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
                      onClick={() => setTaskToDelete(task)}
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
                      تاريخ التسليم: {formatDueDateTime(task.dueDateTime, task.dueTime)}
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

      {/* Task Deletion Confirmation Modal */}
      {taskToDelete && (
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
                <h3 style={{ fontSize: '16px', color: '#fff' }}>تأكيد حذف المهمة المؤرشفة</h3>
                <p style={{ fontSize: '13px', color: 'rgba(245,240,235,0.6)', marginTop: '8px', lineHeight: '1.6' }}>
                  هل أنت متأكد من حذف المهمة المؤرشفة: <strong>"{taskToDelete.title}"</strong> نهائياً؟
                  <br />
                  <span style={{ color: 'var(--color-critical)', fontWeight: 600, fontSize: '12px' }}>تحذير: هذا الإجراء سيحذف المهمة نهائياً من قاعدة البيانات ولا يمكن استعادتها.</span>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '8px' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setTaskToDelete(null)}
                  style={{ flex: 1 }}
                >
                  إلغاء
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    deleteTask(taskToDelete.id);
                    setTaskToDelete(null);
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

      {/* Delete All Archive Confirmation Modal */}
      {showDeleteAllConfirm && (
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
                <h3 style={{ fontSize: '16px', color: '#fff' }}>تأكيد مسح الأرشيف بالكامل</h3>
                <p style={{ fontSize: '13px', color: 'rgba(245,240,235,0.6)', marginTop: '8px', lineHeight: '1.6' }}>
                  هل أنت متأكد من حذف <strong>جميع المهام المؤرشفة</strong> نهائياً؟
                  <br />
                  <span style={{ color: 'var(--color-critical)', fontWeight: 600, fontSize: '12px' }}>تحذير: سيتم إفراغ الأرشيف تماماً ولا يمكن التراجع عن هذا الإجراء!</span>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '8px' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteAllConfirm(false)}
                  style={{ flex: 1 }}
                >
                  إلغاء
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    // Delete all archived tasks
                    tasks.filter(t => t.isArchived).forEach(t => deleteTask(t.id));
                    setShowDeleteAllConfirm(false);
                  }}
                  style={{ 
                    flex: 1, 
                    background: 'linear-gradient(135deg, var(--color-critical) 0%, #c2185b 100%)', 
                    color: '#fff', 
                    boxShadow: '0 4px 15px rgba(244, 63, 94, 0.25)' 
                  }}
                >
                  تأكيد مسح الأرشيف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
