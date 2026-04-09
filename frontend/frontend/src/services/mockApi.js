const STORAGE_KEYS = {
  USERS: 'mock_users',
  PRODUCTS: 'mock_products',
  REVIEWS: 'mock_reviews',
  CURRENT_USER: 'mock_current_user',
  CART: 'mock_cart'
};

const loadFromStorage = (key, defaultValue) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored);
  }
  return defaultValue;
};

const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

let mockUsers = loadFromStorage(STORAGE_KEYS.USERS, [
  {
    id: 1,
    email: 'user@example.com',
    username: 'ivan123',
    password: '12345678',
    full_name: 'Иван Иванов',
    created_at: '2026-04-07T12:00:00Z'
  },
  {
    id: 2,
    email: 'maria@example.com',
    username: 'maria88',
    password: '12345678',
    full_name: 'Мария Петрова',
    created_at: '2026-04-07T13:00:00Z'
  }
]);

let mockProducts = loadFromStorage(STORAGE_KEYS.PRODUCTS, [
  {
    id: 1,
    owner_id: 1,
    owner_username: 'ivan123',
    name: 'Ноутбук Lenovo Legion 5',
    description: 'Игровой ноутбук с процессором Intel Core i7, 16GB RAM, 512GB SSD, видеокарта RTX 3060',
    price: 85000,
    quantity: 5,
    created_at: '2026-04-07T12:00:00Z',
    updated_at: '2026-04-07T12:00:00Z'
  },
  {
    id: 2,
    owner_id: 1,
    owner_username: 'ivan123',
    name: 'Смартфон Apple iPhone 14',
    description: '128GB, черный, отличное состояние',
    price: 75000,
    quantity: 3,
    created_at: '2026-04-07T12:30:00Z',
    updated_at: '2026-04-07T12:30:00Z'
  },
  {
    id: 3,
    owner_id: 2,
    owner_username: 'maria88',
    name: 'Наушники Sony WH-1000XM4',
    description: 'Беспроводные наушники с шумоподавлением',
    price: 25000,
    quantity: 8,
    created_at: '2026-04-07T13:00:00Z',
    updated_at: '2026-04-07T13:00:00Z'
  },
  {
    id: 4,
    owner_id: 2,
    owner_username: 'maria88',
    name: 'Клавиатура Logitech MX Keys',
    description: 'Беспроводная клавиатура для программистов',
    price: 12000,
    quantity: 0,
    created_at: '2026-04-07T13:30:00Z',
    updated_at: '2026-04-07T13:30:00Z'
  },
  {
    id: 5,
    owner_id: 1,
    owner_username: 'ivan123',
    name: 'Монитор Dell UltraSharp 27',
    description: '27 дюймов, 4K, IPS матрица',
    price: 45000,
    quantity: 2,
    created_at: '2026-04-07T14:00:00Z',
    updated_at: '2026-04-07T14:00:00Z'
  },
  {
    id: 6,
    owner_id: 2,
    owner_username: 'maria88',
    name: 'Мышь Logitech MX Master 3',
    description: 'Беспроводная мышь для профессиональной работы',
    price: 8000,
    quantity: 6,
    created_at: '2026-04-07T14:30:00Z',
    updated_at: '2026-04-07T14:30:00Z'
  },
  {
    id: 7,
    owner_id: 1,
    owner_username: 'ivan123',
    name: 'Внешний SSD Samsung T7 1TB',
    description: 'Портативный твердотельный накопитель',
    price: 12000,
    quantity: 4,
    created_at: '2026-04-07T15:00:00Z',
    updated_at: '2026-04-07T15:00:00Z'
  },
  {
    id: 8,
    owner_id: 2,
    owner_username: 'maria88',
    name: 'Фитнес-браслет Xiaomi Mi Band 7',
    description: 'Новый, в упаковке',
    price: 3500,
    quantity: 10,
    created_at: '2026-04-07T15:30:00Z',
    updated_at: '2026-04-07T15:30:00Z'
  }
]);

