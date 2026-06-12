import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { History, PlusCircle, CheckCircle, RotateCcw, UserPlus, UserSquare, Trash, AlertTriangle } from 'lucide-react';

export default function ActivityLog() {
  const { activities, clearActivities, currentUser } = useApp();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={18} style={{ color: 'var(--gold-primary)' }} />
          <h3 style={{ fontSize: '15px', margin: 0 }}>سجل النشاطات الفوري (Activity Log):</h3>
        </div>
        {currentUser?.role === 'owner' && activities.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="btn-danger-text"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
            title="مسح سجل النشاطات بالكامل"
          >
            <Trash size={14} />
            <span>مسح السجل</span>
          </button>
        )}
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

      {/* Clear Log Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
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
                <h3 style={{ fontSize: '16px', color: '#fff' }}>تأكيد مسح سجل النشاطات</h3>
                <p style={{ fontSize: '13px', color: 'rgba(245,240,235,0.6)', marginTop: '8px', lineHeight: '1.6' }}>
                  هل أنت متأكد من مسح سجل النشاطات بالكامل؟ سيتم إفراغ السجل ولا يمكن استعادته.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '8px' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowClearConfirm(false)}
                  style={{ flex: 1 }}
                >
                  إلغاء
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    clearActivities();
                    setShowClearConfirm(false);
                  }}
                  style={{ 
                    flex: 1, 
                    background: 'linear-gradient(135deg, var(--color-critical) 0%, #c2185b 100%)', 
                    color: '#fff', 
                    boxShadow: '0 4px 15px rgba(244, 63, 94, 0.25)' 
                  }}
                >
                  مسح الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
