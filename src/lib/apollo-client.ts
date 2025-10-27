import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  // eslint-disable-next-line no-undef
  uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:3000/graphql',
});

// Cache TTL configuration (in seconds)
// eslint-disable-next-line no-undef
const CACHE_TTL_SECONDS = parseInt(
  // eslint-disable-next-line no-undef
  process.env.REACT_APP_CACHE_TTL_SECONDS || '60',
  10
);

// Create cache instance with type policies
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        movies: {
          // Custom merge to always use incoming data
          merge(existing, incoming) {
            return incoming;
          },
        },
        genres: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

// Track cache timestamps per query
const cacheTimestamps = new Map<string, number>();

// Helper to get cache key for a query
const getCacheKey = (fieldName: string, args?: any): string => {
  return `${fieldName}:${JSON.stringify(args || {})}`;
};

// Wrap cache write to track timestamps
const originalWrite = cache.write.bind(cache);
cache.write = (options: any) => {
  const result = originalWrite(options);

  // Track timestamp for this query
  if (options.query) {
    const queryName = options.query.definitions[0]?.name?.value || 'unknown';
    const cacheKey = getCacheKey(queryName, options.variables);
    cacheTimestamps.set(cacheKey, Date.now());
  }

  return result;
};

// Periodic cache eviction based on TTL
setInterval(() => {
  const now = Date.now();
  const expiredKeys: string[] = [];

  cacheTimestamps.forEach((timestamp, key) => {
    if (now - timestamp > CACHE_TTL_SECONDS * 1000) {
      expiredKeys.push(key);
    }
  });

  // Evict expired entries
  if (expiredKeys.length > 0) {
    expiredKeys.forEach((key) => {
      cacheTimestamps.delete(key);
    });

    // Clear all query cache entries (simpler approach)
    cache.evict({ id: 'ROOT_QUERY' });
    cache.gc();
  }
}, CACHE_TTL_SECONDS * 1000);

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'cache-first',
    },
  },
});