let mockReviews = loadFromStorage(STORAGE_KEYS.REVIEWS, [
  {
    id: 1,
    product_id: 1,
    user_id: 2,
    username: 'maria88',
    rating: 5,
    comment: 'Отличный ноутбук, очень довольна покупкой!',
    created_at: '2026-04-08T10:00:00Z',
    updated_at: '2026-04-08T10:00:00Z'
  },
  {
    id: 2,
    product_id: 1,
    user_id: 1,
    username: 'ivan123',
    rating: 4,
    comment: 'Хороший ноут, но немного шумный под нагрузкой',
    created_at: '2026-04-08T11:00:00Z',
    updated_at: '2026-04-08T11:00:00Z'
  },
  {
    id: 3,
    product_id: 3,
    user_id: 1,
    username: 'ivan123',
    rating: 5,
    comment: 'Лучшие наушники за эти деньги',
    created_at: '2026-04-08T12:00:00Z',
    updated_at: '2026-04-08T12:00:00Z'
  }
]);

let currentUser = loadFromStorage(STORAGE_KEYS.CURRENT_USER, null);

let cart = loadFromStorage(STORAGE_KEYS.CART, {});

const saveAllData = () => {
  saveToStorage(STORAGE_KEYS.USERS, mockUsers);
  saveToStorage(STORAGE_KEYS.PRODUCTS, mockProducts);
  saveToStorage(STORAGE_KEYS.REVIEWS, mockReviews);
  saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
  saveToStorage(STORAGE_KEYS.CART, cart);
};

const generateToken = (user) => {
  return btoa(`${user.id}:${Date.now()}`);
};

export const mockAuthAPI = {
  register: (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = mockUsers.find(u => u.email === data.email || u.username === data.username);
        if (existingUser) {
          reject({ response: { data: { message: 'Пользователь с таким email или именем уже существует' } } });
          return;
        }
        
        const newUser = {
          id: mockUsers.length + 1,
          email: data.email,
          username: data.username,
          password: data.password,
          full_name: data.full_name || '',
          created_at: new Date().toISOString()
        };
        
        mockUsers.push(newUser);
        saveAllData();
        
        const { password, ...userWithoutPassword } = newUser;
        resolve({ data: userWithoutPassword });
      }, 500);
    });
  },
  
  login: (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === data.email && u.password === data.password);
        if (!user) {
          reject({ response: { data: { message: 'Неверный email или пароль' } } });
          return;
        }
        
        const token = generateToken(user);
        currentUser = { ...user };
        saveAllData();
        
        const { password, ...userWithoutPassword } = user;
        resolve({ data: { token, user: userWithoutPassword } });
      }, 500);
    });
  },
  
  getMe: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const token = localStorage.getItem('token');
        if (!token || !currentUser) {
          reject({ response: { status: 401 } });
          return;
        }
        
        const { password, ...userWithoutPassword } = currentUser;
        resolve({ data: userWithoutPassword });
      }, 300);
    });
  },
  
  logout: () => {
    return new Promise((resolve) => {
      currentUser = null;
      saveAllData();
      resolve({ data: { message: 'Выход выполнен' } });
    });
  },

  updateProfile: (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) {
          reject({ response: { status: 401, data: { message: 'Необходимо войти в систему' } } });
          return;
        }

        const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
        if (userIndex === -1) {
          reject({ response: { data: { message: 'Пользователь не найден' } } });
          return;
        }

        const emailExists = mockUsers.some(u => u.email === data.email && u.id !== currentUser.id);
        if (emailExists) {
          reject({ response: { data: { message: 'Пользователь с таким email уже существует' } } });
          return;
        }

        const usernameExists = mockUsers.some(u => u.username === data.username && u.id !== currentUser.id);
        if (usernameExists) {
          reject({ response: { data: { message: 'Пользователь с таким именем уже существует' } } });
          return;
        }

        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          email: data.email,
          username: data.username,
          full_name: data.full_name || ''
        };

        currentUser = { ...mockUsers[userIndex] };
        
        const productOwnerIds = mockProducts.filter(p => p.owner_id === currentUser.id);
        productOwnerIds.forEach(p => {
          p.owner_username = currentUser.username;
        });
        
        saveAllData();

        const { password, ...userWithoutPassword } = currentUser;
        resolve({ data: userWithoutPassword });
      }, 500);
    });
  },

  changePassword: (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) {
          reject({ response: { status: 401, data: { message: 'Необходимо войти в систему' } } });
          return;
        }

        if (currentUser.password !== data.currentPassword) {
          reject({ response: { data: { message: 'Неверный текущий пароль' } } });
          return;
        }

        if (data.newPassword.length < 6) {
          reject({ response: { data: { message: 'Новый пароль должен содержать минимум 6 символов' } } });
          return;
        }

        const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
        mockUsers[userIndex].password = data.newPassword;
        currentUser.password = data.newPassword;
        
        saveAllData();

        resolve({ data: { message: 'Пароль успешно изменен' } });
      }, 500);
    });
  }
};

