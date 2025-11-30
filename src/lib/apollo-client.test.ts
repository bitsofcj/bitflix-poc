/**
 * @jest-environment jsdom
 */

// Mock fetch globally before any imports
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe('apollo-client', () => {
  beforeEach(() => {
    // Ensure fetch is mocked
    global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  });

  it('should export an apolloClient instance', async () => {
    const { apolloClient } = await import('./apollo-client');
    expect(apolloClient).toBeDefined();
    expect(apolloClient).toHaveProperty('cache');
    expect(apolloClient).toHaveProperty('link');
  });

  it('should have cache configured', async () => {
    const { apolloClient } = await import('./apollo-client');
    expect(apolloClient.cache).toBeDefined();
  });

  it('should have cache-first fetch policy for watchQuery', async () => {
    const { apolloClient } = await import('./apollo-client');
    expect(apolloClient.defaultOptions.watchQuery?.fetchPolicy).toBe('cache-first');
  });

  it('should have cache-first fetch policy for query', async () => {
    const { apolloClient } = await import('./apollo-client');
    expect(apolloClient.defaultOptions.query?.fetchPolicy).toBe('cache-first');
  });

  it('should have defaultOptions configured', async () => {
    const { apolloClient } = await import('./apollo-client');
    expect(apolloClient.defaultOptions).toBeDefined();
    expect(apolloClient.defaultOptions.watchQuery).toBeDefined();
    expect(apolloClient.defaultOptions.query).toBeDefined();
  });
});
