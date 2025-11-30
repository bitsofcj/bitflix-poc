import { render } from '@testing-library/react';
import RootLayout, { metadata } from './layout';

// Mock the ApolloWrapper component
jest.mock('@/components/ApolloWrapper', () => ({
  ApolloWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="apollo-wrapper">{children}</div>
  ),
}));

describe('RootLayout', () => {
  it('should render children within html and body tags', () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>
    );

    const html = container.querySelector('html');
    const body = container.querySelector('body');

    expect(html).toBeInTheDocument();
    expect(body).toBeInTheDocument();
  });

  it('should set lang attribute to "en" on html element', () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    const html = container.querySelector('html');
    expect(html).toHaveAttribute('lang', 'en');
  });

  it('should wrap children with ApolloWrapper', () => {
    const { getByTestId } = render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>
    );

    expect(getByTestId('apollo-wrapper')).toBeInTheDocument();
    expect(getByTestId('test-child')).toBeInTheDocument();
  });

  it('should render children content', () => {
    const { getByTestId } = render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>
    );

    expect(getByTestId('test-child')).toHaveTextContent('Test Content');
  });
});

describe('metadata', () => {
  it('should have correct title', () => {
    expect(metadata.title).toBe('BITFLIX | Movie Search App');
  });

  it('should have correct description', () => {
    expect(metadata.description).toBe('Search and discover movies with BITFLIX');
  });

  it('should have favicon icon configured', () => {
    expect(metadata.icons).toEqual({
      icon: '/favicon.png',
    });
  });
});
