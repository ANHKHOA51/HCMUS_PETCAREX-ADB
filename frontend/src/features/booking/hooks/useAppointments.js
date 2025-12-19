import { useState, useEffect, useCallback } from "react";
import { bookingService } from "../services/bookingService";
import toast from "react-hot-toast";

export const useAppointments = (userId) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchAppointments = useCallback(
    async (cursor = null, isRefresh = false) => {
      if (!userId) return;

      setLoading(true);
      try {
        const data = await bookingService.getUserAppointments(userId, { limit: 10, cursor });

        if (isRefresh) {
          setAppointments(data.items);
        } else {
          setAppointments((prev) => [...prev, ...data.items]);
        }

        setNextCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(err);
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    fetchAppointments(null, true);
  }, [fetchAppointments]);

  const loadMore = () => {
    if (!loading && hasMore && nextCursor) {
      fetchAppointments(nextCursor);
    }
  };

  const refresh = () => {
    setNextCursor(null);
    setHasMore(true);
    fetchAppointments(null, true);
  }

  return { appointments, loading, error, hasMore, loadMore, refresh };
};
