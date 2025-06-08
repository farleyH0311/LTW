'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  getNotificationsByUserId,
  markNotificationAsRead,
} from '@/app/axios';

interface Notification {
  id: number;
  content: string;
  url?: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const { userId } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      if (!userId || isNaN(userId)) {
        console.warn('❗ Không có userId hợp lệ');
        return;
      }
      const res = await getNotificationsByUserId(userId, 1, 10);
      setNotifications(Array.isArray(res) ? res : res.items || []);
    } catch (err) {
      console.error('🚨 Lỗi khi lấy thông báo:', err);
    }
  };

  const handleRead = async (id: number, url?: string) => {
    try {
      await markNotificationAsRead(id);
      window.location.href = url || '/';
    } catch (err) {
      console.error('🚨 Lỗi khi đánh dấu đã đọc:', err);
    }
  };

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  if (!userId) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg z-50 p-2">
          {notifications.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              Không có thông báo mới
            </p>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleRead(n.id, n.url)}
                className={`p-2 text-sm cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  !n.isRead ? 'font-bold' : 'text-muted-foreground'
                }`}
              >
                {n.content}
              </div>
            ))
          )}
          <div className="text-center border-t pt-2 mt-2">
            <Link
              href="/notifications"
              className="text-sm text-blue-500 hover:underline"
            >
              Xem tất cả thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
