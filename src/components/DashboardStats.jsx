import React from 'react';
import { useApp } from '../context/AppContext';
import { ClipboardList, CheckCircle2, AlertTriangle, Percent, Archive } from 'lucide-react';

export default function DashboardStats({ setActiveTab, currentUserPermission }) {
  const { tasks } = useApp();

  const activeTasks = tasks.filter(t => !t.isArchived);
  const total = activeTasks.length;
  const completed = activeTasks.filter(t => t.status === 'completed').length;
  const pending = total - completed;
  const criticalPending = activeTasks.filter(t => t.isCritical && t.status === 'pending').length;
  const archivedCount = tasks.filter(t => t.isArchived).length;
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleCardClick = (status, critical, targetTab = 'tasks') => {
    localStorage.setItem('alhan_filter_status', status);
    localStorage.setItem('alhan_filter_critical', critical);
    if (setActiveTab) {
      setActiveTab(targetTab);
    }
  };

  return (
    <div className="stats-cards-container">
      {/* Total Tasks Card */}
      <div 
        className="glass-panel stat-card clickable-card" 
        onClick={() => handleCardClick('all', 'all')}
        style={{ cursor: 'pointer' }}
      >
        <div className="stat-icon" style={{ backgroundColor: 'var(--gold-dim)', color: 'var(--gold-primary)' }}>
          <ClipboardList size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{total}</span>
          <span className="stat-label">إجمالي المهام اليومية</span>
        </div>
      </div>

      {/* Completed Tasks Card */}
      <div 
        className="glass-panel stat-card clickable-card" 
        onClick={() => handleCardClick('completed', 'all')}
        style={{ cursor: 'pointer' }}
      >
        <div className="stat-icon" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
          <CheckCircle2 size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{completed}</span>
          <span className="stat-label">المهام المكتملة</span>
        </div>
      </div>

      {/* Critical Pending Tasks Card */}
      <div 
        className={`glass-panel stat-card clickable-card ${criticalPending > 0 ? 'pulse-critical-badge' : ''}`} 
        onClick={() => handleCardClick('pending', 'urgent')}
        style={{ 
          border: criticalPending > 0 ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--glass-border)',
          backgroundColor: criticalPending > 0 ? 'rgba(244, 63, 94, 0.08)' : 'var(--glass-bg)',
          cursor: 'pointer'
        }}
      >
        <div className="stat-icon" style={{ 
          backgroundColor: criticalPending > 0 ? 'var(--color-critical-bg)' : 'rgba(255,255,255,0.03)', 
          color: criticalPending > 0 ? 'var(--color-critical)' : 'rgba(255,255,255,0.4)' 
        }}>
          <AlertTriangle size={24} className={criticalPending > 0 ? 'animate-pulse' : ''} />
        </div>
        <div className="stat-info">
          <span className="stat-value" style={{ color: criticalPending > 0 ? 'var(--color-critical)' : '#fff' }}>
            {criticalPending}
          </span>
          <span className="stat-label">مهام حرجة معلقة ⚠️</span>
        </div>
      </div>

      {/* Completion Rate Card */}
      <div 
        className="glass-panel stat-card clickable-card" 
        onClick={() => handleCardClick('completed', 'all')}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '10px', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
            <Percent size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{completionRate}%</span>
            <span className="stat-label">معدل الإنجاز اليومي</span>
          </div>
        </div>
        
        {/* Animated Progress Bar */}
        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-espresso-light)', borderRadius: '3px', overflow: 'hidden', marginTop: '4px' }}>
          <div 
            style={{ 
              width: `${completionRate}%`, 
              height: '100%', 
              background: 'linear-gradient(to left, var(--gold-primary), var(--color-success))',
              borderRadius: '3px',
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }} 
          />
        </div>
      </div>

      {/* Archived Tasks Card (Owner Only) */}
      {currentUserPermission === 'owner' && (
        <div 
          className="glass-panel stat-card clickable-card" 
          onClick={() => handleCardClick('all', 'all', 'archive')}
          style={{ cursor: 'pointer', border: '1px solid rgba(223, 183, 108, 0.25)' }}
        >
          <div className="stat-icon" style={{ backgroundColor: 'rgba(223, 183, 108, 0.08)', color: 'var(--gold-primary)' }}>
            <Archive size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{ color: 'var(--gold-primary)' }}>{archivedCount}</span>
            <span className="stat-label">أرشيف المهام المكتملة</span>
          </div>
        </div>
      )}
    </div>
  );
}
