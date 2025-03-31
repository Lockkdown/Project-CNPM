import React from 'react';
import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <NotificationBell />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 