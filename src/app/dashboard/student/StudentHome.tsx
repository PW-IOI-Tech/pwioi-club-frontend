"use client";

import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Flag,
  X,
  MoreHorizontal,
  Image,
  Video,
} from "lucide-react";

// Type definitions
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
    type: string;
    url: string;
  } | null;
  likes: number;
  comments: number;
  timestamp: string;
  assignedBy: string | null;
}

interface Announcement {
  id: string;
  author: string;
  title: string;
  description: string;
  timestamp: string;
}

interface ReportModalState {
  isOpen: boolean;
  postId: string | null;
}

// Welcome Message Component
interface WelcomeMessageProps {
  userName: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ userName }) => (
  <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-sm shadow-sm border border-gray-400 p-6 py-8">
    <h1 className="text-3xl text-white mb-2">
      Welcome back, <span className="font-bold">{userName}</span>!{" "}
      <span className="">👋</span>
    </h1>
    <p className="text-gray-300 leading-tight w-3/4">
      Stay connected with your academic community. Share your progress, learn
      from others, and explore new opportunities.
    </p>
  </div>
);

// Create Post Component
interface CreatePostProps {
  userInitial: string;
}

interface CreatePostProps {
  userInitial: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ userInitial }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-sm border border-gray-400 p-5">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex-1">
          <h3 className="text-gray-900 font-semibold text-xl">
            Share Something
          </h3>
          <p className="text-gray-500 text-xs">What's on your mind?</p>
        </div>
      </div>

      {/* Main Input Area */}
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full bg-gray-50 transition-all duration-200 rounded-sm px-4 py-3 text-left text-gray-600 text-sm border border-gray-400 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent cursor-pointer"
        >
          Share your thoughts, projects, or achievements...
        </button>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center space-x-2 p-2 text-white bg-slate-900 rounded-sm transition-all duration-200 text-sm font-semibold cursor-pointer">
            <Image className="w-4 h-4" />
            <span>Photo</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-2 text-white rounded-sm transition-all duration-200 text-sm bg-slate-900 font-semibold cursor-pointer">
            <Video className="w-4 h-4" />
            <span>Video</span>
          </button>
        </div>
      </div>

      {/* Quick Stats/Encouragement */}
      <div className="mt-4 pt-4 border-t border-gray-300">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>💡 Tip: Share your daily wins!</span>
        </div>
      </div>
    </div>
  );
};

// Post Header Component
interface PostHeaderProps {
  post: Post;
  getRoleBadgeColor: (role: string) => string;
}

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
      <button className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>
  </div>
);

