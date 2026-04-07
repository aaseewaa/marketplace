import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { register } from '../../services/mockAuth';
import './AuthPage.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔹 Form submitted:', form);
    
    setError('');
    setLoading(true);

    try {
      if (!form.email || !form.password) {
        throw new Error('Заполните все поля');
      }

      if (isLogin) {
        console.log('🔹 Attempting login...');
        const res = await login(form.email, form.password);
        console.log('🔹 Login result:', res);
        
        if (res?.error) {
          setError(res.error);
        } else if (res?.success) {
          console.log('🔹 Navigation to /profile');
          navigate('/profile', { replace: true });
        } else {
          setError('Неизвестная ошибка при входе');
        }
      } else {
        console.log('🔹 Attempting registration...');
        const res = register(form.email, form.password, form.name || form.email.split('@')[0]);
        console.log('🔹 Register result:', res);
        
        if (res?.error) {
          setError(res.error);
        } else {
          const loginRes = await login(form.email, form.password);
          if (loginRes?.success) {
            navigate('/profile', { replace: true });
          }
        }
      }
    } catch (err) {
      console.error('❌ Error in handleSubmit:', err);
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit} noValidate>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
          disabled={loading}
        />
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Ваше имя"
            value={form.name}
            onChange={handleChange}
            className="input"
            autoComplete="name"
            disabled={loading}
          />
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
        </button>
      </form>
      
      <button 
        type="button" 
        className="link-btn" 
        onClick={() => {
          setIsLogin(!isLogin);
          setError('');
          setForm({ email: '', password: '' });
        }}
        disabled={loading}
      >
        {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
      </button>
    </div>
  );
}