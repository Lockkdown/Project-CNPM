import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Setting.css';
import { FaBell, FaLanguage, FaMoon, FaLock, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Setting = () => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [settings, setSettings] = useState({
    notifications: true,
  });

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleToggle = (setting) => {
    if (setting === 'darkMode') {
      toggleTheme();
    } else {
      setSettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
    }
  };

  const handleLanguageChange = () => {
    toggleLanguage();
  };

  const handleChangePassword = () => {
    setIsChangePasswordOpen(true);
    setError('');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleClosePasswordModal = () => {
    setIsChangePasswordOpen(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError(language === 'vi' ? 'Mật khẩu mới và xác nhận mật khẩu không khớp' : 'New password and confirm password do not match');
      return;
    }

    console.log('Đổi mật khẩu:', passwordForm);
    setIsChangePasswordOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="settings-container">
      <h1>{language === 'vi' ? 'Cài đặt' : 'Settings'}</h1>

      <div className="settings-section">
        <h2>{language === 'vi' ? 'Tùy chọn' : 'Options'}</h2>
        
        <div className="setting-item">
          <div className="setting-info">
            <FaBell className="setting-icon" />
            <div className="setting-text">
              <h3>{language === 'vi' ? 'Thông báo' : 'Notifications'}</h3>
              <p>{language === 'vi' ? 'Bật/tắt thông báo' : 'Enable/disable notifications'}</p>
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={() => handleToggle('notifications')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <FaMoon className="setting-icon" />
            <div className="setting-text">
              <h3>{language === 'vi' ? 'Chế độ tối' : 'Dark Mode'}</h3>
              <p>{language === 'vi' ? 'Bật/tắt chế độ tối' : 'Enable/disable dark mode'}</p>
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => handleToggle('darkMode')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <FaLanguage className="setting-icon" />
            <div className="setting-text">
              <h3>{language === 'vi' ? 'Ngôn ngữ' : 'Language'}</h3>
              <p>{language === 'vi' ? 'Chọn ngôn ngữ hiển thị' : 'Select display language'}</p>
            </div>
          </div>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="language-select"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h2>{language === 'vi' ? 'Bảo mật' : 'Security'}</h2>
        
        <div className="setting-item clickable" onClick={handleChangePassword}>
          <div className="setting-info">
            <FaLock className="setting-icon" />
            <div className="setting-text">
              <h3>{language === 'vi' ? 'Đổi mật khẩu' : 'Change Password'}</h3>
              <p>{language === 'vi' ? 'Cập nhật mật khẩu đăng nhập' : 'Update login password'}</p>
            </div>
          </div>
          <span className="arrow">›</span>
        </div>
      </div>

      <div className="settings-section">
        <h2>{language === 'vi' ? 'Hỗ trợ' : 'Support'}</h2>
        
        <div className="setting-item clickable">
          <div className="setting-info">
            <FaQuestionCircle className="setting-icon" />
            <div className="setting-text">
              <h3>{language === 'vi' ? 'Trợ giúp' : 'Help'}</h3>
              <p>{language === 'vi' ? 'Xem hướng dẫn sử dụng' : 'View user guide'}</p>
            </div>
          </div>
          <span className="arrow">›</span>
        </div>
      </div>

      <div className="settings-section">
        <div className="setting-item clickable danger" onClick={handleLogout}>
          <div className="setting-info">
            <FaSignOutAlt className="setting-icon" />
            <div className="setting-text">
              <h3>{language === 'vi' ? 'Đăng xuất' : 'Log out'}</h3>
              <p>{language === 'vi' ? 'Thoát khỏi tài khoản' : 'Exit account'}</p>
            </div>
          </div>
        </div>
      </div>

      {isChangePasswordOpen && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h2>{language === 'vi' ? 'Chỉnh sửa mật khẩu' : 'Edit Password'}</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>{language === 'vi' ? 'Mật khẩu hiện tại' : 'Current Password'}</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder={language === 'vi' ? 'Nhập mật khẩu hiện tại' : 'Enter current password'}
                />
              </div>
              <div className="form-group">
                <label>{language === 'vi' ? 'Mật khẩu mới' : 'New Password'}</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder={language === 'vi' ? 'Nhập mật khẩu mới' : 'Enter new password'}
                />
              </div>
              <div className="form-group">
                <label>{language === 'vi' ? 'Xác nhận mật khẩu mới' : 'Confirm New Password'}</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder={language === 'vi' ? 'Nhập lại mật khẩu mới' : 'Re-enter new password'}
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="modal-buttons">
                <button type="button" className="cancel-button" onClick={handleClosePasswordModal}>
                  {language === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button type="submit" className="save-button">
                  {language === 'vi' ? 'Lưu thay đổi' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting; 