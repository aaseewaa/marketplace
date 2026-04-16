const STORAGE_KEYS = {
  USERS: 'mock_users',
  PRODUCTS: 'mock_products',
  REVIEWS: 'mock_reviews',
  CURRENT_USER: 'mock_current_user',
  CART: 'mock_cart',
  ADDRESSES: 'mock_addresses',
  ORDERS: 'mock_orders',
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
    fullName: 'Иван Иванов',
    createdAt: '2026-04-07T12:00:00Z'
  },
  {
    id: 2,
    email: 'maria@example.com',
    username: 'maria88',
    password: '12345678',
    fullName: 'Мария Петрова',
    createdAt: '2026-04-07T13:00:00Z'
  }
]);

let mockProducts = loadFromStorage(STORAGE_KEYS.PRODUCTS, [
  {
    id: 1,
    ownerId: 1,
    ownerUsername: 'ivan123',
    name: 'Ноутбук Lenovo Legion 5',
    description: 'Игровой ноутбук с процессором Intel Core i7, 16GB RAM, 512GB SSD, видеокарта RTX 3060',
    price: 85000,
    quantity: 5,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400'
    ],
    createdAt: '2026-04-07T12:00:00Z',
    updatedAt: '2026-04-07T12:00:00Z'
  },
  {
    id: 2,
    ownerId: 1,
    ownerUsername: 'ivan123',
    name: 'Смартфон Apple iPhone 14',
    description: '128GB, черный, отличное состояние',
    price: 75000,
    quantity: 3,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400'
    ],
    createdAt: '2026-04-07T12:30:00Z',
    updatedAt: '2026-04-07T12:30:00Z'
  },
  {
    id: 3,
    ownerId: 2,
    ownerUsername: 'maria88',
    name: 'Наушники Sony WH-1000XM4',
    description: 'Беспроводные наушники с шумоподавлением',
    price: 25000,
    quantity: 8,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400'
    ],
    createdAt: '2026-04-07T13:00:00Z',
    updatedAt: '2026-04-07T13:00:00Z'
  },
  {
    id: 4,
    ownerId: 2,
    ownerUsername: 'maria88',
    name: 'Клавиатура Logitech MX Keys',
    description: 'Беспроводная клавиатура для программистов',
    price: 12000,
    quantity: 0,
    image: null,
    createdAt: '2026-04-07T13:30:00Z',
    updatedAt: '2026-04-07T13:30:00Z'
  },
  {
    id: 5,
    ownerId: 1,
    ownerUsername: 'ivan123',
    name: 'Монитор Dell UltraSharp 27',
    description: '27 дюймов, 4K, IPS матрица',
    price: 45000,
    quantity: 2,
    image: null,
    createdAt: '2026-04-07T14:00:00Z',
    updatedAt: '2026-04-07T14:00:00Z'
  },
  {
    id: 6,
    ownerId: 2,
    ownerUsername: 'maria88',
    name: 'Мышь Logitech MX Master 3',
    description: 'Беспроводная мышь для профессиональной работы',
    price: 8000,
    quantity: 6,
    image: null,
    createdAt: '2026-04-07T14:30:00Z',
    updatedAt: '2026-04-07T14:30:00Z'
  },
  {
    id: 7,
    ownerId: 1,
    ownerUsername: 'ivan123',
    name: 'Внешний SSD Samsung T7 1TB',
    description: 'Портативный твердотельный накопитель',
    price: 12000,
    quantity: 4,
    image: null,
    createdAt: '2026-04-07T15:00:00Z',
    updatedAt: '2026-04-07T15:00:00Z'
  },
  {
    id: 8,
    ownerId: 2,
    ownerUsername: 'maria88',
    name: 'Фитнес-браслет Xiaomi Mi Band 7',
    description: 'Новый, в упаковке',
    price: 3500,
    quantity: 10,
    image: null,
    createdAt: '2026-04-07T15:30:00Z',
    updatedAt: '2026-04-07T15:30:00Z'
  },
  {
  id: 9,
  ownerId: 1,
  ownerUsername: 'ivan123',
  name: 'Премиум кожаная куртка',
  description: 'Натуральная кожа, итальянское производство',
  price: 25000,
  quantity: 3,
  images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'],
  createdAt: '2026-04-10T12:00:00Z',
  updatedAt: '2026-04-10T12:00:00Z'
  },
  {
    id: 10,
    ownerId: 2,
    ownerUsername: 'maria88',
    name: 'Летние кроссовки Nike',
    description: 'Легкие, дышащие, идеально для лета',
    price: 8900,
    quantity: 10,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
    createdAt: '2026-04-11T12:00:00Z',
    updatedAt: '2026-04-11T12:00:00Z'
  },
  {
    id: 11,
    ownerId: 1,
    ownerUsername: 'ivan123',
    name: 'Уличная толстовка',
    description: 'Хлопок, оверсайз, принт',
    price: 4500,
    quantity: 15,
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400'],
    createdAt: '2026-04-12T12:00:00Z',
    updatedAt: '2026-04-12T12:00:00Z'
  },
  {
    id: 12,
    ownerId: 2,
    ownerUsername: 'maria88',
    name: 'Беспроводные наушники',
    description: 'Шумоподавление, 20 часов работы',
    price: 12000,
    quantity: 7,
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400'],
    createdAt: '2026-04-13T12:00:00Z',
    updatedAt: '2026-04-13T12:00:00Z'
  }
]);

