"use client";

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
import Image from "next/image";

interface User {
  teacherId: string;
  name: string;
  initial: string;
  course: string;
}

interface Post {
  id: string;
  author: string;
  role: string;
  content: string;
  media: {
    type: string;
    url: string;
  } | null;
  likes: number;
  comments: number;
  timestamp: string;
  assignedBy: string | null;
}

interface ReportModalState {
  isOpen: boolean;
  postId: string | null;
}

interface WelcomeMessageProps {
  userName: string;
}

interface CreatePostProps {
  userInitial: string;
}

interface PostHeaderProps {
  post: Post;
  getRoleBadgeColor: (role: string) => string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

interface Post {
  id: string;
  likes: number;
  comments: number;
  likedBy?: Array<{ id: string; name: string; avatar?: string }>;
  topComments?: Comment[];
  allComments?: Comment[];
}

interface PostActionsProps {
  post: Post;
  likedPosts: Set<string>;
  onLike: (postId: string) => void;
  onFlag: (postId: string) => void;
  onComment?: (postId: string, comment: string) => void;
  onShare?: (postId: string) => void;
}

interface PostProps {
  post: Post;
  likedPosts: Set<string>;
  onLike: (postId: string) => void;
  onFlag: (postId: string) => void;
  getRoleBadgeColor: (role: string) => string;
}

interface FeedProps {
  posts: Post[];
  likedPosts: Set<string>;
  onLike: (postId: string) => void;
  onFlag: (postId: string) => void;
  getRoleBadgeColor: (role: string) => string;
}

interface ProfileHeaderProps {
  user: User;
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
  <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-sm shadow-sm border border-gray-400 p-6 py-8">
    <h1 className="text-2xl md:text-3xl text-white mb-2">
      Welcome back, <br className="block sm:hidden" />
      <span className="font-bold">{userName}</span>!{" "}
    </h1>
    <p className="text-gray-300 leading-tight sm:w-3/4 text-sm">
      Stay connected with your student and teachers community. Share your
      thoughts, reviews and see what your students are sharing.
    </p>
  </div>
);

interface CreatePostProps {
  userInitial: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ userInitial }) => {
  const [showModal, setShowModal] = useState(false);
  const [postText, setPostText] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [showToast, setShowToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleTextAreaClick = () => {
    setShowModal(true);
  };

  const handleMediaSelect = (type: "image" | "video") => {
    if (type === "image") {
      fileInputRef.current?.click();
    } else {
      videoInputRef.current?.click();
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedMedia(file);
      setMediaType(type);

      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setShowModal(true);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setPostText("");
    setSelectedMedia(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  const handlePost = () => {
    console.log("Posting:", { text: postText, media: selectedMedia });
    handleCancel();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleModalMediaSelect = (type: "image" | "video") => {
    if (type === "image") {
      fileInputRef.current?.click();
    } else {
      videoInputRef.current?.click();
    }
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
            <p className="text-gray-500 text-xs">What&lsquo;s on your mind?</p>
          </div>
        </div>

        <div className="flex flex-col sm:space-y-4">
          <button
            onClick={handleTextAreaClick}
            className="w-full bg-gray-50 transition-all duration-200 rounded-sm px-4 py-3 text-left text-gray-600 text-sm border border-gray-400 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent cursor-pointer"
          >
            Share your thoughts, or review what students share...
          </button>

          <div className="grid-cols-2 gap-2 hidden sm:grid">
            <button
              onClick={() => handleMediaSelect("image")}
              className="flex items-center justify-center space-x-2 p-2 text-white bg-slate-900 rounded-sm transition-all duration-200 text-sm font-semibold cursor-pointer hover:bg-slate-800"
            >
              <FileImage className="w-4 h-4" />
              <span>Photo</span>
            </button>
            <button
              onClick={() => handleMediaSelect("video")}
              className="flex items-center justify-center space-x-2 p-2 text-white rounded-sm transition-all duration-200 text-sm bg-slate-900 font-semibold cursor-pointer hover:bg-slate-800"
            >
              <Video className="w-4 h-4" />
              <span>Video</span>
            </button>
          </div>
        </div>

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

              {mediaPreview && (
                <div className="mt-4 relative">
                  {mediaType === "image" ? (
                    <Image
                      src={mediaPreview}
                      alt="Selected"
                      className="w-full max-h-96 object-cover rounded-lg"
                      height={100}
                      width={100}
                    />
                  ) : (
                    <video
                      src={mediaPreview}
                      controls
                      className="w-full max-h-96 rounded-lg"
                    />
                  )}
                  <button
                    onClick={() => {
                      setSelectedMedia(null);
                      setMediaPreview(null);
                      setMediaType(null);
                    }}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {!mediaPreview && (
                <div className="mt-4 mb-3">
                  <p className="text-sm text-gray-600 mb-2">Add to your post</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleModalMediaSelect("image")}
                      className="flex items-center space-x-2 px-3 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 transition-colors text-sm cursor-pointer"
                    >
                      <FileImage className="w-4 h-4" />
                      <span>Photo</span>
                    </button>
                    <button
                      onClick={() => handleModalMediaSelect("video")}
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
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-sm sm:rounded-lg hover:bg-gray-100 transition-colors font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={!postText.trim() && !selectedMedia}
                className="px-6 py-2 bg-slate-900 text-white rounded-sm sm:rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-slate-900 text-white test-sm  px-4 py-3 rounded-md shadow-lg flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Posted Suscessfully!</span>
          </div>
        </div>
      )}
    </>
  );
};

const PostHeader: React.FC<PostHeaderProps> = ({ post, getRoleBadgeColor }) => (
  <div className="p-4 pb-3">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {post.author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 text-sm">
              {post.author}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(
                post.role
              )}`}
            >
              {post.role}
            </span>
            {post.assignedBy && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-br from-white to-indigo-50 text-slate-800 border border-slate-400">
                📌 {post.assignedBy}
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
  onComment,
  onShare,
}) => {
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.topComments || []);
  const [showToast, setShowToast] = useState(false);

  const isLiked = likedPosts.has(post.id);
  const totalLikes = post.likes + (isLiked ? 1 : 0);

  const mockLikedBy = post.likedBy || [
    { id: "1", name: "John Doe", avatar: "👤" },
    { id: "2", name: "Jane Smith", avatar: "👩" },
    { id: "3", name: "Mike Johnson", avatar: "👨" },
    { id: "4", name: "Sarah Wilson", avatar: "👩‍💼" },
  ];

  const mockTopComments = post.topComments || [
    {
      id: "1",
      author: "Alice Brown",
      content: "This is really insightful! Thanks for sharing.",
      timestamp: "2h ago",
      avatar: "👩‍🦳",
    },
    {
      id: "2",
      author: "Bob Davis",
      content: "Great post! I completely agree with your perspective.",
      timestamp: "4h ago",
      avatar: "👨‍🦲",
    },
  ];

  useEffect(() => setComments(mockTopComments), []);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        author: "You",
        content: newComment,
        timestamp: "Just now",
        avatar: "👤",
      };

      setComments([...comments, newCommentObj]);
      onComment?.(post.id, newComment);
      setNewComment("");
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
            {post.comments > 0 && (
              <button
                onClick={() => setShowCommentsModal(true)}
                className="underline cursor-pointer"
              >
                {post.comments} {post.comments === 1 ? "comment" : "comments"}
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
              onClick={() => setShowCommentsModal(true)}
              className="flex items-center space-x-1 py-2 rounded-md transition-colors hover:bg-gray-50 text-gray-600 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium">Comment</span>
            </button>

            <button
              onClick={() => handleShare()}
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
            {comments.slice(0, 2).map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-sm">
                    {comment.avatar || "👤"}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 border border-gray-200 rounded-sm px-3 py-2">
                    <div className="font-medium text-sm text-gray-900">
                      {comment.author}
                    </div>
                    <div className="text-sm text-gray-700">
                      {comment.content}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {comment.timestamp}
                  </div>
                </div>
              </div>
            ))}
            {comments.length > 2 && (
              <button
                onClick={() => setShowCommentsModal(true)}
                className="text-sm text-slate-900 hover:text-slate-700 font-medium cursor-pointer underline"
              >
                View all {comments.length} comments
              </button>
            )}
          </div>
        </div>
      )}

      {showLikesModal && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm hidden items-center justify-center z-50">
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
                    {user.avatar || "👤"}
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
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-sm">
                      {comment.avatar || "👤"}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <div className="font-medium text-sm text-gray-900">
                        {comment.author}
                      </div>
                      <div className="text-sm text-gray-700">
                        {comment.content}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {comment.timestamp}
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
                  className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors ease-in-out duration-200 cursor-pointer"
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
          <div className="bg-slate-900 text-white test-sm  px-4 py-3 rounded-md shadow-lg flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Link copied to clipboard!</span>
          </div>
        </div>
      )}
    </div>
  );
};

const Post: React.FC<PostProps> = ({
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
          </pre>

          {shouldTruncate && !isExpanded && (
            <>
              {post.content.length > 200 && contentLines.length <= 2 && "..."}
              <button
                onClick={() => setIsExpanded(true)}
                className="text-blue-600 hover:text-blue-900 font-medium ml-1 cursor-pointer text-xs underline"
              >
                more
              </button>
            </>
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

      {post.media && (
        <div className="px-4 pb-3">
          <img
            src={post.media.url}
            alt="Post media"
            className="w-full h-64 object-cover rounded-sm bg-gray-100"
          />
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
}) => (
  <div className="space-y-6">
    {posts.map((post) => (
      <Post
        key={post.id}
        post={post}
        likedPosts={likedPosts}
        onLike={onLike}
        onFlag={onFlag}
        getRoleBadgeColor={getRoleBadgeColor}
      />
    ))}
  </div>
);

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => (
  <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-sm border border-gray-400 p-5 overflow-hidden">
    <div className="flex items-center space-x-3 mb-3">
      <div className="w-12 h-12 rounded-md bg-slate-900 flex items-center justify-center shadow-lg border border-white/20 transition-all duration-200">
        <span className="text-white font-bold text-lg">{user.initial}</span>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg tracking-wide">{user.name}</h3>
        <p className="text-xs font-medium mb-1 text-blue-900">{user.course}</p>
        {user.teacherId && (
          <p className="text-[11px] font-medium">{user.teacherId}</p>
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
              className="flex-1 px-4 py-2 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-slate-900 focus:border-slate-900 cursor-pointer font-semibold"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherHome: React.FC = () => {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [reportModal, setReportModal] = useState<ReportModalState>({
    isOpen: false,
    postId: null,
  });
  const [reportReason, setReportReason] = useState<string>("");
  const [reportDetails, setReportDetails] = useState<string>("");

  const user: User = {
    name: "Nishchay Bhatia",
    initial: "N",
    course: "Computer Science & Engineering",
    teacherId: "STU2024001",
  };

  const posts: Post[] = [
    {
      id: "1",
      author: "Prof. Sarah Williams",
      role: "Faculty",
      content:
        "Great presentation on Machine Learning algorithms today! The students showed excellent understanding of neural networks and their applications. Keep up the fantastic work! 🎯",
      media: null,
      likes: 24,
      comments: 8,
      timestamp: "2h ago",
      assignedBy: "CS Department",
    },
    {
      id: "2",
      author: "Alex Chen",
      role: "Student",
      content:
        "Just completed my first full-stack e-commerce project using React and Node.js! Thanks to everyone who provided feedback during development. The learning journey continues! 🚀  Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores omnis eum sed nesciunt nemo molestias dolorem debitis aliquid neque nihil reprehenderit, ex labore enim ullam delectus impedit accusamus vitae tenetur provident inventore. Dicta, minima dolore sapiente fugiat assumenda nisi doloribus consequuntur dolorem consequatur asperiores eveniet iusto! Iste ducimus voluptate in.",
      media: {
        type: "image",
        url: "https://via.placeholder.com/600x300/1e40af/ffffff?text=E-Commerce+Project+Screenshot",
      },
      likes: 42,
      comments: 15,
      timestamp: "4h ago",
      assignedBy: null,
    },
    {
      id: "3",
      author: "Dr. Michael Rodriguez",
      role: "Faculty",
      content:
        "Reminder: Final project submissions are due next Friday. Please ensure all documentation and code are properly organized. Office hours available this week for any last-minute questions.",
      media: null,
      likes: 18,
      comments: 12,
      timestamp: "6h ago",
      assignedBy: "Academic Committee",
    },
  ];

  const handleLike = (postId: string): void => {
    setLikedPosts((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  const handleFlag = (postId: string): void => {
    setReportModal({ isOpen: true, postId });
  };

  const handleReportSubmit = (): void => {
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

  const handleReportClose = (): void => {
    setReportModal({ isOpen: false, postId: null });
    setReportReason("");
    setReportDetails("");
  };

  const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case "Admin":
        return "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white border-blue-300";
      case "Student":
        return "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white border-blue-300";
      case "Faculty":
        return "bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 text-white border-blue-400";
      default:
        return "bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white border-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <WelcomeMessage userName={user.name} />
            <div className="block sm:hidden">
              <CreatePost userInitial={user.initial} />
            </div>
            <Feed
              posts={posts}
              likedPosts={likedPosts}
              onLike={handleLike}
              onFlag={handleFlag}
              getRoleBadgeColor={getRoleBadgeColor}
            />
          </div>

          <div className="lg:col-span-3 space-y-4 hidden sm:block">
            <ProfileHeader user={user} />
            <CreatePost userInitial={user.initial} />
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

export default TeacherHome;
