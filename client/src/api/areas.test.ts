import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAreas } from '@/api/areas.ts';

const mockFetch = () => vi.spyOn(globalThis, 'fetch');
const areas = [{ placeId: '123', mainText: 'Mount Olympus', secondaryText: 'Greece' }];

describe('Areas API', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch areas', async () => {
    const fetchSpy = mockFetch().mockResolvedValue(Response.json(areas));

    expect(await getAreas('Olympus')).toEqual(areas);
    expect(fetchSpy).toHaveBeenCalledWith('/api/areas?input=Olympus', { signal: undefined });
  });

  it('should encode the query', async () => {
    const fetchSpy = mockFetch().mockResolvedValue(Response.json(areas));
    const query = 'Περαία - Θεσσαλονίκη';

    await getAreas(query);

    expect(fetchSpy).toHaveBeenCalledWith(`/api/areas?input=${encodeURIComponent(query)}`, {
      signal: undefined,
    });
  });

  it('should pass the abort signal to fetch', async () => {
    const fetchSpy = mockFetch().mockResolvedValue(Response.json(areas));
    const controller = new AbortController();

    await getAreas('Olympus', controller.signal);

    expect(fetchSpy).toHaveBeenCalledWith('/api/areas?input=Olympus', {
      signal: controller.signal,
    });
  });

  it("should throw the server's error message if the response is not ok", async () => {
    mockFetch().mockResolvedValue(
      Response.json({ message: 'An error occurred while fetching areas.' }, { status: 500 })
    );

    await expect(getAreas('Olympus')).rejects.toThrow(/^An error occurred while fetching areas\.$/);
  });

  it('should throw a generic error message if the error response is not JSON', async () => {
    // e.g. an HTML error page from a proxy when the server is down
    mockFetch().mockResolvedValue(new Response('<h1>Bad Gateway</h1>', { status: 502 }));

    await expect(getAreas('Olympus')).rejects.toThrow(/^Failed to fetch areas$/);
  });

  it('should throw a generic error message if the error response has no message', async () => {
    mockFetch().mockResolvedValue(Response.json({}, { status: 500 }));

    await expect(getAreas('Olympus')).rejects.toThrow(/^Failed to fetch areas$/);
  });

  it('should pass through the error if the request fails', async () => {
    mockFetch().mockRejectedValue(new Error('Network down'));

    await expect(getAreas('Olympus')).rejects.toThrow(new Error('Network down'));
  });
});
