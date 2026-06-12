import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, Trash2, Clock, User, AlertTriangle, Search, Filter, Tag, CheckSquare, Coffee, Sparkles, Package, CreditCard, Lock, HelpCircle, Archive } from 'lucide-react';

export default function TaskList() {
  const { tasks, users, currentUser, toggleTaskStatus, deleteTask, deleteAllTasks, archiveTask } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, completed
  const [criticalFilter, setCriticalFilter] = useState('all'); // all, critical
  const [categoryFilter, setCategoryFilter] = useState('all'); // all, preparations, cleaning, etc.
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [assigneeFilter, setAssigneeFilter] = useState(() => {
    // If staff, default to filtering their own tasks
    return currentUser.role === 'staff' ? currentUser.id : 'all';
  });

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

  // Find user details by ID
  const getUserById = (id) => users.find(u => u.id === id) || { name: 'مستخدم محذوف', avatar: '❓', role: 'staff' };

  // Filter logic
  const filteredTasks = tasks.filter(task => {
    if (task.isArchived) return false;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'pending' && task.status === 'pending') ||
                          (statusFilter === 'completed' && task.status === 'completed');

    const matchesCritical = criticalFilter === 'all' || 
                            (criticalFilter === 'critical' && task.isCritical);

    const matchesCategory = categoryFilter === 'all' || 
                            task.category === categoryFilter;

    const matchesAssignee = assigneeFilter === 'all' || 
                            task.assignedTo === assigneeFilter;

    return matchesSearch && matchesStatus && matchesCritical && matchesCategory && matchesAssignee;
  });

  const canDeleteTask = (task) => {
    // Owner can delete any task
    // Manager/Creator can delete tasks they created
    return currentUser.role === 'owner' || task.assignedBy === currentUser.id;
  };

  return (
    <div className="main-dashboard-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
        <div>
          <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquare style={{ color: 'var(--gold-primary)' }} />
            المهام اليومية النشطة
          </h3>
          <p style={{ fontSize: '13px', color: 'rgba(245,240,235,0.5)', marginTop: '4px' }}>
            إدارة ومتابعة وتأكيد المهام اليومية المطلوبة من فريق العمل
          </p>
        </div>

        {currentUser.role === 'owner' && tasks.filter(t => !t.isArchived).length > 0 && (
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
            تصفير وحذف كافة المهام
          </button>
        )}
      </div>

      {/* Search & Filters Panel */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,240,235,0.4)' }} />
          <input
            type="text"
            placeholder="ابحث عن مهمة يومية بالاسم أو التفاصيل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingRight: '40px' }}
          />
        </div>

        {/* Filters Grid */}
        <div className="task-filters">
          {/* Status Tabs */}
          <div className="filter-tabs">
            <button 
              className={`filter-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              الكل ({tasks.length})
            </button>
            <button 
              className={`filter-tab-btn ${statusFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('pending')}
            >
              المعلقة ({tasks.filter(t => t.status === 'pending').length})
            </button>
            <button 
              className={`filter-tab-btn ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('completed')}
            >
              المكتملة ({tasks.filter(t => t.status === 'completed').length})
            </button>
          </div>

          {/* Quick Filters selects */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', width: '100%', justifyContent: 'flex-start', marginTop: '4px' }}>
            
            {/* Criticality Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} style={{ color: 'var(--gold-primary)' }} />
              <select 
                value={criticalFilter} 
                onChange={(e) => setCriticalFilter(e.target.value)}
                className="form-select"
                style={{ padding: '6px 12px', fontSize: '12px', width: 'auto', minWidth: '120px' }}
              >
                <option value="all">كل درجات الأهمية</option>
                <option value="critical">مهام حرجة فقط ⚠️</option>
              </select>
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={14} style={{ color: 'var(--gold-primary)' }} />
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="form-select"
                style={{ padding: '6px 12px', fontSize: '12px', width: 'auto', minWidth: '120px' }}
              >
                <option value="all">كل التصنيفات</option>
                <option value="preparations">تجهيز وتحضير</option>
                <option value="cleaning">نظافة وتعقيم</option>
                <option value="inventory">جرد ومخزون</option>
                <option value="customer_service">خدمة وكاشير</option>
                <option value="closing">إغلاق</option>
              </select>
            </div>

            {/* Assignee Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} style={{ color: 'var(--gold-primary)' }} />
              <select 
                value={assigneeFilter} 
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="form-select"
                style={{ padding: '6px 12px', fontSize: '12px', width: 'auto', minWidth: '150px' }}
              >
                <option value="all">كل الموظفين والمديرين</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.avatar} {u.name} {u.id === currentUser.id ? '(أنت)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* My Tasks Quick Filter for Staff */}
            {currentUser.role === 'staff' && assigneeFilter !== currentUser.id && (
              <button 
                className="btn btn-secondary"
                onClick={() => setAssigneeFilter(currentUser.id)}
                style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--border-radius-sm)' }}
              >
                عرض مهامي فقط 🔍
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="tasks-cards-list">
        {filteredTasks.length === 0 ? (
          <div className="glass-panel no-tasks-state">
            <CheckSquare className="no-tasks-icon" size={48} />
            <h3>لا توجد مهام مطابقة للبحث</h3>
            <p style={{ fontSize: '13px' }}>ابدأ بإسناد مهام جديدة اليوم أو قم بتغيير الفلاتر أعلاه.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const assignee = getUserById(task.assignedTo);
            const assigner = getUserById(task.assignedBy);
            const completer = task.completedBy ? getUserById(task.completedBy) : null;
            const isTaskCritical = task.isCritical && task.status === 'pending';

            return (
              <div 
                key={task.id} 
                className={`glass-panel task-card ${task.status === 'completed' ? 'completed' : ''} ${isTaskCritical ? 'critical-glow-border animate-slide-in' : 'animate-slide-in'}`}
              >
                <div className="task-card-header">
                  {/* Round Checkbox for completion */}
                  <button 
                    onClick={() => toggleTaskStatus(task.id)}
                    className="checkbox-round"
                    title={task.status === 'completed' ? 'إعادة فتح المهمة' : 'إتمام المهمة'}
                  >
                    <Check size={14} />
                  </button>

                  <div className="task-card-title-sec" style={{ flex: 1, paddingRight: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="task-card-title">{task.title}</span>
                      
                      {/* Critical badge */}
                      {task.isCritical && (
                        <span className={`badge badge-critical ${isTaskCritical ? 'pulse-critical-badge' : ''}`}>
                          <AlertTriangle size={10} /> حرجة للغاية
                        </span>
                      )}

                      {/* Category Badge */}
                      <span className="badge badge-normal" style={{ fontSize: '10px' }}>
                        {getCategoryIcon(task.category)}
                        <span style={{ marginRight: '4px' }}>{getCategoryLabel(task.category)}</span>
                      </span>
                    </div>

                    {task.description && (
                      <p className="task-card-desc" style={{ marginTop: '6px' }}>{task.description}</p>
                    )}
                  </div>

                  {/* Actions Group */}
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {currentUser.role === 'owner' && task.status === 'completed' && (
                      <button 
                        onClick={() => archiveTask(task.id)}
                        title="أرشفة المهمة"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center' }}
                      >
                        <Archive size={16} />
                      </button>
                    )}
                    
                    {canDeleteTask(task) && (
                      <button 
                        onClick={() => setTaskToDelete(task)}
                        className="btn-danger-text"
                        title="حذف المهمة"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="task-card-footer">
                  <div className="task-meta-group">
                    <span className="task-meta-item">
                      <Clock size={12} />
                      تسليم: {task.dueTime}
                    </span>
                    <span className="user-badge-tag">
                      <span>المنفذ:</span>
                      <span style={{ fontSize: '13px' }}>{assignee.avatar}</span>
                      <strong>{assignee.name}</strong>
                    </span>
                    <span style={{ fontSize: '11px', opacity: 0.6 }}>
                      بواسطة: {assigner.name}
                    </span>
                  </div>

                  {task.status === 'completed' && task.completedAt && (
                    <div style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={12} />
                      تم الإنجاز بواسطة {completer ? completer.name : 'غير معروف'}
                    </div>
                  )}
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
                <h3 style={{ fontSize: '16px', color: '#fff' }}>تأكيد حذف المهمة</h3>
                <p style={{ fontSize: '13px', color: 'rgba(245,240,235,0.6)', marginTop: '8px', lineHeight: '1.6' }}>
                  هل أنت متأكد من حذف المهمة: <strong>"{taskToDelete.title}"</strong>؟
                  <br />
                  <span style={{ color: 'var(--color-critical)', fontWeight: 600, fontSize: '12px' }}>تحذير: سيتم إزالة المهمة نهائياً ولا يمكن التراجع عنها.</span>
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

      {/* Delete All Tasks Confirmation Modal */}
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
                <h3 style={{ fontSize: '16px', color: '#fff' }}>تأكيد تصفير وحذف كافة المهام</h3>
                <p style={{ fontSize: '13px', color: 'rgba(245,240,235,0.6)', marginTop: '8px', lineHeight: '1.6' }}>
                  هل أنت متأكد من حذف <strong>كافة المهام اليومية</strong> نهائياً من النظام؟
                  <br />
                  <span style={{ color: 'var(--color-critical)', fontWeight: 600, fontSize: '12px' }}>تحذير: هذا الإجراء سيقوم بحذف كافة المهام ولا يمكن استعادتها أبداً!</span>
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
                    deleteAllTasks();
                    setShowDeleteAllConfirm(false);
                  }}
                  style={{ 
                    flex: 1, 
                    background: 'linear-gradient(135deg, var(--color-critical) 0%, #c2185b 100%)', 
                    color: '#fff', 
                    boxShadow: '0 4px 15px rgba(244, 63, 94, 0.25)' 
                  }}
                >
                  تأكيد تصفير المهام
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
