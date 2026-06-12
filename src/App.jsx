import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Login';
import DashboardStats from './components/DashboardStats';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ActivityLog from './components/ActivityLog';
import TeamManagement from './components/TeamManagement';
import ArchiveList from './components/ArchiveList';
import { 
  LayoutDashboard, 
  CheckSquare, 
  PlusCircle, 
  Users, 
  History, 
  Coffee, 
  AlertTriangle, 
  ArrowRight,
  Settings,
  LogOut,
  Archive,
  X
} from 'lucide-react';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentUser, logoutUser, tasks, isCloudActive, firebaseConfig, updateFirebaseConfig } = useApp();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [rawConfig, setRawConfig] = useState(() => {
    return firebaseConfig ? JSON.stringify(firebaseConfig, null, 2) : '';
  });
  const [configError, setConfigError] = useState('');

  const getRoleLabel = (role) => {
    switch (role) {
      case 'owner': return 'صاحب الكافيه';
      case 'manager': return 'مدير فرعي';
      default: return 'موظف';
    }
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setConfigError('');
    if (!rawConfig.trim()) {
      setConfigError('يرجى إدخال كود التكوين!');
      return;
    }
    try {
      let cleaned = rawConfig.trim();
      // Allow pasting javascript copy format e.g. const config = { ... };
      if (cleaned.includes('=')) {
        cleaned = cleaned.split('=').slice(1).join('=').trim();
      }
      if (cleaned.endsWith(';')) {
        cleaned = cleaned.slice(0, -1).trim();
      }
      
      const parsed = JSON.parse(cleaned);
      if (!parsed.apiKey || !parsed.projectId) {
        setConfigError('كود التكوين غير مكتمل! يجب أن يحتوي على apiKey و projectId على الأقل.');
        return;
      }
      updateFirebaseConfig(parsed);
      setShowSettingsModal(false);
    } catch (err) {
      console.error(err);
      setConfigError('صيغة الكود غير صحيحة! يرجى إدخال كود JSON صالح.');
    }
  };

  const handleDisconnect = () => {
    updateFirebaseConfig(null);
    setRawConfig('');
    setShowSettingsModal(false);
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
      case 'archive':
        return <ArchiveList />;
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

            {currentUser.role === 'owner' && (
              <button 
                className={`sidebar-link ${activeTab === 'archive' ? 'active' : ''}`}
                onClick={() => setActiveTab('archive')}
              >
                <Archive size={18} />
                <span>أرشيف المهام</span>
              </button>
            )}
          </nav>
        </div>

        {/* User Card & Logout in Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card" style={{ marginBottom: '12px' }}>
            <div className="sidebar-user-avatar">{currentUser.avatar}</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{currentUser.name}</span>
              <span className="sidebar-user-role">{getRoleLabel(currentUser.role)}</span>
            </div>
          </div>

          <button 
            className="btn btn-secondary" 
            onClick={logoutUser}
            style={{ 
              width: '100%', 
              padding: '8px 12px', 
              fontSize: '12px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '8px', 
              color: 'var(--color-critical)', 
              borderColor: 'rgba(244,63,94,0.15)', 
              background: 'rgba(244,63,94,0.02)' 
            }}
          >
            <LogOut size={14} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        
        {/* Simple Top Bar */}
        <header className="glass-panel" style={{ 
          margin: '24px 32px 0 32px', 
          padding: '12px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>☕</span>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>فرع الكافيه الرئيسي | الإدارة النشطة</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(245, 240, 235, 0.4)', direction: 'ltr' }}>
              {isCloudActive ? "سحابي 🟢" : "محلي 🔴"} | v1.3.0
            </span>
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowSettingsModal(true)}
              style={{ padding: '6px', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
              title="إعدادات الاتصال السحابي"
            >
              <Settings size={16} style={{ color: 'rgba(245, 240, 235, 0.7)' }} />
            </button>
          </div>
        </header>

        {/* Dynamic Render Page View */}
        <main className="main-content">
          {renderView()}
        </main>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-slide-in" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3>إعدادات الربط السحابي (Firebase)</h3>
              <button 
                onClick={() => setShowSettingsModal(false)} 
                className="btn-danger-text"
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span className="badge" style={{ 
                backgroundColor: isCloudActive ? 'var(--color-success-bg)' : 'var(--color-critical-bg)', 
                color: isCloudActive ? 'var(--color-success)' : 'var(--color-critical)',
                border: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '10px'
              }}>
                {isCloudActive ? 'حالة النظام: متصل بقاعدة Firestore 🟢' : 'حالة النظام: تخزين محلي محدود 🔴'}
              </span>
              <p style={{ fontSize: '13px', color: 'rgba(245,240,235,0.6)', lineHeight: '1.6' }}>
                الصق كود تكوين الـ Web SDK الخاص بـ Firebase (Firestore) بالأسفل لتفعيل تخزين ومزامنة البيانات بالوقت الفعلي بين كافة الأجهزة فوراً.
              </p>
            </div>

            <form onSubmit={handleSaveConfig}>
              <div className="form-group">
                <label>كود التكوين (JSON Config Object):</label>
                <textarea
                  value={rawConfig}
                  onChange={(e) => setRawConfig(e.target.value)}
                  placeholder={`{
  "apiKey": "AIzaSy...",
  "authDomain": "alhan-daily-tasks.firebaseapp.com",
  "projectId": "alhan-daily-tasks",
  "storageBucket": "alhan-daily-tasks.appspot.com",
  "messagingSenderId": "...",
  "appId": "..."
}`}
                  className="form-textarea"
                  style={{ fontFamily: 'var(--font-family-en)', fontSize: '12px', minHeight: '150px', direction: 'ltr', textAlign: 'left' }}
                  required
                />
              </div>

              {configError && (
                <div style={{ color: 'var(--color-critical)', fontSize: '12px', fontWeight: 600, marginBottom: '12px' }}>
                  ⚠️ {configError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                {isCloudActive && (
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleDisconnect}
                    style={{ color: 'var(--color-critical)', borderColor: 'rgba(244,63,94,0.2)' }}
                  >
                    إلغاء الربط السحابي
                  </button>
                )}
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowSettingsModal(false)}
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  حفظ وتفعيل الربط
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AppContent() {
  const { currentUser } = useApp();

  // If no user is logged in, show the Login screen
  if (!currentUser) {
    return <Login />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
