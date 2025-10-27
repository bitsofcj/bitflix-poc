import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';
import rateLimit from 'express-rate-limit';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting configuration from environment variables with defaults
const RATE_LIMIT_WINDOW_MS = parseInt(
  process.env.RATE_LIMIT_WINDOW_MS || '60000',
  10
); // 1 minute default
const RATE_LIMIT_MAX_REQUESTS = parseInt(
  process.env.RATE_LIMIT_MAX_REQUESTS || '100',
  10
); // 100 requests per window

// Request size and timeout configuration
const MAX_REQUEST_SIZE = process.env.MAX_REQUEST_SIZE || '1mb'; // Max payload size
const FETCH_TIMEOUT_MS = parseInt(process.env.FETCH_TIMEOUT_MS || '10000', 10); // 10 seconds default

// Create rate limiter for API endpoints only (not static files)
const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: RATE_LIMIT_WINDOW_MS / 1000,
  },
  handler: (req, res) => {
    console.log(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
    });
  },
});

// Parse JSON bodies for GraphQL requests with size limit
app.use(express.json({ limit: MAX_REQUEST_SIZE }));

const MOVIES_API_URL = process.env.MOVIES_API_URL;
const MOVIES_API_KEY = process.env.MOVIES_API_KEY;

console.log('=== Server Starting ===');
console.log('Node version:', process.version);
console.log('PORT:', PORT);
console.log('MOVIES_API_URL:', MOVIES_API_URL ? 'Set' : 'Not set');
console.log('MOVIES_API_KEY:', MOVIES_API_KEY ? 'Set' : 'Not set');
console.log(
  'Rate Limit:',
  `${RATE_LIMIT_MAX_REQUESTS} requests per ${
    RATE_LIMIT_WINDOW_MS / 1000
  } seconds`
);
console.log('Max Request Size:', MAX_REQUEST_SIZE);
console.log('Fetch Timeout:', `${FETCH_TIMEOUT_MS / 1000} seconds`);

if (!MOVIES_API_URL || !MOVIES_API_KEY) {
  console.error('ERROR: Missing required environment variables!');
  console.error('Please check your .env file');
  process.exit(1);
}

// Proxy middleware for all API endpoints
const proxyRequest = async (req, res) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    // Construct the full URL with query parameters
    const path = req.originalUrl;
    const url = new URL(path, MOVIES_API_URL).toString();

    console.log('Proxying request to:', url);

    const response = await fetch(url, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${MOVIES_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    clearTimeout(timeout);

    if (error.name === 'AbortError') {
      console.error('Proxy timeout:', req.originalUrl);
      return res.status(504).json({ error: 'Request timeout' });
    }

    console.error('Proxy error:', error);
    console.error('MOVIES_API_URL was:', MOVIES_API_URL);
    console.error('Request URL was:', req.originalUrl);
    res.status(500).json({ error: 'Proxy request failed' });
  }
};

// Health check endpoint (with rate limiting)
app.get('/healthcheck', apiLimiter, proxyRequest);

// GraphQL endpoint - handle both OPTIONS (preflight) and POST
app.options('/graphql', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

app.post('/graphql', apiLimiter, async (req, res) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const graphqlUrl = `${MOVIES_API_URL}/graphql`;

    // console.log('Proxying GraphQL request to:', graphqlUrl);
    // console.log(
    //   'GraphQL Query:',
    //   req.body.query ? req.body.query.substring(0, 100) + '...' : 'No query'
    // );

    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MOVIES_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const data = await response.json();

    // Add CORS headers to response
    res.header('Access-Control-Allow-Origin', '*');
    res.status(response.status).json(data);
  } catch (error) {
    clearTimeout(timeout);

    if (error.name === 'AbortError') {
      console.error('GraphQL timeout:', MOVIES_API_URL);
      res.header('Access-Control-Allow-Origin', '*');
      return res.status(504).json({ error: 'Request timeout' });
    }

    console.error('GraphQL proxy error:', error);
    console.error('MOVIES_API_URL was:', MOVIES_API_URL);
    console.error('Request body:', JSON.stringify(req.body));
    res.header('Access-Control-Allow-Origin', '*');
    res
      .status(500)
      .json({ error: 'GraphQL proxy request failed', details: error.message });
  }
});

// Serve built frontend static files
app.use(express.static('build'));

// Catch-all route for React Router (must be after API routes and static files)
// Only serve index.html for non-API routes
app.get('*', (req, res, next) => {
  // Don't catch API routes
  if (req.path.startsWith('/healthcheck') || req.path.startsWith('/graphql')) {
    return next();
  }
  res.sendFile('index.html', { root: 'build' });
});

// Error handling for payload too large
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    console.error('Request too large:', req.path);
    return res.status(413).json({ error: 'Request payload too large' });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Server ready to accept connections`);
});

server.on('error', (err) => {
  if (err.code === 'EACCES') {
    console.error(`ERROR: Port ${PORT} requires elevated privileges`);
    console.error('Try using a port >= 1024 or run with sudo');
  } else if (err.code === 'EADDRINUSE') {
    console.error(`ERROR: Port ${PORT} is already in use`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
