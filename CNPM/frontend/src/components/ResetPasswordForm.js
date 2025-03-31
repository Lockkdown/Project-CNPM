import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaKey, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/ResetPasswordForm.css';
import { authAPI } from '../services/api';

function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      setApiError('Token không hợp lệ hoặc đã hết hạn');
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setApiError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
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
    const passwordValidation = validatePassword(formData.newPassword);
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (!passwordValidation.isValid) {
      newErrors.newPassword = Object.values(passwordValidation.errors).filter(error => error).join(', ');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.newPassword !== formData.confirmPassword) {
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
    setSuccess('');
    setApiError('');

    try {
      await authAPI.resetPassword({
        token,
        new_password: formData.newPassword
      });
      
      setSuccess('Mật khẩu đã được đặt lại thành công! Chuyển hướng đến trang đăng nhập...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-form error">
          <h2><FaKey className="form-icon" /> Lỗi</h2>
          <p className="error-message">{apiError}</p>
          <button 
            className="back-button"
            onClick={() => navigate('/login')}
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <form className="reset-password-form" onSubmit={handleSubmit} noValidate>
        <h2><FaKey className="form-icon" /> Đặt Lại Mật Khẩu</h2>
        {apiError && <div className="error-message">{apiError}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="form-group">
          <label htmlFor="newPassword">
            <FaLock className="input-icon" /> Mật khẩu mới:
          </label>
          <div className="input-container">
            <input
              type={showPassword.newPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={errors.newPassword ? 'error' : ''}
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility('newPassword')}
            >
              {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            <FaLock className="input-icon" /> Xác nhận mật khẩu:
          </label>
          <div className="input-container">
            <input
              type={showPassword.confirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility('confirmPassword')}
            >
              {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            <FaKey /> {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </button>
          <button 
            type="button" 
            className="back-button"
            onClick={() => navigate('/login')}
            disabled={isLoading}
          >
            Quay lại đăng nhập
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPasswordForm;
