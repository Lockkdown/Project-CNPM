import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaArrowLeft, FaIdCard, FaEye, FaEyeSlash} from 'react-icons/fa';
import '../styles/RegisterForm.css';
import PropTypes from 'prop-types';
import LoadingSpinner from './LoadingSpinner';
import { authAPI } from '../services/api';
import ErrorMessage from './ErrorMessage';

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

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
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= minLength;

    return {
      isValid: isLongEnough && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      errors: {
        length: !isLongEnough ? `Mật khẩu phải có ít nhất ${minLength} ký tự` : '',
        upperCase: !hasUpperCase ? 'Mật khẩu phải có ít nhất 1 chữ hoa' : '',
        lowerCase: !hasLowerCase ? 'Mật khẩu phải có ít nhất 1 chữ thường' : '',
        numbers: !hasNumbers ? 'Mật khẩu phải có ít nhất 1 số' : '',
        specialChar: !hasSpecialChar ? 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt' : ''
      }
    };
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    if (!formData.username) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (!usernameRegex.test(formData.username)) {
      newErrors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới, độ dài từ 3-20 ký tự';
    }

    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.full_name) {
      newErrors.full_name = 'Vui lòng nhập họ và tên';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (!passwordValidation.isValid) {
      newErrors.password = Object.values(passwordValidation.errors).filter(error => error).join(', ');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
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
    setError('');
    setSuccess('');

    try {
      await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name
      });

      setSuccess('Đăng ký thành công! Chuyển hướng đến trang đăng nhập...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <h2><FaUserPlus className="form-icon" /> Đăng Ký</h2>
        {success && <div className="success-message">{success}</div>}
        <div className="form-group">
          <label htmlFor="full_name">
            <FaIdCard className="input-icon" /> Họ và tên:
          </label>
          <div className="input-container">
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={errors.full_name ? 'error' : ''}
              placeholder="Nhập họ và tên của bạn"
            />
          </div>
          {errors.full_name && <span className="error-text">{errors.full_name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="username">
            <FaUser className="input-icon" /> Tên đăng nhập:
          </label>
          <div className="input-container">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="Nhập tên đăng nhập"
            />
          </div>
          {errors.username && <span className="error-text">{errors.username}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">
            <FaEnvelope className="input-icon" /> Email:
          </label>
          <div className="input-container">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Nhập email của bạn"
            />
          </div>
          {errors.email && <span className="error-text">{errors.email}</span>}
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
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">
            <FaLock className="input-icon" /> Xác nhận mật khẩu:
          </label>
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Nhập lại mật khẩu"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>
        <div className="form-actions">
          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : <FaUserPlus />} Đăng Ký
          </button>
          <button type="button" className="back-button" onClick={handleBack}>
            <FaArrowLeft /> Quay lại
          </button>
        </div>
        {error && <ErrorMessage message={error} />}
      </form>
    </div>
  );
}

RegisterForm.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default RegisterForm; 