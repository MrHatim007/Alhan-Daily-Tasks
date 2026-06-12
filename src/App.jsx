import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import UserSelector from './components/UserSelector';
import DashboardStats from './components/DashboardStats';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ActivityLog from './components/ActivityLog';
import TeamManagement from './components/TeamManagement';
import { 
  LayoutDashboard, 
  CheckSquare, 
  PlusCircle, 
  Users, 
  History, 
  Coffee, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentUser, tasks } = useApp();

  const getRoleLabel = (role) => {
    switch (role) {
      case 'owner': return 'صاحب الكافيه';
      case 'manager': return 'مدير فرعي';
      default: return 'موظف';
    }
  };

  // Get only critical pending tasks for the dashboard overview
  const criticalPendingTasks = tasks.filter(t => t.isCritical && t.status === 'pending');

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header Greeting */}
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 800 }}>مرحباً بك، {currentUser.name} 👋</h2>
              <p style={{ fontSize: '13px', color: 'rgba(245,240,235,0.5)', marginTop: '4px' }}>
                نظرة عامة على سير العمل والنشاطات الحالية لكافيه ألحان اليوم.
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <DashboardStats />

            {/* Sub-grid for critical tasks and recent log overview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', flexWrap: 'wrap' }} className="dashboard-grid">
              
              {/* Critical Alert Tasks Box */}
              <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '15px', color: 'var(--color-critical)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} /> مهام عاجلة وحرجة تحتاج للتنفيذ فوراً ({criticalPendingTasks.length})
                </h4>
                
                {criticalPendingTasks.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(245,240,235,0.4)', fontSize: '13px' }}>
                    🎉 رائع! لا توجد مهام حرجة معلقة حالياً. جميع الأعمال الأساسية تمت بكفاءة.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {criticalPendingTasks.map(task => (
                      <div key={task.id} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRight: '3px solid var(--color-critical)' }}>
                        <div>
                          <strong style={{ fontSize: '14px', color: '#fff' }}>{task.title}</strong>
                          <div style={{ fontSize: '11px', color: 'rgba(245,240,235,0.5)', marginTop: '4px' }}>
                            وقت التسليم: {task.dueTime}
                          </div>
                        </div>
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => setActiveTab('tasks')}
                          style={{ padding: '6px 12px', fontSize: '11px' }}
                        >
                          عرض وتأكيد <ArrowRight size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Activity Log Box */}
              <ActivityLog />

            </div>
          </div>
        );
      case 'tasks':
        return <TaskList />;
      case 'assign':
        return <TaskForm />;
      case 'team':
        return <TeamManagement />;
      case 'logs':
        return <ActivityLog />;
      default:
        return <div>التبويب غير متوفر</div>;
    }
  };

  return (
    <div className="app-layout">
      {/* 1. Sidebar Panel */}
      <aside className="glass-panel sidebar">
        <div>
          {/* Logo */}
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Coffee size={24} />
            </div>
            <div className="sidebar-logo-title">
              <h1>كافيه ألحان</h1>
              <p>Daily Tasks System</p>
            </div>
          </div>

          {/* Menu Links */}
          <nav className="sidebar-menu">
            <button 
              className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>لوحة التحكم</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              <CheckSquare size={18} />
              <span>المهام اليومية</span>
            </button>

            {(currentUser.role === 'owner' || currentUser.role === 'manager') && (
              <button 
                className={`sidebar-link ${activeTab === 'assign' ? 'active' : ''}`}
                onClick={() => setActiveTab('assign')}
              >
                <PlusCircle size={18} />
                <span>إسناد مهمة</span>
              </button>
            )}

            <button 
              className={`sidebar-link ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => setActiveTab('team')}
            >
              <Users size={18} />
              <span>فريق العمل</span>
            </button>

            <button 
              className={`sidebar-link ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              <History size={18} />
              <span>سجل النشاطات</span>
            </button>
          </nav>
        </div>

        {/* User Card in Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="sidebar-user-avatar">{currentUser.avatar}</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{currentUser.name}</span>
              <span className="sidebar-user-role">{getRoleLabel(currentUser.role)}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        
        {/* User Switcher Banner always available at the top */}
        <div style={{ padding: '24px 32px 0 32px' }}>
          <UserSelector />
        </div>

        {/* Dynamic Render Page View */}
        <main className="main-content">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
