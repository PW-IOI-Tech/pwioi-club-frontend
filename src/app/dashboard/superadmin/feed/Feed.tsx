"use client";

import React, { useState, useRef } from "react";
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

// === Types ===
interface User {
  name: string;
  enrollmentId?: string;
  batch?: { name: string };
  school?: { name: string };
}

interface Post {
  id: string;
  author: string;
  author_type: string;
  content: string;
  media: {
    type: "image" | "video";
    storage_url: string;
  }[];
  likes: number;
  _count: {
    comments: number;
  };
  timestamp: string;
  userInfo: {
    name: string;
  };
  assignedBy: string | null;
}

interface Comment {
  id: string;
  userInfo: {
    name: string;
    username?: string;
  };
  content: string;
  createdAt: string;
  avatar?: string;
}

// === Mock Data ===
const mockPosts: Post[] = [
  {
    id: "post_1",
    author: "Alice Johnson",
    author_type: "Student",
    content:
      "Just completed my final project on AI-powered chatbots! Learned so much about NLP and backend integration.\n\nCan't believe how far I've come in just one year!",
    media: [
      {
        type: "image",
        storage_url: "https://source.unsplash.com/random/800x600/?ai,project",
      },
    ],
    likes: 24,
    _count: { comments: 3 },
    timestamp: "2 hours ago",
    userInfo: { name: "Alice Johnson" },
    assignedBy: null,
  },
  {
    id: "post_2",
    author: "Prof. David Miller",
    author_type: "Faculty",
    content:
      "Reminder: Assignment 3 deadline is extended to Friday. Please ensure all team contributions are documented clearly.",
    media: [],
    likes: 15,
    _count: { comments: 3 },
    timestamp: "5 hours ago",
    userInfo: { name: "Prof. David Miller" },
    assignedBy: null,
  },
];

const mockComments = {
  post_1: [
    {
      id: "c1",
      userInfo: { name: "Sarah Lee", username: "sarahlee" },
      content: "Great work! Looking forward to seeing the demo.",
      createdAt: "2024-04-05T10:30:00Z",
      avatar: "👩",
    },
    {
      id: "c2",
      userInfo: { name: "Tom Wright", username: "tomwright" },
      content: "Can you share the GitHub repo?",
      createdAt: "2024-04-05T11:15:00Z",
      avatar: "👨",
    },
  ],
  post_2: [
    {
      id: "c3",
      userInfo: { name: "Linda", username: "linda" },
      content: "Thank you, Professor!",
      createdAt: "2024-04-05T12:00:00Z",
      avatar: "👩",
    },
  ],
};

