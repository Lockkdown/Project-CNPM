import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import '../styles/NotificationBell.css';

const NotificationBell = () => {
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef(null);
  const [notifications] = useState([
    {
      id: 1,
      title: 'Hoạt động mới',
      content: 'Bạn có một hoạt động mới được thêm vào ngày hôm nay',
      time: '5 phút trước'
    },
    {
      id: 2,
      title: 'Nhắc nhở',
      content: 'Hoạt động "Tập thể dục" sẽ bắt đầu sau 30 phút',
      time: '1 giờ trước'
    }
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotification(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  return (
    <div className="notification-wrapper" ref={notificationRef}>
      <FaBell 
        className="notification-icon" 
        onClick={toggleNotification}
      />
      {notifications.length > 0 && (
        <span className="notification-badge">{notifications.length}</span>
      )}
      {showNotification && (
        <div className="notification-popup">
          <div className="notification-header">
            <span className="notification-title">Thông báo</span>
            <FaTimes 
              className="notification-close"
              onClick={toggleNotification}
            />
          </div>
          <div className="notification-content">
            {notifications.map(notification => (
              <div key={notification.id} className="notification-item">
                <div className="notification-item-title">{notification.title}</div>
                <div className="notification-item-content">{notification.content}</div>
                <div className="notification-item-time">{notification.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 