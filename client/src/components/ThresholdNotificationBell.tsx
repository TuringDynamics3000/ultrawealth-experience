/**
 * Threshold Notification Bell
 * 
 * Shows compliance notifications for threshold changes and approaching limits.
 * Displays unread count badge and notification dropdown.
 * 
 * RULES:
 * - Authority-gated (SYSTEM_ADMIN required to view)
 * - Shows threshold change events (pending, approved, rejected)
 * - Shows approaching threshold warnings
 * - Notifications can be marked as read
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Settings,
} from "lucide-react";
import { useAuthorities } from "@/hooks/useAuthorities";
import { useTuringCoreClient } from "@/hooks/useTuringCoreClient";
import type { ThresholdNotification } from "@/contracts/threshold";
import { THRESHOLD_CATEGORY_LABELS } from "@/contracts/threshold";

interface ThresholdNotificationBellProps {
  tenantId?: string;
  onNotificationClick?: (notification: ThresholdNotification) => void;
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getNotificationIcon(type: ThresholdNotification['type']) {
  switch (type) {
    case 'THRESHOLD_CHANGE_PENDING':
      return <Clock className="h-4 w-4 text-amber-500" />;
    case 'THRESHOLD_CHANGE_APPROVED':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'THRESHOLD_CHANGE_REJECTED':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'THRESHOLD_APPROACHING':
      return <TrendingUp className="h-4 w-4 text-amber-500" />;
    case 'THRESHOLD_EXCEEDED':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Settings className="h-4 w-4 text-slate-500" />;
  }
}

function getNotificationMessage(notification: ThresholdNotification): string {
  const category = THRESHOLD_CATEGORY_LABELS[notification.category];
  const amount = formatCurrency(notification.threshold);
  
  switch (notification.type) {
    case 'THRESHOLD_CHANGE_PENDING':
      return `${category} threshold change to ${amount} pending approval`;
    case 'THRESHOLD_CHANGE_APPROVED':
      return `${category} threshold change to ${amount} approved`;
    case 'THRESHOLD_CHANGE_REJECTED':
      return `${category} threshold change to ${amount} rejected`;
    case 'THRESHOLD_APPROACHING':
      return `Transaction approaching ${category} threshold (${amount})`;
    case 'THRESHOLD_EXCEEDED':
      return `Transaction exceeded ${category} threshold (${amount})`;
    default:
      return `${category} threshold notification`;
  }
}

export function ThresholdNotificationBell({ 
  tenantId = 'tenant-001',
  onNotificationClick 
}: ThresholdNotificationBellProps) {
  const { has } = useAuthorities();
  const client = useTuringCoreClient();
  
  const [notifications, setNotifications] = useState<ThresholdNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const canView = has('SYSTEM_ADMIN');

  // Load notifications on mount and periodically
  useEffect(() => {
    if (!canView) return;
    
    loadNotifications();
    loadUnreadCount();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      loadNotifications();
      loadUnreadCount();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [tenantId, canView]);

  async function loadNotifications() {
    try {
      const response = await client.listThresholdNotifications({
        tenantId,
        limit: 10,
      });
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadUnreadCount() {
    try {
      const response = await client.getUnreadNotificationCount(tenantId);
      if (response.success && response.data) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  }

  async function handleMarkAsRead(notificationId: string) {
    try {
      const response = await client.markNotificationRead(notificationId);
      if (response.success) {
        setNotifications(prev => 
          prev.map(n => n.notificationId === notificationId ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  function handleNotificationClick(notification: ThresholdNotification) {
    if (!notification.isRead) {
      handleMarkAsRead(notification.notificationId);
    }
    onNotificationClick?.(notification);
    setOpen(false);
  }

  // Don't render if user doesn't have view authority
  if (!canView) {
    return null;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Threshold Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.notificationId}
                className={`flex items-start gap-3 p-3 cursor-pointer ${
                  !notification.isRead ? 'bg-muted/50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notification.isRead ? 'font-medium' : ''}`}>
                    {getNotificationMessage(notification)}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{notification.actor}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(notification.timestamp)}</span>
                  </div>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                )}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-center text-sm text-muted-foreground justify-center"
              onClick={() => {
                // Navigate to full notifications view
                setOpen(false);
              }}
            >
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
