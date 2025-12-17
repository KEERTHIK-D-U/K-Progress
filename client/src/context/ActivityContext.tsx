import React, { createContext, useState, useContext, useEffect } from 'react';

export interface Activity {
  date: string; // YYYY-MM-DD
  count: number;
  messages: string[]; // List of commit messages for that day
}

interface ActivityContextType {
  activityData: Activity[];
  addCommit: (message: string) => void;
  loading: boolean;
  streak: number;
  totalCommits: number;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

const STORAGE_KEY = 'ai_todo_activity_log';

export const ActivityProvider = ({ children }: { children: React.ReactNode }) => {
  const [activityData, setActivityData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [totalCommits, setTotalCommits] = useState(0);

  // Helper to get local date string YYYY-MM-DD
  const getLocalDate = (d = new Date()) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  };

  const calculateStats = (data: Activity[]) => {
      // Total Commits
      const total = data.reduce((acc, curr) => acc + curr.count, 0);
      setTotalCommits(total);

      // Calculate Streak
      // Sort data descending
      const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      let currentStreak = 0;
      const today = getLocalDate();
      const yesterday = getLocalDate(new Date(Date.now() - 86400000));

      // Check if we have activity today or yesterday to start the streak
      const hasToday = sorted.find(a => a.date === today && a.count > 0);
      const hasYesterday = sorted.find(a => a.date === yesterday && a.count > 0);

      if (!hasToday && !hasYesterday) {
          setStreak(0);
          return;
      }

      // Start counting
      // We iterate back from today (or yesterday if today is empty)
      let checkDate = new Date();
      // If no activity today, start checking from yesterday for the streak continuation
      if (!hasToday) {
          checkDate.setDate(checkDate.getDate() - 1);
      }

      while (true) {
          const checkStr = getLocalDate(checkDate);
          const hasActivity = sorted.find(a => a.date === checkStr && a.count > 0);
          
          if (hasActivity) {
              currentStreak++;
              checkDate.setDate(checkDate.getDate() - 1);
          } else {
              break;
          }
      }
      setStreak(currentStreak);
  };

  // Load from storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setActivityData(parsed);
      calculateStats(parsed);
    }
    setLoading(false);
  }, []);

  const saveToStorage = (data: Activity[]) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setActivityData(data);
      calculateStats(data);
  };

  const addCommit = (message: string) => {
      const today = getLocalDate();
      const existingIndex = activityData.findIndex(a => a.date === today);
      
      let newData = [...activityData];

      if (existingIndex >= 0) {
          // Update existing day
          const existing = newData[existingIndex];
          newData[existingIndex] = {
              ...existing,
              count: existing.count + 1,
              messages: [...existing.messages, message]
          };
      } else {
          // New day entry
          newData.push({
              date: today,
              count: 1,
              messages: [message]
          });
      }
      
      saveToStorage(newData);
  };

  return (
    <ActivityContext.Provider value={{ activityData, addCommit, loading, streak, totalCommits }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};
