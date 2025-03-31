import React, { useState} from 'react';
import DayDetail from './DayDetail';
import Sidebar from './Sidebar';
import '../styles/HomePage.css';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaBell } from 'react-icons/fa';

function HomePage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [activities, setActivities] = useState({});
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [completedActivities, setCompletedActivities] = useState({});
  const [showNotification, setShowNotification] = useState(false);
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
  
  // Tạo mảng các ngày trong tuần
  const getWeekDays = () => {
    const days = [];
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDate.getDay()); // Bắt đầu từ Chủ nhật

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const getMonthName = () => {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return months[currentDate.getMonth()];
  };

  const weekDays = getWeekDays();
  const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const handleAddActivity = () => {
    setShowDayDetail(true);
  };

  const handleSaveActivities = (date, dayActivities) => {
    const dateKey = date.toISOString().split('T')[0];
    setActivities(prev => ({
      ...prev,
      [dateKey]: dayActivities
    }));
  };

  const getDayActivities = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    return activities[dateKey] || [];
  };

  const formatDate = (date) => {
    return `${date.getDate()} tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`;
  };

  const getDayName = (date) => {
    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return dayNames[date.getDay()];
  };

  const handleCompleteActivity = (activityId) => {
    setCompletedActivities(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }));
  };

  const isActivityCompleted = (activityId) => {
    return completedActivities[activityId] || false;
  };

  const handleLogout = () => {
    // Xóa dữ liệu người dùng nếu có
    // localStorage.removeItem('user');
    // Điều hướng về trang đăng nhập
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="notification-wrapper">
        <FaBell 
          className="notification-icon" 
          onClick={() => setShowNotification(!showNotification)}
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
                onClick={() => setShowNotification(false)}
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
      <Sidebar />
      <header className="home-header">
        <h1>Trang Chủ</h1>
        <div className="user-info">
          <span>Xin chào, User</span>
          <button className="logout-button" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="home-main">
        <div className="calendar-section">
          <div className="calendar-header">
            <h2>Lịch tuần</h2>
          </div>
          <div className="week-calendar">
            {weekDays.map((day, index) => (
              <div 
                key={index} 
                className={`day-card ${day.getDate() === new Date().getDate() && 
                           day.getMonth() === new Date().getMonth() && 
                           day.getFullYear() === new Date().getFullYear() ? 'today' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                <div className="day-name">{dayNames[index]}</div>
                <div className="day-date">{day.getDate()}</div>
                <div className="day-month">{day.getMonth() + 1}</div>
                <div className="day-events">
                  {getDayActivities(day).map(activity => (
                    <div key={activity.id} className="event-item">
                      {activity.name} - {activity.time} ({activity.duration} phút)
                      {isActivityCompleted(activity.id) && <span className="completed-badge">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="selected-day-details">
          {selectedDate ? (
            <>
              <div className="selected-day-header">
                <div>
                  <h3 className="selected-day-title">{getDayName(selectedDate)}</h3>
                  <div className="selected-day-date">{formatDate(selectedDate)}</div>
                </div>
                <button className="add-activity-button" onClick={handleAddActivity}>
                  <i className="fas fa-plus"></i>
                  Thêm hoạt động
                </button>
              </div>
              <div className="selected-day-activities">
                {getDayActivities(selectedDate).map(activity => (
                  <div 
                    key={activity.id} 
                    className={`selected-activity-card ${isActivityCompleted(activity.id) ? 'completed' : ''}`}
                  >
                    <div className="selected-activity-time">
                      <i className="far fa-clock"></i>
                      {activity.time}
                    </div>
                    <div className="selected-activity-name">{activity.name}</div>
                    <div className="selected-activity-duration">
                      <i className="fas fa-hourglass-half"></i>
                      Thời gian: {activity.duration} phút
                    </div>
                    <div className="activity-actions">
                      <button 
                        className={`complete-button ${isActivityCompleted(activity.id) ? 'completed' : ''}`}
                        onClick={() => handleCompleteActivity(activity.id)}
                      >
                        {isActivityCompleted(activity.id) ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
                      </button>
                    </div>
                  </div>
                ))}
                {getDayActivities(selectedDate).length === 0 && (
                  <div className="selected-activity-card">
                    <div className="selected-activity-name">Không có hoạt động nào</div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-day-selected">
              <i className="far fa-calendar-alt"></i>
              <span>Vui lòng chọn một ngày để xem chi tiết hoạt động</span>
            </div>
          )}
        </div>
      </main>

      {showDayDetail && selectedDate && (
        <DayDetail
          date={selectedDate}
          onClose={() => setShowDayDetail(false)}
          onSave={handleSaveActivities}
          existingActivities={getDayActivities(selectedDate)}
        />
      )}
    </div>
  );
}

export default HomePage; 