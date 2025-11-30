import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql',
});

// Cache TTL configuration (in milliseconds)
const CACHE_TTL_MS = parseInt(
  process.env.NEXT_PUBLIC_CACHE_TTL_SECONDS || '60',
  10
) * 1000;

// Create cache instance with simple merge policies
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        movies: {
          // Key by arguments to ensure different searches/filters are cached separately
          keyArgs: ['pagination', 'where'],
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

// Track when cache was last cleared
let lastCacheClear = Date.now();

// Periodically clear cache after TTL expires
setInterval(() => {
  const now = Date.now();
  if (now - lastCacheClear >= CACHE_TTL_MS) {
    // Clear the cache
    cache.evict({ id: 'ROOT_QUERY' });
    cache.gc();
    lastCacheClear = now;
  }
}, 5000); // Check every 5 seconds

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
