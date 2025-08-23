import React from "react";
import { X, User, Calendar, AlertTriangle } from "lucide-react";

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

interface FlaggedByModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: FlaggedPost;
}

const FlaggedByModal: React.FC<FlaggedByModalProps> = ({
  isOpen,
  onClose,
  post,
}) => {
  if (!isOpen) return null;

  const flagsByReason = post.flaggedBy.reduce((acc, flag) => {
    if (!acc[flag.flagReason]) {
      acc[flag.flagReason] = [];
    }
    acc[flag.flagReason].push(flag);
    return acc;
  }, {} as Record<string, FlaggedUser[]>);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm border border-gray-400 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Post Flags Details
            </h3>
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-600">
                Post ID: {post.postId} • {post.flagCount} flag
                {post.flagCount !== 1 ? "s" : ""}
              </p>
              <p className="text-sm font-medium text-gray-800">
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    post.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : post.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-slate-900" />
            Original Post
          </h4>
          <div className="bg-gray-50 rounded-sm p-4 border border-gray-400">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium text-gray-800">{post.postAuthor}</p>
                <p className="text-sm text-gray-600">{post.postAuthorEmail}</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>Posted: {formatDate(post.postCreatedAt)}</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{post.postContent}</p>
            {post.mediaUrl && (
              <p className="text-sm text-blue-600 mt-2">
                Media:{" "}
                <a
                  href={post.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  View attachment
                </a>
              </p>
            )}
          </div>
        </div>

        <div className="p-6">
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-slate-900" />
            Flagged by Users ({post.flagCount})
          </h4>

          <div className="space-y-4">
            {Object.entries(flagsByReason).map(([reason, flags]) => (
              <div key={reason} className="border border-gray-400 rounded-sm">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 rounded-sm">
                  <h5 className="font-medium text-gray-800">
                    {reason}
                    <span className="ml-2 text-sm text-gray-600">
                      ({flags.length} user{flags.length !== 1 ? "s" : ""})
                    </span>
                  </h5>
                </div>
                <div className="p-4">
                  <div className="grid gap-3">
                    {flags.map((flag, _index) => (
                      <div
                        key={flag.userId}
                        className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {flag.userName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {flag.userEmail}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(flag.flaggedAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlaggedByModal;
