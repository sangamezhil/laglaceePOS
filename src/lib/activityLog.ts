
'use client';

import type { ActivityLog } from "@/lib/types";
import { initialActivityLog } from "@/data/activityLog";

const ACTIVITY_LOG_KEY = 'activityLog';

// Function to get activity logs from localStorage
export const getActivityLog = (): ActivityLog[] => {
  if (typeof window === 'undefined') {
    return initialActivityLog;
  }
  const storedLogs = localStorage.getItem(ACTIVITY_LOG_KEY);
  if (storedLogs) {
    return JSON.parse(storedLogs);
  }
  // Initialize with default logs if none are stored
  localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(initialActivityLog));
  return initialActivityLog;
};

// Function to add a new entry to the activity log
export const addActivityLog = (entry: Omit<ActivityLog, 'id' | 'date'>) => {
    if (typeof window === 'undefined') return;

    const newLogEntry: ActivityLog = {
        ...entry,
        id: `log-${Date.now()}`,
        date: new Date().toISOString(),
    };

    const currentLogs = getActivityLog();
    const updatedLogs = [newLogEntry, ...currentLogs];
    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(updatedLogs));
    
    // Dispatch a storage event to notify other components/tabs
    window.dispatchEvent(new Event('storage'));
};
