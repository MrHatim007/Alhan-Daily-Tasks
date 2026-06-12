import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const INITIAL_USERS = [
  { id: 'owner_1', name: 'أ. أحمد (صاحب الكافيه)', role: 'owner', avatar: '👑', email: 'owner@alhan.com', password: '123' },
  { id: 'manager_morning', name: 'خالد (مدير الصباح)', role: 'manager', avatar: '☀️', email: 'khaled@alhan.com', password: '123' },
  { id: 'manager_evening', name: 'sara', role: 'manager', avatar: '🌙', email: 'sara@alhan.com', password: '123' },
  { id: 'manager_inventory', name: 'عمر (مدير المخزون)', role: 'manager', avatar: '📦', email: 'omar@alhan.com', password: '123' },
  { id: 'staff_barista', name: 'يوسف (الباريستا)', role: 'staff', avatar: '☕', email: 'yousef@alhan.com', password: '123' },
  { id: 'staff_cashier', name: 'لينا (الكاشير)', role: 'staff', avatar: '💳', email: 'lina@alhan.com', password: '123' }
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
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
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
    userName: 'يوسف (الباريستا)',
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
    return saved ? JSON.parse(saved) : null; // Defaults to null (not logged in)
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
    if (currentUser) {
      localStorage.setItem('alhan_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('alhan_current_user');
    }
  }, [currentUser]);

  // Log activity helper
  const logActivity = (action, details, userId, userName) => {
    const activeId = userId || (currentUser ? currentUser.id : 'system');
    const activeName = userName || (currentUser ? currentUser.name : 'النظام');
    
    const newActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: activeId,
      userName: activeName,
      action,
      details
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 50));
  };

  // Login User
  const loginUser = (email, password) => {
    const foundUser = users.find(
      u => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password === password
    );
    
    if (foundUser) {
      setCurrentUser(foundUser);
      logActivity('login_user', `سجل الدخول للنظام.`, foundUser.id, foundUser.name);
      return { success: true };
    }
    
    return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة!' };
  };

  // Logout User
  const logoutUser = () => {
    if (currentUser) {
      logActivity('logout_user', `سجل خروجه من النظام.`, currentUser.id, currentUser.name);
      setCurrentUser(null);
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
  const addUser = ({ name, role, avatar, email, password }) => {
    const defaultEmail = `${name.replace(/\s+/g, '.').toLowerCase()}@alhan.com`;
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      role,
      avatar,
      email: email || defaultEmail,
      password: password || '123' // Default password is 123
    };
    setUsers(prev => [...prev, newUser]);
    logActivity('add_user', `أضاف عضواً جديداً بصلاحية ${role === 'manager' ? 'مدير' : 'موظف'}: "${name}".`);
    return newUser;
  };

  // Delete User
  const deleteUser = (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      logActivity('delete_user', `قام بحذف العضو: "${userToDelete.name}" من نظام فريق العمل.`);
    }
  };

  return (
    <AppContext.Provider
      value={{
        users,
        tasks,
        activities,
        currentUser,
        loginUser,
        logoutUser,
        addTask,
        toggleTaskStatus,
        deleteTask,
        addUser,
        deleteUser,
        logActivity
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
