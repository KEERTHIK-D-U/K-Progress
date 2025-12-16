import React, { useState, useEffect } from 'react';
import { useTodo } from '../../context/TodoContext';
import { Circle, X } from 'lucide-react';

interface CheckInModalProps {
    onClose: () => void;
}

const CheckInModal: React.FC<CheckInModalProps> = ({ onClose }) => {
    const { todos, updateProgress } = useTodo();
    const [activeTodos, setActiveTodos] = useState(todos.filter(t => t.status !== 'completed'));
    
    // Refresh local list if context changes (though we mostly drive from local interaction)
    useEffect(() => {
        setActiveTodos(todos.filter(t => t.status !== 'completed'));
    }, [todos]);

    const handleQuickComplete = (id: string) => {
        // Toggle completion for traditional tasks or simple progress bump?
        // Let's just mark traditional as completed, and for modern... maybe just acknowledge?
        // For simplicity, let's just allow marking tasks as done or 100%.
        updateProgress(id, 100);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl transform scale-100 transition-transform">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white relative">
                    <h2 className="text-2xl font-bold mb-1">Daily Check-in</h2>
                    <p className="text-gray-400 text-sm">What did you accomplish today?</p>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {activeTodos.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>You're all caught up! Great job.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activeTodos.map(todo => (
                                <div key={todo._id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{todo.title}</h4>
                                        <p className="text-xs text-gray-500 capitalize">{todo.type} • {todo.progress}%</p>
                                    </div>
                                    <button 
                                        onClick={() => handleQuickComplete(todo._id)}
                                        className="text-gray-400 hover:text-green-500 focus:outline-none transition-colors"
                                        title="Mark as Done"
                                    >
                                        <Circle size={24} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition-all shadow-md"
                    >
                        I'm Done for Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckInModal;
