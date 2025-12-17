import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TodoProvider } from './context/TodoContext';
import { ActivityProvider } from './context/ActivityContext';
import Dashboard from './pages/Dashboard';
import NotificationManager from './components/NotificationManager';

function App() {
  return (
    <Router>
      <TodoProvider>
        <ActivityProvider>
          <NotificationManager />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Navigate to="/" />} />
            {/* Catch all redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ActivityProvider>
      </TodoProvider>
    </Router>
  );
}

export default App;
