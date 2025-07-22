import { useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface SyncData {
  type: 'employee' | 'attendance' | 'leave' | 'notification' | 'issue';
  action: 'create' | 'update' | 'delete';
  data: any;
  userId?: string;
}

// Global event emitter for data synchronization
class DataSyncManager {
  private listeners: Map<string, Function[]> = new Map();

  subscribe(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Trigger data sync across the application
  syncData(syncData: SyncData) {
    console.log('Syncing data:', syncData);
    
    // Update related data stores based on the sync type
    switch (syncData.type) {
      case 'employee':
        this.syncEmployeeData(syncData);
        break;
      case 'attendance':
        this.syncAttendanceData(syncData);
        break;
      case 'leave':
        this.syncLeaveData(syncData);
        break;
      case 'notification':
        this.syncNotificationData(syncData);
        break;
      case 'issue':
        this.syncIssueData(syncData);
        break;
    }
  }

  private syncEmployeeData(syncData: SyncData) {
    // Update directory data
    const directoryKey = 'nalco_employees';
    const existingEmployees = JSON.parse(localStorage.getItem(directoryKey) || '[]');
    
    switch (syncData.action) {
      case 'create':
        existingEmployees.push(syncData.data);
        break;
      case 'update':
        const updateIndex = existingEmployees.findIndex((emp: any) => emp.employeeId === syncData.data.employeeId);
        if (updateIndex > -1) {
          existingEmployees[updateIndex] = { ...existingEmployees[updateIndex], ...syncData.data };
        }
        break;
      case 'delete':
        const deleteIndex = existingEmployees.findIndex((emp: any) => emp.employeeId === syncData.data.employeeId);
        if (deleteIndex > -1) {
          existingEmployees.splice(deleteIndex, 1);
        }
        break;
    }
    
    localStorage.setItem(directoryKey, JSON.stringify(existingEmployees));
    this.emit('employee-updated', syncData.data);
  }

  private syncAttendanceData(syncData: SyncData) {
    // Notify all attendance views to refresh
    this.emit('attendance-updated', syncData.data);
    
    // Update team statistics if it's a team member
    if (syncData.userId) {
      this.emit('team-stats-updated', { userId: syncData.userId, data: syncData.data });
    }
  }

  private syncLeaveData(syncData: SyncData) {
    // Update team availability
    this.emit('leave-updated', syncData.data);
    
    // Trigger notification for relevant authorities
    if (syncData.action === 'create') {
      this.addNotification({
        type: 'info',
        title: 'New Leave Application',
        message: `Leave application submitted by ${syncData.data.employeeName}`,
        targetRoles: ['authority', 'admin'],
      });
    }
  }

  private syncNotificationData(syncData: SyncData) {
    this.emit('notification-added', syncData.data);
  }

  private syncIssueData(syncData: SyncData) {
    this.emit('issue-updated', syncData.data);
    
    // Trigger notification for assigned user
    if (syncData.action === 'create' || syncData.action === 'update') {
      this.addNotification({
        type: 'warning',
        title: 'Issue Update',
        message: `Issue ${syncData.data.id} has been ${syncData.action}d`,
        targetUsers: [syncData.data.assigneeId],
      });
    }
  }

  // Helper method to add notifications
  addNotification(notification: {
    type: string;
    title: string;
    message: string;
    targetRoles?: string[];
    targetUsers?: string[];
  }) {
    // Get all users from localStorage to determine who should receive the notification
    const employees = JSON.parse(localStorage.getItem('nalco_employees') || '[]');
    
    employees.forEach((employee: any) => {
      const shouldReceive = 
        notification.targetRoles?.includes(employee.role) ||
        notification.targetUsers?.includes(employee.employeeId);
        
      if (shouldReceive) {
        const userNotifications = JSON.parse(
          localStorage.getItem(`notifications_${employee.employeeId}`) || '[]'
        );
        
        const newNotification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          timestamp: new Date().toISOString(),
          read: false,
        };
        
        userNotifications.unshift(newNotification);
        // Keep only latest 20 notifications
        userNotifications.splice(20);
        
        localStorage.setItem(
          `notifications_${employee.employeeId}`,
          JSON.stringify(userNotifications)
        );
      }
    });
    
    this.emit('notifications-updated', notification);
  }
}

// Global instance
export const dataSyncManager = new DataSyncManager();

// Hook for using data synchronization
export const useDataSync = () => {
  const { user } = useAuth();

  const syncData = useCallback((syncData: SyncData) => {
    dataSyncManager.syncData({
      ...syncData,
      userId: user?.employeeId,
    });
  }, [user]);

  const subscribe = useCallback((event: string, callback: Function) => {
    return dataSyncManager.subscribe(event, callback);
  }, []);

  const emit = useCallback((event: string, data: any) => {
    dataSyncManager.emit(event, data);
  }, []);

  // Auto-sync user activity
  useEffect(() => {
    if (user?.employeeId) {
      // Track user activity for session management
      const handleActivity = () => {
        localStorage.setItem(`last_activity_${user.employeeId}`, Date.now().toString());
      };

      window.addEventListener('click', handleActivity);
      window.addEventListener('keypress', handleActivity);
      window.addEventListener('scroll', handleActivity);

      return () => {
        window.removeEventListener('click', handleActivity);
        window.removeEventListener('keypress', handleActivity);
        window.removeEventListener('scroll', handleActivity);
      };
    }
  }, [user]);

  return {
    syncData,
    subscribe,
    emit,
    addNotification: dataSyncManager.addNotification.bind(dataSyncManager),
  };
};

// Utility functions for common sync operations
export const syncEmployeeUpdate = (employeeData: any) => {
  dataSyncManager.syncData({
    type: 'employee',
    action: 'update',
    data: employeeData,
  });
};

export const syncAttendanceUpdate = (attendanceData: any, userId: string) => {
  dataSyncManager.syncData({
    type: 'attendance',
    action: 'update',
    data: attendanceData,
    userId,
  });
};

export const syncLeaveApplication = (leaveData: any) => {
  dataSyncManager.syncData({
    type: 'leave',
    action: 'create',
    data: leaveData,
  });
};

export const syncIssueUpdate = (issueData: any) => {
  dataSyncManager.syncData({
    type: 'issue',
    action: 'update',
    data: issueData,
  });
};
