import React, { useState, memo } from 'react';
// --- REMOVED motion ---
import {
  StarIcon,
  Loader2,
  Trash2,
  ThumbsUp,
  Check,
  UserCircle2,
} from 'lucide-react';

// --- Utility Functions (Unchanged) ---
function formatTime(ts) {
  if (!ts) return '';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString();
  } catch {
    return '';
  }
}

function formatUsername(displayName, email) {
  if (displayName) {
    return displayName;
  }
  return email ? email.split('@')[0] : 'Anonymous';
}

/* ---------------------- Review Card ---------------------- */
export const ReviewCard = memo(
  ({ review, user, onDeleteReview, onMarkHelpful }) => {
    const formattedName = formatUsername(review.username, review.userEmail);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMarkingHelpful, setIsMarkingHelpful] = useState(false);
    const [localHelpfulCount, setLocalHelpfulCount] = useState(
      review.helpfulCount || 0
    );
    const [markedHelpfulByCurrentUser, setMarkedHelpfulByCurrentUser] =
      useState(false);

    const isAuthor = user && review.userId === user.uid;

    const handleDeleteClick = () => {
      setIsDeleting(true);
      onDeleteReview(review.id, review.rating, review.imageUrl);
    };

    const handleHelpfulClick = async () => {
      if (!user || markedHelpfulByCurrentUser || isMarkingHelpful) return;
      setIsMarkingHelpful(true);
      const success = await onMarkHelpful(review.id, user.uid);
      setIsMarkingHelpful(false);
      if (success) {
        setMarkedHelpfulByCurrentUser(true);
        setLocalHelpfulCount((prev) => prev + 1);
      }
    };

    return (
      <div // --- REMOVED motion.div ---
        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <UserCircle2 className="w-10 h-10 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <div>
              <div className="font-semibold text-gray-800 dark:text-white">
                {formattedName}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {formatTime(review.createdAt)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${
                  i < (review.rating || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-snug">
          {review.comment}
        </p>
        {review.imageUrl && (
          <div className="mt-3">
            <img
              src={review.imageUrl}
              alt="Review attachment"
              className="w-full h-44 object-cover rounded-lg border border-gray-100 dark:border-gray-700"
              loading="lazy"
            />
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={handleHelpfulClick}
            disabled={!user || markedHelpfulByCurrentUser || isMarkingHelpful}
            className={`text-sm font-medium flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${
              markedHelpfulByCurrentUser
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 cursor-default'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {isMarkingHelpful ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : markedHelpfulByCurrentUser ? (
              <Check className="w-4 h-4" />
            ) : (
              <ThumbsUp className="w-4 h-4" />
            )}
            Helpful {localHelpfulCount > 0 ? `(${localHelpfulCount})` : ''}
          </button>

          {isAuthor && (
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="text-sm text-red-600 dark:text-red-500 font-medium flex items-center gap-1 hover:text-red-800 dark:hover:text-red-400 disabled:text-gray-400"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      </div>
    );
  }
);