"use client";

import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import {
  getPostById,
  getProfileByUserId,
  getCommentsByPost,
  createComment,
  handleLike as likePost,
  deleteComment,
  updateComment,
  getAllPosts,
} from "@/app/axios";
import { formatJoinedDate } from "@/lib/formatdate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  ArrowLeft,
  SendHorizonal,
  Pencil,
  Trash,
} from "lucide-react";

export default function PostDetailPage() {
  const { id } = useParams();
  const postId = Number(id);
  const userId = Number(Cookies.get("userId") || 0);
  const router = useRouter();

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPostById(postId);
        const user = await getProfileByUserId(data.userId);
        const comments = await getCommentsByPost(postId);
        const allPosts = await getAllPosts();
        const current = allPosts.find((p: any) => p.id === postId);
        const likesCount = current?.likesCount ?? 0;
        const isLike = current?.isLike ?? false;

        setPost({
          id: data.id,
          userId: data.userId,
          content: data.content,
          createdAt: data.createdAt,
          media_urls: data.media_urls,
          likesCount: likesCount,
          isLiked: isLike,
          user: {
            id: user.id,
            name: user.name,
            avt: user.avt,
            account_name: user.account_name,
          },
          time: formatJoinedDate(data.createdAt),
        });
        setComments(buildCommentTree(comments));
      } catch (err) {
        console.error("Lỗi khi tải bài viết chi tiết:", err);
      }
    };

    if (postId) fetchData();
  }, [postId]);

  const buildCommentTree = (list: any[]): any[] => {
    const map: Record<number, any> = {};
    const roots: any[] = [];
    list.forEach((c) => (map[c.id] = { ...c, replies: [] }));
    list.forEach((c) => {
      if (c.parentCommentId) map[c.parentCommentId]?.replies?.push(map[c.id]);
      else roots.push(map[c.id]);
    });
    return roots;
  };

  const handleLike = async () => {
    try {
      const res = await likePost(postId, userId);
      const message = res?.data?.message ?? "";
      setPost((prev: any) => ({
        ...prev,
        likesCount:
          message === "1" ? prev.likesCount + 1 : Math.max(prev.likesCount - 1, 0),
        isLiked: message === "1",
      }));
    } catch (err) {
      console.error("Lỗi khi like:", err);
    }
  };

  const fetchComments = async () => {
    const comments = await getCommentsByPost(postId);
    setComments(buildCommentTree(comments));
  };

  const handleCreateComment = async () => {
    if (!newComment.trim()) return;
    try {
      await createComment(postId, userId, newComment, null);
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
    }
  };

  const handleReplyComment = async () => {
    if (!replyContent.trim() || replyingToId === null) return;
    try {
      await createComment(postId, userId, replyContent, replyingToId);
      setReplyContent("");
      setReplyingToId(null);
      fetchComments();
    } catch (err) {
      console.error("Lỗi khi gửi trả lời:", err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;
    try {
      await deleteComment(userId, commentId);
      fetchComments();
    } catch (err) {
      console.error("Xóa bình luận thất bại:", err);
    }
  };

  const handleUpdateComment = async () => {
    try {
      if (!editContent.trim() || editingCommentId === null) return;
      await updateComment(userId, editingCommentId, {
        id: editingCommentId,
        userId,
        content: editContent,
      });
      setEditingCommentId(null);
      setEditContent("");
      fetchComments();
    } catch (err) {
      console.error("Lỗi khi cập nhật bình luận:", err);
    }
  };

const goToProfile = async (userId?: number) => {
  if (!userId || isNaN(userId)) {
    console.warn("⚠️ userId không hợp lệ:", userId);
    return;
  }

  try {
    const profile = await getProfileByUserId(userId);
    if (profile?.id) {
      router.push(`/profile/${profile.id}`);
    } else {
      console.warn("Không tìm thấy profile từ userId:", userId);
    }
  } catch (error) {
    console.error("Lỗi khi chuyển tới profile:", error);
  }
};

const renderComment = (cmt: any, level = 0, replyToName?: string) => (
  <div
    key={cmt.id}
    className={`mb-4 ${level > 0 ? "ml-[20px] border-l-2 border-gray-300 dark:border-gray-600 pl-4" : ""}`}
  >
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#2a2a3b] shadow-sm">
      {/* Avatar */}
      <button onClick={() => router.push(`/profile/${cmt.userId}`)}>
        <Avatar className="w-10 h-10">
          <AvatarImage src={cmt.user.profile.avt} />
          <AvatarFallback>{cmt.user.profile.name[0]}</AvatarFallback>
        </Avatar>
      </button>

      {/* Nội dung */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <button
            onClick={() => router.push(`/profile/${cmt.userId}`)}
            className="text-sm font-semibold hover:underline dark:text-white"
          >
            {cmt.user.profile.name}
          </button>
          {replyToName && (
            <span className="text-sm text-blue-500 font-medium">@{replyToName}</span>
          )}
        </div>

        {editingCommentId === cmt.id ? (
          <>
            <input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
            />
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={handleUpdateComment}>Cập nhật</Button>
              <Button variant="ghost" size="sm" onClick={() => setEditingCommentId(null)}>Hủy</Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-line">{cmt.content}</p>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2">
              <span>{formatJoinedDate(cmt.created_at)}</span>
              <button onClick={() => setReplyingToId(cmt.id)} className="hover:underline">Trả lời</button>
              {cmt.userId === userId && (
                <>
                  <button onClick={() => {
                    setEditingCommentId(cmt.id);
                    setEditContent(cmt.content);
                  }} className="hover:underline">Sửa</button>
                  <button onClick={() => handleDeleteComment(cmt.id)} className="hover:underline">Xóa</button>
                </>
              )}
            </div>
          </>
        )}

        {replyingToId === cmt.id && (
          <div className="flex gap-2 mt-3">
            <input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Trả lời bình luận..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
            />
            <Button onClick={handleReplyComment} disabled={!replyContent.trim()}>
              <SendHorizonal className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>

    {/* render replies */}
    {cmt.replies?.map((rep: any) =>
      renderComment(rep, level + 1, cmt.user.profile.name)
    )}
  </div>
);



  if (!post) return <p className="text-center py-8">Loading...</p>;

return (
  <div className="max-w-2xl mx-auto py-6 px-4">
    <Button variant="ghost" onClick={() => router.back()} className="mb-4 flex items-center gap-1">
      <ArrowLeft className="w-4 h-4" /> Back
    </Button>

{post?.user?.id && (
  <button
    onClick={() => router.push(`/profile/${post.user.id}`)}
    className="flex gap-3 items-center mb-4 hover:bg-muted p-2 rounded-md transition text-left w-full"
  >
    <Avatar>
      <AvatarImage src={post.user.avt} />
      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
    </Avatar>
    <div>
      <p className="font-medium dark:text-white">{post.user.name}</p>
      <p className="text-sm text-muted-foreground">
        @{post.user.account_name} • {post.time}
      </p>
    </div>
  </button>
)}


    <p className="text-base mb-4 whitespace-pre-line dark:text-gray-100">{post.content}</p>

    {post.media_urls?.length > 0 && (
      <div className="grid grid-cols-2 gap-2 mb-4">
        {post.media_urls.map((url: string, idx: number) => (
          <img
            key={idx}
            src={url}
            alt={`media-${idx}`}
            className="w-full h-48 object-cover rounded border dark:border-gray-700"
          />
        ))}
      </div>
    )}

    <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
      <button onClick={handleLike} className="flex items-center gap-1">
        <Heart
          className={`w-4 h-4 ${post.isLiked ? "fill-red-500 text-red-500" : "text-red-500"}`}
          stroke="currentColor"
        />
        <span>{post.likesCount}</span>
      </button>
      <div className="flex items-center gap-1">
        <MessageCircle className="w-4 h-4" /> {comments.length}
      </div>
    </div>

    <div className="flex gap-2 mb-6">
      <input
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write comment..."
        className="flex-1 border rounded p-2 text-sm bg-background dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />
      <Button onClick={handleCreateComment}>
        <SendHorizonal className="w-4 h-4" />
      </Button>
    </div>

    <div className="space-y-4">
      {comments.map((cmt) => renderComment(cmt, 0))}
    </div>
  </div>
);
}