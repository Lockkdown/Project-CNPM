import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPaperPlane, FaArrowLeft, FaKey } from 'react-icons/fa';
import '../styles/ForgotPasswordForm.css';
import { authAPI } from '../services/api';

function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');

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

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email của bạn';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
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
      await authAPI.forgotPassword({ email: formData.email });
      setSuccess('Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.');
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleSubmit} noValidate>
        <h2><FaKey className="form-icon" /> Quên Mật Khẩu</h2>
        <p className="form-description">
          <FaPaperPlane className="description-icon" /> Vui lòng nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
        </p>
        {apiError && <div className="error-message">{apiError}</div>}
        {success && <div className="success-message">{success}</div>}
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
              disabled={isLoading}
            />
          </div>
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            <FaPaperPlane /> {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
          <button 
            type="button" 
            className="back-button"
            onClick={() => navigate('/login')}
            disabled={isLoading}
          >
            <FaArrowLeft /> Quay lại
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPasswordForm; 