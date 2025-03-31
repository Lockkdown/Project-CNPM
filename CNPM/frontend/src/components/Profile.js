import React, { useState, useRef } from 'react';
import '../styles/Profile.css';
import { FaUser, FaClock, FaCheck, FaCamera } from 'react-icons/fa';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [userData, setUserData] = useState({
    name: 'Hoàng Việt Nguyên',
    role: 'Sinh viên',
    email: 'nguyenvana@gmail.com',
    phone: '0123456789',
    avatar: null,
    habits: [
      {
        id: 1,
        name: 'Đọc sách',
        time: '20:00',
        frequency: '3 lần/tuần',
        status: 'Đang thực hiện'
      },
      {
        id: 2,
        name: 'Tập thể dục',
        time: '06:00',
        frequency: 'Hàng ngày',
        status: 'Đang thực hiện'
      }
    ]
  });

  const [editForm, setEditForm] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    avatar: null
  });

  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      avatar: null
    });
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({
          ...editForm,
          avatar: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({
      ...userData,
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      avatar: editForm.avatar || userData.avatar
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="avatar-section">
        <div className="avatar-circle" onClick={handleAvatarClick}>
          {userData.avatar ? (
            <>
              <img src={userData.avatar} alt="Avatar" className="avatar-image" />
              <div className="avatar-overlay">
                <FaCamera className="camera-icon" />
              </div>
            </>
          ) : (
            <>
              <FaUser className="avatar-icon" />
              <div className="avatar-overlay">
                <FaCamera className="camera-icon" />
              </div>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
        <div className="avatar-info">
          <h2>{userData.name}</h2>
          <p className="role">{userData.role}</p>
          <button className="edit-button" onClick={handleEditClick}>
            Chỉnh sửa
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h2>Chỉnh sửa hồ sơ</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên của bạn"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email của bạn"
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>
              <div className="form-group">
                <label>Avatar</label>
                <div className="avatar-upload">
                  <div className="avatar-preview-container" onClick={handleAvatarClick}>
                    {editForm.avatar ? (
                      <div className="avatar-preview">
                        <img src={editForm.avatar} alt="Preview" />
                        <div className="avatar-overlay">
                          <FaCamera className="camera-icon" />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar-preview">
                        {userData.avatar ? (
                          <>
                            <img src={userData.avatar} alt="Current Avatar" />
                            <div className="avatar-overlay">
                              <FaCamera className="camera-icon" />
                            </div>
                          </>
                        ) : (
                          <>
                            <FaUser className="preview-icon" />
                            <div className="avatar-overlay">
                              <FaCamera className="camera-icon" />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-buttons">
                <button type="button" className="cancel-button" onClick={handleCloseEdit}>
                  Hủy
                </button>
                <button type="submit" className="save-button">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="info-section">
        <h2>Thông tin cá nhân</h2>
        <div className="info-group">
          <FaUser className="info-icon" />
          <div className="info-content">
            <label>Tên</label>
            <p>{userData.name}</p>
          </div>
        </div>
        <div className="info-group">
          <i className="fas fa-envelope info-icon"></i>
          <div className="info-content">
            <label>Email</label>
            <p>{userData.email}</p>
          </div>
        </div>
        <div className="info-group">
          <i className="fas fa-phone info-icon"></i>
          <div className="info-content">
            <label>Số điện thoại</label>
            <p>{userData.phone}</p>
          </div>
        </div>
      </div>

      <div className="habits-section">
        <h2>Thói quen thường xuyên</h2>
        {userData.habits.map(habit => (
          <div key={habit.id} className="habit-item">
            <div className="habit-header">
              <h3>{habit.name}</h3>
            </div>
            <div className="habit-details">
              <div className="habit-detail">
                <FaClock className="habit-icon" />
                <span>{habit.time}</span>
              </div>
              <div className="habit-detail">
                <FaCheck className="habit-icon" />
                <span>{habit.frequency}</span>
              </div>
              <span className="status">{habit.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
