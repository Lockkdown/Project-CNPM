import React from 'react';
import MonthCalendar from './MonthCalendar';
import Sidebar from './Sidebar';
import '../styles/CalendarPage.css';

const CalendarPage = ({ activities, completedActivities }) => {
  // Dữ liệu mẫu cho activities và completedActivities
  const sampleActivities = {
    '2024-03-17': [
      { id: 1, title: 'Tập thể dục', time: '06:00', duration: 30 },
      { id: 2, title: 'Họp nhóm', time: '09:00', duration: 60 }
    ],
    '2024-03-18': [
      { id: 3, title: 'Học bài', time: '14:00', duration: 120 }
    ]
  };

  const sampleCompletedActivities = {
    1: true,
    2: true,
    3: false
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="calendar-page">
        <div className="calendar-container">
          <h1>Lịch Tháng</h1>
          <div className="calendar-wrapper">
            <MonthCalendar 
              activities={activities || sampleActivities}
              completedActivities={completedActivities || sampleCompletedActivities}
            />
          </div>
          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-color completed-all"></div>
              <span>Hoàn thành tất cả hoạt động</span>
            </div>
            <div className="legend-item">
              <div className="legend-color completed-partial"></div>
              <span>Hoàn thành một phần</span>
            </div>
            <div className="legend-item">
              <div className="legend-color today"></div>
              <span>Hôm nay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage; 