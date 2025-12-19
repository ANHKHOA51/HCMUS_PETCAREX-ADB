import { useState, useEffect, useCallback, useRef } from "react";
import { productService } from "../services/productService";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProducts = ({ search, type }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const cursorRef = useRef(null);
  const loadingRef = useRef(false);
  const abortControllerRef = useRef(null);

  // Cache structure: { [key: string]: { data: Product[], cursor: string, timestamp: number } }
  const cacheRef = useRef({});

  const getCacheKey = useCallback((s, t) => `${s || ""}-${t || ""}`, []);

  const resetList = useCallback(() => {
    setProducts([]);
    setHasMore(true);
    cursorRef.current = null;
    // We don't reset loadingRef here because a fetch might be about to start or running
  }, []);

  const fetchProducts = useCallback(async (isLoadMore = false) => {
    const key = getCacheKey(search, type);

    // If initial load (not load more) and valid cache exists
    if (!isLoadMore) {
      const cached = cacheRef.current[key];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setProducts(cached.data);
        cursorRef.current = cached.cursor;
        setHasMore(!!cached.cursor);
        return;
      }
    }

    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const currentCursor = isLoadMore ? cursorRef.current : null;

      const res = await productService.getProducts({
        search,
        type,
        cursor: currentCursor,
        limit: 10,
        signal: abortControllerRef.current.signal // Pass signal if service supports it (or for future)
      });

      setProducts(prev => {
        // If we are loading more, append. If new filter/search, replace.
        // However, this function is called with isLoadMore based on user action.
        // But if search changed, we called resetList() before.
        // So 'prev' should be empty if !isLoadMore, but let's be safe.
        return isLoadMore ? [...prev, ...res.items] : res.items;
      });

      cursorRef.current = res.nextCursor;
      setHasMore(!!res.nextCursor);

      // Update cache
      if (!isLoadMore) {
        cacheRef.current[key] = {
          data: res.items,
          cursor: res.nextCursor,
          timestamp: Date.now()
        };
      }

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [search, type, getCacheKey]);

  // Effect to trigger fetch when search/type changes (Initial load for new filter)
  useEffect(() => {
    resetList();
    fetchProducts(false);

    return () => {
      // Cleanup: abort request if component unmounts or deps change
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      loadingRef.current = false;
    };
  }, [search, type, resetList, fetchProducts]);

  const loadMore = useCallback(() => {
    if (hasMore && !loadingRef.current) {
      fetchProducts(true);
    }
  }, [hasMore, fetchProducts]);

  return { products, loading, error, hasMore, loadMore };
};

export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    const fetch = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        if (mounted) setProduct(data);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();

    return () => {
      mounted = false;
    };
  }, [id]);

  return { product, loading, error };
};