// === Components ===
const WelcomeMessage: React.FC<{ userName: string }> = ({ userName }) => (
  <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-sm shadow-sm border border-gray-400 p-6 py-8">
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

const CreatePost: React.FC<{ userInitial: string }> = ({ userInitial }) => {
  const [showModal, setShowModal] = useState(false);
  const [postText, setPostText] = useState("");
  const [mediaList, setMediaList] = useState<
    { file: File; preview: string; type: "image" | "video"; key: string }[]
  >([]);
  const [showToast, setShowToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = `media_${Date.now()}`;
    const preview = URL.createObjectURL(file);
    setMediaList((prev) => [...prev, { file, preview, type, key }]);
    setShowModal(true);
  };

  const handleRemoveMedia = (key: string) => {
    setMediaList((prev) => {
      const item = prev.find((m) => m.key === key);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((m) => m.key !== key);
    });
  };

  const addMedia = (type: "image" | "video") => {
    if (type === "image") fileInputRef.current?.click();
    else videoInputRef.current?.click();
  };

  const handlePost = () => {
    if (!postText.trim() && mediaList.length === 0) return;
    setPostText("");
    setMediaList((prev) => {
      prev.forEach((m) => URL.revokeObjectURL(m.preview));
      return [];
    });
    setShowModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleCancel = () => {
    setPostText("");
    setMediaList((prev) => {
      prev.forEach((m) => URL.revokeObjectURL(m.preview));
      return [];
    });
    setShowModal(false);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-sm border border-gray-400 px-5 sm:py-5 py-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-semibold">
            {userInitial}
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 font-semibold text-xl">
              Share Something
            </h3>
            <p className="text-gray-500 text-xs">What’s on your mind?</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-gray-50 transition-all duration-200 rounded-sm px-4 py-3 text-left text-gray-600 text-sm border border-gray-400 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
        >
          Share your thoughts, projects, or achievements...
        </button>

        <div className="mt-4 pt-4 border-t border-gray-300 hidden sm:block">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>💡 Tip: Share your daily insights!</span>
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

      {/* Create Post Modal */}
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
                <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-semibold">
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

              {mediaList.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mediaList.map((media) => (
                    <div key={media.key} className="relative">
                      {media.type === "image" ? (
                        <img
                          src={media.preview}
                          alt="Preview"
                          className="w-full max-h-60 object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={media.preview}
                          controls
                          className="w-full max-h-60 rounded-lg"
                        />
                      )}
                      <button
                        onClick={() => handleRemoveMedia(media.key)}
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
                      onClick={() => addMedia("image")}
                      className="flex items-center space-x-2 px-3 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 transition-colors text-sm cursor-pointer"
                    >
                      <FileImage className="w-4 h-4" />
                      <span>Photo</span>
                    </button>
                    <button
                      onClick={() => addMedia("video")}
                      className="flex items-center space-x-2 px-3 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 transition-colors text-sm cursor-pointer"
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
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-100 transition-colors font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={!postText.trim() && mediaList.length === 0}
                className="px-6 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-slate-900 text-white text-sm px-4 py-3 rounded-md shadow-lg flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Posted Successfully!</span>
          </div>
        </div>
      )}
    </>
  );
};

const PostHeader: React.FC<{
  post: Post;
  getRoleBadgeColor: (role: string) => string;
}> = ({ post, getRoleBadgeColor }) => (
  <div className="p-4 pb-3">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white text-sm">
          {post.userInfo.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 text-sm">
              {post.userInfo.name}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(
                post.author_type
              )}`}
            >
              {post.author_type}
            </span>
          </div>
          <p className="text-xs text-gray-500">{post.timestamp}</p>
        </div>
      </div>
    </div>
  </div>
);

const PostActions: React.FC<{
  post: Post;
  isLiked: boolean;
  onLike: () => void;
  onFlag: () => void;
}> = ({ post, isLiked, onLike, onFlag }) => {
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(
    mockComments[post.id] || []
  );
  const [showToast, setShowToast] = useState(false);

  const totalLikes = post.likes + (isLiked ? 1 : 0);
  const mockLikedBy = [
    { id: "1", name: "John Doe", avatar: "👤" },
    { id: "2", name: "Jane Smith", avatar: "👩" },
    { id: "3", name: "Mike", avatar: "👨" },
  ];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const now = new Date().toISOString();
    setComments([
      ...comments,
      {
        id: `c${comments.length + 1}`,
        userInfo: { name: "You" },
        content: newComment,
        createdAt: now,
        avatar: "👤",
      },
    ]);
    setNewComment("");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    });
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
            {comments.length > 0 && (
              <button
                onClick={() => setShowCommentsModal(true)}
                className="underline cursor-pointer"
              >
                {comments.length}{" "}
                {comments.length === 1 ? "comment" : "comments"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 text-xs border-t border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 gap-6">
            <button
              onClick={onLike}
              className={`flex items-center space-x-1 py-2 rounded-md hover:bg-gray-50 cursor-pointer ${
                isLiked ? "text-slate-900" : "text-gray-600"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="font-medium">Like</span>
            </button>

            <button
              onClick={() => setShowCommentsModal(true)}
              className="flex items-center space-x-1 py-2 rounded-md hover:bg-gray-50 text-gray-600 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium">Comment</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-1 py-2 rounded-md hover:bg-gray-50 text-gray-600 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span className="font-medium">Share</span>
            </button>
          </div>

          <button
            onClick={() => onFlag()}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {comments.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-50">
          <div className="space-y-3">
            {comments.slice(0, 2).map((c) => (
              <div key={c.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-sm">
                    {c.avatar || "👤"}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 border border-gray-200 rounded-sm px-3 py-2">
                    <div className="font-medium text-sm text-gray-900">
                      {c.userInfo.name}
                    </div>
                    <div className="text-sm text-gray-700">{c.content}</div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {new Date(c.createdAt).toLocaleString("en-IN", {
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
                onClick={() => setShowCommentsModal(true)}
                className="text-sm text-slate-900 hover:text-slate-700 font-medium underline cursor-pointer"
              >
                View all {comments.length} comments
              </button>
            )}
          </div>
        </div>
      )}

      {/* Likes Modal */}
      {showLikesModal && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-96 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Likes</h3>
              <button
                onClick={() => setShowLikesModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-80">
              {mockLikedBy.slice(0, totalLikes).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-4 hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{user.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {showCommentsModal && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-96 overflow-hidden flex flex-col">
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
              {comments.map((c) => (
                <div key={c.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-sm">
                      {c.avatar || "👤"}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <div className="font-medium text-sm text-gray-900">
                        {c.userInfo.name}
                      </div>
                      <div className="text-sm text-gray-700">{c.content}</div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleString("en-IN", {
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast for Share */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-slate-900 text-white text-sm px-4 py-3 rounded-md shadow-lg flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Link copied to clipboard!</span>
          </div>
        </div>
      )}
    </div>
  );
};

const Post: React.FC<{
  post: Post;
  isLiked: boolean;
  onLike: () => void;
  onFlag: () => void;
  getRoleBadgeColor: (role: string) => string;
}> = ({ post, isLiked, onLike, onFlag, getRoleBadgeColor }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate =
    post.content.length > 200 || post.content.split("\n").length > 2;
  const displayContent = isExpanded
    ? post.content
    : shouldTruncate
    ? post.content.substring(0, 200) + "..."
    : post.content;

  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-400 overflow-hidden">
      <PostHeader post={post} getRoleBadgeColor={getRoleBadgeColor} />

      <div className="px-4 py-3">
        <div className="text-gray-800 text-sm whitespace-pre-wrap">
          {displayContent}
          {shouldTruncate && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-blue-600 hover:text-blue-900 font-medium ml-1 text-xs underline cursor-pointer"
            >
              more
            </button>
          )}
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-blue-600 hover:text-blue-900 font-medium block mt-1 text-xs underline cursor-pointer"
            >
              Show less
            </button>
          )}
        </div>
      </div>

      {post.media.length > 0 && (
        <div className="px-4 pb-3">
          {post.media[0].type === "image" ? (
            <img
              src={post.media[0].storage_url}
              alt="Post media"
              className="w-full h-64 object-cover rounded-sm"
            />
          ) : (
            <video
              src={post.media[0].storage_url}
              controls
              className="w-full h-64 rounded-sm"
            />
          )}
        </div>
      )}

      <PostActions
        post={post}
        isLiked={isLiked}
        onLike={onLike}
        onFlag={onFlag}
      />
    </div>
  );
};

const ProfileHeader: React.FC<{ user: User }> = ({ user }) => (
  <div className="bg-white rounded-sm shadow-sm border border-gray-400 p-5">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 rounded-md bg-slate-900 flex items-center justify-center">
        <span className="text-white font-bold text-lg">
          {user.name.charAt(0)}
        </span>
      </div>
      <div>
        <h3 className="font-bold text-lg">{user.name}</h3>
        <p className="text-xs text-blue-900">{user.school?.name}</p>
        {user.enrollmentId && (
          <p className="text-xs text-gray-600">
            {user.enrollmentId} • {user.batch?.name}
          </p>
        )}
      </div>
    </div>
  </div>
);

const ReportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  reason: string;
  setReason: (r: string) => void;
  details: string;
  setDetails: (d: string) => void;
}> = ({
  isOpen,
  onClose,
  onSubmit,
  reason,
  setReason,
  details,
  setDetails,
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
              className="p-1 text-gray-400 hover:text-gray-600 rounded cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-600 mb-4">
            Help us understand what’s wrong with this post
          </p>

          <div className="space-y-3 mb-6">
            {["spam", "harassment", "offensive", "irrelevant", "other"].map(
              (value) => (
                <label
                  key={value}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={value}
                    checked={reason === value}
                    onChange={(e) => setReason(e.target.value)}
                    className="text-slate-900 focus:ring-slate-900"
                  />
                  <span className="text-gray-700">
                    {value === "spam" && "Spam or promotional content"}
                    {value === "harassment" && "Harassment or bullying"}
                    {value === "offensive" && "Offensive content"}
                    {value === "irrelevant" && "Irrelevant to the community"}
                    {value === "other" && "Other (please specify)"}
                  </span>
                </label>
              )
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Information (Optional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide details about the issue..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-slate-900 resize-none"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 transition-colors font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={!reason}
              className="flex-1 px-4 py-2 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// === Main Feed Component ===
const Feed: React.FC<{ user: any; userDetails: any }> = ({
  user,
  userDetails,
}) => {
  const [posts] = useState(mockPosts);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [reportModal, setReportModal] = useState<{
    isOpen: boolean;
    postId: string | null;
  }>({
    isOpen: false,
    postId: null,
  });
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Student":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Faculty":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Admin":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleLike = (id: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleFlag = (id: string) => {
    setReportModal({ isOpen: true, postId: id });
  };

  const handleSubmitReport = () => {
    console.log(
      "Reporting post:",
      reportModal.postId,
      "Reason:",
      reportReason,
      "Details:",
      reportDetails
    );
    setReportModal({ isOpen: false, postId: null });
    setReportReason("");
    setReportDetails("");
  };

  const handleCloseReport = () => {
    setReportModal({ isOpen: false, postId: null });
    setReportReason("");
    setReportDetails("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <WelcomeMessage userName={user?.name} />
            <div className="block sm:hidden">
              <CreatePost userInitial={user?.name?.charAt(0).toUpperCase()} />
            </div>
            {posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                isLiked={likedPosts.has(post.id)}
                onLike={() => handleLike(post.id)}
                onFlag={() => handleFlag(post.id)}
                getRoleBadgeColor={getRoleBadgeColor}
              />
            ))}
          </div>

          <div className="lg:col-span-3 space-y-4 hidden sm:block">
            <ProfileHeader user={userDetails} />
            <CreatePost userInitial={user?.name?.charAt(0).toUpperCase()} />
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={handleCloseReport}
        onSubmit={handleSubmitReport}
        reason={reportReason}
        setReason={setReportReason}
        details={reportDetails}
        setDetails={setReportDetails}
      />
    </div>
  );
};

export default Feed;
