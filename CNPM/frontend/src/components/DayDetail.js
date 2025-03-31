import React, { useState, useEffect } from 'react';
import '../styles/DayDetail.css';

function DayDetail({ date, onClose, onSave, existingActivities = [] }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Khởi tạo danh sách hoạt động với các hoạt động đã có
    setActivities(existingActivities);
  }, [existingActivities]);

  const handleAddActivity = () => {
    setActivities([
      ...activities,
      {
        id: Date.now(),
        name: '',
        time: '',
        duration: ''
      }
    ]);
  };

  const handleRemoveActivity = (id) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  const handleActivityChange = (id, field, value) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, [field]: value } : activity
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(date, activities);
    onClose();
  };

  const formatDate = (date) => {
    return `${date.getDate()} tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`;
  };

  return (
    <div className="day-detail-overlay">
      <div className="day-detail-modal">
        <div className="day-detail-header">
          <h2>Hoạt động ngày {formatDate(date)}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="activity-list">
            {activities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-inputs">
                  <input
                    type="text"
                    placeholder="Tên hoạt động"
                    value={activity.name}
                    onChange={(e) => handleActivityChange(activity.id, 'name', e.target.value)}
                    required
                  />
                  <input
                    type="time"
                    value={activity.time}
                    onChange={(e) => handleActivityChange(activity.id, 'time', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Thời gian (phút)"
                    value={activity.duration}
                    onChange={(e) => handleActivityChange(activity.id, 'duration', e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="button" 
                  className="remove-activity"
                  onClick={() => handleRemoveActivity(activity.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="add-activity" onClick={handleAddActivity}>
            + Thêm hoạt động
          </button>
          <button type="submit" className="save-activities">
            Lưu hoạt động
          </button>
        </form>
      </div>
    </div>
  );
}

export default DayDetail; 