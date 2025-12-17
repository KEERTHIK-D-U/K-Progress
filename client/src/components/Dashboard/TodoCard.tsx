import { useState } from 'react';
import { useTodo, type Todo } from '../../context/TodoContext';
import { CheckCircle, Circle, Trash2, Calendar } from 'lucide-react';



export const TodoCard = ({ todo }: { todo: Todo }) => {
  const { deleteTodo, updateProgress } = useTodo();
  
  const isModern = todo.type === 'modern';
  const isCompleted = todo.status === 'completed';

  const handleDelete = () => {
      if(window.confirm('Delete this task?')) deleteTodo(todo._id);
  }

  const handleToggleComplete = () => {
    // For traditional, toggle status
    // For modern, this might open a check-in modal. For MVP, just set 100%
    const newProgress = isCompleted ? 0 : 100;
    updateProgress(todo._id, newProgress);
  }

  if (isModern) {
      const [showLearningModal, setShowLearningModal] = useState(false);
      const [learningText, setLearningText] = useState('');
      const { archiveTodo } = useTodo();

      const handleArchive = async () => {
          if (!learningText.trim()) return;
          await archiveTodo(todo._id, learningText);
          setShowLearningModal(false);
      };
      
      const handleMilestoneToggle = async (index: number) => {
          if (!todo.milestones) return;
          
          const newMilestones = [...todo.milestones];
          newMilestones[index].completed = !newMilestones[index].completed;
          
          const completedCount = newMilestones.filter(m => m.completed).length;
          const totalCount = newMilestones.length;
          const newProgress = Math.round((completedCount / totalCount) * 100);
          
          await updateProgress(todo._id, newProgress, newMilestones);
      };


     return (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6 relative overflow-visible group hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-gray-600 to-gray-800"></div>
          <div className="flex justify-between items-start mb-6">
             <div>
                <span className="text-xs font-bold text-gray-600 tracking-wider uppercase bg-gray-100 px-3 py-1.5 rounded-md">Goal</span>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{todo.title}</h3>
                <p className="text-base text-gray-500 mt-1">{todo.description}</p>
             </div>
             <div className="flex items-center space-x-2">
                 {!isCompleted && (
                     <button 
                        onClick={() => setShowLearningModal(true)}
                        className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors font-medium"
                     >
                        Mark Complete
                     </button>
                 )}
                 <button onClick={handleDelete} className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-5 w-5" />
                 </button>
             </div>
          </div>
          
          {/* AI Roadmap Display */}
          {todo.milestones && todo.milestones.length > 0 && (
              <div className="mt-6 border-t pt-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Your Roadmap</h4>
                  <div className="space-y-3">
                      {todo.milestones.map((milestone, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => handleMilestoneToggle(idx)}
                            className={`flex items-start p-3 rounded-lg border transition-all cursor-pointer hover:border-gray-300 ${milestone.completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100'}`}
                          >
                              <div className={`mt-0.5 mr-3 flex-shrink-0 transition-colors ${milestone.completed ? 'text-green-600' : 'text-gray-300'}`}>
                                  {milestone.completed ? (
                                      <CheckCircle className="h-5 w-5 fill-green-50" />
                                  ) : (
                                      <Circle className="h-5 w-5" />
                                  )}
                              </div>
                              <span className={`text-sm ${milestone.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                                  {milestone.title}
                              </span>
                          </div>
                      ))}
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gray-800 transition-all duration-500"
                        style={{ width: `${todo.progress}%` }} 
                      />
                  </div>
                  <div className="text-right text-xs text-gray-400 mt-1">{todo.progress}% Complete</div>
              </div>
          )}

          {/* Learning Modal Overlay */}
            {showLearningModal && (
                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn rounded-xl">
                    <div className="w-full max-w-md">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Goal Completed! 🎉</h4>
                        <p className="text-gray-600 mb-4">What was your biggest key learning from this journey?</p>
                        <textarea
                            value={learningText}
                            onChange={(e) => setLearningText(e.target.value)}
                            placeholder="I learned that consistency beats intensity..."
                            className="w-full border border-gray-300 rounded-lg p-3 h-32 mb-4 focus:ring-2 focus:ring-gray-800 focus:outline-none"
                            autoFocus
                        />
                        <div className="flex justify-end space-x-2">
                            <button 
                                onClick={() => {
                                    setShowLearningModal(false);
                                }}
                                className="px-4 py-2 text-gray-500 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleArchive}
                                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                            >
                                Archive & Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
     );
  }

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-4 flex items-center justify-between group hover:border-gray-400 transition-all ${isCompleted ? 'opacity-60' : ''}`}>
       <div className="flex items-center gap-4">
          <button onClick={handleToggleComplete} className={`text-gray-400 hover:text-gray-800 transition-colors ${isCompleted ? 'text-gray-500' : ''}`}>
             {isCompleted ? <CheckCircle className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
          </button>
          <div>
             <h4 className={`text-base font-medium text-gray-800 ${isCompleted ? 'line-through text-gray-400' : ''}`}>{todo.title}</h4>
             {todo.dueDate && (
                 <div className="flex items-center text-xs text-gray-500 mt-0.5">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(todo.dueDate).toLocaleDateString()}
                 </div>
             )}
          </div>
       </div>
       <button onClick={handleDelete} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2">
           <Trash2 className="h-4 w-4" />
       </button>
    </div>
  );
};
