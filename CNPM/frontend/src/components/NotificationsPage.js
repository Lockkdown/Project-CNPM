import React, { useState } from 'react';
import '../styles/NotificationsPage.css';

const NotificationsPage = () => {
  const [notifications] = useState([
    {
      id: 1,
      title: 'Hoạt động mới',
      content: 'Bạn có một hoạt động mới được thêm vào ngày hôm nay',
      time: '5 phút trước',
      isRead: false
    },
    {
      id: 2,
      title: 'Nhắc nhở',
      content: 'Hoạt động "Tập thể dục" sẽ bắt đầu sau 30 phút',
      time: '1 giờ trước',
      isRead: false
    },
    {
      id: 3,
      title: 'Hoàn thành mục tiêu',
      content: 'Chúc mừng! Bạn đã hoàn thành tất cả hoạt động trong ngày hôm qua',
      time: '1 ngày trước',
      isRead: true
    }
  ]);

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <h1>Thông báo</h1>
          <div className="notifications-actions">
            <button className="mark-all-read">Đánh dấu tất cả đã đọc</button>
            <button className="delete-all">Xóa tất cả</button>
          </div>
        </div>
        
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
            >
              <div className="notification-icon">
                {!notification.isRead && <span className="unread-dot"></span>}
                <i className="notification-type-icon"></i>
              </div>
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.content}</div>
                <div className="notification-time">{notification.time}</div>
              </div>
              <div className="notification-actions">
                <button className="mark-read">
                  {notification.isRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                </button>
                <button className="delete-notification">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage; 