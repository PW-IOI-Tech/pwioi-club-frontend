"use client";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Flag,
  X,
  Video,
  Check,
  User,
  FileImage,
} from "lucide-react";
import { PostShimmer } from "../superadmin/Feed";

interface User {
  batch: string;
  studentId: string;
  semester: string;
  name: string;
  initial: string;
  course: string;
  gpa: string;
  rank: string;
}

interface Post {
  id: string;
  author: string;
  role: string;
  content: string;
  media: {
    id: string;
    type: "IMAGE" | "VIDEO";
    mime_type: string;
    s3_key: string;
    signedUrl: string;
  }[];
  likes: number;
  comments: Comment[];
  _count: {
    comments: number;
  };
  userInfo: {
    name: string;
  };
  author_type: string;
  timestamp: string;
  assignedBy: string | null;
  likedBy?: Array<{ id: string; name: string; avatar?: string }>;
}

interface Comment {
  id: string;
  userInfo: any;
  content: string;
  createdAt: string;
  avatar?: string;
}

interface ReportModalState {
  isOpen: boolean;
  postId: string | null;
}

interface WelcomeMessageProps {
  userName: string;
}

interface PostActionsProps {
  post: Post;
  likedPosts: Set<string>;
  onLike: (postId: string) => void;
  onFlag: (postId: string) => void;
  onShare?: (postId: string) => void;
}

interface FeedProps {
  posts: Post[];
  likedPosts: Set<string>;
  onLike: (postId: string) => void;
  onFlag: (postId: string) => void;
  getRoleBadgeColor: (role: string) => string;
  loading: boolean;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportReason: string;
  setReportReason: (reason: string) => void;
  reportDetails: string;
  setReportDetails: (details: string) => void;
  onSubmit: () => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ userName }) => (
  <div className="bg-[#12294c] rounded-sm shadow-sm border border-gray-400 p-6 py-8">
    <h1 className="text-2xl md:text-3xl text-white mb-2">
      Welcome back, <br className="block sm:hidden" />
      <span className="font-bold">{userName}</span>!{" "}
      <span className="">👋</span>
    </h1>
    <p className="text-gray-300 leading-tight sm:w-3/4 text-sm">
      Stay connected with your academic community. Share your progress, learn
      from others, and explore new opportunities.
    </p>
  </div>
);

