import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { usePolling } from '../../lib/hooks/usePolling';

export interface ReportComment {
  id: string;
  author: string;
  authorRole?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isEditing?: boolean;
}

interface ReportCommentsProps {
  reportId: string;
  pollingIntervalMs?: number;
  onNewComment?: (comment: ReportComment) => void;
}

/**
 * useCommentPolling Hook
 *
 * Specialized polling hook for report comments with pagination support
 *
 * @example
 * ```typescript
 * const { comments, isPolling, error, addComment } = useCommentPolling(reportId);
 * ```
 */
export function useCommentPolling(
  reportId: string,
  intervalMs: number = 10000
) {
  const [comments, setComments] = useState<ReportComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/reports/${reportId}/comments`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComments(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  }, [reportId]);

  const polling = usePolling(fetchComments, {
    intervalMs,
    maxRetries: 5,
    autoStart: true,
  });

  const addComment = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setIsSubmittingComment(true);
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/reports/${reportId}/comments`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: text.trim() }),
          }
        );

        if (response.ok) {
          const newComment = await response.json();
          setComments((prev) => [...prev, newComment]);
          setNewCommentText('');

          // Fetch fresh comments to ensure consistency
          await fetchComments();
        }
      } catch (error) {
        console.error('Failed to post comment:', error);
      } finally {
        setIsSubmittingComment(false);
      }
    },
    [reportId, fetchComments]
  );

  return {
    ...polling,
    comments,
    newCommentText,
    setNewCommentText,
    addComment,
    isSubmittingComment,
  };
}

/**
 * ReportCommentsView Component
 *
 * Displays real-time comment updates for a report with:
 * - Auto-polling for new comments
 * - Comment composition interface
 * - Real-time update indication
 * - Author and timestamp display
 */
export function ReportCommentsView({
  reportId,
  pollingIntervalMs = 10000,
  onNewComment,
}: ReportCommentsProps) {
  const {
    comments,
    isPolling,
    error,
    newCommentText,
    setNewCommentText,
    addComment,
    isSubmittingComment,
    lastUpdated,
  } = useCommentPolling(reportId, pollingIntervalMs);

  const handleSubmitComment = useCallback(async () => {
    if (newCommentText.trim()) {
      await addComment(newCommentText);
      onNewComment?.({
        id: String(Date.now()),
        author: 'Current User',
        content: newCommentText,
        createdAt: new Date().toISOString(),
      });
    }
  }, [newCommentText, addComment, onNewComment]);

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-900 rounded-lg">
      {/* Header with polling status */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <Text className="text-sm font-semibold text-slate-900 dark:text-white">
          Comments ({comments.length})
        </Text>

        <View className="flex-row items-center gap-2">
          {isPolling ? (
            <View className="flex-row items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded">
              <View className="w-2 h-2 bg-green-600 rounded-full" />
              <Text className="text-xs font-medium text-green-600 dark:text-green-400">
                Live
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
              <View className="w-2 h-2 bg-slate-400 rounded-full" />
              <Text className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Off
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Error state */}
      {error && (
        <View className="mx-4 mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded">
          <Text className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
            Update Error
          </Text>
          <Text className="text-sm text-red-700 dark:text-red-300">
            {error.message || 'Failed to load comments'}
          </Text>
        </View>
      )}

      {/* Comments list */}
      <ScrollView className="mx-4 mt-3 mb-3" scrollEnabled={comments.length > 3}>
        {comments.length === 0 ? (
          <View className="py-8 items-center">
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              No comments yet. Be the first to comment!
            </Text>
          </View>
        ) : (
          comments.map((comment, index) => (
            <View
              key={comment.id}
              className={`mb-3 p-3 rounded-lg border ${
                index === comments.length - 1
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              {/* Comment header */}
              <View className="flex-row justify-between items-start mb-2">
                <View>
                  <View className="flex-row items-center gap-2">
                    <Text className="font-semibold text-sm text-slate-900 dark:text-white">
                      {comment.author}
                    </Text>
                    {comment.authorRole && (
                      <Text className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {comment.authorRole}
                      </Text>
                    )}
                  </View>
                  <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {formatTime(comment.createdAt)}
                    {comment.updatedAt &&
                      comment.updatedAt !== comment.createdAt && (
                        <Text> (edited)</Text>
                      )}
                  </Text>
                </View>
              </View>

              {/* Comment content */}
              <Text className="text-sm text-slate-900 dark:text-slate-200 leading-relaxed">
                {comment.content}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Comment composition */}
      <View className="border-t border-slate-200 dark:border-slate-700 p-4">
        <Text className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
          Add a Comment
        </Text>

        <View className="flex-row gap-2 items-flex-end">
          <TextInput
            value={newCommentText}
            onChangeText={setNewCommentText}
            placeholder="Write your comment..."
            placeholderTextColor="#9ca3af"
            maxLength={500}
            multiline
            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            editable={!isSubmittingComment}
          />

          <Pressable
            onPress={handleSubmitComment}
            disabled={
              !newCommentText.trim() ||
              isSubmittingComment ||
              newCommentText.length > 500
            }
            className={`px-4 py-2 rounded-lg ${
              newCommentText.trim() && !isSubmittingComment
                ? 'bg-blue-600'
                : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            {isSubmittingComment ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-semibold text-sm">Post</Text>
            )}
          </Pressable>
        </View>

        <Text className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          {newCommentText.length}/500 characters
        </Text>
      </View>

      {/* Polling indicator footer */}
      {!isPolling && (
        <View className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-slate-200 dark:border-slate-700">
          <Text className="text-xs text-yellow-700 dark:text-yellow-300">
            Comment polling paused. Pull to refresh or check back later.
          </Text>
        </View>
      )}
    </View>
  );
}

/**
 * ReportCommentNotification Component
 *
 * Lightweight component for displaying new comment notifications
 */
export function ReportCommentNotification({
  comment,
  onDismiss,
}: {
  comment: ReportComment;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <Pressable
      onPress={onDismiss}
      className="mx-4 mb-2 p-3 rounded-lg bg-blue-500 flex-row items-start gap-3"
    >
      <View className="flex-1">
        <Text className="text-sm font-semibold text-white">
          💬 New comment from {comment.author}
        </Text>
        <Text className="text-xs text-blue-100 mt-1 line-clamped-2">
          {comment.content}
        </Text>
      </View>
      <Text className="text-white font-bold">✕</Text>
    </Pressable>
  );
}

/**
 * useReportCommentsListener Hook
 *
 * For parent screens needing to listen to comment updates
 */
export function useReportCommentsListener(reportId: string) {
  const { comments, lastUpdated } = useCommentPolling(reportId);

  return {
    commentCount: comments.length,
    lastCommentTime: lastUpdated,
    comments,
  };
}
