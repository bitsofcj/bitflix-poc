import { render } from '@testing-library/react';
import { ApolloWrapper } from './ApolloWrapper';
import { ApolloProvider } from '@apollo/client';

// Mock apollo-client module
jest.mock('@/lib/apollo-client', () => ({
  apolloClient: {
    cache: {},
    link: {},
    defaultOptions: {},
  },
}));

// Mock ApolloProvider
jest.mock('@apollo/client', () => ({
  ApolloProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="apollo-provider">{children}</div>
  ),
}));

describe('ApolloWrapper', () => {
  it('should render children', () => {
    const { getByText } = render(
      <ApolloWrapper>
        <div>Test Child</div>
      </ApolloWrapper>
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('should wrap children with ApolloProvider', () => {
    const { getByTestId } = render(
      <ApolloWrapper>
        <div>Test Child</div>
      </ApolloWrapper>
    );

    expect(getByTestId('apollo-provider')).toBeInTheDocument();
  });

  it('should render multiple children', () => {
    const { getByText } = render(
      <ApolloWrapper>
        <div>Child 1</div>
        <div>Child 2</div>
      </ApolloWrapper>
    );

    expect(getByText('Child 1')).toBeInTheDocument();
    expect(getByText('Child 2')).toBeInTheDocument();
  });
});
