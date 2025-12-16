import { useState } from 'react';
import { useTodo, type Todo } from '../../context/TodoContext';
import { CheckCircle, Circle, Trash2, Calendar, TrendingUp, BookOpen, Send } from 'lucide-react';

const LogInput = ({ onLog }: { onLog: (text: string) => void }) => {
    const [text, setText] = useState('');
    const [expanded, setExpanded] = useState(false);

    const handleSubmit = () => {
        if (!text.trim()) return;
        onLog(text);
        setText('');
        setExpanded(false);
    };

    if (!expanded) {
        return (
            <button onClick={() => setExpanded(true)} className="text-xs text-gray-400 hover:text-gray-600 flex items-center transition-colors">
                <BookOpen size={12} className="mr-1" /> Log Daily Activity
            </button>
        );
    }

    return (
        <div className="animate-fadeIn">
            <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What did you accomplish today?"
                className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-gray-800 focus:outline-none bg-gray-50 mb-2"
                rows={2}
                autoFocus
            />
            <div className="flex justify-end space-x-2">
                <button onClick={() => setExpanded(false)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                <button onClick={handleSubmit} className="text-xs bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-black flex items-center">
                    <Send size={10} className="mr-1" /> Save
                </button>
            </div>
        </div>
    );
};

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
          
          <div className="mt-6">
             <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Log Activity</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={learningText}
                        onChange={(e) => setLearningText(e.target.value)}
                        placeholder="What did you work on today?"
                        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-gray-800 focus:outline-none bg-gray-50"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                updateProgress(todo._id, undefined, undefined, learningText);
                                setLearningText('');
                            }
                        }}
                    />
                    <button 
                        onClick={() => {
                            if (!learningText.trim()) return;
                            updateProgress(todo._id, undefined, undefined, learningText);
                            setLearningText('');
                        }}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors"
                    >
                        Commit
                    </button>
                </div>
             </div>
          </div>
          
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-50">
             <div className="flex items-center text-sm text-gray-500">
                <TrendingUp className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-semibold text-gray-700 mr-1">{todo.streak} Day</span> Streak
             </div>
             <div className="text-sm text-gray-400">
                {todo.targetDate && `Target: ${new Date(todo.targetDate).toLocaleDateString()}`}
             </div>
          </div>

          {/* Daily Log Section */}
          <div className="mt-6 pt-4 border-t border-gray-50">
              <LogInput onLog={(text) => updateProgress(todo._id, undefined, undefined, text)} />
          </div>

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
