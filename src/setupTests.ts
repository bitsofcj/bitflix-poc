// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Suppress Apollo Client deprecation warnings in tests
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args: unknown[]) => {
    const message = args[0]?.toString() || '';

    // Suppress Apollo Client deprecation warnings
    if (
      message.includes('canonizeResults') ||
      message.includes('addTypename') ||
      message.includes('https://go.apollo.dev/c/err') ||
      message.includes('ReactDOMTestUtils.act') ||
      message.includes('React Router Future Flag Warning')
    ) {
      return;
    }

    originalWarn(...args);
  };

  console.error = (...args: unknown[]) => {
    const message = args[0]?.toString() || '';

    // Suppress ReactDOMTestUtils.act deprecation
    if (message.includes('ReactDOMTestUtils.act')) {
      return;
    }

    originalError(...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
