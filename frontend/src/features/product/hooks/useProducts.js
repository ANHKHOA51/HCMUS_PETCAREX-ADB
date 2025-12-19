import { useState, useEffect, useCallback, useRef } from "react";
import { productService } from "../services/productService";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProducts = ({ search, type }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef(null);

  // Cache structure: { [key: string]: { data: Product[], cursor: string, timestamp: number } }
  const cacheRef = useRef({});

  const getCacheKey = useCallback((s, t) => `${s || ""}-${t || ""}`, []);

  const resetList = useCallback(() => {
    setProducts([]);
    setHasMore(true);
    cursorRef.current = null;
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

    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      // Use current cursor if loading more, otherwise null (start fresh)
      const currentCursor = isLoadMore ? cursorRef.current : null;

      const res = await productService.getProducts({
        search,
        type,
        cursor: currentCursor,
        limit: 10
      });

      setProducts(prev => isLoadMore ? [...prev, ...res.items] : res.items);
      cursorRef.current = res.nextCursor;
      setHasMore(!!res.nextCursor);

      // Update cache
      if (!isLoadMore) {
        cacheRef.current[key] = {
          data: res.items,
          cursor: res.nextCursor,
          timestamp: Date.now()
        };
      } else {
        // If loading more, invalidate specific cache or update it (complex, easiest to just invalidate for simplicity or append)
        // For infinite scroll, appending to cache is tricky if not contiguous. 
        // Simple strategy: Only cache the FIRST page results for quick navigation back.
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, type, getCacheKey]);

  // Effect to trigger fetch when search/type changes (Initial load for new filter)
  useEffect(() => {
    resetList();
    fetchProducts(false);
  }, [search, type, resetList, fetchProducts]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchProducts(true);
    }
  }, [hasMore, loading, fetchProducts]);

  return { products, loading, error, hasMore, loadMore };
};

export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { product, loading, error };
};
