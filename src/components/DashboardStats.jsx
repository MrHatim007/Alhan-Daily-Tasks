import React from 'react';
import { useApp } from '../context/AppContext';
import { ClipboardList, CheckCircle2, AlertTriangle, Percent } from 'lucide-react';

export default function DashboardStats({ setActiveTab }) {
  const { tasks } = useApp();

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = total - completed;
  const criticalPending = tasks.filter(t => t.isCritical && t.status === 'pending').length;
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleCardClick = (status, critical) => {
    localStorage.setItem('alhan_filter_status', status);
    localStorage.setItem('alhan_filter_critical', critical);
    if (setActiveTab) {
      setActiveTab('tasks');
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
    </div>
  );
}
