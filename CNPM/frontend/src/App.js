import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import HomePage from './components/HomePage';
import CalendarPage from './components/CalendarPage';
import NotificationsPage from './components/NotificationsPage';
import Layout from './components/Layout';
import { SidebarProvider } from './context/SidebarContext';
import Profile from './components/Profile';
import Setting from './components/Setting';
import AllHabits from './components/AllHabits';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <ThemeProvider>
          <SidebarProvider>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/home" element={<Layout><HomePage /></Layout>} />
              <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
              <Route path="/notifications" element={<Layout><NotificationsPage /></Layout>} />
              <Route path="/profile" element={<Layout><Profile /></Layout>} />
              <Route path="/settings" element={<Layout><Setting /></Layout>} />
              <Route path="/habits" element={<Layout><AllHabits /></Layout>} />
            </Routes>
          </SidebarProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App; 