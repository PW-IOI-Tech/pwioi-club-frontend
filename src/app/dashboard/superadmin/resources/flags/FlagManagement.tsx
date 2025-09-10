"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Flag, Users, AlertTriangle, CheckCircle, X, Eye } from "lucide-react";
import Table from "../../Table";
import FlaggedByModal from "./FlaggedByModal";
import axios from "axios";

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
  flagIds: string[];
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
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icon =
    type === "success" ? (
      <CheckCircle size={20} />
    ) : type === "error" ? (
      <X size={20} />
    ) : (
      <AlertTriangle size={20} />
    );

  return (
    <div className="fixed top-4 right-4 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-in slide-in-from-top-2">
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

export default function FlagManagement() {
  const [flaggedPosts, setFlaggedPosts] = useState<FlaggedPost[]>([]);
  const [error, setError] = useState("");
  const [selectedPost, setSelectedPost] = useState<FlaggedPost | null>(null);
  const [isFlaggedByModalOpen, setIsFlaggedByModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

useEffect(() => {
  const fetchFlags = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/flags`,
        { withCredentials: true }
      );

      // Group flags by postId
      const grouped: Record<string, FlaggedPost> = {};

      res.data.data.forEach((f: any) => {
        const postId = f.post?.id || f.post_id;

        if (!grouped[postId]) {
          grouped[postId] = {
            id: postId,
            postId: postId,
            flagIds: [],
            postContent: f.post?.content || "",
            postAuthor: f.post?.author_type || "Unknown",
            postAuthorEmail: f.post?.author?.email || "N/A",
            postCreatedAt: f.post?.createdAt || "",
            mediaUrl: f.post?.media?.[0]?.url || undefined,
            flagCount: 0,
            flaggedBy: [],
            status: f.is_verified ? "rejected" : "pending",
            createdAt: f.createdAt,
          };
        }

        // increment flag count + add user
        grouped[postId].flagCount += 1;
        grouped[postId].flagIds.push(f.id);
        grouped[postId].flaggedBy.push({
          userId: f.flagged_by,
          userName: f.user?.name || "Unknown",
          userEmail: f.user?.email || "N/A",
          flagReason: f.content,
          flaggedAt: f.createdAt,
        });
      });

      setFlaggedPosts(Object.values(grouped));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch flags");
    }
  };

  fetchFlags();
}, []);


  const showToast = useCallback((message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

const handleApproveFlag = useCallback(
  async (post: FlaggedPost) => {
    try {
      const flagId = post.flagIds[0]; // 👈 use real flag id
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/flags/${flagId}/review`,
        { action: "approve" },
        { withCredentials: true }
      );
      setFlaggedPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, status: "approved" } : p
        )
      );
      showToast("Flag approved successfully. Post has been deleted.", "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to approve flag", "error");
    }
  },
  [showToast]
);

const handleRejectFlag = useCallback(
  async (post: FlaggedPost) => {
    try {
      const flagId = post.flagIds[0]; // 👈 use real flag id
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/flags/${flagId}/review`,
        { action: "dismiss" },
        { withCredentials: true }
      );
      setFlaggedPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, status: "rejected" } : p
        )
      );
      showToast("Flag dismissed successfully. Post has been restored.", "info");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to dismiss flag", "error");
    }
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

  const statistics = useMemo(() => {
    const pending = flaggedPosts.filter((post) => post.status === "pending");
    const highPriority = pending.filter((post) => post.flagCount >= 3);
    const totalFlags = flaggedPosts.reduce((sum, post) => sum + post.flagCount, 0);
    return {
      totalFlagged: flaggedPosts.length,
      pendingReview: pending.length,
      highPriority: highPriority.length,
      totalFlags,
    };
  }, [flaggedPosts]);

const tableData = useMemo(() => {
  if (!flaggedPosts || flaggedPosts.length === 0) return [];

  return flaggedPosts.map((post) => ({
    id: post.id,
    postContent:
      post.postContent.length > 50
        ? post.postContent.substring(0, 50) + "..."
        : post.postContent,
    postAuthor: post.postAuthor,
    postCreatedAt: new Date(post.postCreatedAt).toLocaleString(), // nicer formatting
    flagCount: post.flagCount,
    status: post.status,
    actions:
      post.status === "pending" ? (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewFlaggedBy(post)}
            className="text-blue-600 hover:text-blue-800 p-1 cursor-pointer"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleApproveFlag(post)}
            className="text-green-600 hover:text-green-800 p-1 cursor-pointer"
          >
            <CheckCircle size={16} />
          </button>
          <button
            onClick={() => handleRejectFlag(post)}
            className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
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
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Flag Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <Flag className="w-6 h-6 text-slate-900 mx-auto mb-1" />
              <h4 className="text-lg text-slate-900">Total Flagged</h4>
              <p className="text-5xl font-bold text-[#1B3A6A]">{statistics.totalFlagged}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-yellow-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <AlertTriangle className="w-6 h-6 text-slate-900 mx-auto mb-1" />
              <h4 className="text-lg text-slate-900">Pending Review</h4>
              <p className="text-5xl font-bold text-yellow-600">{statistics.pendingReview}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-red-50 rounded-sm border border-gray-400">
            <div className="p-6 text-center">
              <Users className="w-6 h-6 text-slate-900 mx-auto mb-1" />
              <h4 className="text-lg text-slate-900">High Priority</h4>
              <p className="text-5xl font-bold text-red-600">{statistics.highPriority}</p>
            </div>
          </div>
        </div>

        <Table
          data={tableData}
          title="Flagged Posts"
          filterField="status"
          badgeFields={["status", "flagCount"]}
          selectFields={{ status: [
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" }
          ] }}
          nonEditableFields={["id", "postId", "postContent", "postAuthor", "flagCount", "lastFlaggedAt", "actions"]}
          hiddenColumns={["id"]}
        />

        {selectedPost && (
          <FlaggedByModal isOpen={isFlaggedByModalOpen} onClose={handleCloseFlaggedByModal} post={selectedPost} />
        )}

        {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      </div>
    </div>
  );
}