let mockReviews = loadFromStorage(STORAGE_KEYS.REVIEWS, [
  {
    id: 1,
    productId: 1,
    userId: 2,
    username: 'maria88',
    rating: 5,
    comment: 'Отличный ноутбук, очень довольна покупкой!',
    createdAt: '2026-04-08T10:00:00Z',
    updatedAt: '2026-04-08T10:00:00Z'
  },
  {
    id: 2,
    productId: 1,
    userId: 1,
    username: 'ivan123',
    rating: 4,
    comment: 'Хороший ноут, но немного шумный под нагрузкой',
    createdAt: '2026-04-08T11:00:00Z',
    updatedAt: '2026-04-08T11:00:00Z'
  },
  {
    id: 3,
    productId: 3,
    userId: 1,
    username: 'ivan123',
    rating: 5,
    comment: 'Лучшие наушники за эти деньги',
    createdAt: '2026-04-08T12:00:00Z',
    updatedAt: '2026-04-08T12:00:00Z'
  }
]);

let deliveryAddresses = loadFromStorage(STORAGE_KEYS.ADDRESSES, [
  {
    id: 1,
    userId: 1,
    addressLine: 'ул. Ленина, д. 10, кв. 25',
    city: 'Москва',
    postalCode: '101000',
    country: 'Россия',
    isDefault: true,
    createdAt: '2026-04-07T12:00:00Z'
  },
  {
    id: 2,
    userId: 2,
    addressLine: 'пр. Невский, д. 15, кв. 8',
    city: 'Санкт-Петербург',
    postalCode: '191186',
    country: 'Россия',
    isDefault: true,
    createdAt: '2026-04-07T13:00:00Z'
  }
]);

