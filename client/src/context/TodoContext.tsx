import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

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
  status: 'pending' | 'in-progress' | 'completed' | 'paused';
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

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Needs token from user

  const fetchTodos = async () => {
    if (!user) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get('http://localhost:5000/api/todos', config);
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [user]);

  const createTodo = async (todoData: any) => {
    if (!user) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post('http://localhost:5000/api/todos', todoData, config);
      setTodos((prev) => [data, ...prev]);
    } catch (error) {
      console.error("Error creating todo", error);
      throw error;
    }
  };

  const updateProgress = async (id: string, progress?: number, milestones?: any[], logText?: string) => {
    if (!user) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const payload: any = {};
      if (progress !== undefined) payload.progress = progress;
      if (milestones) payload.milestones = milestones;
      if (logText) payload.logText = logText;
      
      const { data } = await axios.put(`http://localhost:5000/api/todos/${id}/progress`, payload, config);
      setTodos((prev) => prev.map((todo) => (todo._id === id ? data : todo)));
    } catch (error) {
      console.error("Error updating progress", error);
    }
  };

  const archiveTodo = async (id: string, learning: string) => {
    if (!user) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.post(`http://localhost:5000/api/todos/${id}/archive`, { learning }, config);
      // Remove from local state
      setTodos(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error("Archive failed", error);
      throw error;
    }
  };
  
  const deleteTodo = async (id: string) => {
       if (!user) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.delete(`http://localhost:5000/api/todos/${id}`, config);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo", error);
    }
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
