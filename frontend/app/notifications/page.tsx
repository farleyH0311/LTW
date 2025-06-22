'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import {
  getNotificationsByUserId,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../axios';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Heart,
  MessageCircle,
  Calendar,
  Info,
} from 'lucide-react';
import Cookies from "js-cookie";

interface Notification {
  id: number;
  content: string;
  url?: string;
  isRead: boolean;
  createdAt: string;
  type?: string;
}

const getIconByType = (type: string | undefined) => {
  switch (type) {
    case 'like_post':
    case 'waiting_match':
    case 'match_success':
      return <Heart className="w-4 h-4 text-pink-500" />;
    case 'comment_post':
      return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case 'reply_comment':
      return <MessageCircle className="w-4 h-4 text-indigo-500" />;
    case 'date_invitation':
    case 'date_status':
    case 'rate_date':
      return <Calendar className="w-4 h-4 text-green-500" />;
    case 'new_post':
      return <Bell className="w-4 h-4 text-violet-500" />;
    default:
      return <Info className="w-4 h-4 text-gray-400" />;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const router = useRouter();
  const observerRef = useRef<HTMLDivElement | null>(null);

const fetchMore = async (customPage?: number) => {
  const pageToFetch = customPage ?? page;
  if (!userId || loading || !hasMore) return;
  setLoading(true);
  try {
    const res = await getNotificationsByUserId(userId, pageToFetch);
    const newItems = Array.isArray(res) ? res : res?.items || [];

    if (customPage === 1) {
      setNotifications(newItems); // reset nếu là trang đầu
    } else {
      setNotifications((prev) => [...prev, ...newItems]);
    }

    const more =
      Array.isArray(res)
        ? res.length > 0
        : res?.page && res?.totalPages
          ? res.page < res.totalPages
          : false;

    setHasMore(more);
    setPage(pageToFetch + 1);
  } catch (err) {
    console.error("Lỗi khi tải thông báo:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  if (userId) {
    fetchMore();
  }
}, [userId]);

  useEffect(() => {
    const storedId = Cookies.get("userId");
    console.log("📦 Lấy userId từ cookie:", storedId);
    if (storedId) {
      const parsedId = parseInt(storedId);
      if (!isNaN(parsedId)) {
        setUserId(parsedId);
        setPage(1);
        setNotifications([]);
        setHasMore(true);
      } else {
        console.warn("userId trong cookie không hợp lệ:", storedId);
      }
    } else {
      console.warn("Không tìm thấy userId trong cookie.");
    }
  }, []);

  useEffect(() => {
    if (!observerRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchMore();
      },
      { threshold: 1.0 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchMore, hasMore]);

  const handleClick = async (id: number, url?: string) => {
    try {
      await markNotificationAsRead(id);
      router.push(url || '/');
    } catch (err) {
      console.error('Lỗi khi đánh dấu đã đọc:', err);
    }
  };

  const handleMarkAll = async () => {
    if (!userId) return;
    try {
      await markAllNotificationsAsRead(userId);
      setNotifications([]);
      setPage(1);
      setHasMore(true);
      fetchMore();
    } catch (err) {
      console.error('Lỗi khi đánh dấu tất cả:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 rounded-xl text-sm bg-muted hover:bg-accent transition"
        >
          ← Quay lại
        </button>
        <h1 className="text-xl font-semibold text-center flex-1 dark:text-white">
          Thông báo của bạn
        </h1>
        <div className="w-[100px]" />
      </div>

      {notifications.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <button
            onClick={handleMarkAll}
            className="text-sm text-blue-500 hover:underline"
          >
            Đánh dấu tất cả là đã đọc
          </button>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
            />
            Chỉ chưa đọc
          </label>
        </div>
      )}

      {notifications.length === 0 && !loading ? (
        <p className="text-muted-foreground text-sm text-center">
          Không có thông báo nào.
        </p>
      ) : (
        <div className="space-y-2">
          {notifications
            .filter((n) => !showUnreadOnly || !n.isRead)
            .map((n) => (
              <div
                key={n.id}
                onClick={() => handleClick(n.id, n.url)}
                className={`p-4 rounded-lg border cursor-pointer flex gap-3 items-start ${
                  n.isRead
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-background hover:bg-accent font-medium'
                } transition`}
              >
                {getIconByType(n.type)}
                <div className="flex-1 space-y-1">
                  <p>{n.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

          {loading && (
            <div className="space-y-2 mt-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded border bg-muted animate-pulse space-y-2"
                >
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div ref={observerRef} />
    </div>
  );
}
