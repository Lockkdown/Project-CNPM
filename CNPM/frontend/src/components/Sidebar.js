import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaCalendar, FaTasks, FaBell, FaCog, FaUser, FaBars } from 'react-icons/fa';
import { useSidebar } from '../context/SidebarContext';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Sidebar.css';

function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const menuItems = {
    vi: {
      home: 'Trang chủ',
      calendar: 'Lịch',
      habits: 'Thói quen',
      notifications: 'Thông báo',
      settings: 'Cài đặt',
      profile: 'Hồ sơ'
    },
    en: {
      home: 'Home',
      calendar: 'Calendar',
      habits: 'Habits',
      notifications: 'Notifications',
      settings: 'Settings',
      profile: 'Profile'
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="hamburger-button" onClick={toggleSidebar}>
        <FaBars />
      </button>
      
      <nav className="sidebar-menu">
        <button className="menu-item" onClick={() => handleNavigate('/home')}>
          <FaHome />
          <span>{menuItems[language].home}</span>
        </button>
        <button className="menu-item" onClick={() => handleNavigate('/calendar')}>
          <FaCalendar />
          <span>{menuItems[language].calendar}</span>
        </button>
        <button className="menu-item" onClick={() => handleNavigate('/habits')}>
          <FaTasks />
          <span>{menuItems[language].habits}</span>
        </button>
        <button className="menu-item" onClick={() => handleNavigate('/notifications')}>
          <FaBell />
          <span>{menuItems[language].notifications}</span>
        </button>
        <button className="menu-item" onClick={() => handleNavigate('/settings')}>
          <FaCog />
          <span>{menuItems[language].settings}</span>
        </button>
        <button className="menu-item" onClick={() => handleNavigate('/profile')}>
          <FaUser />
          <span>{menuItems[language].profile}</span>
        </button>
      </nav>
    </div>
  );
}

export default Sidebar; 