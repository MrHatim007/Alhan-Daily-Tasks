import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Login';
import DashboardStats from './components/DashboardStats';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ActivityLog from './components/ActivityLog';
import TeamManagement from './components/TeamManagement';
import ArchiveList from './components/ArchiveList';
import Settings from './components/Settings';
import { 
  LayoutDashboard, 
  CheckSquare, 
  PlusCircle, 
  Users, 
  History, 
  Coffee, 
  AlertTriangle, 
  ArrowRight,
  LogOut,
  Archive,
  Sliders,
  Trophy
} from 'lucide-react';

function Dashboard() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('alhan_active_tab') || 'dashboard';
  });
  const { currentUser, logoutUser, tasks, isCloudActive, roles, systemLogo, users } = useApp();
  const [showInactivityModal, setShowInactivityModal] = useState(false);
  const [inactivityCountdown, setInactivityCountdown] = useState(60);
  const [showMobileMore, setShowMobileMore] = useState(false);

  const currentUserRole = roles.find(r => r.id === currentUser.role);
  const currentUserPermission = currentUserRole ? currentUserRole.permission : currentUser.role;

  useEffect(() => {
    localStorage.setItem('alhan_active_tab', activeTab);
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('alhan_active_tab');
    logoutUser();
  };

  // Inactivity tracking (Stage 1: Modal is closed)
  useEffect(() => {
    if (!currentUser || showInactivityModal) return;

    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      // Inactive for 60 seconds (1 minute) -> open warning modal
      timeoutId = setTimeout(() => {
        setShowInactivityModal(true);
        setInactivityCountdown(60); // 60 seconds warning countdown
      }, 60000);
    };

    // Listen to mouse movement, mouse clicks, keyboard presses, scroll, and touch events
    const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
    
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Start inactivity countdown
    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [currentUser, showInactivityModal]);

  // Countdown timer (Stage 2: Modal is open)
  useEffect(() => {
    if (!showInactivityModal || !currentUser) return;

    const intervalId = setInterval(() => {
      setInactivityCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          handleLogout();
          setShowInactivityModal(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [showInactivityModal, currentUser]);

  const getRoleLabel = (role) => {
    switch (role) {
      case 'owner': return 'صاحب الكافيه';
      case 'manager': return 'مدير فرعي';
      default: return 'موظف';
    }
  };

  // Config handlers removed (integrated directly in environment variables)

  // Get only critical pending tasks for the dashboard overview
  const criticalPendingTasks = tasks.filter(t => t.isCritical && t.status === 'pending');

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': {
        const leaderboard = users.map(user => {
          const completedCount = tasks.filter(t => t.assignedTo === user.id && t.status === 'completed').length;
          return { ...user, completedCount };
        }).sort((a, b) => b.completedCount - a.completedCount);

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
            <DashboardStats setActiveTab={setActiveTab} />

            {/* Sub-grid for critical tasks, leaderboard and recent logs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', flexWrap: 'wrap' }} className="dashboard-grid">
              
              {/* Right column: critical tasks & leaderboard */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

                {/* Gamified Leaderboard */}
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ fontSize: '15px', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trophy size={16} /> لوحة الصدارة ومستوى إنجاز المهام 🏆
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {leaderboard.slice(0, 5).map((u, index) => {
                      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👏';
                      const uRole = roles.find(r => r.id === u.role)?.label || 'موظف';
                      return (
                        <div 
                          key={u.id} 
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            padding: '10px 14px', 
                            borderRadius: 'var(--border-radius-md)', 
                            background: index === 0 ? 'rgba(223, 183, 108, 0.06)' : 'rgba(255,255,255,0.01)', 
                            border: index === 0 ? '1px solid rgba(223, 183, 108, 0.2)' : '1px solid transparent' 
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', minWidth: '24px', textAlign: 'center' }}>{medal}</span>
                            <span style={{ fontSize: '22px' }}>{u.avatar}</span>
                            <div>
                              <strong style={{ fontSize: '13px', color: '#fff', display: 'block' }}>{u.name}</strong>
                              <span style={{ fontSize: '10px', color: 'rgba(245,240,235,0.4)' }}>{uRole}</span>
                            </div>
                          </div>
                          <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--gold-primary)' }}>{u.completedCount}</span>
                            <span style={{ fontSize: '10px', color: 'rgba(245,240,235,0.5)', marginRight: '4px' }}>منجزة</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Left column: Activity Log (Only for Owner) or Café Banner for employees */}
              {currentUserPermission === 'owner' ? (
                <ActivityLog />
              ) : (
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '220px' }}>
                  <Coffee size={36} style={{ color: 'var(--gold-primary)', opacity: 0.6 }} />
                  <div>
                    <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '6px' }}>كافيه ألحان يرحب بك!</h4>
                    <p style={{ fontSize: '12px', color: 'rgba(245,240,235,0.5)', lineHeight: '1.6', maxWidth: '240px', margin: '0 auto' }}>
                      راجع قائمة المهام اليومية المطلوبة منك وقم بإنجازها ليرتفع ترتيبك في لوحة صدارة الكافيه اليومية.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        );
      }
      case 'tasks':
        return <TaskList />;
      case 'assign':
        return <TaskForm />;
      case 'team':
        return <TeamManagement />;
      case 'logs':
        return currentUserPermission === 'owner' ? <ActivityLog /> : <div className="glass-panel" style={{ padding: '24px', color: 'var(--color-critical)', textAlign: 'center' }}>عذراً، هذه الصفحة مخصصة لمالك الكافيه فقط!</div>;
      case 'archive':
        return <ArchiveList />;
      case 'settings':
        return <Settings />;
      default:
        return <div>التبويب غير متوفر</div>;
    }
  };

  return (
    <div className="app-layout">
      {/* Mobile Top Bar (Mobile Only) */}
      <header className="mobile-top-bar mobile-only">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--gold-dim)',
            border: '1px solid rgba(223,183,108,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px'
          }}>
            {systemLogo ? (
              <img src={systemLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '16px' }}>☕</span>
            )}
          </div>
          <span style={{ fontWeight: 800, fontSize: '15px', color: '#fff' }}>كافيه ألحان</span>
        </div>

        {/* User profile with quick logout on mobile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(245, 240, 235, 0.5)' }}>{currentUser.name.split(' ')[0]}</span>
          <button 
            onClick={handleLogout}
            style={{
              background: 'rgba(244, 63, 94, 0.05)',
              border: '1px solid rgba(244, 63, 94, 0.15)',
              color: 'var(--color-critical)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="تسجيل الخروج"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* 1. Sidebar Panel (Desktop Only) */}
      <aside className="glass-panel sidebar desktop-only">
        <div>
          {/* Logo */}
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              {systemLogo ? (
                <img src={systemLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
              ) : (
                <Coffee size={24} />
              )}
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

            {(currentUserPermission === 'owner' || currentUserPermission === 'manager') && (
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

            {currentUserPermission === 'owner' && (
              <button 
                className={`sidebar-link ${activeTab === 'logs' ? 'active' : ''}`}
                onClick={() => setActiveTab('logs')}
              >
                <History size={18} />
                <span>سجل النشاطات</span>
              </button>
            )}

            {currentUserPermission === 'owner' && (
              <button 
                className={`sidebar-link ${activeTab === 'archive' ? 'active' : ''}`}
                onClick={() => setActiveTab('archive')}
              >
                <Archive size={18} />
                <span>أرشيف المهام</span>
              </button>
            )}

            {(currentUserPermission === 'owner' || currentUserPermission === 'manager') && (
              <button 
                className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Sliders size={18} />
                <span>إعدادات النظام</span>
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
              <span className="sidebar-user-role">{currentUserRole?.label || currentUser.role}</span>
            </div>
          </div>

          <button 
            className="btn btn-secondary" 
            onClick={handleLogout}
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
        
        {/* Simple Top Bar (Desktop Only) */}
        <header className="glass-panel desktop-only" style={{ 
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
          </div>
        </header>

        {/* Dynamic Render Page View */}
        <main className="main-content">
          {renderView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Mobile Only) */}
      <nav className="mobile-bottom-nav mobile-only">
        <button 
          className={`mobile-nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('dashboard');
            setShowMobileMore(false);
          }}
        >
          <LayoutDashboard size={20} />
          <span>الرئيسية</span>
        </button>

        <button 
          className={`mobile-nav-link ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('tasks');
            setShowMobileMore(false);
          }}
        >
          <CheckSquare size={20} />
          <span>المهام</span>
        </button>

        <button 
          className={`mobile-nav-link ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('team');
            setShowMobileMore(false);
          }}
        >
          <Users size={20} />
          <span>الفريق</span>
        </button>

        <button 
          className={`mobile-nav-link ${showMobileMore ? 'active' : ''}`}
          onClick={() => setShowMobileMore(!showMobileMore)}
        >
          <Sliders size={20} />
          <span>المزيد</span>
        </button>
      </nav>

      {/* Mobile Bottom Sheet (More Menu) */}
      {showMobileMore && (
        <div className="bottom-sheet-overlay" onClick={() => setShowMobileMore(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-handle"></div>
            <div className="bottom-sheet-title">قائمة الخيارات الإضافية</div>

            {(currentUserPermission === 'owner' || currentUserPermission === 'manager') && (
              <div 
                className={`bottom-sheet-menu-item ${activeTab === 'assign' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('assign');
                  setShowMobileMore(false);
                }}
              >
                <PlusCircle size={18} />
                <span>إسناد مهمة جديدة</span>
              </div>
            )}

            {currentUserPermission === 'owner' && (
              <div 
                className={`bottom-sheet-menu-item ${activeTab === 'logs' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('logs');
                  setShowMobileMore(false);
                }}
              >
                <History size={18} />
                <span>سجل النشاطات العملياتية</span>
              </div>
            )}

            {currentUserPermission === 'owner' && (
              <div 
                className={`bottom-sheet-menu-item ${activeTab === 'archive' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('archive');
                  setShowMobileMore(false);
                }}
              >
                <Archive size={18} />
                <span>أرشيف المهام المنجزة</span>
              </div>
            )}

            {(currentUserPermission === 'owner' || currentUserPermission === 'manager') && (
              <div 
                className={`bottom-sheet-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('settings');
                  setShowMobileMore(false);
                }}
              >
                <Sliders size={18} />
                <span>إعدادات النظام وتخصيصه</span>
              </div>
            )}

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />

            <div 
              className="bottom-sheet-menu-item danger"
              onClick={() => {
                setShowMobileMore(false);
                handleLogout();
              }}
            >
              <LogOut size={18} />
              <span>تسجيل الخروج من الحساب</span>
            </div>
          </div>
        </div>
      )}

      {/* Inactivity Warning Modal */}
      {showInactivityModal && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content glass-panel animate-slide-in" style={{ 
            borderColor: 'var(--color-critical)', 
            maxWidth: '400px',
            textAlign: 'center',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            {/* Warning Icon with pulse */}
            <div className="pulse-critical-badge" style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--color-critical-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-critical)',
              fontSize: '28px'
            }}>
              <AlertTriangle size={32} />
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>تنبيه تسجيل الخروج التلقائي</h3>
              <p style={{ fontSize: '13px', color: 'rgba(245, 240, 235, 0.7)', lineHeight: '1.6' }}>
                لقد كنت غير نشط لفترة من الوقت. للحفاظ على أمان بياناتك، سيتم تسجيل خروجك تلقائياً خلال:
              </p>
            </div>

            {/* Countdown Display */}
            <div style={{
              fontSize: '36px',
              fontWeight: 800,
              color: 'var(--color-critical)',
              background: 'rgba(244, 63, 94, 0.05)',
              border: '2px solid rgba(244, 63, 94, 0.2)',
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-family-en)',
              boxShadow: '0 0 15px rgba(244, 63, 94, 0.1)'
            }}>
              {inactivityCountdown}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '10px' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowInactivityModal(false)}
                style={{ flex: 1, padding: '12px' }}
              >
                متابعة العمل
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={handleLogout}
                style={{ 
                  flex: 1, 
                  padding: '12px',
                  color: 'var(--color-critical)',
                  borderColor: 'rgba(244, 63, 94, 0.3)',
                  background: 'rgba(244, 63, 94, 0.05)'
                }}
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function AppContent() {
  const { currentUser, loading, systemLogo } = useApp();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--bg-espresso)',
        color: '#fff',
        gap: '16px'
      }}>
        {systemLogo ? (
          <img 
            src={systemLogo} 
            alt="Logo" 
            className="pulse-critical-badge" 
            style={{ 
              width: '80px', 
              height: '80px', 
              objectFit: 'contain',
              borderRadius: '16px'
            }} 
          />
        ) : (
          <div className="pulse-critical-badge" style={{ fontSize: '32px' }}>☕</div>
        )}
        <p style={{ fontSize: '14px', color: 'var(--gold-primary)', fontWeight: 600 }}>جاري مزامنة كافيه ألحان مع السحابة...</p>
      </div>
    );
  }

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
