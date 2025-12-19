import { useState, useEffect, useCallback, useRef } from "react";
import { branchService } from "../services/branchService";

const CACHE_KEY = "branch_list";
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const useBranches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef(null);
  const loadingRef = useRef(false); // Synchronous loading state
  const abortControllerRef = useRef(null);
  const initializedRef = useRef(false); // Track initial load

  // Simple cache
  const cacheRef = useRef({ data: [], cursor: null, timestamp: 0 });

  // const fetchBranches = useCallback(async (isLoadMore = false) => {
  //   // Cache check for initial load
  //   if (!isLoadMore && !initializedRef.current) {
  //     // If we have valid cache, use it and don't fetch
  //     if (Date.now() - cacheRef.current.timestamp < CACHE_DURATION && cacheRef.current.data.length > 0) {
  //       setBranches(cacheRef.current.data);
  //       cursorRef.current = cacheRef.current.cursor;
  //       setHasMore(!!cacheRef.current.cursor);
  //       initializedRef.current = true;
  //       return;
  //     }
  //   }

  //   if (loadingRef.current) return;
  //   loadingRef.current = true;
  //   setLoading(true);
  //   setError(null);

  //   // Cancel previous request if any
  //   if (abortControllerRef.current) {
  //     abortControllerRef.current.abort();
  //   }
  //   abortControllerRef.current = new AbortController();

  //   try {
  //     const currentCursor = isLoadMore ? cursorRef.current : null;

  //     const res = await branchService.getBranches({
  //       cursor: currentCursor,
  //       limit: 10,
  //       signal: abortControllerRef.current.signal
  //     });

  //     // Avoid state update if unmounted or aborted (though branchService needs to support signal pass-through)
  //     // Since branchService currently doesn't accept signal, this check is still good.

  //     const newBranches = isLoadMore ? [...(branches || []), ...res.items] : res.items;

  //     // Handle case where infinite scroll triggered but no new items returned
  //     if (res.items.length === 0) {
  //       setHasMore(false);
  //     } else {
  //       setBranches(prev => isLoadMore ? [...prev, ...res.items] : res.items);
  //       cursorRef.current = res.nextCursor;
  //       setHasMore(!!res.nextCursor);

  //       // Update cache
  //       if (!isLoadMore || cacheRef.current.data.length < newBranches.length) {
  //         cacheRef.current = {
  //           data: newBranches,
  //           cursor: res.nextCursor,
  //           timestamp: Date.now()
  //         };
  //       }
  //     }
  //     initializedRef.current = true;

  //   } catch (err) {
  //     if (err.name !== 'AbortError') {
  //       setError(err.message);
  //     }
  //   } finally {
  //     loadingRef.current = false;
  //     setLoading(false);
  //   }
  // }, [branches]); // branches dependency needed for spreading, but might cause loop if not careful. 
  // // actually better to use functional state update setBranches(prev => ...) to avoid dependency on branches

  // Corrected useCallback dependency list
  const fetchBranchesSafe = useCallback(async (isLoadMore = false) => {
    // Logic duplicated to break dependency cycle or use refs?
    // Let's use the code above but fix state update to not depend on 'branches'

    // ... (Same logic as above, but setBranches(prev => ...))

    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const currentCursor = isLoadMore ? cursorRef.current : null;

      // Note: Modified branchService needs to support signal if we want true cancellation
      const res = await branchService.getBranches({
        cursor: currentCursor,
        limit: 10
      });

      // Use functional update to avoid closure staleness
      setBranches(prev => {
        const updated = isLoadMore ? [...prev, ...res.items] : res.items;

        // Update cache inside effect or here via ref? Ref is safe.
        if (!isLoadMore || cacheRef.current.data.length < updated.length) {
          cacheRef.current = {
            data: updated,
            cursor: res.nextCursor,
            timestamp: Date.now()
          };
        }
        return updated;
      });

      cursorRef.current = res.nextCursor;
      setHasMore(!!res.nextCursor);
      initializedRef.current = true;

    } catch (err) {
      setError(err.message);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch if not initialized or if explicitly resetting?
    // For now, standard effect
    fetchBranchesSafe(false);

    return () => {
      // Cleanup if needed
    };
  }, [fetchBranchesSafe]);


  const loadMore = useCallback(() => {
    // Ensure we don't trigger if already loading
    if (hasMore && !loadingRef.current) {
      fetchBranchesSafe(true);
    }
  }, [hasMore, fetchBranchesSafe]);

  return { branches, loading, error, hasMore, loadMore };
};
