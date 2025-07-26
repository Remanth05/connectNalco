import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  User,
  Calendar,
  FileText,
  Trash2,
  MarkAsRead,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Initialize with some sample notifications based on user role
    const sampleNotifications: Notification[] = [
      {
        id: "notif-1",
        title: "Leave Application Approved",
        message:
          "Your leave application for March 28-30 has been approved by Dr. Priya Sharma.",
        type: "success",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        actionUrl: "/portal/leave",
      },
      {
        id: "notif-2",
        title: "System Maintenance Scheduled",
        message:
          "Scheduled maintenance on March 31 from 2:00 AM to 4:00 AM. System will be unavailable.",
        type: "warning",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        read: false,
        actionUrl: "/settings",
      },
      {
        id: "notif-3",
        title: "Payslip Available",
        message: "Your payslip for March 2024 is now available for download.",
        type: "info",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        actionUrl: "/portal/payslips",
      },
      {
        id: "notif-4",
        title: "New Issue Reported",
        message: "A new safety issue has been reported in your department requiring immediate attention.",
        type: "warning",
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        read: false,
        actionUrl: "/issues",
      },
      {
        id: "notif-5",
        title: "Profile Update Required",
        message: "Please update your emergency contact information in your profile.",
        type: "info",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        actionUrl: "/portal/profile",
      },
    ];

    // Add role-specific notifications
    if (user?.role === "authority") {
      sampleNotifications.unshift(
        {
          id: "notif-auth-1",
          title: "Pending Leave Approvals",
          message:
            "You have 3 pending leave applications awaiting your review.",
          type: "warning",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: "/authority/dashboard",
        },
        {
          id: "notif-auth-2",
          title: "Team Attendance Alert",
          message: "Sunita Devi has not checked in today. Please follow up.",
          type: "warning",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: "/authority/attendance",
        },
        {
          id: "notif-auth-3",
          title: "Department Issue Escalated",
          message: "A critical safety issue has been escalated to your department for immediate action.",
          type: "error",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: "/issues",
        },
        {
          id: "notif-auth-4",
          title: "Reimbursement Requests",
          message: "2 new reimbursement requests require your approval.",
          type: "info",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: "/authority/dashboard",
        },
      );
    }

    if (user?.role === "admin") {
      sampleNotifications.unshift(
        {
          id: "notif-admin-1",
          title: "System Alert",
          message: "Database storage is 85% full. Consider archiving old data.",
          type: "warning",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: "/admin/dashboard",
        },
        {
          id: "notif-admin-2",
          title: "Security Update",
          message: "3 failed login attempts detected from IP 192.168.1.100.",
          type: "error",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: "/admin/dashboard",
        },
        {
          id: "notif-admin-3",
          title: "Backup Completed",
          message:
            "Scheduled database backup completed successfully at 2:00 AM.",
          type: "success",
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          read: true,
          actionUrl: "/settings",
        },
        {
          id: "notif-admin-4",
          title: "Critical Issues Report",
          message: "5 critical issues require immediate admin attention across all departments.",
          type: "error",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: "/issues",
        },
        {
          id: "notif-admin-5",
          title: "Department Analytics Ready",
          message: "Monthly analytics report for all departments is now available for review.",
          type: "info",
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: "/analytics",
        },
      );
    }

    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem(
      `notifications_${user?.employeeId}`,
    );
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
      } catch (error) {
        console.error("Error loading notifications:", error);
        setNotifications(sampleNotifications);
      }
    } else {
      setNotifications(sampleNotifications);
    }

    // Set up periodic check for new notifications (simulated)
    const interval = setInterval(() => {
      // Randomly add a new notification occasionally
      if (Math.random() < 0.1) {
        // 10% chance every 30 seconds
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          title: "New Activity",
          message: "You have a new activity requiring your attention.",
          type: "info",
          timestamp: new Date().toISOString(),
          read: false,
        };

        setNotifications((prev) => {
          const updated = [newNotification, ...prev].slice(0, 20); // Keep only latest 20
          localStorage.setItem(
            `notifications_${user?.employeeId}`,
            JSON.stringify(updated),
          );
          return updated;
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-nalco-green" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-nalco-red" />;
      default:
        return <Info className="h-4 w-4 text-nalco-blue" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-nalco-green bg-nalco-green/5";
      case "warning":
        return "border-l-yellow-500 bg-yellow-500/5";
      case "error":
        return "border-l-nalco-red bg-nalco-red/5";
      default:
        return "border-l-nalco-blue bg-nalco-blue/5";
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n,
      );
      localStorage.setItem(
        `notifications_${user?.employeeId}`,
        JSON.stringify(updated),
      );
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem(
        `notifications_${user?.employeeId}`,
        JSON.stringify(updated),
      );
      return updated;
    });
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== notificationId);
      localStorage.setItem(
        `notifications_${user?.employeeId}`,
        JSON.stringify(updated),
      );
      return updated;
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setIsOpen(false); // Close the popover
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now.getTime() - notificationTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notificationTime.toLocaleDateString();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-nalco-red text-white text-xs flex items-center justify-center p-0 min-w-0">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-nalco-black">Notifications</h3>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            <Badge variant="secondary">{notifications.length}</Badge>
          </div>
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-nalco-gray mx-auto mb-4" />
              <p className="text-nalco-gray">No notifications</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    p-3 m-1 border-l-4 rounded-r cursor-pointer transition-all hover:bg-nalco-gray/5 
                    ${getNotificationColor(notification.type)}
                    ${!notification.read ? "bg-opacity-10" : "opacity-70"}
                  `}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-sm font-medium ${!notification.read ? "text-nalco-black" : "text-nalco-gray"}`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-nalco-red rounded-full ml-2 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-nalco-gray mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-nalco-gray mt-2">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setIsOpen(false);
                // Navigate to settings or a dedicated notifications page
                navigate("/settings");
              }}
            >
              View All Notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
