
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTodo } from '../context/TodoContext';
import { useNavigate } from 'react-router-dom';
import TraditionalForm from '../components/TodoForm/TraditionalForm';
import ModernAIForm from '../components/TodoForm/ModernAIForm';
import { TodoCard } from '../components/Dashboard/TodoCard';
import SelectionScreen from '../components/Dashboard/SelectionScreen';
import ProfileModal from '../components/Dashboard/ProfileModal';
import ActivityHeatmap from '../components/Dashboard/ActivityHeatmap';
import CheckInModal from '../components/Dashboard/CheckInModal';
import Footer from '../components/Layout/Footer';
import { Download, Calendar as CalendarIcon, BrainCircuit, Settings } from 'lucide-react';
import api from '../context/api';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { todos, loading } = useTodo();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState<'selection' | 'dashboard'>('selection');
  const [activeTab, setActiveTab] = useState<'tasks' | 'analytics'>('tasks');
  const [showTraditionalForm, setShowTraditionalForm] = useState(false);
  const [showModernForm, setShowModernForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Check for daily check-in
    const lastCheckIn = localStorage.getItem('lastCheckInDate');
    const today = new Date().toDateString();
    
    if (lastCheckIn !== today) {
        // Delay slightly for effect
        const timer = setTimeout(() => setShowCheckInModal(true), 1500);
        return () => clearTimeout(timer);
    }
  }, []);

  const handleCheckInClose = () => {
      localStorage.setItem('lastCheckInDate', new Date().toDateString());
      setShowCheckInModal(false);
      // Refresh stats if we updated things
      if (activeTab === 'analytics') {
          // trigger re-fetch logic if we extracted it, or just let next tab switch handle it
      }
  };

  useEffect(() => {
    if (activeTab === 'analytics') {
        const fetchStats = async () => {
            try {
                const res = await api.get('/todos/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch stats");
            }
        };
        fetchStats();
    }
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExport = async () => {
    try {
        const response = await api.get('/todos/export', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'todos_export.csv');
        document.body.appendChild(link);
        link.click();
    } catch (error) {
        console.error("Export failed", error);
    }
  };

  const traditionalTodos = todos.filter(t => t.type === 'traditional');
  const modernTodos = todos.filter(t => t.type === 'modern');

  if (viewMode === 'selection') {
      return <SelectionScreen onSelect={(mode) => {
          setViewMode('dashboard');
          if (mode === 'traditional') {
             // Just go to dashboard, maybe highlight traditional section
          } else {
             // highlight modern
          }
      }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
               <div className="flex items-center cursor-pointer" onClick={() => setViewMode('selection')}>
                  <img src="/logo.png" alt="K Progress" className="h-10 w-auto" />
               </div>
               <div className="flex items-center space-x-6">
                  <div className="hidden md:flex space-x-1 bg-gray-100 p-1 rounded-lg">
                      <button 
                        onClick={() => setActiveTab('tasks')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'tasks' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Tasks
                      </button>
                      <button 
                        id="analytics-tab-btn"
                        onClick={() => setActiveTab('analytics')}
                         className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Analytics
                      </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                     <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                        {user?.name.charAt(0)}
                     </div>
                     <span className="text-gray-700 text-sm font-medium hidden sm:block">{user?.name}</span>
                     <button onClick={() => setShowProfileModal(true)} className="text-gray-400 hover:text-gray-700">
                        <Settings size={18} />
                     </button>
                  </div>
                  <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 text-sm">Logout</button>
               </div>
            </div>
         </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {activeTab === 'tasks' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Section */}
            <div className="space-y-4" id="daily-tasks-section">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                        <CalendarIcon size={20} className="text-gray-600"/>
                        <h2 className="text-lg font-bold text-gray-800">Daily Tasks</h2>
                    </div>
                    <button onClick={() => setShowTraditionalForm(true)} className="text-sm text-gray-800 hover:text-black font-medium bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300 transition-colors">
                    + Add Task
                    </button>
                </div>
                
                {loading ? <div className="text-center py-10 text-gray-400">Loading...</div> : (
                traditionalTodos.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50">
                        <p className="text-gray-400 text-sm">No daily tasks pending</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {traditionalTodos.map(todo => <TodoCard key={todo._id} todo={todo} />)}
                    </div>
                )
                )}
            </div>

            {/* AI Section */}
            <div className="space-y-4" id="modern-goals-section">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                        <BrainCircuit size={20} className="text-gray-800"/>
                        <h2 className="text-lg font-bold text-gray-800">Long-term Goals</h2>
                    </div>
                    <button onClick={() => setShowModernForm(true)} className="text-sm text-gray-800 hover:text-black font-medium bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300 transition-colors">
                    + New Goal
                    </button>
                </div>

                {loading ? <div className="text-center py-10 text-gray-400">Loading...</div> : (
                    <div className="space-y-4">
                    {modernTodos.length === 0 && (
                        <div className="bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 rounded-xl p-8 text-center relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="relative z-10">
                                <h3 className="text-gray-900 font-bold mb-2">Start your AI Journey</h3>
                                <p className="text-gray-600 text-sm mb-4">Let AI create a roadmap for your success.</p>
                                <button onClick={() => setShowModernForm(true)} className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all border border-gray-200">
                                Try AI Planner
                                </button>
                            </div>
                        </div>
                    )}
                    {modernTodos.map(todo => <TodoCard key={todo._id} todo={todo} />)}
                    </div>
                )}
            </div>
            </div>
        ) : (
            /* Analytics Tab */
            <div className="space-y-8 animate-fadeIn">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Progress Analytics</h2>
                    <button onClick={handleExport} className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        <Download size={18} />
                        <span className="font-medium">Export CSV</span>
                    </button>
                </div>

                {!stats ? <div>Loading stats...</div> : (
                    <>
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-gray-500 text-sm mb-1">Consistency Score</p>
                                <div className="flex items-end space-x-2">
                                    <span className="text-3xl font-bold text-gray-800">{stats.consistency}</span>
                                    <span className="text-gray-400 text-sm mb-1">/ 100</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-gray-500 text-sm mb-1">Completed Goals</p>
                                <span className="text-3xl font-bold text-gray-800">{stats.completed}</span>
                            </div>
                             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-gray-500 text-sm mb-1">Pending Milestones</p>
                                <span className="text-3xl font-bold text-gray-600">{stats.pending}</span>
                            </div>
                        </div>

                        {/* Heatmap */}
                        <div className="animate-slideUp">
                            <ActivityHeatmap data={stats.heatmapData || []} />
                        </div>

                        {/* Charts Removed as per request */}
                    </>
                )}
            </div>
        )}
      </div>

      <Footer />


      {showTraditionalForm && <TraditionalForm onClose={() => setShowTraditionalForm(false)} />}
      {showModernForm && <ModernAIForm onClose={() => setShowModernForm(false)} />}
      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
      {showCheckInModal && <CheckInModal onClose={handleCheckInClose} />}
    </div>
  );
};

export default Dashboard;

