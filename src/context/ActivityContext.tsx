import { createContext, useState, useEffect, ReactNode } from 'react';
import { ActivityLogType } from '../types/activity';

interface ActivityContextType {
  logs: ActivityLogType[];
  loading: boolean;
  error: string | null;
  getLogs: (filters?: Partial<ActivityLogType>) => ActivityLogType[];
  addLog: (log: ActivityLogType) => void;
}

export const ActivityContext = createContext<ActivityContextType>({
  logs: [],
  loading: false,
  error: null,
  getLogs: () => [],
  addLog: () => {},
});

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<ActivityLogType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize activity logs from localStorage
  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem('activityLogs');
      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs);
        setLogs(parsedLogs);
      } else {
        // Initialize with empty array if no logs exist
        localStorage.setItem('activityLogs', JSON.stringify([]));
      }
    } catch (err) {
      console.error('Failed to initialize activity logs:', err);
      setError('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for new activity logs from other contexts
  useEffect(() => {
    const handleActivityLogAdded = (event: CustomEvent<ActivityLogType>) => {
      const newLog = event.detail;
      setLogs(prevLogs => [...prevLogs, newLog]);
    };

    window.addEventListener('activityLogAdded', handleActivityLogAdded as EventListener);

    return () => {
      window.removeEventListener('activityLogAdded', handleActivityLogAdded as EventListener);
    };
  }, []);

  // Add new activity log
  const addLog = (log: ActivityLogType) => {
    try {
      const newLogs = [...logs, log];
      setLogs(newLogs);
      localStorage.setItem('activityLogs', JSON.stringify(newLogs));
    } catch (err) {
      console.error('Failed to add activity log:', err);
      setError('Failed to add activity log');
    }
  };

  // Get logs with optional filtering
  const getLogs = (filters?: Partial<ActivityLogType>): ActivityLogType[] => {
    if (!filters) {
      const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return sortedLogs;
    }
    
    const filteredLogs = logs
      .filter(log => {
        return Object.entries(filters).every(([key, value]) => {
          return log[key as keyof ActivityLogType] === value;
        });
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return filteredLogs;
  };

  return (
    <ActivityContext.Provider value={{ logs, loading, error, getLogs, addLog }}>
      {children}
    </ActivityContext.Provider>
  );
};