"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Flag, Users, AlertTriangle, CheckCircle, X, Eye } from "lucide-react";
import Table from "../../Table";
import FlaggedByModal from "./FlaggedByModal";

interface FlaggedUser {
  userId: string;
  userName: string;
  userEmail: string;
  flagReason: string;
  flaggedAt: string;
}

interface FlaggedPost {
  id: string;
  postId: string;
  postContent: string;
  postAuthor: string;
  postAuthorEmail: string;
  postCreatedAt: string;
  mediaUrl?: string;
  flagCount: number;
  flaggedBy: FlaggedUser[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = "bg-slate-900";
  const icon =
    type === "success" ? (
      <CheckCircle size={20} />
    ) : type === "error" ? (
      <X size={20} />
    ) : (
      <AlertTriangle size={20} />
    );

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-in slide-in-from-top-2`}
    >
      {icon}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:bg-gray-50 hover:text-black rounded p-1 cursor-pointer"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const initialFlaggedPosts: FlaggedPost[] = [
  {
    id: "1",
    postId: "post_123",
    postContent:
      "This is an inappropriate post that violates community guidelines...",
    postAuthor: "John Doe",
    postAuthorEmail: "john.doe@company.com",
    postCreatedAt: "2024-08-20",
    flagCount: 3,
    flaggedBy: [
      {
        userId: "user1",
        userName: "Alice Smith",
        userEmail: "alice@company.com",
        flagReason: "Inappropriate content",
        flaggedAt: "2024-08-21",
      },
      {
        userId: "user2",
        userName: "Bob Johnson",
        userEmail: "bob@company.com",
        flagReason: "Spam",
        flaggedAt: "2024-08-21",
      },
      {
        userId: "user3",
        userName: "Carol Wilson",
        userEmail: "carol@company.com",
        flagReason: "Harassment",
        flaggedAt: "2024-08-22",
      },
    ],
    status: "pending",
    createdAt: "2024-08-21",
  },
  {
    id: "2",
    postId: "post_456",
    postContent: "Another flagged post with offensive language",
    postAuthor: "Jane Smith",
    postAuthorEmail: "jane.smith@company.com",
    postCreatedAt: "2024-08-19",
    mediaUrl: "https://example.com/image.jpg",
    flagCount: 1,
    flaggedBy: [
      {
        userId: "user4",
        userName: "David Brown",
        userEmail: "david@company.com",
        flagReason: "Offensive language",
        flaggedAt: "2024-08-21",
      },
    ],
    status: "pending",
    createdAt: "2024-08-21",
  },
  {
    id: "3",
    postId: "post_789",
    postContent: "Spam content promoting external services",
    postAuthor: "Mike Wilson",
    postAuthorEmail: "mike@company.com",
    postCreatedAt: "2024-08-18",
    flagCount: 5,
    flaggedBy: [
      {
        userId: "user5",
        userName: "Emma Davis",
        userEmail: "emma@company.com",
        flagReason: "Spam",
        flaggedAt: "2024-08-20",
      },
      {
        userId: "user6",
        userName: "Frank Miller",
        userEmail: "frank@company.com",
        flagReason: "Commercial content",
        flaggedAt: "2024-08-20",
      },
      {
        userId: "user7",
        userName: "Grace Lee",
        userEmail: "grace@company.com",
        flagReason: "Spam",
        flaggedAt: "2024-08-21",
      },
      {
        userId: "user8",
        userName: "Henry Clark",
        userEmail: "henry@company.com",
        flagReason: "Inappropriate content",
        flaggedAt: "2024-08-21",
      },
      {
        userId: "user9",
        userName: "Ivy Taylor",
        userEmail: "ivy@company.com",
        flagReason: "Spam",
        flaggedAt: "2024-08-22",
      },
    ],
    status: "pending",
    createdAt: "2024-08-20",
  },
];

export default function FlagManagement() {
  const [flaggedPosts, setFlaggedPosts] =
    useState<FlaggedPost[]>(initialFlaggedPosts);
  const [error, setError] = useState("");
  const [selectedPost, setSelectedPost] = useState<FlaggedPost | null>(null);
  const [isFlaggedByModalOpen, setIsFlaggedByModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const statistics = useMemo(() => {
    const pending = flaggedPosts.filter((post) => post.status === "pending");
    const highPriority = pending.filter((post) => post.flagCount >= 3);
    const totalFlags = flaggedPosts.reduce(
      (sum, post) => sum + post.flagCount,
      0
    );

    return {
      totalFlagged: flaggedPosts.length,
      pendingReview: pending.length,
      highPriority: highPriority.length,
      totalFlags: totalFlags,
    };
  }, [flaggedPosts]);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info") => {
      setToast({ message, type });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const handleApproveFlag = useCallback(
    (postId: string) => {
      setFlaggedPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, status: "approved" as const } : post
        )
      );
      showToast(
        "Flag approved successfully. Post has been deleted.",
        "success"
      );
    },
    [showToast]
  );

  const handleRejectFlag = useCallback(
    (postId: string) => {
      setFlaggedPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, status: "rejected" as const } : post
        )
      );
      showToast("Flag rejected successfully. Post has been unflagged.", "info");
    },
    [showToast]
  );

  const handleViewFlaggedBy = useCallback((post: FlaggedPost) => {
    setSelectedPost(post);
    setIsFlaggedByModalOpen(true);
  }, []);

  const handleCloseFlaggedByModal = useCallback(() => {
    setIsFlaggedByModalOpen(false);
    setSelectedPost(null);
  }, []);

  const tableData = useMemo(() => {
    return flaggedPosts.map((post) => ({
      id: post.id,
      postId: post.postId,
      postContent:
        post.postContent.length > 50
          ? post.postContent.substring(0, 50) + "..."
          : post.postContent,
      postAuthor: post.postAuthor,
      postCreatedAt: post.postCreatedAt,
      flagCount: post.flagCount,
      status: post.status,
      actions:
        post.status === "pending" ? (
          <div className="flex space-x-2">
            <button
              onClick={() => handleViewFlaggedBy(post)}
              className="text-blue-600 hover:text-blue-800 p-1 cursor-pointer"
              title="View flagged by users"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => handleApproveFlag(post.id)}
              className="text-green-600 hover:text-green-800 p-1 cursor-pointer"
              title="Approve flag & delete post"
            >
              <CheckCircle size={16} />
            </button>
            <button
              onClick={() => handleRejectFlag(post.id)}
              className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
              title="Reject flag & restore post"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <span
            className={`px-2 py-1 rounded text-xs ${
              post.status === "approved"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {post.status === "approved" ? "Deleted" : "Restored"}
          </span>
        ),
    }));
  }, [flaggedPosts, handleApproveFlag, handleRejectFlag, handleViewFlaggedBy]);

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-2xl mx-auto mt-8">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => setError("")}
          className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          Flag Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <Flag className="w-6 h-6 text-slate-900 mx-auto mb-1" />
              <h4 className="text-lg text-slate-900">Total Flagged</h4>
              <p className="text-5xl font-bold text-[#1B3A6A]">
                {statistics.totalFlagged}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-yellow-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <AlertTriangle className="w-6 h-6 text-slate-900 mx-auto mb-1" />
              <h4 className="text-lg text-slate-900">Pending Review</h4>
              <p className="text-5xl font-bold text-yellow-600">
                {statistics.pendingReview}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-red-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <Users className="w-6 h-6 text-slate-900 mx-auto mb-1" />
              <h4 className="text-lg text-slate-900">High Priority</h4>
              <p className="text-5xl font-bold text-red-600">
                {statistics.highPriority}
              </p>
            </div>
          </div>
        </div>

        <Table
          data={tableData}
          title="Flagged Posts"
          filterField="status"
          badgeFields={["status", "flagCount"]}
          selectFields={{
            status: ["pending", "approved", "rejected"],
          }}
          nonEditableFields={[
            "id",
            "postId",
            "postContent",
            "postAuthor",
            "flagCount",
            "lastFlaggedAt",
            "actions",
          ]}
          hiddenColumns={["id"]}
        />

        {selectedPost && (
          <FlaggedByModal
            isOpen={isFlaggedByModalOpen}
            onClose={handleCloseFlaggedByModal}
            post={selectedPost}
          />
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </div>
    </div>
  );
}
