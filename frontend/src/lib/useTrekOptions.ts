import { useState, useEffect } from 'react';
import { treksApi } from './api';

export interface TrekOption {
  value: string;
  label: string;
}

const defaultOptions: TrekOption[] = [
  { value: '', label: 'Select a Trek' },
  { value: 'custom', label: 'Custom Trek / Not Sure' },
];

const loadingOptions: TrekOption[] = [
  { value: '', label: 'Loading treks...' },
];

export function useTrekOptions(): { trekOptions: TrekOption[]; loading: boolean } {
  const [trekOptions, setTrekOptions] = useState<TrekOption[]>(loadingOptions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchTreks() {
      try {
        const { items } = await treksApi.list({ status: 'published', limit: 100 });
        if (cancelled) return;
        const options: TrekOption[] = [
          { value: '', label: 'Select a Trek' },
          ...items.map((t) => ({ value: t.slug, label: t.name })),
          { value: 'custom', label: 'Custom Trek / Not Sure' },
        ];
        setTrekOptions(options);
      } catch {
        if (!cancelled) setTrekOptions(defaultOptions);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchTreks();
    return () => {
      cancelled = true;
    };
  }, []);

  return { trekOptions, loading };
}
