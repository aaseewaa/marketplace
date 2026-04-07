const STORAGE_KEY_USERS = 'marketplace_users';
const STORAGE_KEY_CURRENT = 'marketplace_currentUser';

const getUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('❌ Failed to parse users:', e);
    return [];
  }
};

const setUsers = (users) => {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
};

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_CURRENT);
  }
};

export const register = (email, password, name = null) => {
  console.log('🔹 [mockAuth] register called:', { email, name });
  
  if (!email?.trim() || !password?.trim()) {
    return { error: 'Email и пароль обязательны' };
  }
  
  const users = getUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  
  if (existing) {
    console.log('🔹 [mockAuth] User already exists:', existing.email);
    return { error: 'Пользователь с таким email уже существует' };
  }
  
  const newUser = {
    id: Date.now().toString(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
    name: name?.trim() || email.trim().split('@')[0],
    avatar: null,
    createdAt: new Date().toISOString(),
    role: 'user'
  };
  
  users.push(newUser);
  setUsers(users);
  
  console.log('🔹 [mockAuth] User registered:', { 
    id: newUser.id, 
    email: newUser.email, 
    name: newUser.name 
  });
  
  const { password: _, ...userSafe } = newUser;
  return { user: userSafe };
};

export const login = (email, password) => {
  console.log('🔹 [mockAuth] login called:', { email });
  
  if (!email?.trim() || !password?.trim()) {
    return { error: 'Введите email и пароль' };
  }
  
  const users = getUsers();
  console.log('🔹 [mockAuth] Users in storage:', users.map(u => ({ 
    email: u.email, 
    name: u.name 
  })));
  
  const user = users.find(u => 
    u.email.toLowerCase() === email.toLowerCase().trim() && 
    u.password === password.trim()
  );
  
  if (!user) {
    console.log('🔹 [mockAuth] Login failed: user not found or wrong password');
    return { error: 'Неверный email или пароль' };
  }
  
  console.log('🔹 [mockAuth] Login success:', { 
    id: user.id, 
    email: user.email, 
    name: user.name 
  });
  
  const { password: _, ...userSafe } = user;
  setCurrentUser(userSafe);
  
  return { user: userSafe };
};

export const logout = () => {
  setCurrentUser(null);
  console.log('🔹 [mockAuth] User logged out');
};

export const getCurrentSession = () => {
  return getCurrentUser();
};

export const updateUser = (userId, updates) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) {
    return { error: 'Пользователь не найден' };
  }
  
  users[index] = { ...users[index], ...updates, id: userId };
  setUsers(users);
  
  const current = getCurrentUser();
  if (current?.id === userId) {
    const { password: _, ...safeUpdates } = users[index];
    setCurrentUser(safeUpdates);
    return { user: safeUpdates };
  }
  
  return { success: true };
};