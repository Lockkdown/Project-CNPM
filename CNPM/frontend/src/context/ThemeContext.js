import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo ThemeContext để lưu trữ và chia sẻ trạng thái theme trong toàn bộ ứng dụng
const ThemeContext = createContext();

// Component ThemeProvider - Cung cấp theme cho toàn bộ ứng dụng
export const ThemeProvider = ({ children }) => {
  // Khởi tạo state darkMode với giá trị từ localStorage hoặc mặc định là true
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : true;
  });

  // Effect hook để cập nhật theme và lưu vào localStorage
  useEffect(() => {
    // Lưu trạng thái darkMode vào localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // Nếu darkMode là true, áp dụng theme tối
    if (darkMode) {
      document.documentElement.style.setProperty('--bg-primary', '#000000');
      document.documentElement.style.setProperty('--bg-secondary', '#1a1a1a');
      document.documentElement.style.setProperty('--bg-tertiary', '#2d2d2d');
      document.documentElement.style.setProperty('--text-primary', '#ffffff');
      document.documentElement.style.setProperty('--text-secondary', '#999999');
    } 
    // Nếu darkMode là false, áp dụng theme sáng
    else {
      document.documentElement.style.setProperty('--bg-primary', '#eeeeee');
      document.documentElement.style.setProperty('--bg-secondary', '#ffffff');
      document.documentElement.style.setProperty('--bg-tertiary', '#f5f5f5');
      document.documentElement.style.setProperty('--text-primary', '#000000');
      document.documentElement.style.setProperty('--text-secondary', '#666666');
    }
  }, [darkMode]); // Chạy effect mỗi khi darkMode thay đổi

  // Hàm để chuyển đổi giữa theme sáng và tối
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Render ThemeProvider với giá trị theme hiện tại
  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children} {/* Render các component con */}
    </ThemeContext.Provider>
  );
};

// Custom hook useTheme để sử dụng theme trong các component
export const useTheme = () => {
  // Lấy context từ ThemeContext
  const context = useContext(ThemeContext);
  
  // Kiểm tra xem hook có được sử dụng trong ThemeProvider không
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  // Trả về context chứa darkMode và toggleTheme
  return context;
}; 