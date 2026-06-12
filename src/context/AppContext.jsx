import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFirestoreInstance } from '../firebase';
import { collection, onSnapshot, doc, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

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
    isArchived: false,
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
    isArchived: false,
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
    isArchived: false,
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
    isArchived: false,
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
  // Check if Firebase is active synchronously to guide state initialization
  const db = getFirestoreInstance();
  const isCloudActive = db !== null;

  // State initialization (Local Fallbacks)
  const [users, setUsers] = useState(() => {
    if (isCloudActive) return [];
    const saved = localStorage.getItem('alhan_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [tasks, setTasks] = useState(() => {
    if (isCloudActive) return [];
    const saved = localStorage.getItem('alhan_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [activities, setActivities] = useState(() => {
    if (isCloudActive) return [];
    const saved = localStorage.getItem('alhan_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('alhan_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(isCloudActive);

  // Real-time Firestore sync & Seeding
  useEffect(() => {
    if (!isCloudActive) return;

    let usersLoaded = false;
    let tasksLoaded = false;
    let activitiesLoaded = false;

    const checkLoadingComplete = () => {
      if (usersLoaded && tasksLoaded && activitiesLoaded) {
        setLoading(false);
      }
    };

    // 1. Sync Users & Seed all collections only if users table is empty
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      if (snapshot.empty) {
        // Seed Firestore for the very first time
        INITIAL_USERS.forEach(async (user) => {
          await setDoc(doc(db, "users", user.id), user);
        });
        INITIAL_TASKS.forEach(async (task) => {
          await setDoc(doc(db, "tasks", task.id), task);
        });
        INITIAL_ACTIVITIES.forEach(async (act) => {
          await setDoc(doc(db, "activities", act.id), act);
        });
      } else {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        setUsers(list);
      }
      usersLoaded = true;
      checkLoadingComplete();
    });

    // 2. Sync Tasks (Do not auto-seed if empty, to support system resetting)
    const unsubTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTasks(list);
      } else {
        setTasks([]);
      }
      tasksLoaded = true;
      checkLoadingComplete();
    });

    // 3. Sync Activities (Do not auto-seed if empty, to support system resetting)
    const unsubActivities = onSnapshot(collection(db, "activities"), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setActivities(list);
      } else {
        setActivities([]);
      }
      activitiesLoaded = true;
      checkLoadingComplete();
    });

    return () => {
      unsubUsers();
      unsubTasks();
      unsubActivities();
    };
  }, [isCloudActive]);

  // Persist Local States only if cloud is inactive
  useEffect(() => {
    if (!isCloudActive) {
      localStorage.setItem('alhan_users', JSON.stringify(users));
    }
  }, [users, isCloudActive]);

  useEffect(() => {
    if (!isCloudActive) {
      localStorage.setItem('alhan_tasks', JSON.stringify(tasks));
    }
  }, [tasks, isCloudActive]);

  useEffect(() => {
    if (!isCloudActive) {
      localStorage.setItem('alhan_activities', JSON.stringify(activities));
    }
  }, [activities, isCloudActive]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('alhan_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('alhan_current_user');
    }
  }, [currentUser]);

  // Log activity helper
  const logActivity = async (action, details, userId, userName) => {
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

    if (isCloudActive) {
      await setDoc(doc(db, "activities", newActivity.id), newActivity);
    } else {
      setActivities(prev => [newActivity, ...prev].slice(0, 50));
    }
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
  const addTask = async ({ title, description, category, assignedTo, isCritical, dueTime }) => {
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
      isArchived: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      completedBy: null
    };

    if (isCloudActive) {
      await setDoc(doc(db, "tasks", newTask.id), newTask);
    } else {
      setTasks(prev => [newTask, ...prev]);
    }

    logActivity(
      'create_task',
      `أضاف مهمة ${isCritical ? 'حرجة ⚠️' : 'عادية'} جديدة: "${title}" وأسندها إلى "${assignedUser ? assignedUser.name : 'غير محدد'}".`
    );
  };

  // Toggle Task (Complete / Uncomplete)
  const toggleTaskStatus = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;
    const completedBy = newStatus === 'completed' ? currentUser.id : null;

    if (isCloudActive) {
      await updateDoc(doc(db, "tasks", taskId), {
        status: newStatus,
        completedAt,
        completedBy
      });
    } else {
      setTasks(prev =>
        prev.map(t => t.id === taskId ? { ...t, status: newStatus, completedAt, completedBy } : t)
      );
    }

    if (newStatus === 'completed') {
      logActivity('complete_task', `أنجز المهمة: "${task.title}".`);
    } else {
      logActivity('uncomplete_task', `أعاد فتح المهمة: "${task.title}".`);
    }
  };

  // Delete Task
  const deleteTask = async (taskId) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;

    if (isCloudActive) {
      await deleteDoc(doc(db, "tasks", taskId));
    } else {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }

    logActivity('delete_task', `حذف المهمة: "${taskToDelete.title}".`);
  };

  // Archive Task
  const archiveTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (isCloudActive) {
      await updateDoc(doc(db, "tasks", taskId), { isArchived: true });
    } else {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isArchived: true } : t));
    }

    logActivity('archive_task', `قام بأرشفة المهمة المكتملة: "${task.title}".`);
  };

  // Unarchive Task
  const unarchiveTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (isCloudActive) {
      await updateDoc(doc(db, "tasks", taskId), { isArchived: false });
    } else {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isArchived: false } : t));
    }

    logActivity('unarchive_task', `أعاد استعادة المهمة المؤرشفة: "${task.title}".`);
  };

  // Add new User (Manager or Staff)
  const addUser = async ({ name, role, avatar, email, password }) => {
    const defaultEmail = `${name.replace(/\s+/g, '.').toLowerCase()}@alhan.com`;
    const newUserId = `user_${Date.now()}`;
    const newUser = {
      id: newUserId,
      name,
      role,
      avatar,
      email: email || defaultEmail,
      password: password || '123'
    };

    if (isCloudActive) {
      await setDoc(doc(db, "users", newUserId), newUser);
    } else {
      setUsers(prev => [...prev, newUser]);
    }

    logActivity('add_user', `أضاف عضواً جديداً بصلاحية ${role === 'manager' ? 'مدير' : 'موظف'}: "${name}".`);
    return newUser;
  };

  // Delete User
  const deleteUser = async (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;

    if (isCloudActive) {
      await deleteDoc(doc(db, "users", userId));
    } else {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }

    logActivity('delete_user', `قام بحذف العضو: "${userToDelete.name}" من نظام فريق العمل.`);
  };

  // Clear Activities Log
  const clearActivities = async () => {
    if (isCloudActive) {
      for (const act of activities) {
        try {
          await deleteDoc(doc(db, "activities", act.id));
        } catch (e) {
          console.error("Error deleting activity doc:", e);
        }
      }
    } else {
      setActivities([]);
    }
  };

  // Delete All Tasks
  const deleteAllTasks = async () => {
    if (isCloudActive) {
      for (const task of tasks) {
        try {
          await deleteDoc(doc(db, "tasks", task.id));
        } catch (e) {
          console.error("Error deleting task document:", e);
        }
      }
    } else {
      setTasks([]);
    }
    logActivity('delete_all_tasks', `قام بحذف جميع المهام من النظام لتصفيره.`);
  };

  // Update User
  const updateUser = async (userId, updates) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const updatedUser = { ...user, ...updates };

    if (isCloudActive) {
      await setDoc(doc(db, "users", userId), updatedUser);
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    }

    // If updating the currently logged-in user, update the session state too
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(updatedUser);
    }

    logActivity('update_user', `قام بتحديث معلومات العضو: "${updatedUser.name}".`);
    return updatedUser;
  };

  return (
    <AppContext.Provider
      value={{
        users,
        tasks,
        activities,
        currentUser,
        isCloudActive,
        loading,
        loginUser,
        logoutUser,
        addTask,
        toggleTaskStatus,
        deleteTask,
        deleteAllTasks,
        archiveTask,
        unarchiveTask,
        addUser,
        deleteUser,
        updateUser,
        clearActivities,
        logActivity
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