export const mockProductsAPI = {
  getAll: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockProducts];
        
        if (params.search) {
          const searchLower = params.search.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchLower) || 
            (p.description && p.description.toLowerCase().includes(searchLower))
          );
        }
        
        if (params.minPrice) {
          filtered = filtered.filter(p => p.price >= params.minPrice);
        }
        
        if (params.maxPrice) {
          filtered = filtered.filter(p => p.price <= params.maxPrice);
        }
        
        if (params.sortBy === 'price') {
          filtered.sort((a, b) => params.order === 'asc' ? a.price - b.price : b.price - a.price);
        } else if (params.sortBy === 'name') {
          filtered.sort((a, b) => params.order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        } else {
          filtered.sort((a, b) => params.order === 'asc' 
            ? new Date(a.created_at) - new Date(b.created_at) 
            : new Date(b.created_at) - new Date(a.created_at)
          );
        }
        
        resolve({ data: filtered });
      }, 300);
    });
  },
  
  getById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = mockProducts.find(p => p.id === Number(id));
        if (product) {
          resolve({ data: product });
        } else {
          reject({ response: { status: 404, data: { message: 'Товар не найден' } } });
        }
      }, 200);
    });
  },
  
  getMyProducts: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!currentUser) {
          resolve({ data: [] });
          return;
        }
        
        const myProducts = mockProducts.filter(p => p.owner_id === currentUser.id);
        resolve({ data: myProducts });
      }, 300);
    });
  },
  
  create: (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) {
          reject({ response: { status: 401, data: { message: 'Необходимо войти в систему' } } });
          return;
        }
        
        if (!data.name || data.name.trim() === '') {
          reject({ response: { data: { message: 'Название товара обязательно' } } });
          return;
        }
        
        if (data.price <= 0) {
          reject({ response: { data: { message: 'Цена должна быть больше 0' } } });
          return;
        }
        
        if (data.quantity < 0) {
          reject({ response: { data: { message: 'Количество не может быть отрицательным' } } });
          return;
        }
        
        const newProduct = {
          id: mockProducts.length + 1,
          owner_id: currentUser.id,
          owner_username: currentUser.username,
          name: data.name,
          description: data.description || '',
          price: data.price,
          quantity: data.quantity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        mockProducts.push(newProduct);
        saveAllData();
        resolve({ data: newProduct });
      }, 500);
    });
  },
  
  update: (id, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockProducts.findIndex(p => p.id === Number(id));
        if (index === -1) {
          reject({ response: { status: 404, data: { message: 'Товар не найден' } } });
          return;
        }
        
        const product = mockProducts[index];
        if (product.owner_id !== currentUser?.id) {
          reject({ response: { status: 403, data: { message: 'Вы не можете редактировать этот товар' } } });
          return;
        }
        
        if (data.name && data.name.trim() === '') {
          reject({ response: { data: { message: 'Название товара обязательно' } } });
          return;
        }
        
        if (data.price && data.price <= 0) {
          reject({ response: { data: { message: 'Цена должна быть больше 0' } } });
          return;
        }
        
        if (data.quantity && data.quantity < 0) {
          reject({ response: { data: { message: 'Количество не может быть отрицательным' } } });
          return;
        }
        
        mockProducts[index] = {
          ...product,
          ...data,
          updated_at: new Date().toISOString()
        };
        
        saveAllData();
        resolve({ data: mockProducts[index] });
      }, 500);
    });
  },
  
  delete: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockProducts.findIndex(p => p.id === Number(id));
        if (index === -1) {
          reject({ response: { status: 404, data: { message: 'Товар не найден' } } });
          return;
        }
        
        const product = mockProducts[index];
        if (product.owner_id !== currentUser?.id) {
          reject({ response: { status: 403, data: { message: 'Вы не можете удалить этот товар' } } });
          return;
        }
        
        mockProducts.splice(index, 1);
        saveAllData();
        resolve({ data: { message: 'Товар удален' } });
      }, 500);
    });
  },

  getReviews: (productId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const productReviews = mockReviews.filter(r => r.product_id === Number(productId));
        resolve({ data: productReviews });
      }, 200);
    });
  },

  createReview: (productId, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) {
          reject({ response: { status: 401, data: { message: 'Необходимо войти в систему' } } });
          return;
        }

        const product = mockProducts.find(p => p.id === Number(productId));
        if (!product) {
          reject({ response: { status: 404, data: { message: 'Товар не найден' } } });
          return;
        }

        if (product.owner_id === currentUser.id) {
          reject({ response: { data: { message: 'Вы не можете оставить отзыв на свой товар' } } });
          return;
        }

        const newReview = {
          id: mockReviews.length + 1,
          product_id: Number(productId),
          user_id: currentUser.id,
          username: currentUser.username,
          rating: data.rating,
          comment: data.comment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        mockReviews.push(newReview);
        saveAllData();
        resolve({ data: newReview });
      }, 500);
    });
  },

  getCart: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!currentUser) {
          resolve({ data: { items: [], total_amount: 0 } });
          return;
        }
        
        if (!cart[currentUser.id]) {
          cart[currentUser.id] = { items: [], total_amount: 0 };
          saveAllData();
        }
        
        const userCart = cart[currentUser.id];
        resolve({ data: userCart });
      }, 200);
    });
  },

  addToCart: (productId, quantity) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) {
          reject({ response: { status: 401, data: { message: 'Необходимо войти в систему' } } });
          return;
        }

        const product = mockProducts.find(p => p.id === Number(productId));
        if (!product) {
          reject({ response: { status: 404, data: { message: 'Товар не найден' } } });
          return;
        }

        if (product.owner_id === currentUser.id) {
          reject({ response: { data: { message: 'Нельзя купить свой собственный товар' } } });
          return;
        }

        if (product.quantity < quantity) {
          reject({ response: { data: { message: 'Недостаточно товара на складе' } } });
          return;
        }

        if (!cart[currentUser.id]) {
          cart[currentUser.id] = { items: [], total_amount: 0 };
        }

        const existingItem = cart[currentUser.id].items.find(item => item.product_id === Number(productId));
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart[currentUser.id].items.push({
            id: Date.now(),
            product_id: product.id,
            product_name: product.name,
            price: product.price,
            quantity: quantity,
            added_at: new Date().toISOString()
          });
        }

        cart[currentUser.id].total_amount = cart[currentUser.id].items.reduce(
          (sum, item) => sum + (item.price * item.quantity), 0
        );

        saveAllData();
        resolve({ data: { message: 'Товар добавлен в корзину' } });
      }, 500);
    });
  },

  updateCartItem: (itemId, quantity) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) {
          reject({ response: { status: 401 } });
          return;
        }

        if (!cart[currentUser.id]) {
          reject({ response: { data: { message: 'Корзина пуста' } } });
          return;
        }

        const itemIndex = cart[currentUser.id].items.findIndex(item => item.id === Number(itemId));
        if (itemIndex === -1) {
          reject({ response: { data: { message: 'Товар не найден в корзине' } } });
          return;
        }

        const product = mockProducts.find(p => p.id === cart[currentUser.id].items[itemIndex].product_id);
        if (product && quantity > product.quantity) {
          reject({ response: { data: { message: 'Недостаточно товара на складе' } } });
          return;
        }

        if (quantity <= 0) {
          cart[currentUser.id].items.splice(itemIndex, 1);
        } else {
          cart[currentUser.id].items[itemIndex].quantity = quantity;
        }

        cart[currentUser.id].total_amount = cart[currentUser.id].items.reduce(
          (sum, item) => sum + (item.price * item.quantity), 0
        );

        saveAllData();
        resolve({ data: { message: 'Корзина обновлена' } });
      }, 500);
    });
  },

  removeFromCart: (itemId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) {
          reject({ response: { status: 401 } });
          return;
        }

        if (!cart[currentUser.id]) {
          reject({ response: { data: { message: 'Корзина пуста' } } });
          return;
        }

        const itemIndex = cart[currentUser.id].items.findIndex(item => item.id === Number(itemId));
        if (itemIndex === -1) {
          reject({ response: { data: { message: 'Товар не найден в корзине' } } });
          return;
        }

        cart[currentUser.id].items.splice(itemIndex, 1);
        cart[currentUser.id].total_amount = cart[currentUser.id].items.reduce(
          (sum, item) => sum + (item.price * item.quantity), 0
        );

        saveAllData();
        resolve({ data: { message: 'Товар удален из корзины' } });
      }, 500);
    });
  },

  clearCart: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (currentUser) {
          cart[currentUser.id] = { items: [], total_amount: 0 };
          saveAllData();
        }
        resolve({ data: { message: 'Корзина очищена' } });
      }, 500);
    });
  }
};