const CreatePost: React.FC<any> = ({ userInitial }) => {
  const [showModal, setShowModal] = useState(false);
  const [postText, setPostText] = useState("");
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [previewFiles, setPreviewFiles] = useState<
    { url: string; type: "image" | "video"; key: string }[]
  >([]);
  const [showToast, setShowToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const getVideoDuration = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration.toString());
      };
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/media/signed-url`,
        { fileName: file.name, fileType: file.type },
        { withCredentials: true }
      );

      const { uploadUrl, key } = data;
      await fetch(uploadUrl, { method: "PUT", body: file });

      let duration = null;
      if (type === "video") {
        duration = await getVideoDuration(file);
      }

      setMediaList((prev) => [
        ...prev,
        {
          type: type.toUpperCase(),
          mime_type: file.type,
          s3_key: key,
          thumbnail_url: null,
          duration: duration,
        },
      ]);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewFiles((prev) => [
          ...prev,
          { url: e.target?.result as string, type, key },
        ]);
      };
      reader.readAsDataURL(file);

      setShowModal(true);
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  const handleRemoveMedia = async (key: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/media/remove`,
        {
          withCredentials: true,
          data: { key: key },
        }
      );

      setMediaList((prev) => prev.filter((m) => m.s3_key !== key));
      setPreviewFiles((prev) => prev.filter((p) => p.key !== key));
    } catch (error) {
      console.error("Remove file error:", error);
    }
  };

  const handlePost = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/post/create`,
        { content: postText, media: mediaList },
        { withCredentials: true }
      );

      console.log("Post created:", data);
      handleCancel();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error("Post creation error:", error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setPostText("");
    setMediaList([]);
    setPreviewFiles([]);
  };

  const handleMediaSelect = (type: "image" | "video") => {
    if (type === "image") fileInputRef.current?.click();
    else videoInputRef.current?.click();
  };

  return (
    <>
      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-sm border border-gray-400 px-5 sm:py-5 py-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-[#12294c] rounded-full flex items-center justify-center text-white font-semibold">
            {userInitial}
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 font-semibold text-xl">
              Share Something
            </h3>
            <p className="text-gray-500 text-xs">What&lsquo;s on your mind?</p>
          </div>
        </div>

        <div className="flex flex-col sm:space-y-4">
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-gray-50 transition-all duration-200 rounded-sm px-4 py-3 text-left text-gray-600 text-sm border border-gray-400 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent cursor-pointer"
          >
            Share your thoughts, projects, or achievements...
          </button>

          <div className="grid-cols-2 gap-2 hidden sm:grid">
            <button
              onClick={() => handleMediaSelect("image")}
              className="flex items-center justify-center space-x-2 p-2 text-white bg-[#12294c] rounded-sm transition-all duration-200 text-sm font-semibold cursor-pointer hover:bg-slate-800"
            >
              <FileImage className="w-4 h-4" />
              <span>Photo</span>
            </button>
            <button
              onClick={() => handleMediaSelect("video")}
              className="flex items-center justify-center space-x-2 p-2 text-white rounded-sm transition-all duration-200 text-sm bg-[#12294c] font-semibold cursor-pointer hover:bg-slate-800"
            >
              <Video className="w-4 h-4" />
              <span>Video</span>
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-300 hidden sm:block">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>💡 Tip: Share your daily wins!</span>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "image")}
          className="hidden"
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={(e) => handleFileChange(e, "video")}
          className="hidden"
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Create Post
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-[#12294c] rounded-full flex items-center justify-center text-white font-semibold">
                  {userInitial}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">You</p>
                  <p className="text-xs text-gray-500">Public</p>
                </div>
              </div>

              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full border-none resize-none placeholder-gray-500 focus:outline-none min-h-[120px]"
                autoFocus
              />
              {previewFiles.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {previewFiles.map((file) => (
                    <div key={file.key} className="relative">
                      {file.type === "image" ? (
                        <img
                          src={file.url}
                          alt="Selected"
                          className="w-full max-h-60 object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={file.url}
                          controls
                          className="w-full max-h-60 rounded-lg"
                        />
                      )}
                      <button
                        onClick={() => handleRemoveMedia(file.key)}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 mb-3">
                  <p className="text-sm text-gray-600 mb-2">Add to your post</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMediaSelect("image")}
                      className="flex items-center space-x-2 px-3 py-2 bg-[#12294c] text-white rounded-sm hover:bg-slate-700 transition-colors text-sm cursor-pointer"
                    >
                      <FileImage className="w-4 h-4" />
                      <span>Photo</span>
                    </button>
                    <button
                      onClick={() => handleMediaSelect("video")}
                      className="flex items-center space-x-2 px-3 py-2 bg-[#12294c] text-white rounded-sm hover:bg-slate-700 transition-colors text-sm cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>Video</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-sm sm:rounded-lg hover:bg-gray-100 transition-colors font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={!postText.trim() && previewFiles.length === 0}
                className="px-6 py-2 bg-[#12294c] text-white rounded-sm sm:rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-[#12294c] text-white text-sm px-4 py-3 rounded-md shadow-lg flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Posted Successfully!</span>
          </div>
        </div>
      )}
    </>
  );
};

const PostHeader: React.FC<any> = ({ post, getRoleBadgeColor }) => (
  <div className="p-4 pb-3">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#12294c] rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {post?.userInfo?.name
              .split(" ")
              .map((n: any) => n[0])
              .join("")}
          </span>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 text-sm">
              {post?.userInfo?.name}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(
                post?.author_type
              )}`}
            >
              {post?.author_type}
            </span>
            {post.assignedBy && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-br from-white to-indigo-50 text-slate-800 border border-slate-400">
                📌 {post?.author_type}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">{post.timestamp}</p>
        </div>
      </div>
    </div>
  </div>
);