// Post Actions Component
interface PostActionsProps {
  post: Post;
  likedPosts: Set<string>;
  onLike: (postId: string) => void;
  onFlag: (postId: string) => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  post,
  likedPosts,
  onLike,
  onFlag,
}) => (
  <div className="px-4 py-3 border-t border-gray-100 text-sm">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center space-x-1 px-3 py-2 rounded-sm transition-all hover:bg-gray-50 cursor-pointer ${
            likedPosts.has(post.id) ? "text-slate-900" : "text-gray-600"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${
              likedPosts.has(post.id) ? "fill-current" : ""
            }`}
          />
          <span className="font-medium">
            {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
          </span>
        </button>
        <button className="flex items-center space-x-1 px-3 py-2 rounded-sm transition-colors hover:bg-gray-50 text-gray-600 cursor-pointer">
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium">{post.comments}</span>
        </button>
        <button className="flex items-center space-x-1 px-3 py-2 rounded-sm transition-colors hover:bg-gray-50 text-gray-600 cursor-pointer">
          <Share2 className="w-4 h-4" />
          <span className="font-medium">Share</span>
        </button>
      </div>
      <button
        onClick={() => onFlag(post.id)}
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors cursor-pointer"
      >
        <Flag className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// Individual Post Component
interface PostProps {
  post: Post;
  likedPosts: Set<string>;
  onLike: (postId: string) => void;
  onFlag: (postId: string) => void;
  getRoleBadgeColor: (role: string) => string;
}

const Post: React.FC<PostProps> = ({
  post,
  likedPosts,
  onLike,
  onFlag,
  getRoleBadgeColor,
}) => (
  <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-sm border border-gray-400 overflow-hidden">
    <PostHeader post={post} getRoleBadgeColor={getRoleBadgeColor} />

    <div className="px-4 pb-3">
      <p className="text-gray-800 text-sm leading-tight tracking-normal">
        {post.content}
      </p>
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

// Feed Component
interface FeedProps {
  posts: Post[];
  likedPosts: Set<string>;
  onLike: (postId: string) => void;
  onFlag: (postId: string) => void;
  getRoleBadgeColor: (role: string) => string;
}

const Feed: React.FC<FeedProps> = ({
  posts,
  likedPosts,
  onLike,
  onFlag,
  getRoleBadgeColor,
}) => (
  <div className="space-y-4">
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

// Profile Header Component
interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => (
  <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm shadow-sm border border-gray-400 p-5 overflow-hidden">
    {/* Header Section */}
    <div className="flex items-center space-x-3 mb-3">
      <div className="w-12 h-12 rounded-md bg-slate-900 flex items-center justify-center shadow-lg border border-white/20 transition-all duration-200">
        <span className="text-white font-bold text-lg">{user.initial}</span>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg tracking-wide">{user.name}</h3>
        <p className="text-xs font-medium mb-1 text-blue-900">{user.course}</p>
        {user.studentId && user.batch && (
          <p className="text-[11px] font-medium">
            {user.studentId} • {user.batch}
          </p>
        )}
      </div>
    </div>
  </div>
);

// Report Modal Component
interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportReason: string;
  setReportReason: (reason: string) => void;
  reportDetails: string;
  setReportDetails: (details: string) => void;
  onSubmit: () => void;
}

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
            Help us understand what's wrong with this post
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

// Main Component
const StudentHome: React.FC = () => {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [reportModal, setReportModal] = useState<ReportModalState>({
    isOpen: false,
    postId: null,
  });
  const [reportReason, setReportReason] = useState<string>("");
  const [reportDetails, setReportDetails] = useState<string>("");

  // Mock data
  const user: User = {
    name: "Nishchay Bhatia",
    initial: "N",
    course: "Computer Science & Engineering",
    gpa: "8.7",
    rank: "142",
    studentId: "STU2024001",
    semester: "4th Semester",
    batch: "2024-2028",
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
        "Just completed my first full-stack e-commerce project using React and Node.js! Thanks to everyone who provided feedback during development. The learning journey continues! 🚀",
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

  const announcements: Announcement[] = [
    {
      id: "1",
      author: "Administration",
      title: "Spring Break Schedule",
      description:
        "Campus will be closed from March 15-22. Online resources remain available.",
      timestamp: "1d ago",
    },
    {
      id: "2",
      author: "Career Services",
      title: "Tech Career Fair",
      description:
        "Join us April 10th for networking with top tech companies. Registration required.",
      timestamp: "2d ago",
    },
    {
      id: "3",
      author: "Library Services",
      title: "Extended Hours",
      description:
        "Library now open 24/7 during finals week. Study rooms available for booking.",
      timestamp: "3d ago",
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
          {/* Left Column - Main Content (66%) */}
          <div className="lg:col-span-7 space-y-4">
            <WelcomeMessage userName={user.name} />
            <Feed
              posts={posts}
              likedPosts={likedPosts}
              onLike={handleLike}
              onFlag={handleFlag}
              getRoleBadgeColor={getRoleBadgeColor}
            />
          </div>

          {/* Right Column - Sidebar (25%) */}
          <div className="lg:col-span-3 space-y-4">
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

export default StudentHome;
