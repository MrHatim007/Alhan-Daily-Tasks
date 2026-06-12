import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const INITIAL_USERS = [
  { id: 'owner_1', name: 'أ. أحمد (صاحب الكافيه)', role: 'owner', avatar: '👑', email: 'owner@alhan.com' },
  { id: 'manager_morning', name: 'خالد (مدير الصباح)', role: 'manager', avatar: '☀️', email: 'khaled.m@alhan.com' },
  { id: 'manager_evening', name: 'سارة (مديرة المساء)', role: 'manager', avatar: '🌙', email: 'sara.e@alhan.com' },
  { id: 'manager_inventory', name: 'عمر (مدير المخزون والطلبات)', role: 'manager', avatar: '📦', email: 'omar.i@alhan.com' },
  { id: 'staff_barista', name: 'يوسف (صانع القهوة - الباريستا)', role: 'staff', avatar: '☕', email: 'yousef.b@alhan.com' },
  { id: 'staff_cashier', name: 'لينا (الكاشير والمحاسبة)', role: 'staff', avatar: '💳', email: 'lina.c@alhan.com' }
];

const INITIAL_TASKS = [
  {
    id: 'task_1',
    title: 'معايرة مطحنة القهوة الصباحية',
    description: 'التأكد من طحن حبوب البن بالشكل الصحيح واختبار درجة الاستخلاص (Double Shot).',
    category: 'preparations',
    assignedTo: 'staff_barista',
    assignedBy: 'manager_morning',
    status: 'completed',
    isCritical: true,
    dueTime: '07:30',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    completedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    completedBy: 'staff_barista'
  },
  {
    id: 'task_2',
    title: 'جرد الحليب والمكونات الباردة',
    description: 'تسجيل كمية الحليب المتبقية وطلب كميات إضافية للمساء إذا لزم الأمر.',
    category: 'inventory',
    assignedTo: 'manager_inventory',
    assignedBy: 'owner_1',
    status: 'pending',
    isCritical: true,
    dueTime: '12:00',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    completedAt: null,
    completedBy: null
  },
  {
    id: 'task_3',
    title: 'تنظيف مكائن الاسبريسو بالكامل',
    description: 'تنظيف المجموعة الخلفية (Backflush) بالمسحوق الخاص وتنظيف أنابيب البخار.',
    category: 'cleaning',
    assignedTo: 'staff_barista',
    assignedBy: 'manager_evening',
    status: 'pending',
    isCritical: true,
    dueTime: '23:30',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago
    completedAt: null,
    completedBy: null
  },
  {
    id: 'task_4',
    title: 'مراجعة التقارير المالية والتحصيل اليومي',
    description: 'مطابقة الكاش مع تقرير المبيعات في نظام الـ POS وتسليم التقرير النهائي.',
    category: 'customer_service',
    assignedTo: 'staff_cashier',
    assignedBy: 'owner_1',
    status: 'pending',
    isCritical: false,
    dueTime: '23:45',
    createdAt: new Date().toISOString(),
    completedAt: null,
    completedBy: null
  }
];

const INITIAL_ACTIVITIES = [
  {
    id: 'act_1',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    userId: 'owner_1',
    userName: 'أ. أحمد (صاحب الكافيه)',
    action: 'create_task',
    details: 'أضاف مهمة حرجة جديدة: "جرد الحليب والمكونات الباردة" وأسندها إلى "عمر".'
  },
  {
    id: 'act_2',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    userId: 'manager_morning',
    userName: 'خالد (مدير الصباح)',
    action: 'create_task',
    details: 'أضاف مهمة حرجة: "معايرة مطحنة القهوة الصباحية" وأسندها إلى "يوسف".'
  },
  {
    id: 'act_3',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    userId: 'staff_barista',
    userName: 'يوسف (صانع القهوة - الباريستا)',
    action: 'complete_task',
    details: 'أنجز المهمة الحرجة: "معايرة مطحنة القهوة الصباحية".'
  }
];

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('alhan_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('alhan_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('alhan_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('alhan_current_user');
    // Default to owner on first load
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  // Persist states
  useEffect(() => {
    localStorage.setItem('alhan_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('alhan_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('alhan_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('alhan_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Log activity helper
  const logActivity = (action, details, userId = currentUser.id, userName = currentUser.name) => {
    const newActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId,
      userName,
      action,
      details
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 50)); // Keep last 50 activities
  };

  // Switch Current User
  const switchUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      logActivity('switch_user', `قام بالتبديل إلى حساب: ${user.name}`, user.id, user.name);
    }
  };

  // Add Task
  const addTask = ({ title, description, category, assignedTo, isCritical, dueTime }) => {
    const assignedUser = users.find(u => u.id === assignedTo);
    const newTask = {
      id: `task_${Date.now()}`,
      title,
      description,
      category,
      assignedTo,
      assignedBy: currentUser.id,
      status: 'pending',
      isCritical,
      dueTime,
      createdAt: new Date().toISOString(),
      completedAt: null,
      completedBy: null
    };

    setTasks(prev => [newTask, ...prev]);
    logActivity(
      'create_task',
      `أضاف مهمة ${isCritical ? 'حرجة ⚠️' : 'عادية'} جديدة: "${title}" وأسندها إلى "${assignedUser ? assignedUser.name : 'غير محدد'}".`
    );
  };

  // Toggle Task (Complete / Uncomplete)
  const toggleTaskStatus = (taskId) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const newStatus = task.status === 'completed' ? 'pending' : 'completed';
          const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;
          const completedBy = newStatus === 'completed' ? currentUser.id : null;

          // Log action
          if (newStatus === 'completed') {
            logActivity('complete_task', `أنجز المهمة: "${task.title}".`);
          } else {
            logActivity('uncomplete_task', `أعاد فتح المهمة: "${task.title}".`);
          }

          return { ...task, status: newStatus, completedAt, completedBy };
        }
        return task;
      })
    );
  };

  // Delete Task
  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (taskToDelete) {
      logActivity('delete_task', `حذف المهمة: "${taskToDelete.title}".`);
    }
  };

  // Add new User (Manager or Staff)
  const addUser = ({ name, role, avatar, email }) => {
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      role,
      avatar,
      email: email || `${name.replace(/\s+/g, '.').toLowerCase()}@alhan.com`
    };
    setUsers(prev => [...prev, newUser]);
    logActivity('add_user', `أضاف مستخدماً جديداً بصلاحية ${role === 'manager' ? 'مدير' : 'موظف'}: "${name}".`);
    return newUser;
  };

  return (
    <AppContext.Provider
      value={{
        users,
        tasks,
        activities,
        currentUser,
        switchUser,
        addTask,
        toggleTaskStatus,
        deleteTask,
        addUser,
        logActivity
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
