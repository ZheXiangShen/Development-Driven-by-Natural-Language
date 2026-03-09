'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchJson } from '@/src/app/lib/api/client';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApiResource<T>(url: string | null): ApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(url));
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(async () => {
    setReloadToken((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchJson<T>(url, { signal: controller.signal });
        if (!active) return;
        setData(result);
      } catch (err) {
        if (!active || controller.signal.aborted) return;
        console.error(err);
        setError('加载失败，请稍后重试');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
      controller.abort();
    };
  }, [url, reloadToken]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
