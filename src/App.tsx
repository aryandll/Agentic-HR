import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Recruitment from './pages/Recruitment';
import Payroll from './pages/Payroll';
import Attendance from './pages/Attendance';
import Performance from './pages/Performance';
import OrgChart from './pages/OrgChart';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Careers from './pages/Careers';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';

import type { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path='/careers' element={<Careers />} />
      <Route path='/login' element={<Login />} />
      <Route path='/' element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='employees' element={<Employees />} />
        <Route path='recruitment' element={<Recruitment />} />
        <Route path='payroll' element={<Payroll />} />
        <Route path='attendance' element={<Attendance />} />
        <Route path='performance' element={<Performance />} />
        <Route path='org-chart' element={<OrgChart />} />

        <Route path='onboarding' element={<Onboarding />} />
        <Route path='settings' element={<Settings />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
          <Toaster position="top-right" toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
          }} />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
