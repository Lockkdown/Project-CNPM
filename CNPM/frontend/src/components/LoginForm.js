import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt, FaUserPlus, FaQuestionCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/LoginForm.css';
import { authAPI } from '../services/api';


function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setApiError(''); // Xóa lỗi API khi người dùng nhập
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập email của bạn';
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu của bạn';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      // Sử dụng URLSearchParams thay vì FormData
      const params = new URLSearchParams();
      params.append('username', formData.username); // username sẽ là email
      params.append('password', formData.password);

      const response = await authAPI.login(params);

      // Lưu token
      localStorage.setItem('token', response.access_token);
      
      // Hiển thị thông báo thành công
      setApiError('Đăng nhập thành công! Chuyển hướng đến trang chủ...');
    
      // Chuyển hướng đến trang chủ
      setTimeout(() => {
      navigate('/');
      }, 2000);
    } catch (err) {
      if (err.response?.status === 404) {
        setApiError('Email chưa được đăng ký. Vui lòng đăng ký trước.');
      } else if (err.response?.status === 401) {
        setApiError('Mật khẩu không chính xác.');
      } else if (err.response?.status === 422) {
        setApiError('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      } else {
        setApiError(err.response?.data?.detail || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2><FaSignInAlt className="form-icon" /> Đăng Nhập</h2>
        {apiError && (
          <div className={`error-message ${apiError.includes('thành công') ? 'success' : ''}`}>
            {apiError}
          </div>
        )}
        <div className="form-group">
          <label htmlFor="username">
            <FaUser className="input-icon" /> Email:
          </label>
          <div className="input-container">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="Nhập email của bạn"
            />
          </div>
          {errors.username && <span className="error-text">{errors.username}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">
            <FaLock className="input-icon" /> Mật khẩu:
          </label>
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Nhập mật khẩu"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>
        <button 
          type="submit" 
          className="login-button"
          disabled={isLoading}
        >
          <FaSignInAlt /> {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
        </button>
        <div className="form-links">
          <button 
            type="button" 
            className="link-button" 
            onClick={() => navigate('/register')}
            disabled={isLoading}
          >
            <FaUserPlus /> Đăng ký
          </button>
          <button 
            type="button" 
            className="link-button"
            onClick={() => navigate('/forgot-password')}
            disabled={isLoading}
          >
            <FaQuestionCircle /> Quên mật khẩu?
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm; 