"use client";

import type React from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { MainNav } from "@/components/main-nav";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Share as ShareIcon,
  Video,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/components/language-provider";
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border";
import {
  getProfileByUserId,
  getAllPosts,
  createPost,
  handleLike,
  createComment,
  getCommentsByPost,
  deleteComment,
  updateComment,
  updatePost,
  deletePost,
  getAllProfiles,
} from "../../axios";
import { formatJoinedDate } from "../../../lib/formatdate";

export default function FeedPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [postContent, setPostContent] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [openCommentsPostId, setOpenCommentsPostId] = useState<number | null>(
    null
  );
  const [commentsByPostId, setCommentsByPostId] = useState<
    Record<number, CommentType[]>
  >({});
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(
    null
  );
  const [replyContent, setReplyContent] = useState<string>("");
  const [showRepliesFor, setShowRepliesFor] = useState<number[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [profiles, setProfiles] = useState<UserData[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const userId = Cookies.get("userId");
  interface UserData {
    id: number;
    userId: number;
    name: string;
    avt: string;
    account_name: string;
    interests: string[];
  }
  type CommentType = {
    id: number;
    content: string;
    userId: number;
    user: {
      profile: {
        name: string;
        avt: string;
        account_name: string;
      };
    };
    parentCommentId: number | null;
    created_at: string;
    replies?: CommentType[];
  };

  interface PostFromAPI {
    id: number;
    userId: number;
    content: string;
    media_urls: string[];
    createdAt: string;
    likesCount: number;
    isLike: boolean;
  }
  interface Post {
    id: number;
    content: string;
    user: {
      id: number;
      name: string;
      avt: string;
      account_name: string;
    };
    image?: string | null;
    comments: number;
    time: string;
    userId: number;
    likesCount: number;
    isLiked: boolean;
    media_urls: string[];
    allComments?: CommentType[];
  }
  useEffect(() => {
    getAllProfiles().then((all: UserData[]) => {
      const filtered = all.filter(
        (profile: UserData) => profile.userId !== Number(userId)
      );
      const shuffled = filtered.sort(() => Math.random() - 0.5);
      setProfiles(shuffled.slice(0, 3));
    });
  }, []);
  useEffect(() => {
    //console.log("User ID từ cookie:", userId);

    if (userId) {
      const fetchProfile = async () => {
        try {
          const data = await getProfileByUserId(userId);
          // console.log("Dữ liệu nhận được từ getProfileByUserId:", data);
          setUserData(data);
        } catch (error) {
          // console.error("Lỗi khi tải profile:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    } else {
      console.error("User ID không tồn tại trong cookie");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchPostsWithUsers = async () => {
      try {
        const postsData = await getAllPosts();

        const postsWithDetails = await Promise.all(
          postsData.map(async (post: PostFromAPI) => {
            const [user, comments] = await Promise.all([
              getProfileByUserId(post.userId),
              getCommentsByPost(post.id),
            ]);

            return {
              ...post,
              user: {
                id: user.id,
                name: user.name || "Người dùng ẩn danh",
                avt: user.avt || "/default-avatar.png",
                account_name: user.account_name,
              },
              time: formatJoinedDate(post.createdAt),
              likesCount: post.likesCount,
              isLiked: post.isLike,
              comments: comments.length,
              allComments: buildCommentTree(comments),
              media_urls: post.media_urls,
            };
          })
        );

        setPosts(postsWithDetails);
        console.log("post", postsWithDetails);
        const commentMap: Record<number, CommentType[]> = {};
        postsWithDetails.forEach((post) => {
          commentMap[post.id] = post.allComments || [];
        });

        setCommentsByPostId(commentMap);
      } catch (error) {
        console.error("Lỗi khi tải bài đăng hoặc user hoặc comment:", error);
      }
    };

    fetchPostsWithUsers();
  }, []);

  const [openId, setOpenId] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenId(null);
      }
    }
    if (openId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openId]);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editMediaUrls, setEditMediaUrls] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<number[]>([]);

  async function handleAction(postId: number, action: "edit" | "delete") {
    setOpenId(null);

    if (action === "edit") {
      //console.log("Edit post", postId);
      const post = posts.find((p) => p.id === postId);
      if (post) {
        setEditingPostId(postId);
        setEditContent(post.content);
        setRemovedImages([]);
      }
    } else if (action === "delete") {
      // console.log("Delete post", postId);
      try {
        await deletePost(userId, postId);
        console.log("Đã xóa bài viết thành công");
        setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
      } catch (error) {
        console.error("Lỗi khi xóa bài viết", error);
      }
    }
  }

  function handleRemoveImage(idx: number) {
    setRemovedImages((prev) => [...prev, idx]);
  }
  async function handleUpdatePost(postId: number) {
    try {
      if (!userId) return;

      // Tạo mảng ảnh mới, lọc ảnh đã bị xóa tạm
      const newMediaUrls =
        posts
          .find((p) => p.id === postId)
          ?.media_urls.filter((_, idx) => !removedImages.includes(idx)) || [];

      await updatePost(userId, postId, {
        content: editContent,
        media_urls: newMediaUrls,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, content: editContent, media_urls: newMediaUrls }
            : post
        )
      );

      setEditingPostId(null);
      setRemovedImages([]);
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
    }
  }

  const defaultUserData = userData || {
    userId: "",
    name: "N/A",
    avt: "images.png",
    account_name: "",
  };
  const postCount = posts.filter(
    (post) => post.userId === defaultUserData.userId
  ).length;

  function buildCommentTree(comments: CommentType[]): CommentType[] {
    //.log("Raw comments:", comments);
    const commentMap: Record<number, CommentType> = {};
    const roots: CommentType[] = [];

    comments.forEach((comment) => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    Object.values(commentMap).forEach((comment) => {
      if (comment.parentCommentId === null) {
        roots.push(comment);
      } else {
        const parent = commentMap[comment.parentCommentId];
        if (parent) {
          parent.replies!.push(comment);
        } else {
          console.warn("Không tìm thấy parent:", comment.parentCommentId);
        }
      }
    });

    // console.log("Tree comments:", roots);
    return roots;
  }

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;

    const userId = Cookies.get("userId");

    if (!userId || !userData) {
      alert("Chưa đăng nhập hoặc chưa có dữ liệu người dùng");
      return;
    }

    try {
      const media_urls = await Promise.all(
        postFiles.map((file) => uploadImageToCloudinary(file))
      );

      const created = await createPost({
        content: postContent,
        userId: Number(userId),
        media_urls,
      });

      const newPost = {
        ...created,
        user: {
          name: userData.name || "Người dùng",
          avt: userData.avt || "/placeholder.svg?height=40&width=40&text=?",
          account_name: userData.account_name,
        },
        likesCount: 0,
        comments: 0,
        time: "Just now",
        postCount: 1,
      };

      setPosts([newPost, ...posts]);
      setPostContent("");
      setPostFiles([]);
    } catch (err) {
      console.error("Tạo bài viết thất bại:", err);
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      const res = await handleLike(postId, userId);
      const message = res.data.message;

      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likesCount:
                  message === "1" ? post.likesCount + 1 : post.likesCount - 1,
                isLiked: message === "1",
              }
            : post
        )
      );
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const fetchComments = async (postId: number) => {
    try {
      const res = await getCommentsByPost(postId);
      const tree = buildCommentTree(res);

      setCommentsByPostId((prev) => ({
        ...prev,
        [postId]: tree,
      }));
    } catch (err) {
      console.error("Lỗi tải bình luận", err);
    }
  };

  const handleSubmitComment = async (
    postId: number,
    userId: number,
    parentCommentId: number | null = null,
    commentContent: string
  ) => {
    try {
      await createComment(postId, userId, commentContent, parentCommentId);
      if (parentCommentId === null) {
        setNewComment("");
      } else {
        setReplyContent("");
        setReplyingToCommentId(null);
      }
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, comments: post.comments + 1 } : post
        )
      );
      fetchComments(postId);
    } catch (err) {
      console.error("Lỗi khi gửi bình luận", err);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);
  function removeCommentAndReplies(
    comments: CommentType[],
    deletedCommentId: number
  ): CommentType[] {
    return comments
      .filter(
        (comment) =>
          comment.id !== deletedCommentId &&
          comment.parentCommentId !== deletedCommentId
      )
      .map((comment) => {
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: removeCommentAndReplies(comment.replies, deletedCommentId),
          };
        }
        return comment;
      });
  }

  const handleCommentDeleted = (postId: number, deletedCommentId: number) => {
    setCommentsByPostId((prev) => {
      // console.log("Before delete:", prev[postId]);
      const updatedComments = prev[postId]
        ? removeCommentAndReplies(prev[postId], deletedCommentId)
        : [];

      //console.log("After delete:", updatedComments);

      return { ...prev, [postId]: updatedComments };
    });

    setPosts((prevPosts) => {
      //  console.log("Before update posts:", prevPosts);
      const updatedPosts = prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: Math.max(post.comments - 1, 0),
            }
          : post
      );
      //console.log("After update posts:", updatedPosts);
      return updatedPosts;
    });
  };

  const handleDeleteComment = async (
    userId: number | string | undefined,
    postId: number,
    commentId: number,
    onDeleted: (postId: number, deletedCommentId: number) => void
  ) => {
    if (!userId) {
      alert("Bạn chưa đăng nhập");
      return;
    }

    const confirmDelete = window.confirm("Bạn có chắc muốn xóa bình luận này?");
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await deleteComment(Number(userId), commentId);
      onDeleted(postId, commentId);
    } catch (error) {
      alert("Xóa bình luận thất bại, vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditComment = async (
    userId: number,
    postId: number,
    commentId: number,
    newContent: string
  ) => {
    try {
      await updateComment(userId, commentId, { content: newContent });

      await fetchComments(postId);

      setEditingCommentId(null);
      setEditContent("");
    } catch (error) {
      console.error("Lỗi khi sửa bình luận:", error);
    }
  };
  const [postFiles, setPostFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPostFiles(Array.from(e.target.files));
    }
  };
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const cloudName = "doy9hevnl";
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Harmonia");

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error("Upload ảnh thất bại");
    }
  };

  const renderCommentsTree = (
    comments: CommentType[],
    postId: number,
    level = 0
  ) => {
    return comments.map((comment) => {
      const hasReplies = comment.replies && comment.replies.length > 0;
      const showReplies = showRepliesFor.includes(comment.id);

      return (
        <div
          key={comment.id}
          className="space-y-1"
          style={{ marginLeft: level === 0 ? 0 : 20 * level }}
        >
          <div className="flex items-start gap-3">
            <img
              src={comment.user.profile.avt}
              alt={comment.user.profile.name}
              className="w-8 h-8 rounded-full object-cover"
            />

            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <p className="font-semibold text-sm">
                  {comment.user.profile.name}
                </p>
                <p className="text-sm">{comment.content}</p>
              </div>

              {/* Thời gian + nút trả lời */}
              <div className="text-xs text-gray-500 flex items-center gap-4 mt-1">
                <span>{formatJoinedDate(comment.created_at)}</span>

                <button
                  onClick={() =>
                    setReplyingToCommentId(
                      replyingToCommentId === comment.id ? null : comment.id
                    )
                  }
                  className="hover:underline"
                >
                  {replyingToCommentId === comment.id
                    ? t("feed.cancel")
                    : t("feed.reply")}
                </button>

                {comment.userId === Number(userId) && (
                  <>
                    <button
                      onClick={() => {
                        if (editingCommentId === comment.id) {
                          setEditingCommentId(null);
                          setEditContent("");
                        } else {
                          setEditingCommentId(comment.id);
                          setEditContent(comment.content);
                        }
                      }}
                      className="hover:underline"
                    >
                      {editingCommentId === comment.id
                        ? t("feed.cancel")
                        : t("feed.update")}
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteComment(
                          userId,
                          postId,
                          comment.id,
                          handleCommentDeleted
                        )
                      }
                      className="hover:underline"
                    >
                      {t("feed.delete")}
                    </button>
                  </>
                )}
              </div>

              {(replyingToCommentId === comment.id ||
                editingCommentId === comment.id) && (
                <div className="mt-2 flex gap-2">
                  <input
                    className="flex-1 border bg-gray-50 rounded px-2 py-3 mb-4 text-sm"
                    type="text"
                    placeholder={
                      replyingToCommentId === comment.id
                        ? t("feed.writereply")
                        : t("feed.writecmt")
                    }
                    value={
                      replyingToCommentId === comment.id
                        ? replyContent
                        : editContent
                    }
                    onChange={(e) => {
                      if (replyingToCommentId === comment.id) {
                        setReplyContent(e.target.value);
                      } else {
                        setEditContent(e.target.value);
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      if (replyingToCommentId === comment.id) {
                        handleSubmitComment(
                          postId,
                          Number(userId!),
                          comment.id,
                          replyContent.trim()
                        );
                        setReplyContent("");
                        setReplyingToCommentId(null);
                      } else if (editingCommentId === comment.id) {
                        handleEditComment(
                          Number(userId!),
                          postId,
                          comment.id,
                          editContent.trim()
                        );
                        setEditContent("");
                        setEditingCommentId(null);
                      }
                    }}
                    disabled={
                      (replyingToCommentId === comment.id &&
                        !replyContent.trim()) ||
                      (editingCommentId === comment.id && !editContent.trim())
                    }
                  >
                    {t("feed.send")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReplyingToCommentId(null);
                      setReplyContent("");
                      setEditingCommentId(null);
                      setEditContent("");
                    }}
                  >
                    {t("feed.cancel")}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {hasReplies && !showReplies && (
            <button
              className="ml-10 text-xs text-blue-600 hover:underline"
              onClick={() => setShowRepliesFor((prev) => [...prev, comment.id])}
            >
              {t("feed.watch")} {comment.replies?.length ?? 0}{" "}
              {t("feed.replies")}
            </button>
          )}

          {/* Các trả lời con */}
          {hasReplies && showReplies && (
            <div className="ml-10">
              {renderCommentsTree(comment.replies ?? [], postId, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };
  const viewProfile = (id: number) => {
    router.push(`/profile/${id}`);
  };
  return (
    <div className="container px-4 sm:px-6 py-4 sm:py-8">
      <div className="flex flex-col gap-4 sm:gap-8">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Feed
          </h1>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-4 sm:space-y-6">
            <Card className="mb-4 sm:mb-6">
              <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                <div className="flex gap-3 sm:gap-4">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarImage src={defaultUserData.avt} alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your thoughts or relationship journey..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="min-h-[80px] sm:min-h-[100px] resize-none text-sm sm:text-base"
                    />
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs sm:text-sm px-2 sm:px-3"
                          asChild
                        >
                          <label className="cursor-pointer flex items-center">
                            <Paperclip className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden xs:inline">Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </label>
                        </Button>
                        {postFiles.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {postFiles.length} file
                            {postFiles.length > 1 ? "s" : ""} selected
                          </span>
                        )}
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs sm:text-sm px-2 sm:px-3"
                        >
                          <Paperclip className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="hidden xs:inline">Photo</span>
                        </Button> */}

                        {/* <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs sm:text-sm px-2 sm:px-3"
                        >
                          <Video className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="hidden xs:inline">Video</span>
                        </Button> */}
                      </div>
                      <AnimatedGradientBorder>
                        <Button
                          size="sm"
                          onClick={handleCreatePost}
                          disabled={!postContent.trim()}
                        >
                          Post
                        </Button>
                      </AnimatedGradientBorder>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4 sm:space-y-6">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <AnimatedGradientBorder>
                    <Card>
                      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                              <AvatarImage
                                src={post.user.avt}
                                alt={post.user.name}
                              />
                              <AvatarFallback>
                                {post.user.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className="cursor-pointer"
                              onClick={() => viewProfile(post.user.id)}
                            >
                              <p className="font-medium text-sm sm:text-base">
                                {post.user.name}
                              </p>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">
                                @{post.user.account_name} • {post.time}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              post.userId === Number(userId)
                                ? setOpenId(openId === post.id ? null : post.id)
                                : null
                            }
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Menu chỉ hiện khi post.id === openId */}
                        {openId === post.id && (
                          <div className="absolute right-0 mt-1 w-28 rounded-md border bg-white shadow-md z-10">
                            <button
                              className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                              onClick={() => handleAction(post.id, "edit")}
                            >
                              {t("feed.update")}
                            </button>
                            <button
                              className="block w-full px-3 py-2 text-left hover:bg-gray-100 text-red-600"
                              onClick={() => handleAction(post.id, "delete")}
                            >
                              {t("feed.delete")}
                            </button>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="pb-2 sm:pb-3 px-3 sm:px-6">
                        {/* <p className="whitespace-pre-line text-sm sm:text-base">
                          {post.content}
                        </p> */}
                        {editingPostId === post.id ? (
                          <div>
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full border rounded p-2"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdatePost(post.id)}
                              >
                                {t("feed.save")}
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingPostId(null)}
                              >
                                {t("feed.cancel")}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p>{post.content}</p>
                        )}

                        {post.media_urls && post.media_urls.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                            {post.media_urls
                              .map((url, idx) => ({ url, idx }))
                              .filter(({ idx }) => !removedImages.includes(idx)) // ẩn ảnh đã đánh dấu xóa tạm
                              .map(({ url, idx }) => (
                                <div
                                  key={idx}
                                  className="relative w-full aspect-square overflow-hidden rounded-md cursor-pointer"
                                  onClick={() => setSelectedImage(url)}
                                >
                                  <Image
                                    src={url}
                                    alt={`Post image ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                  {editingPostId === post.id && (
                                    <button
                                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                      onClick={(e) => {
                                        e.stopPropagation(); // tránh đóng modal xem ảnh
                                        handleRemoveImage(idx);
                                      }}
                                    >
                                      ×
                                    </button>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
                        {selectedImage && (
                          <div
                            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                            onClick={() => setSelectedImage(null)}
                          >
                            <div className="max-w-full max-h-full p-4">
                              <Image
                                src={selectedImage}
                                alt="Full image"
                                width={1000}
                                height={1000}
                                className="max-w-full max-h-[90vh] object-contain rounded"
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="border-t pt-2 sm:pt-3 px-3 sm:px-6 flex justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground h-8 text-xs sm:text-sm"
                          onClick={() => handleLikePost(post.id)}
                        >
                          <Heart
                            className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${
                              post.isLiked ? "text-red-500" : "text-gray-500"
                            }`}
                          />
                          {post.likesCount}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground h-8 text-xs sm:text-sm"
                          onClick={() => {
                            if (openCommentsPostId === post.id) {
                              setOpenCommentsPostId(null);
                              setReplyingToCommentId(null);
                            } else {
                              setOpenCommentsPostId(post.id);
                              fetchComments(post.id);
                            }
                          }}
                        >
                          <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          {post.comments}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground h-8 text-xs sm:text-sm"
                        >
                          <ShareIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="hidden xs:inline">Share</span>
                        </Button>{" "}
                      </CardFooter>

                      {/* Hiển thị phần bình luận dưới bài viết*/}

                      {openCommentsPostId === post.id && (
                        <div className="block w-full border-t border-gray-300 mt-4 pt-4 space-y-4">
                          {/* Danh sách bình luận */}
                          <div className="max-h-64 overflow-y-auto space-y-3 p-2">
                            {commentsByPostId[post.id]?.length ? (
                              renderCommentsTree(
                                commentsByPostId[post.id],
                                post.id
                              )
                            ) : (
                              <p className="text-sm text-gray-500">
                                {t("feed.nocmt")}
                              </p>
                            )}
                          </div>

                          {/* Ô nhập bình luận */}
                          <div className="flex items-center gap-3 p-3">
                            <input
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder={t("feed.writecmt")}
                              className="flex-1 border rounded bg-gray-50 p-3 py-3 text-sm"
                            />
                            <Button
                              size="sm"
                              disabled={!newComment.trim()}
                              onClick={() => {
                                handleSubmitComment(
                                  post.id,
                                  Number(userId!),
                                  null,
                                  newComment.trim()
                                );
                                setNewComment("");
                              }}
                            >
                              {t("feed.send")}
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  </AnimatedGradientBorder>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar - hidden on mobile, displayed below content on tablets, displayed on side on desktop */}
          <div className="order-last mt-4 lg:mt-0 lg:order-none">
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-base sm:text-lg font-semibold">
                  {t("profile.yourProfile") || "Your Profile"}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 sm:gap-4">
                  <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                    <AvatarImage src={defaultUserData.avt} alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      {defaultUserData.name}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      @{defaultUserData.account_name}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span className="text-[10px] sm:text-xs font-medium">
                        92% Compatibility
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="font-medium text-sm sm:text-base">5</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Matches
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      {
                        posts.filter(
                          (post) => post.userId === defaultUserData.userId
                        ).length
                      }
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Posts
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">3</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Active Chats
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs sm:text-sm"
                  asChild
                >
                  <Link href="/profile">
                    {t("profile.viewProfile") || "View Profile"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="mt-4 sm:mt-6">
              <CardHeader className="pb-2">
                <h3 className="text-base sm:text-lg font-semibold">
                  {t("matches.suggestedMatches") || "Suggested Matches"}
                </h3>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {profiles.slice(0, 3).map((profile, i) => (
                    <div
                      key={profile.userId}
                      className="flex items-center gap-3 p-3 sm:p-4"
                    >
                      <Avatar>
                        <AvatarImage
                          src={
                            profile.avt ||
                            `/placeholder.svg?height=40&width=40&text=${profile.name.charAt(
                              0
                            )}`
                          }
                        />
                        <AvatarFallback>
                          {profile.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {profile.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {profile.interests.join(", ")}
                        </p>
                        {/* <div className="flex items-center gap-1 mt-1">
                          <Sparkles className="h-3 w-3 text-primary" />
                          <span className="text-[10px] font-medium">
                            {[94, 91, 89][i]}% Match
                          </span>
                        </div> */}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 h-8 text-xs"
                        onClick={() => viewProfile(profile.id)}
                      >
                        {t("matches.connect") || "Connect"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="px-4 pb-4 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs sm:text-sm"
                  asChild
                >
                  <Link href="/matches">
                    {t("matches.viewAll") || "View All Matches"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom Sparkles Icon
function Sparkles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v18"></path>
      <path d="M9 6l3-3 3 3"></path>
      <path d="M9 18l3 3 3-3"></path>
      <path d="M3 12h18"></path>
      <path d="M6 9l-3 3 3 3"></path>
      <path d="M18 9l3 3-3 3"></path>
    </svg>
  );
}
