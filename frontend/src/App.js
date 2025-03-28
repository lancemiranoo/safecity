import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CreateReportPage from './pages/CreateReportPage';
import Login from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import UpdateReportPage from './pages/UpdateReportPage';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create-report" element={<CreateReportPage />} />
        <Route path="/edit-report/:id" element={<UpdateReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
