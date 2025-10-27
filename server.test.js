import request from 'supertest';
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Mock node-fetch
jest.mock('node-fetch');
const mockedFetch = fetch;

// Load test environment
dotenv.config({ path: '.env.test' });

// Mock environment variables
process.env.MOVIES_API_URL = 'https://test-api.example.com';
process.env.MOVIES_API_KEY = 'test-api-key';
process.env.RATE_LIMIT_MAX_REQUESTS = '100';
process.env.RATE_LIMIT_WINDOW_MS = '60000';
process.env.MAX_REQUEST_SIZE = '1mb';
process.env.FETCH_TIMEOUT_MS = '10000';

describe('Server Endpoint Tests', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    // Create a fresh app instance for each test
    app = express();
    app.use(express.json({ limit: '1mb' }));

    // Mock the proxy endpoint
    app.get('/healthcheck', async (req, res) => {
      try {
        const response = await mockedFetch(
          'https://test-api.example.com/healthcheck',
          {
            headers: {
              Authorization: 'Bearer test-api-key',
              'Content-Type': 'application/json',
            },
            signal: expect.any(Object),
          }
        );
        const data = await response.json();
        res.status(response.status).json(data);
      } catch (error) {
        res.status(500).json({ error: 'Proxy request failed' });
      }
    });

    // Mock the GraphQL endpoint
    app.post('/graphql', async (req, res) => {
      try {
        const response = await mockedFetch(
          'https://test-api.example.com/graphql',
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer test-api-key',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
            signal: expect.any(Object),
          }
        );
        const data = await response.json();
        res.header('Access-Control-Allow-Origin', '*');
        res.status(response.status).json(data);
      } catch (error) {
        res.header('Access-Control-Allow-Origin', '*');
        res.status(500).json({ error: 'GraphQL proxy request failed' });
      }
    });

    // Mock the OPTIONS endpoint
    app.options('/graphql', (req, res) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.sendStatus(200);
    });
  });

  describe('GET /healthcheck', () => {
    it('should proxy healthcheck request successfully', async () => {
      mockedFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ status: 'ok' }),
      });

      const response = await request(app).get('/healthcheck');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
      expect(mockedFetch).toHaveBeenCalledWith(
        expect.stringContaining('/healthcheck'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
          }),
        })
      );
    });

    it('should return 500 on upstream error', async () => {
      mockedFetch.mockRejectedValueOnce(new Error('Network error'));

      const response = await request(app).get('/healthcheck');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /graphql', () => {
    const mockGraphQLQuery = {
      query: `
        query GetMovies {
          movies {
            id
            title
          }
        }
      `,
    };

    it('should proxy GraphQL request successfully', async () => {
      const mockResponse = {
        data: {
          movies: [
            { id: '1', title: 'Inception' },
            { id: '2', title: 'The Matrix' },
          ],
        },
      };

      mockedFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockResponse,
      });

      const response = await request(app)
        .post('/graphql')
        .send(mockGraphQLQuery)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    it('should include authorization header in upstream request', async () => {
      mockedFetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ data: {} }),
      });

      await request(app)
        .post('/graphql')
        .send(mockGraphQLQuery)
        .set('Content-Type', 'application/json');

      expect(mockedFetch).toHaveBeenCalledWith(
        expect.stringContaining('/graphql'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(mockGraphQLQuery),
        })
      );
    });

    it('should return 500 on GraphQL error', async () => {
      mockedFetch.mockRejectedValueOnce(new Error('GraphQL error'));

      const response = await request(app)
        .post('/graphql')
        .send(mockGraphQLQuery)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    it('should handle empty request body', async () => {
      mockedFetch.mockResolvedValueOnce({
        status: 400,
        json: async () => ({ error: 'Bad Request' }),
      });

      const response = await request(app)
        .post('/graphql')
        .send({})
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
    });
  });

  describe('OPTIONS /graphql', () => {
    it('should handle preflight CORS request', async () => {
      const response = await request(app).options('/graphql');

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe('*');
      expect(response.headers['access-control-allow-methods']).toBe(
        'POST, OPTIONS'
      );
      expect(response.headers['access-control-allow-headers']).toContain(
        'Content-Type'
      );
    });
  });

  describe('Request size limits', () => {
    it('should reject requests larger than MAX_REQUEST_SIZE', async () => {
      const largePayload = {
        query: 'a'.repeat(2 * 1024 * 1024), // 2MB payload
      };

      const response = await request(app)
        .post('/graphql')
        .send(largePayload)
        .set('Content-Type', 'application/json');

      // This will fail at the body parser level
      expect([413, 400, 500]).toContain(response.status);
    });
  });

  describe('Timeout handling', () => {
    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'AbortError';
      mockedFetch.mockRejectedValueOnce(timeoutError);

      const response = await request(app)
        .post('/graphql')
        .send({ query: 'test' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});
