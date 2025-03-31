import React, { useState, useEffect, useCallback } from 'react';
import '../styles/MonthCalendar.css';

const MonthCalendar = ({ activities, completedActivities }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [streak, setStreak] = useState(0);
  const [totalCompletedDays, setTotalCompletedDays] = useState(0);
  const [partialCompletedDays, setPartialCompletedDays] = useState(0);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    // Thêm ngày trống cho các ngày trước ngày đầu tiên của tháng
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Thêm các ngày trong tháng
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getMonthName = (date) => {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return months[date.getMonth()];
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDayActivities = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    return activities[dateKey] || [];
  };

  const getDayStatus = (date) => {
    const dayActivities = getDayActivities(date);
    if (dayActivities.length === 0) return '';

    const allCompleted = dayActivities.every(activity => 
      completedActivities[activity.id]
    );
    
    const someCompleted = dayActivities.some(activity => 
      completedActivities[activity.id]
    );

    if (allCompleted) return 'completed-all';
    if (someCompleted) return 'completed-partial';
    return '';
  };

  // Chuyển các hàm tính toán thành useCallback
  const calculateStreak = useCallback(() => {
    let currentStreak = 0;
    let maxStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateKey = checkDate.toISOString().split('T')[0];
      
      const dayActivities = activities[dateKey] || [];
      const isCompleted = dayActivities.length > 0 && 
        dayActivities.every(activity => completedActivities[activity.id]);

      if (isCompleted) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        break;
      }
    }

    return currentStreak;
  }, [activities, completedActivities]);

  const calculateTotalCompletedDays = useCallback(() => {
    let total = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateKey = checkDate.toISOString().split('T')[0];
      
      const dayActivities = activities[dateKey] || [];
      const isCompleted = dayActivities.length > 0 && 
        dayActivities.every(activity => completedActivities[activity.id]);

      if (isCompleted) {
        total++;
      }
    }

    return total;
  }, [activities, completedActivities]);

  const calculatePartialCompletedDays = useCallback(() => {
    let total = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateKey = checkDate.toISOString().split('T')[0];
      
      const dayActivities = activities[dateKey] || [];
      
      if (dayActivities.length > 0) {
        const someCompleted = dayActivities.some(activity => completedActivities[activity.id]);
        const allCompleted = dayActivities.every(activity => completedActivities[activity.id]);
        
        if (someCompleted && !allCompleted) {
          total++;
        }
      }
    }

    return total;
  }, [activities, completedActivities]);

  useEffect(() => {
    const currentStreak = calculateStreak();
    const total = calculateTotalCompletedDays();
    const partial = calculatePartialCompletedDays();
    setStreak(currentStreak);
    setTotalCompletedDays(total);
    setPartialCompletedDays(partial);
  }, [calculateStreak, calculateTotalCompletedDays, calculatePartialCompletedDays]);

  const days = getDaysInMonth(currentDate);

  return (
    <div className="month-calendar">
      <div className="month-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h3>{getMonthName(currentDate)} {currentDate.getFullYear()}</h3>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="weekdays">
        <div>CN</div>
        <div>T2</div>
        <div>T3</div>
        <div>T4</div>
        <div>T5</div>
        <div>T6</div>
        <div>T7</div>
      </div>
      <div className="days-grid">
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`calendar-day ${day ? getDayStatus(day) : 'empty'} ${
              day && day.toDateString() === new Date().toDateString() ? 'today' : ''
            }`}
          >
            {day ? day.getDate() : ''}
          </div>
        ))}
      </div>
      <div className="streak-stats">
        <div className="streak-card">
          <div className="streak-title">Chuỗi hiện tại</div>
          <div className="streak-value">{streak} ngày</div>
        </div>
        <div className="streak-card">
          <div className="streak-title">Chuỗi dài nhất</div>
          <div className="streak-value">0 ngày</div>
        </div>
        <div className="streak-card">
          <div className="streak-title">Tổng số ngày hoàn thành</div>
          <div className="streak-value">{totalCompletedDays} ngày</div>
        </div>
        <div className="streak-card">
          <div className="streak-title">Hoàn thành một phần</div>
          <div className="streak-value">{partialCompletedDays} ngày</div>
        </div>
      </div>
    </div>
  );
};

export default MonthCalendar; 