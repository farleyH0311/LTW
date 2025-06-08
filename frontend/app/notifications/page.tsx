'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import {
  getNotificationsByUserId,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../axios';
import { useRouter } from 'next/navigation';

interface Notification {
  id: number;
  content: string;
  url?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const router = useRouter();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchMore = useCallback(async () => {
    if (!userId || loading || !hasMore) return;
    setLoading(true);
    try {
const res = await getNotificationsByUserId(userId, page);
const newItems = res?.items || res || [];
setNotifications((prev) => [...prev, ...newItems]);

setHasMore(res?.page && res?.totalPages ? res.page < res.totalPages : false);
console.log('[debug] notifications:', res?.items || res);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error('Lỗi khi tải thông báo:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, page, loading, hasMore]);

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      const uid = parseInt(storedId);
      setUserId(uid);
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

    useEffect(() => {
    if (userId) {
        setPage(1);
        setNotifications([]);
        fetchMore();
    }
    }, [userId]);
console.log('[🔥 DEBUG notifications]:', notifications);

  return (
  <div className="max-w-2xl mx-auto py-8 px-4">
    <div className="flex items-center justify-between mb-6">
    <button
    onClick={() => window.history.back()}
    className="px-4 py-2 rounded-xl text-white bg-transparent hover:bg-violet-600/20 transition-all duration-200 ease-in-out"
    >← Quay lại</button>
      <h1 className="text-2xl font-semibold text-center flex-1">
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

      {!loading && notifications.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center">
          Không có thông báo nào.
        </p>
      ) : (
        <div className="space-y-2">
          {notifications
            .filter(n => !showUnreadOnly || !n.isRead)
            .map((n) => (
              <div
                key={n.id}
                onClick={() => handleClick(n.id, n.url)}
                className={`p-4 rounded cursor-pointer border ${
                  n.isRead ? 'bg-muted text-muted-foreground' : 'bg-background font-medium'
                } hover:bg-accent transition`}
              >
                <p>{n.content}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))}

          {loading && (
            <div className="space-y-2 mt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 rounded border bg-muted animate-pulse space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
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
