/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

// Store original environment
const originalEnv = process.env;

describe('GraphQL API Route', () => {
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

  describe('POST', () => {
    it('should proxy valid GraphQL request to movies API', async () => {
      const mockResponse = {
        data: { movies: [] },
      };

      (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
        status: 200,
        json: async () => mockResponse,
      });

      const { POST } = await import('./route');
      const request = new NextRequest('http://localhost/api/graphql', {
        method: 'POST',
        body: JSON.stringify({ query: '{ movies { id } }' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(global.fetch).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(data).toEqual(mockResponse);
    });

    it('should include CORS headers in response', async () => {
      (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
        status: 200,
        json: async () => ({ data: {} }),
      });

      const { POST } = await import('./route');
      const request = new NextRequest('http://localhost/api/graphql', {
        method: 'POST',
        body: JSON.stringify({ query: '{ test }' }),
      });

      const response = await POST(request);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('should return 504 on AbortError', async () => {
      const abortError = new Error('Aborted');
      abortError.name = 'AbortError';

      (global.fetch as jest.Mock) = jest.fn().mockRejectedValue(abortError);

      const { POST } = await import('./route');
      const request = new NextRequest('http://localhost/api/graphql', {
        method: 'POST',
        body: JSON.stringify({ query: '{ test }' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(504);
      expect(data.error).toBe('Request timeout');
    });

    it('should handle fetch errors gracefully', async () => {
      (global.fetch as jest.Mock) = jest.fn().mockRejectedValue(new Error('Network error'));

      const { POST } = await import('./route');
      const request = new NextRequest('http://localhost/api/graphql', {
        method: 'POST',
        body: JSON.stringify({ query: '{ test }' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('GraphQL proxy request failed');
      expect(data.details).toBe('Network error');
    });

    it('should pass request body to upstream API', async () => {
      const requestBody = {
        query: '{ movies { id title } }',
        variables: { page: 1 },
      };

      (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
        status: 200,
        json: async () => ({ data: {} }),
      });

      const { POST } = await import('./route');
      const request = new NextRequest('http://localhost/api/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/graphql'),
        expect.objectContaining({
          body: JSON.stringify(requestBody),
        })
      );
    });
  });

  describe('OPTIONS', () => {
    it('should return 200 status', async () => {
      const { OPTIONS } = await import('./route');
      const response = await OPTIONS();
      expect(response.status).toBe(200);
    });

    it('should include CORS headers', async () => {
      const { OPTIONS } = await import('./route');
      const response = await OPTIONS();

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe(
        'POST, OPTIONS'
      );
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe(
        'Content-Type, Authorization'
      );
    });
  });
});