const PostActions: React.FC<PostActionsProps> = ({
  post,
  likedPosts,
  onLike,
  onFlag,
  onShare,
}) => {
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<any>(post?.comments || []);
  const [AllComments, setAllComments] = useState<any>([]);
  const totalComments = post?._count?.comments;
  const [showToast, setShowToast] = useState(false);

  const isLiked = likedPosts.has(post.id);
  const totalLikes = post.likes + (isLiked ? 1 : 0);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/post-comment`,
        {
          postId: post.id,
          content: newComment,
        },
        { withCredentials: true }
      );

      const createdComment = response.data.data;
      const newCommentObj: Comment = {
        id: createdComment.id,
        userInfo: {
          name: "You",
        },
        content: createdComment.content,
        createdAt: new Date(createdComment.createdAt).toLocaleString(),
        avatar: "👤",
      };

      setComments((prev: any) => [...prev, newCommentObj]);
      setAllComments((prev: any) => [...prev, newCommentObj]);
      setNewComment("");
    } catch (error: any) {
      console.error("Error posting comment:", error.response?.data || error);
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      })
      .catch(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      });
    onShare?.(post.id);
  };

  const handleCommentModal = async (postId: string) => {
    setShowCommentsModal(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/get/${postId}`,
        { withCredentials: true }
      );
      setAllComments(response.data.data);
    } catch (error: any) {
      console.error("Error fetching comment:", error.response?.data || error);
    }
  };

  return (
    <div className="border-t border-gray-100">
      <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {totalLikes > 0 && (
              <button
                onClick={() => setShowLikesModal(true)}
                className="underline cursor-pointer"
              >
                {totalLikes} {totalLikes === 1 ? "like" : "likes"}
              </button>
            )}
            {comments?.length > 0 && (
              <button
                onClick={() => handleCommentModal(post?.id)}
                className="underline cursor-pointer"
              >
                {totalComments} {totalComments === 1 ? "comment" : "comments"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 text-xs border-t border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 gap-6">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-1 py-2 rounded-md transition-all hover:bg-gray-50 cursor-pointer ${
                isLiked ? "text-slate-900" : "text-gray-600"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="font-medium">Like</span>
            </button>

            <button
              onClick={() => handleCommentModal(post?.id)}
              className="flex items-center space-x-1 py-2 rounded-md transition-colors hover:bg-gray-50 text-gray-600 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium">Comment</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-1 py-2 rounded-md transition-colors hover:bg-gray-50 text-gray-600 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span className="font-medium">Share</span>
            </button>
          </div>

          <button
            onClick={() => onFlag(post.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
            title="Report post"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {comments.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-50">
          <div className="space-y-3">
            {comments?.slice(0, 2)?.map((comment: any) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-[#12294c] rounded-full flex items-center justify-center text-sm text-white">
                    {comment.avatar ||
                      comment?.userInfo?.name?.charAt(0) ||
                      "👤"}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 border border-gray-200 rounded-sm px-3 py-2">
                    <div className="font-medium text-sm text-gray-900">
                      {comment?.userInfo?.username}
                    </div>
                    <div className="text-sm text-gray-700">
                      {comment.content}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {comment?.createdAt &&
                      new Date(comment.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                  </div>
                </div>
              </div>
            ))}
            {comments.length > 2 && (
              <button
                onClick={() => handleCommentModal(post.id)}
                className="text-sm text-slate-900 hover:text-slate-700 font-medium cursor-pointer underline"
              >
                View all {totalComments} comments
              </button>
            )}
          </div>
        </div>
      )}

      {showCommentsModal && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Comments</h3>
              <button
                onClick={() => setShowCommentsModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {AllComments?.map((comment: any) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-[#12294c] rounded-full flex items-center justify-center text-sm text-white">
                      {comment?.avatar ||
                        comment?.userInfo?.name?.charAt(0) ||
                        "👤"}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <div className="font-medium text-sm text-gray-900">
                        {comment?.userInfo?.name}
                      </div>
                      <div className="text-sm text-gray-700">
                        {comment.content}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {comment?.createdAt &&
                        new Date(comment.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleCommentSubmit} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-[#12294c] text-white rounded-md hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors ease-in-out duration-200 cursor-pointer"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-[#12294c] text-white test-sm px-4 py-3 rounded-md shadow-lg flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Link copied to clipboard!</span>
          </div>
        </div>
      )}
    </div>
  );
};
const Post: React.FC<any> = ({
  post,
  likedPosts,
  onLike,
  onFlag,
  getRoleBadgeColor,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const contentLines = post.content.split("\n");
  const shouldTruncate = contentLines.length > 2 || post.content.length > 200;

  const getTruncatedContent = () => {
    if (contentLines.length > 2) {
      return contentLines.slice(0, 2).join("\n");
    }
    if (post.content.length > 200) {
      return post.content.substring(0, 200);
    }
    return post.content;
  };

  const displayContent = isExpanded ? post.content : getTruncatedContent();

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-sm border border-gray-400 overflow-hidden">
      <PostHeader post={post} getRoleBadgeColor={getRoleBadgeColor} />

      <div className="px-4 py-3">
        <div className="text-gray-800 text-sm">
          <pre className="whitespace-pre-wrap font-inherit">
            {displayContent}
            {shouldTruncate && !isExpanded && "..."}
          </pre>

          {shouldTruncate && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-blue-600 hover:text-blue-900 font-medium ml-1 cursor-pointer text-xs underline"
            >
              more
            </button>
          )}

          {isExpanded && shouldTruncate && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-blue-600 hover:text-blue-900 font-medium cursor-pointer block mt-1 text-xs underline"
            >
              Show less
            </button>
          )}
        </div>
      </div>

      {post?.media?.length > 0 && (
        <div className="px-4 pb-3 grid grid-cols-1 gap-2">
          {post.media.map((mediaItem: any) => (
            <div key={mediaItem.id}>
              {mediaItem.type === "IMAGE" ? (
                <img
                  src={mediaItem.signedUrl}
                  alt="Post media"
                  className="w-full max-h-96 object-contain rounded-sm bg-gray-100"
                />
              ) : (
                <video
                  src={mediaItem.signedUrl}
                  controls
                  className="w-full max-h-96 rounded-sm bg-gray-100"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <PostActions
        post={post}
        likedPosts={likedPosts}
        onLike={onLike}
        onFlag={onFlag}
      />
    </div>
  );
};

const Feed: React.FC<FeedProps> = ({
  posts,
  likedPosts,
  onLike,
  onFlag,
  getRoleBadgeColor,
  loading,
}) => {
  if (loading) {
    return <PostShimmer />;
  }

  const uniquePosts = posts.filter(
    (post, index, self) => index === self.findIndex((p) => p.id === post.id)
  );

  return (
    <div className="space-y-6">
      {uniquePosts.map((post, index) => (
        <Post
          key={`${post.id}-${index}`}
          post={post}
          likedPosts={likedPosts}
          onLike={onLike}
          onFlag={onFlag}
          getRoleBadgeColor={getRoleBadgeColor}
        />
      ))}
    </div>
  );
};

const ProfileHeader: React.FC<any> = ({ user }) => (
  <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-sm border border-gray-400 p-5 overflow-hidden">
    <div className="flex items-center space-x-3 mb-3">
      <div className="w-12 h-12 rounded-md bg-[#12294c] flex items-center justify-center shadow-lg border border-white/20 transition-all duration-200">
        <span className="text-white font-bold text-lg">
          {user?.name?.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg tracking-wide">{user?.name}</h3>
        <p className="text-xs font-medium mb-1 text-blue-900">
          {user?.school?.name}
        </p>
        {user?.enrollmentId && user?.batch?.name && (
          <p className="text-[11px] font-medium">
            {user?.enrollmentId} • {user?.batch?.name}
          </p>
        )}
      </div>
    </div>
  </div>
);

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportReason,
  setReportReason,
  reportDetails,
  setReportDetails,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-3xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Report Post</h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-600 mb-4">
            Help us understand what&lsquo;s wrong with this post
          </p>

          <div className="space-y-3 mb-6">
            {[
              { value: "spam", label: "Spam or promotional content" },
              { value: "harassment", label: "Harassment or bullying" },
              { value: "offensive", label: "Offensive content" },
              { value: "irrelevant", label: "Irrelevant to the community" },
              { value: "other", label: "Other (please specify)" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={option.value}
                  checked={reportReason === option.value}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="text-slate-900 focus:ring-slate-900"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Information (Optional)
            </label>
            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Please provide details about the issue..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 resize-none"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 transition-colors focus:ring-slate-900 focus:border-slate-900 cursor-pointer font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={!reportReason}
              className="flex-1 px-4 py-2 bg-[#12294c] text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-slate-900 focus:border-slate-900 cursor-pointer font-semibold"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const StudentHome: React.FC<{ userDetails: any }> = ({ userDetails }) => {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [reportModal, setReportModal] = useState<ReportModalState>({
    isOpen: false,
    postId: null,
  });
  const [reportReason, setReportReason] = useState<string>("");
  const [reportDetails, setReportDetails] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const getPosts = async (
    cursor?: string,
    limit: number = 10,
    search?: string
  ) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/post/get`,
      { withCredentials: true, params: { cursor, limit, search } }
    );
    return response.data;
  };

  const fetchPosts = async (cursor?: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await getPosts(cursor, 10);
      setPosts((prev) => [...prev, ...data.data]);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    const originalLikedPosts = new Set(likedPosts);
    const isCurrentlyLiked = likedPosts.has(postId);

    setLikedPosts((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });

    try {
      if (isCurrentlyLiked) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/likes/unlike/${postId}`,
          {},
          { withCredentials: true }
        );
      } else {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/likes/like/${postId}`,
          {},
          { withCredentials: true }
        );
      }
    } catch (error) {
      console.error("Error liking/unliking:", error);
      // Revert UI on error
      setLikedPosts(originalLikedPosts);
    }
  };

  const handleFlag = (postId: string): void => {
    setReportModal({ isOpen: true, postId });
  };

  const handleReportSubmit = async (): Promise<void> => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/flags`,
        {
          postId: reportModal.postId,
          reason: reportReason,
        },
        { withCredentials: true }
      );

      console.log("Report submitted:", res.data);
    } catch (err: any) {
      console.error("Error reporting:", err.response?.data || err.message);
    } finally {
      handleReportClose();
    }
  };

  const handleReportClose = (): void => {
    setReportModal({ isOpen: false, postId: null });
    setReportReason("");
    setReportDetails("");
  };

  const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case "Admin":
        return "bg-red-500 text-white";
      case "Student":
        return "bg-blue-500 text-white";
      case "Faculty":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <WelcomeMessage userName={user?.name || "User"} />
            <div className="block sm:hidden">
              <CreatePost userInitial={user?.name?.charAt(0).toUpperCase()} />
            </div>
            <Feed
              posts={posts}
              likedPosts={likedPosts}
              onLike={handleLike}
              onFlag={handleFlag}
              getRoleBadgeColor={getRoleBadgeColor}
              loading={loading}
            />
          </div>

          <div className="lg:col-span-3 space-y-4 hidden sm:block">
            <ProfileHeader user={userDetails} />
            <CreatePost userInitial={user?.name?.charAt(0).toUpperCase()} />
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={handleReportClose}
        reportReason={reportReason}
        setReportReason={setReportReason}
        reportDetails={reportDetails}
        setReportDetails={setReportDetails}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default StudentHome;
