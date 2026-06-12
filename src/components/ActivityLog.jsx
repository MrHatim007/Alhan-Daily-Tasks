import React from 'react';
import { useApp } from '../context/AppContext';
import { History, PlusCircle, CheckCircle, RotateCcw, UserPlus, UserSquare, Trash } from 'lucide-react';

export default function ActivityLog() {
  const { activities } = useApp();

  const getActionIcon = (action) => {
    switch (action) {
      case 'create_task':
        return <PlusCircle size={14} style={{ color: 'var(--gold-primary)' }} />;
      case 'complete_task':
        return <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />;
      case 'uncomplete_task':
        return <RotateCcw size={14} style={{ color: 'rgba(245, 240, 235, 0.4)' }} />;
      case 'delete_task':
        return <Trash size={14} style={{ color: 'var(--color-critical)' }} />;
      case 'add_user':
        return <UserPlus size={14} style={{ color: 'var(--color-info)' }} />;
      case 'switch_user':
        return <UserSquare size={14} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />;
      default:
        return <History size={14} />;
    }
  };

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
        <History size={18} style={{ color: 'var(--gold-primary)' }} />
        <h3 style={{ fontSize: '15px' }}>سجل النشاطات الفوري (Activity Log):</h3>
      </div>

      <div className="activity-list">
        {activities.length === 0 ? (
          <p style={{ fontSize: '12px', color: 'rgba(245, 240, 235, 0.4)', textAlign: 'center', padding: '20px 0' }}>
            لا توجد نشاطات مسجلة بعد.
          </p>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="activity-item" style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                {getActionIcon(act.action)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: '#f5f0eb' }}>{act.details}</p>
                <span className="activity-time">
                  {formatTime(act.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
