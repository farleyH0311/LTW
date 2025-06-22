"use client";

import Image from "next/image";
import { useState } from "react";

export default function PostItem({
  post,
  userId,
  comments,
  setComments,
  newComment,
  setNewComment,
  replyContent,
  setReplyContent,
  replyingToCommentId,
  setReplyingToCommentId,
  editingCommentId,
  setEditingCommentId,
  editContent,
  setEditContent,
  isDeleting,
  onLike,
  onSubmitComment,
  onDeleteComment,
  onEditComment,
}: any) {
  const handleCommentSubmit = () => {
    if (!userId || !newComment.trim()) return;
    onSubmitComment(post.id, userId, null, newComment);
  };

  const handleReplySubmit = (parentId: number) => {
    if (!userId || !replyContent.trim()) return;
    onSubmitComment(post.id, userId, parentId, replyContent);
  };

  const handleEditSubmit = (commentId: number) => {
    if (!userId || !editContent.trim()) return;
    onEditComment(userId, post.id, commentId, editContent);
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-zinc-900">
      <div className="flex items-center mb-3">
        <Image
          src={post.author?.avt || "/default-avatar.png"}
          width={40}
          height={40}
          alt="avatar"
          className="rounded-full object-cover w-10 h-10"
        />
        <div className="ml-3">
          <p className="font-semibold">{post.author?.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{post.content}</p>

      {post.media_urls?.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          {post.media_urls.map((url: string, idx: number) => (
            <img key={idx} src={url} alt="media" className="rounded-md w-full object-cover" />
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
        <button onClick={() => onLike(post.id)}>❤️ {post.likes} Thích</button>
        <span>💬 {comments.length} Bình luận</span>
      </div>

      <div className="mt-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết bình luận..."
          className="w-full p-2 rounded-md border dark:bg-zinc-800"
        />
        <button onClick={handleCommentSubmit} className="mt-2 text-blue-500">
          Gửi bình luận
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {comments.map((cmt: any) => (
          <div key={cmt.id} className="border-t pt-3">
            <p className="font-semibold">{cmt.user?.profile?.name}</p>
            {editingCommentId === cmt.id ? (
              <>
                <input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-zinc-800"
                />
                <button onClick={() => handleEditSubmit(cmt.id)} className="text-green-500 mr-2">
                  Lưu
                </button>
                <button onClick={() => setEditingCommentId(null)} className="text-gray-400">
                  Huỷ
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300">{cmt.content}</p>
            )}

            <div className="flex gap-2 text-xs text-blue-500 mt-1">
              <button onClick={() => {
                setReplyingToCommentId(cmt.id);
                setReplyContent("");
              }}>Trả lời</button>

              {userId === cmt.userId && (
                <>
                  <button onClick={() => {
                    setEditingCommentId(cmt.id);
                    setEditContent(cmt.content);
                  }}>Sửa</button>

                  <button
                    disabled={isDeleting}
                    onClick={() =>
                      onDeleteComment(userId, post.id, cmt.id, (postId: number, deletedCommentId: number) =>
                        setComments((prev: any[]) => prev.filter((c: any) => c.id !== deletedCommentId))
                      )
                    }
                  >
                    Xoá
                  </button>
                </>
              )}
            </div>

            {replyingToCommentId === cmt.id && (
  <div className="mt-3 ml-4 flex items-start gap-2">
    <Image
      src={post.author?.avt || "/default-avatar.png"}
      alt="Avatar"
      width={32}
      height={32}
      className="rounded-full object-cover w-8 h-8"
    />
    <div className="flex-1">
      <input
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        placeholder="Trả lời bình luận..."
        className="w-full p-2 border rounded dark:bg-zinc-800"
      />
      <button onClick={() => handleReplySubmit(cmt.id)} className="mt-1 text-blue-500">
        Gửi trả lời
      </button>
    </div>
  </div>
)}

          </div>
        ))}
      </div>
    </div>
  );
}
