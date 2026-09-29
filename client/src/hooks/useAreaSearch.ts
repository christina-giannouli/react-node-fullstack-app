import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getAreas } from '@/api/areas.ts';
import { useDebounce } from '@/hooks/useDebounce.ts';
import type { Area } from '@/schema/form';

const MIN_QUERY_LENGTH = 3;

export const areaLabel = (area: Area) => `${area.mainText}, ${area.secondaryText}`;

export function useAreaSearch() {
  const [query, setQuery] = useState('');
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);

  // Label of the area the input currently matches, so we don't search for it again.
  const selectedLabel = useRef<string | null>(null);
  const debouncedQuery = useDebounce<string>(query);

  useEffect(() => {
    // Don't fetch if the query is too short.
    if (debouncedQuery.trim().length < MIN_QUERY_LENGTH) return;

    // If the user has selected an area, don't query it again.
    if (debouncedQuery === selectedLabel.current) return;

    const controller = new AbortController();
    setLoading(true);

    getAreas(debouncedQuery, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setAreas(data);
      })
      .catch((err: Error) => {
        // Ignore failures from aborted requests.
        if (controller.signal.aborted) return;

        toast.error(err.message);
        setAreas([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    // Abort the request if the component is unmounted
    // or the query changes, to avoid race conditions
    return () => controller.abort();
  }, [debouncedQuery]);

  // Updates the query and returns the area it matches, if any.
  const updateQuery = (value: string): Area | undefined => {
    // The value is only a valid area when the text matches a suggestion.
    const area = areas.find((area) => areaLabel(area) === value);

    selectedLabel.current = area ? value : null;
    setQuery(value);

    if (value.trim().length < MIN_QUERY_LENGTH) setAreas([]);
    return area;
  };

  const reset = () => {
    selectedLabel.current = null;
    setQuery('');
    setAreas([]);
  };

  return { query, areas, loading, updateQuery, reset };
}
