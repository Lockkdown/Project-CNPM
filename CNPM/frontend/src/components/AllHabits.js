import React, { useState, useMemo } from 'react';
import '../styles/AllHabits.css';

const AllHabits = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalCurrentDate, setModalCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [editingHabit, setEditingHabit] = useState(null);
  const [selectedHabitGroup, setSelectedHabitGroup] = useState('study');
  const [monthlyHabits, setMonthlyHabits] = useState([
    {
      id: 1,
      name: 'Học tiếng Anh',
      startDate: '01/03/2024',
      endDate: '31/03/2024',
      frequency: '5 lần/tuần',
      status: 'Đang thực hiện',
      progress: 45,
      time: '08:00',
      duration: '60'
    },
    {
      id: 2,
      name: 'Thiền',
      startDate: '01/03/2024',
      endDate: '31/03/2024',
      frequency: '2 lần/tuần',
      status: 'Đang thực hiện',
      progress: 60,
      time: '06:00',
      duration: '30'
    },
    {
      id: 3,
      name: 'Tập thể dục',
      startDate: '01/03/2024',
      endDate: '31/03/2024',
      frequency: 'Hàng ngày',
      status: 'Đang thực hiện',
      progress: 75,
      time: '17:00',
      duration: '45'
    },
    {
      id: 4,
      name: 'Đọc sách',
      startDate: '01/03/2024',
      endDate: '31/03/2024',
      frequency: '3 lần/tuần',
      status: 'Đang thực hiện',
      progress: 30,
      time: '20:00',
      duration: '30'
    }
  ]);
  const [newHabit, setNewHabit] = useState({
    name: '',
    time: '',
    duration: '',
    selectedDates: []
  });

  // Tính toán thống kê
  const statistics = useMemo(() => {
    const total = monthlyHabits.length;
    const completed = monthlyHabits.filter(habit => habit.progress === 100).length;
    const inProgress = monthlyHabits.filter(habit => habit.progress > 0 && habit.progress < 100).length;
    const notStarted = monthlyHabits.filter(habit => habit.progress === 0).length;
    const averageProgress = total > 0
      ? Math.round(monthlyHabits.reduce((acc, habit) => acc + habit.progress, 0) / total)
      : 0;

    // Phân loại thói quen
    const exerciseHabits = monthlyHabits.filter(habit =>
      habit.name.toLowerCase().includes('tập')
    );

    const studyHabits = monthlyHabits.filter(habit =>
      ['học', 'đọc', 'viết', 'luyện'].some(keyword =>
        habit.name.toLowerCase().includes(keyword)
      )
    );

    const otherHabits = monthlyHabits.filter(habit =>
      !exerciseHabits.includes(habit) && !studyHabits.includes(habit)
    );

    // Tính phần trăm của mỗi nhóm
    const exercisePercentage = (exerciseHabits.length / total) * 100;
    const studyPercentage = (studyHabits.length / total) * 100;
    const otherPercentage = (otherHabits.length / total) * 100;

    // Xác định nhóm có phần trăm cao nhất
    const maxPercentage = Math.max(exercisePercentage, studyPercentage, otherPercentage);
    let dominantGroup = {
      type: 'study',
      habits: studyHabits,
      percentage: studyPercentage,
      icon: 'fas fa-book',
      title: 'Học tập'
    };

    if (exercisePercentage === maxPercentage) {
      dominantGroup = {
        type: 'exercise',
        habits: exerciseHabits,
        percentage: exercisePercentage,
        icon: 'fas fa-running',
        title: 'Thể dục'
      };
    } else if (otherPercentage === maxPercentage) {
      dominantGroup = {
        type: 'other',
        habits: otherHabits,
        percentage: otherPercentage,
        icon: 'fas fa-star',
        title: 'Khác'
      };
    }

    return {
      total,
      completed,
      inProgress,
      notStarted,
      averageProgress,
      exerciseHabits: exerciseHabits.length,
      studyHabits: studyHabits.length,
      otherHabits: otherHabits.length,
      groups: {
        exercise: {
          habits: exerciseHabits,
          percentage: exercisePercentage,
          icon: 'fas fa-running',
          title: 'Thể dục'
        },
        study: {
          habits: studyHabits,
          percentage: studyPercentage,
          icon: 'fas fa-book',
          title: 'Học tập'
        },
        other: {
          habits: otherHabits,
          percentage: otherPercentage,
          icon: 'fas fa-star',
          title: 'Khác'
        }
      },
      dominantGroup
    };
  }, [monthlyHabits]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    const days = [];

    // Thêm ngày từ tháng trước
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }

    // Thêm ngày trong tháng hiện tại
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    // Thêm ngày từ tháng sau
    const remainingDays = 42 - days.length; // 6 hàng x 7 cột
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleModalPrevMonth = () => {
    setModalCurrentDate(new Date(modalCurrentDate.getFullYear(), modalCurrentDate.getMonth() - 1, 1));
  };

  const handleModalNextMonth = () => {
    setModalCurrentDate(new Date(modalCurrentDate.getFullYear(), modalCurrentDate.getMonth() + 1, 1));
  };

  const getMonthName = (date) => {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return months[date.getMonth()];
  };

  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const handleOpenModal = (habit = null) => {
    if (habit) {
      setEditingHabit(habit);
      const startDate = parseDate(habit.startDate);
      const endDate = parseDate(habit.endDate);
      const selectedDates = [];

      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        selectedDates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setNewHabit({
        name: habit.name,
        time: habit.time,
        duration: habit.duration,
        selectedDates: selectedDates
      });
    } else {
      setEditingHabit(null);
      setNewHabit({
        name: '',
        time: '',
        duration: '',
        selectedDates: []
      });
    }
    setModalCurrentDate(new Date()); // Reset modal calendar về tháng hiện tại
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHabit(null);
    setNewHabit({
      name: '',
      time: '',
      duration: '',
      selectedDates: []
    });
  };

  const handleDateSelect = (date) => {
    setNewHabit(prev => {
      const dateString = date.toISOString().split('T')[0];
      const exists = prev.selectedDates.includes(dateString);

      return {
        ...prev,
        selectedDates: exists
          ? prev.selectedDates.filter(d => d !== dateString)
          : [...prev.selectedDates, dateString]
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHabit(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Tìm ngày bắt đầu và kết thúc từ các ngày đã chọn
    const sortedDates = [...newHabit.selectedDates].sort();
    const startDate = new Date(sortedDates[0]);
    const endDate = new Date(sortedDates[sortedDates.length - 1]);

    // Tính tần suất dựa trên số ngày đã chọn
    const frequency = calculateFrequency(newHabit.selectedDates);

    const habit = {
      name: newHabit.name,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      time: newHabit.time,
      duration: newHabit.duration,
      frequency: frequency,
      status: 'Đang thực hiện',
      progress: editingHabit ? editingHabit.progress : 0
    };

    if (editingHabit) {
      // Cập nhật thói quen đang sửa
      setMonthlyHabits(prev => prev.map(h =>
        h.id === editingHabit.id ? { ...habit, id: h.id } : h
      ));
    } else {
      // Thêm thói quen mới
      setMonthlyHabits(prev => [...prev, { ...habit, id: prev.length + 1 }]);
    }

    handleCloseModal();
  };

  const handleDeleteClick = (habit) => {
    setHabitToDelete(habit);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (habitToDelete) {
      setMonthlyHabits(prev => prev.filter(habit => habit.id !== habitToDelete.id));
      setIsDeleteModalOpen(false);
      setHabitToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setHabitToDelete(null);
  };

  // Hàm parse chuỗi ngày dd/mm/yyyy thành đối tượng Date
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
  };

  // Hàm tính tần suất dựa trên các ngày đã chọn
  const calculateFrequency = (selectedDates) => {
    const daysPerWeek = Math.round(selectedDates.length / 4); // Ước tính số ngày mỗi tuần
    if (daysPerWeek === 7) return 'Hàng ngày';
    if (daysPerWeek === 1) return '1 lần/tuần';
    return `${daysPerWeek} lần/tuần`;
  };

  // Hàm format ngày thành chuỗi dd/mm/yyyy
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Xử lý click vào phần biểu đồ
  const handlePieChartClick = (groupType) => {
    setSelectedHabitGroup(groupType);
  };

  return (
    <div className="habits-container">
      <div className="habits-header">
        <h1>Thói quen</h1>
      </div>

      <div className="habits-content">
        <div className="monthly-section">
          <div className="habits-section">
            <h2>
              <i className="fas fa-calendar-alt"></i>
              Các thói quen trong tháng
            </h2>
            <div className="habits-grid">
              {monthlyHabits.map(habit => (
                <div key={habit.id} className="habit-card">
                  <div className="habit-card-header">
                    <h3>{habit.name}</h3>
                    <span className="habit-status">{habit.status}</span>
                  </div>
                  <div className="habit-details">
                    <div className="habit-info">
                      <i className="fas fa-calendar"></i>
                      <span>{habit.startDate} - {habit.endDate}</span>
                    </div>
                    <div className="habit-info">
                      <i className="fas fa-clock"></i>
                      <span>{habit.time} ({habit.duration} phút)</span>
                    </div>
                    <div className="habit-info">
                      <i className="fas fa-redo"></i>
                      <span>{habit.frequency}</span>
                    </div>
                  </div>
                  <div className="habit-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${habit.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{habit.progress}%</span>
                  </div>
                  <div className="habit-actions">
                    <button className="edit-button" onClick={() => handleOpenModal(habit)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteClick(habit)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="calendar-section">
            <div className="calendar-container-habit">
              <div className="calendar-header">
                <h3>{getMonthName(currentDate)} {currentDate.getFullYear()}</h3>
                <div className="calendar-nav">
                  <button onClick={handlePrevMonth}>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button onClick={handleNextMonth}>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
              <div className="calendar-grid">
                {weekDays.map(day => (
                  <div key={day} className="calendar-weekday">{day}</div>
                ))}
                {getDaysInMonth(currentDate).map((day, index) => {
                  const isToday = day.date.toDateString() === new Date().toDateString();
                  const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
                  return (
                    <div
                      key={index}
                      className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedDate(day.date)}
                    >
                      {day.date.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
            <button className="add-habit-button" onClick={() => handleOpenModal()}>
              <i className="fas fa-plus"></i>
              Thêm thói quen mới
            </button>
          </div>
        </div>

        <div className="statistics-section">
          <h2>
            <i className="fas fa-chart-bar"></i>
            Thống kê tháng
          </h2>
          <div className="statistics-content">
            <div className="statistics-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-list"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Tổng số thói quen</span>
                  <span className="stat-value">{statistics.total}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon completed">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Đã hoàn thành</span>
                  <span className="stat-value">{statistics.completed}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon in-progress">
                  <i className="fas fa-spinner"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Đang thực hiện</span>
                  <span className="stat-value">{statistics.inProgress}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon not-started">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Chưa bắt đầu</span>
                  <span className="stat-value">{statistics.notStarted}</span>
                </div>
              </div>
            </div>

            <div className="statistics-details">
              <div className="pie-chart-container">
                <h3>Phân loại thói quen</h3>
                <div className="pie-chart">
                  <svg viewBox="0 0 100 100">
                    {/* Exercise slice */}
                    <circle
                      className="pie-chart-circle exercise"
                      cx="50"
                      cy="50"
                      r="25"
                      strokeDasharray={`${(statistics.exerciseHabits / statistics.total) * 157.08} 157.08`}
                      strokeDashoffset="0"
                      onClick={() => handlePieChartClick('exercise')}
                      style={{ cursor: 'pointer' }}
                    />
                    {/* Study slice */}
                    <circle
                      className="pie-chart-circle study"
                      cx="50"
                      cy="50"
                      r="25"
                      strokeDasharray={`${(statistics.studyHabits / statistics.total) * 157.08} 157.08`}
                      strokeDashoffset={`${-(statistics.exerciseHabits / statistics.total) * 157.08}`}
                      onClick={() => handlePieChartClick('study')}
                      style={{ cursor: 'pointer' }}
                    />
                    {/* Other slice */}
                    <circle
                      className="pie-chart-circle other"
                      cx="50"
                      cy="50"
                      r="25"
                      strokeDasharray={`${(statistics.otherHabits / statistics.total) * 157.08} 157.08`}
                      strokeDashoffset={`${-((statistics.exerciseHabits + statistics.studyHabits) / statistics.total) * 157.08}`}
                      onClick={() => handlePieChartClick('other')}
                      style={{ cursor: 'pointer' }}
                    />
                  </svg>
                </div>
                <div className="pie-chart-legend">
                  <div className="legend-item" onClick={() => handlePieChartClick('exercise')} style={{ cursor: 'pointer' }}>
                    <span className="legend-color exercise"></span>
                    <span className="legend-label">Thể dục</span>
                    <span className="legend-value">{Math.round((statistics.exerciseHabits / statistics.total) * 100)}%</span>
                  </div>
                  <div className="legend-item" onClick={() => handlePieChartClick('study')} style={{ cursor: 'pointer' }}>
                    <span className="legend-color study"></span>
                    <span className="legend-label">Học tập</span>
                    <span className="legend-value">{Math.round((statistics.studyHabits / statistics.total) * 100)}%</span>
                  </div>
                  <div className="legend-item" onClick={() => handlePieChartClick('other')} style={{ cursor: 'pointer' }}>
                    <span className="legend-color other"></span>
                    <span className="legend-label">Khác</span>
                    <span className="legend-value">{Math.round((statistics.otherHabits / statistics.total) * 100)}%</span>
                  </div>
                </div>
              </div>

              <div className="habit-details-card">
                <h3>
                  <i className={statistics.groups[selectedHabitGroup].icon}></i>
                  Chi tiết thói quen {statistics.groups[selectedHabitGroup].title}
                </h3>
                <div className="habit-list">
                  {statistics.groups[selectedHabitGroup].habits.map(habit => (
                    <div key={habit.id} className="habit-item">
                      <div className="habit-item-header">
                        <span className="habit-item-name">{habit.name}</span>
                        <span className="habit-item-progress">{habit.progress}%</span>
                      </div>
                      <div className="habit-item-details">
                        <div className="habit-item-info">
                          <i className="fas fa-calendar"></i>
                          <span>{habit.startDate} - {habit.endDate}</span>
                        </div>
                        <div className="habit-item-info">
                          <i className="fas fa-clock"></i>
                          <span>{habit.time} ({habit.duration} phút)</span>
                        </div>
                        <div className="habit-item-info">
                          <i className="fas fa-redo"></i>
                          <span>{habit.frequency}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="stat-card full-width">
              <div className="stat-icon progress">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="stat-info">
                <span className="stat-label">Tiến độ trung bình</span>
                <div className="average-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${statistics.averageProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{statistics.averageProgress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingHabit ? 'Sửa thói quen' : 'Thêm thói quen mới'}</h2>
              <button className="close-button" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="habit-form">
              <div className="form-group">
                <label htmlFor="name">Tên hoạt động</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newHabit.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Giờ thực hiện</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={newHabit.time}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">Thời gian thực hiện (phút)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={newHabit.duration}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Chọn ngày thực hiện</label>
                <div className="modal-calendar">
                  <div className="calendar-header">
                    <h3>{getMonthName(modalCurrentDate)} {modalCurrentDate.getFullYear()}</h3>
                    <div className="calendar-nav">
                      <button type="button" onClick={handleModalPrevMonth}>
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <button type="button" onClick={handleModalNextMonth}>
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                  <div className="calendar-grid">
                    {weekDays.map(day => (
                      <div key={day} className="calendar-weekday">{day}</div>
                    ))}
                    {getDaysInMonth(modalCurrentDate).map((day, index) => {
                      const dateString = day.date.toISOString().split('T')[0];
                      const isSelected = newHabit.selectedDates.includes(dateString);
                      return (
                        <div
                          key={index}
                          className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} 
                            ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleDateSelect(day.date)}
                        >
                          {day.date.getDate()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="submit-button">
                  {editingHabit ? 'Cập nhật' : 'Thêm thói quen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="modal-header">
              <h2>Xác nhận xóa</h2>
              <button className="close-button" onClick={handleCancelDelete}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="delete-modal-body">
              <p>Bạn có chắc chắn muốn xóa thói quen này không?</p>
              <div className="habit-to-delete">
                <h3>{habitToDelete?.name}</h3>
                <div className="habit-info">
                  <i className="fas fa-calendar"></i>
                  <span>{habitToDelete?.startDate} - {habitToDelete?.endDate}</span>
                </div>
                <div className="habit-info">
                  <i className="fas fa-clock"></i>
                  <span>{habitToDelete?.time} ({habitToDelete?.duration} phút)</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-button" onClick={handleCancelDelete}>
                Hủy
              </button>
              <button className="delete-confirm-button" onClick={handleConfirmDelete}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllHabits;