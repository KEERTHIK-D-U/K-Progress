import React, { useState } from 'react';
import { useTodo } from '../../context/TodoContext';
import { X, Calendar, Flag } from 'lucide-react';

interface TraditionalFormProps {
  onClose: () => void;
}

const TraditionalForm: React.FC<TraditionalFormProps> = ({ onClose }) => {
  const { createTodo } = useTodo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTodo({
      type: 'traditional',
      title,
      description,
      dueDate,
      priority,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">Add New Task</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
             <textarea
               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
               rows={3}
               placeholder="Add details..."
               value={description}
               onChange={(e) => setDescription(e.target.value)}
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
               <div className="relative">
                 <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                 <input
                   type="date"
                   className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                   value={dueDate}
                   onChange={(e) => setDueDate(e.target.value)}
                 />
               </div>
             </div>
             
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
               <div className="relative">
                 <Flag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                 <select
                   className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                   value={priority}
                   onChange={(e) => setPriority(e.target.value)}
                 >
                   <option value="low">Low Priority</option>
                   <option value="medium">Medium Priority</option>
                   <option value="high">High Priority</option>
                 </select>
               </div>
             </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TraditionalForm;
