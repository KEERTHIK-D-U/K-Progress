import React, { createContext, useState, useContext, useEffect } from 'react';

// Data types aligned with previous backend models
interface Milestone {
  title: string;
  completed: boolean;
  completedAt?: Date;
}

export interface Todo {
  _id: string;
  type: 'traditional' | 'modern';
  title: string;
  description: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  duration?: { value: number; unit: 'days' | 'months' };
  startDate?: string;
  targetDate?: string;
  reminderEnabled: boolean;
  motivationalEnabled: boolean;
  contactPreference?: { email: boolean; whatsapp: boolean };
  milestones?: Milestone[];
  progress: number;
  streak: number;
  status: 'pending' | 'in-progress' | 'completed' | 'paused' | 'archived';
  createdAt: string;
  lastUpdated?: string;
  archivedAt?: string;
  learning?: string;
}

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  createTodo: (todoData: any) => Promise<void>;
  updateProgress: (id: string, progress?: number, milestones?: any[], logText?: string) => Promise<void>;
  archiveTodo: (id: string, learning: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  refreshTodos: () => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const STORAGE_KEY = 'ai_todo_tracker_data';

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from local storage on mount
  const fetchTodos = async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTodos(JSON.parse(stored));
      } else {
        setTodos([]);
      }
    } catch (error) {
      console.error("Error loading todos from local storage", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Helper to save to local storage
  const saveToStorage = (newTodos: Todo[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
    setTodos(newTodos);
  };

  const createTodo = async (todoData: any) => {
    // Generate a simple ID
    const newTodo: Todo = {
      ...todoData,
      _id: Date.now().toString(), // Simple ID generation
      progress: 0,
      streak: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      milestones: todoData.milestones || []
    };

    const updatedTodos = [newTodo, ...todos];
    saveToStorage(updatedTodos);
  };

  const updateProgress = async (id: string, progress?: number, milestones?: any[], _logText?: string) => {
    const updatedTodos = todos.map(todo => {
        if (todo._id !== id) return todo;

        const updates: Partial<Todo> = { lastUpdated: new Date().toISOString() };
        if (progress !== undefined) updates.progress = progress;
        if (milestones) updates.milestones = milestones;
        
        // Auto-update status based on progress
        if (progress === 100) {
            updates.status = 'completed';
        } else if (todo.status === 'pending') {
            updates.status = 'in-progress';
        }

        return { ...todo, ...updates };
    });
    saveToStorage(updatedTodos);
  };

  const archiveTodo = async (id: string, _learning: string) => {
    // Currently just deleting archived todos to keep list clean, 
    // or we could mark them as archived if we want to show them in a history view later.
    const remainingTodos = todos.filter(t => t._id !== id);
    saveToStorage(remainingTodos);
  };
  
  const deleteTodo = async (id: string) => {
     const remainingTodos = todos.filter(t => t._id !== id);
     saveToStorage(remainingTodos);
  };

  return (
    <TodoContext.Provider value={{ todos, loading, createTodo, updateProgress, deleteTodo, archiveTodo, refreshTodos: fetchTodos }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};