let mockOrders = loadFromStorage(STORAGE_KEYS.ORDERS, [
  {
    id: 1,
    buyerId: 1,
    deliveryAddressId: 1,
    status: 'completed',
    totalAmount: 25000,
    createdAt: '2026-04-08T10:00:00Z',
    completedAt: '2026-04-08T14:00:00Z',
    cancelledAt: null,
    items: [
      {
        id: 101,
        productId: 3,
        productName: 'Наушники Sony WH-1000XM4',
        quantity: 1,
        priceAtOrder: 25000
      }
    ]
  },
  {
    id: 2,
    buyerId: 2,
    deliveryAddressId: 2,
    status: 'created',
    totalAmount: 85000,
    createdAt: '2026-04-09T10:00:00Z',
    completedAt: null,
    cancelledAt: null,
    items: [
      {
        id: 201,
        productId: 1,
        productName: 'Ноутбук Lenovo Legion 5',
        quantity: 1,
        priceAtOrder: 85000
      }
    ]
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
  saveToStorage(STORAGE_KEYS.ADDRESSES, deliveryAddresses);
  saveToStorage(STORAGE_KEYS.ORDERS, mockOrders);
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
          fullName: data.fullName || '',
          createdAt: new Date().toISOString()
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
          fullName: data.fullName || ''
        };

        currentUser = { ...mockUsers[userIndex] };
        
        mockProducts.forEach(p => {
          if (p.ownerId === currentUser.id) {
            p.ownerUsername = currentUser.username;
          }
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
  },

  getAddresses: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!currentUser) {
          resolve({ data: [] });
          return;
        }
        const userAddresses = deliveryAddresses.filter(a => a.userId === currentUser.id);
        resolve({ data: userAddresses });
      }, 200);
    });
  },

  createAddress: (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) {
          reject({ response: { status: 401, data: { message: 'Необходимо войти в систему' } } });
          return;
        }

        if (data.isDefault) {
          deliveryAddresses.forEach(a => {
            if (a.userId === currentUser.id) {
              a.isDefault = false;
            }
          });
        }

        const newAddress = {
          id: deliveryAddresses.length + 1,
          userId: currentUser.id,
          addressLine: data.addressLine,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country || 'Россия',
          isDefault: data.isDefault || false,
          createdAt: new Date().toISOString()
        };

        deliveryAddresses.push(newAddress);
        saveAllData();
        resolve({ data: newAddress });
      }, 500);
    });
  },

  updateAddress: (id, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) {
          reject({ response: { status: 401 } });
          return;
        }

        const index = deliveryAddresses.findIndex(a => a.id === Number(id) && a.userId === currentUser.id);
        if (index === -1) {
          reject({ response: { status: 404, data: { message: 'Адрес не найден' } } });
          return;
        }

        if (data.isDefault) {
          deliveryAddresses.forEach(a => {
            if (a.userId === currentUser.id) {
              a.isDefault = false;
            }
          });
        }

        deliveryAddresses[index] = {
          ...deliveryAddresses[index],
          ...data,
          updatedAt: new Date().toISOString()
        };

        saveAllData();
        resolve({ data: deliveryAddresses[index] });
      }, 500);
    });
  },

  deleteAddress: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) {
          reject({ response: { status: 401 } });
          return;
        }

        const index = deliveryAddresses.findIndex(a => a.id === Number(id) && a.userId === currentUser.id);
        if (index === -1) {
          reject({ response: { status: 404, data: { message: 'Адрес не найден' } } });
          return;
        }

        deliveryAddresses.splice(index, 1);
        saveAllData();
        resolve({ data: { message: 'Адрес удален' } });
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
            ? new Date(a.createdAt) - new Date(b.createdAt) 
            : new Date(b.createdAt) - new Date(a.createdAt)
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
        
        const myProducts = mockProducts.filter(p => p.ownerId === currentUser.id);
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
          ownerId: currentUser.id,
          ownerUsername: currentUser.username,
          name: data.name,
          description: data.description || '',
          price: data.price,
          quantity: data.quantity,
          images: data.images || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
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
        if (product.ownerId !== currentUser?.id) {
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
          images: data.images || product.images || [],
          updatedAt: new Date().toISOString()
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
        if (product.ownerId !== currentUser?.id) {
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
        const productReviews = mockReviews.filter(r => r.productId === Number(productId));
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

        if (product.ownerId === currentUser.id) {
          reject({ response: { data: { message: 'Вы не можете оставить отзыв на свой товар' } } });
          return;
        }

        const newReview = {
          id: mockReviews.length + 1,
          productId: Number(productId),
          userId: currentUser.id,
          username: currentUser.username,
          rating: data.rating,
          comment: data.comment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        mockReviews.push(newReview);
        saveAllData();
        resolve({ data: newReview });
      }, 500);
    });
  },

  createOrder: (addressId, items) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) {
          reject({ response: { status: 401, data: { message: 'Необходимо войти в систему' } } });
          return;
        }

        const address = deliveryAddresses.find(a => a.id === Number(addressId) && a.userId === currentUser.id);
        if (!address) {
          reject({ response: { data: { message: 'Адрес доставки не найден' } } });
          return;
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
          const product = mockProducts.find(p => p.id === item.productId);
          if (!product) {
            reject({ response: { data: { message: `Товар с id ${item.productId} не найден` } } });
            return;
          }

          if (product.ownerId === currentUser.id) {
            reject({ response: { data: { message: `Нельзя купить свой товар: ${product.name}` } } });
            return;
          }

          if (product.quantity < item.quantity) {
            reject({ response: { data: { message: `Недостаточно товара: ${product.name}` } } });
            return;
          }

          totalAmount += product.price * item.quantity;
          orderItems.push({
            id: Date.now() + Math.random(),
            productId: product.id,
            productName: product.name,
            quantity: item.quantity,
            priceAtOrder: product.price
          });

          const productIndex = mockProducts.findIndex(p => p.id === product.id);
          mockProducts[productIndex].quantity -= item.quantity;
        }

        const newOrder = {
          id: mockOrders.length + 1,
          buyerId: currentUser.id,
          deliveryAddressId: Number(addressId),
          status: 'created',
          totalAmount: totalAmount,
          createdAt: new Date().toISOString(),
          completedAt: null,
          cancelledAt: null,
          items: orderItems
        };

        mockOrders.push(newOrder);
        
        if (cart[currentUser.id]) {
          cart[currentUser.id] = { items: [], totalAmount: 0 };
        }
        
        saveAllData();
        resolve({ data: newOrder });
      }, 500);
    });
  },

  getMyOrders: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!currentUser) {
          resolve({ data: [] });
          return;
        }
        const userOrders = mockOrders.filter(o => o.buyerId === currentUser.id);
        resolve({ data: userOrders });
      }, 300);
    });
  },

  getOrderById: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) {
          reject({ response: { status: 401 } });
          return;
        }
        const order = mockOrders.find(o => o.id === Number(id) && o.buyerId === currentUser.id);
        if (!order) {
          reject({ response: { status: 404, data: { message: 'Заказ не найден' } } });
          return;
        }
        resolve({ data: order });
      }, 200);
    });
  },

  updateOrderStatus: (id, status) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) {
          reject({ response: { status: 401 } });
          return;
        }
        
        const index = mockOrders.findIndex(o => o.id === Number(id) && o.buyerId === currentUser.id);
        if (index === -1) {
          reject({ response: { status: 404, data: { message: 'Заказ не найден' } } });
          return;
        }

        mockOrders[index].status = status;
        if (status === 'completed') {
          mockOrders[index].completedAt = new Date().toISOString();
        }
        if (status === 'cancelled') {
          mockOrders[index].cancelledAt = new Date().toISOString();
        }

        saveAllData();
        resolve({ data: mockOrders[index] });
      }, 500);
    });
  },

  getCart: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!currentUser) {
          resolve({ data: { items: [], totalAmount: 0 } });
          return;
        }
        
        if (!cart[currentUser.id]) {
          cart[currentUser.id] = { items: [], totalAmount: 0 };
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

        if (product.ownerId === currentUser.id) {
          reject({ response: { data: { message: 'Нельзя купить свой собственный товар' } } });
          return;
        }

        if (product.quantity < quantity) {
          reject({ response: { data: { message: 'Недостаточно товара на складе' } } });
          return;
        }

        if (!cart[currentUser.id]) {
          cart[currentUser.id] = { items: [], totalAmount: 0 };
        }

        const existingItem = cart[currentUser.id].items.find(item => item.productId === Number(productId));
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart[currentUser.id].items.push({
            id: Date.now(),
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: quantity,
            addedAt: new Date().toISOString()
          });
        }

        cart[currentUser.id].totalAmount = cart[currentUser.id].items.reduce(
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

        const product = mockProducts.find(p => p.id === cart[currentUser.id].items[itemIndex].productId);
        if (product && quantity > product.quantity) {
          reject({ response: { data: { message: 'Недостаточно товара на складе' } } });
          return;
        }

        if (quantity <= 0) {
          cart[currentUser.id].items.splice(itemIndex, 1);
        } else {
          cart[currentUser.id].items[itemIndex].quantity = quantity;
        }

        cart[currentUser.id].totalAmount = cart[currentUser.id].items.reduce(
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
        cart[currentUser.id].totalAmount = cart[currentUser.id].items.reduce(
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
          cart[currentUser.id] = { items: [], totalAmount: 0 };
          saveAllData();
        }
        resolve({ data: { message: 'Корзина очищена' } });
      }, 500);
    });
  },

  requestReturn: (orderId, itemId, reason) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) {
          reject({ response: { status: 401 } });
          return;
        }

        const order = mockOrders.find(o => o.id === Number(orderId) && o.buyerId === currentUser.id);
        if (!order) {
          reject({ response: { data: { message: 'Заказ не найден' } } });
          return;
        }

        const item = order.items.find(i => i.id === Number(itemId));
        if (!item) {
          reject({ response: { data: { message: 'Товар не найден в заказе' } } });
          return;
        }

        console.log('Заявка на возврат:', { orderId, itemId, reason });

        resolve({ data: { message: 'Заявка на возврат отправлена' } });
      }, 500);
    });
  },

  getUserById: (userId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(u => u.id === Number(userId));
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          resolve({ data: userWithoutPassword });
        } else {
          reject({ response: { status: 404, data: { message: 'Пользователь не найден' } } });
        }
      }, 200);
    });
  },
};