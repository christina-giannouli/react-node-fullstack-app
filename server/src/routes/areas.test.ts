import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.ts';

const API_URL = 'https://areas.test/api';
const areas = [{ placeId: '123', mainText: 'Mount Olympus', secondaryText: 'Greece' }];

const mockFetch = () => vi.spyOn(globalThis, 'fetch');

describe('Areas Route', () => {
  beforeEach(() => {
    vi.stubEnv('API_URL', API_URL);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('should return areas', async () => {
    const fetchSpy = mockFetch().mockResolvedValue(Response.json(areas));
    const res = await request(app).get('/api/areas').query({ input: 'Olympus' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(areas);
    expect(fetchSpy).toHaveBeenCalledWith(`${API_URL}?input=Olympus`);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array if no areas are found', async () => {
    const fetchSpy = mockFetch().mockResolvedValue(Response.json([]));
    const res = await request(app).get('/api/areas').query({ input: 'missingArea' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should encode the input before calling the API', async () => {
    const fetchSpy = mockFetch().mockResolvedValue(Response.json(areas));
    const input = 'Περαία - Θεσσαλονίκη';

    await request(app).get('/api/areas').query({ input });

    expect(fetchSpy).toHaveBeenCalledWith(`${API_URL}?input=${encodeURIComponent(input)}`);
  });

  it.each([
    ['a missing input', {}],
    ['a blank input', { input: ' ' }],
    ['an input shorter than 3 characters', { input: 'ab' }],
    ['an input that is only short once trimmed', { input: '  ab  ' }],
  ])('should return an empty array without calling the API', async (_, query) => {
    const fetchSpy = mockFetch();
    const res = await request(app).get('/api/areas').query(query);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('should forward the status upon failed API response', async () => {
    mockFetch().mockResolvedValue(new Response('Bad gateway', { status: 502 }));
    const res = await request(app).get('/api/areas').query({ input: 'Olympus' });

    expect(res.status).toBe(502);
    expect(res.body).toEqual({
      message: 'Failed to fetch areas.',
      status: 502,
      debugMessage: null,
      timestamp: expect.any(String),
    });
  });

  it('should return an error if the API returns invalid data', async () => {
    mockFetch().mockResolvedValue(Response.json([{ placeId: '' }]));
    const res = await request(app).get('/api/areas').query({ input: 'Olympus' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: 'An error occurred while fetching areas.',
      status: 500,
      debugMessage: expect.any(String),
      timestamp: expect.any(String),
    });
  });

  it('should return an error upon network error', async () => {
    const fetchSpy = mockFetch().mockRejectedValue(new Error('Network error'));
    const res = await request(app).get('/api/areas').query({ input: 'Olympus' });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: 'An error occurred while fetching areas.',
      status: 500,
      debugMessage: 'Network error',
      timestamp: expect.any(String),
    });
  });
});
