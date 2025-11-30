/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

// Store original environment
const originalEnv = process.env;

describe('Healthcheck API Route', () => {
  beforeAll(() => {
    // Set environment variables before importing the module
    process.env.MOVIES_API_URL = 'https://api.example.com';
    process.env.MOVIES_API_KEY = 'test-api-key';
    process.env.FETCH_TIMEOUT_MS = '10000';
  });

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('GET', () => {
    it('should proxy healthcheck request to movies API', async () => {
      const mockResponse = {
        status: 'ok',
        timestamp: new Date().toISOString(),
      };

      (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
        status: 200,
        json: async () => mockResponse,
      });

      const { GET } = await import('./route');
      const request = new NextRequest('http://localhost/api/healthcheck');

      const response = await GET(request);
      const data = await response.json();

      expect(global.fetch).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(data).toEqual(mockResponse);
    });

    it('should include query parameters in proxied request', async () => {
      (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
        status: 200,
        json: async () => ({ status: 'ok' }),
      });

      const { GET } = await import('./route');
      const request = new NextRequest(
        'http://localhost/api/healthcheck?detailed=true'
      );

      await GET(request);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('detailed=true'),
        expect.any(Object)
      );
    });

    it('should return 504 on AbortError', async () => {
      const abortError = new Error('Timeout');
      abortError.name = 'AbortError';

      (global.fetch as jest.Mock) = jest.fn().mockRejectedValue(abortError);

      const { GET } = await import('./route');
      const request = new NextRequest('http://localhost/api/healthcheck');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(504);
      expect(data.error).toBe('Request timeout');
    });

    it('should handle fetch errors gracefully', async () => {
      (global.fetch as jest.Mock) = jest.fn().mockRejectedValue(new Error('Network error'));

      const { GET } = await import('./route');
      const request = new NextRequest('http://localhost/api/healthcheck');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Proxy request failed');
    });

    it('should preserve response status from upstream API', async () => {
      (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
        status: 503,
        json: async () => ({ status: 'degraded' }),
      });

      const { GET } = await import('./route');
      const request = new NextRequest('http://localhost/api/healthcheck');

      const response = await GET(request);

      expect(response.status).toBe(503);
    });

    it('should construct correct URL with pathname', async () => {
      (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
        status: 200,
        json: async () => ({ status: 'ok' }),
      });

      const { GET } = await import('./route');
      const request = new NextRequest('http://localhost/api/healthcheck');

      await GET(request);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/healthcheck'),
        expect.any(Object)
      );
    });
  });
});
