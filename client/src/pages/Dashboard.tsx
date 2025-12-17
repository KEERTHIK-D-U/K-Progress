import React, { useState, useEffect } from 'react';
import { useTodo } from '../context/TodoContext';
import { useActivity } from '../context/ActivityContext';
import TraditionalForm from '../components/TodoForm/TraditionalForm';
import ModernAIForm from '../components/TodoForm/ModernAIForm';
import { TodoCard } from '../components/Dashboard/TodoCard';
import SelectionScreen from '../components/Dashboard/SelectionScreen';
import ProfileModal from '../components/Dashboard/ProfileModal';
import ActivityHeatmap from '../components/Dashboard/ActivityHeatmap';
import CheckInModal from '../components/Dashboard/CheckInModal';
import Footer from '../components/Layout/Footer';
import { Calendar as CalendarIcon, BrainCircuit, Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Mock User for display
  const user = { name: 'User' }; 
  const { todos, loading } = useTodo();
  const { activityData, addCommit, streak, totalCommits } = useActivity();
  
  const [viewMode, setViewMode] = useState<'selection' | 'dashboard'>('selection');
  const [activeTab, setActiveTab] = useState<'tasks' | 'analytics'>('tasks');
  const [showTraditionalForm, setShowTraditionalForm] = useState(false);
  const [showModernForm, setShowModernForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  
  const [commitMessage, setCommitMessage] = useState('');

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
  };

  const handleCommit = () => {
      if (!commitMessage.trim()) return;
      addCommit(commitMessage);
      setCommitMessage('');
  };



  const traditionalTodos = todos.filter(t => t.type === 'traditional');
  const modernTodos = todos.filter(t => t.type === 'modern');

  if (viewMode === 'selection') {
      return <SelectionScreen onSelect={() => {
          setViewMode('dashboard');
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
                     {/* Settings could be local prefs */}
                     <button onClick={() => setShowProfileModal(true)} className="text-gray-400 hover:text-gray-700">
                        <Settings size={18} />
                     </button>
                  </div>
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

            {/* AI Section (Manual now) */}
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
                                <h3 className="text-gray-900 font-bold mb-2">Start your Journey</h3>
                                <p className="text-gray-600 text-sm mb-4">Create a roadmap for your success.</p>
                                <button onClick={() => setShowModernForm(true)} className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all border border-gray-200">
                                Try Planner
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
            /* Analytics Tab - Github Style */
            <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="w-full max-w-4xl">
                        <ActivityHeatmap data={activityData as any} />
                    </div>

                    {/* Commit Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                             <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <div className="w-3 h-3 bg-[#40c463] rounded-sm"></div> Log Activity
                            </h3>
                            <div className="flex gap-4 text-sm">
                                <div className="text-center">
                                    <span className="block font-bold text-gray-900 text-lg">{streak}</span>
                                    <span className="text-gray-500 text-xs uppercase tracking-wider">Day Streak</span>
                                </div>
                                <div className="text-center">
                                    <span className="block font-bold text-gray-900 text-lg">{totalCommits}</span>
                                    <span className="text-gray-500 text-xs uppercase tracking-wider">Total Commits</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={commitMessage}
                                onChange={(e) => setCommitMessage(e.target.value)}
                                placeholder="What did you achieve today?"
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
                            />
                            <button 
                                onClick={handleCommit}
                                disabled={!commitMessage.trim()}
                                className="bg-[#2da44e] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#2c974b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Commit
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Commits turn the heatmap green. darker green = more activity.
                        </p>
                    </div>
                </div>
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

