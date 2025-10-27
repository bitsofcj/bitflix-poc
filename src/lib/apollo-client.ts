import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  // eslint-disable-next-line no-undef
  uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:3000/graphql',
});

// Cache TTL configuration (in milliseconds)
// eslint-disable-next-line no-undef
const CACHE_TTL_MS = parseInt(
  // eslint-disable-next-line no-undef
  process.env.REACT_APP_CACHE_TTL_SECONDS || '60',
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
