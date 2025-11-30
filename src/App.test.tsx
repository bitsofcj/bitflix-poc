import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import App from './App';
import { GET_MOVIES_WITH_COUNT, GET_GENRES } from '@/lib/graphql-queries';

const mockMovies = {
  request: {
    query: GET_MOVIES_WITH_COUNT,
    variables: { pagination: { page: 1, perPage: 12 }, where: undefined },
  },
  result: {
    data: {
      movies: {
        nodes: [],
        pagination: {
          page: 1,
          perPage: 12,
          totalPages: 0,
          __typename: 'PaginationInfo',
        },
        __typename: 'MovieConnection',
      },
      totalCount: {
        pagination: {
          totalPages: 0,
          __typename: 'PaginationInfo',
        },
        __typename: 'MovieConnection',
      },
    },
  },
};

const mockGenres = {
  request: {
    query: GET_GENRES,
  },
  result: {
    data: {
      genres: {
        nodes: [],
        __typename: 'GenreConnection',
      },
    },
  },
};

describe('App', () => {
  it('should render the main app container', () => {
    render(
      <MockedProvider mocks={[mockMovies, mockGenres]}>
        <App />
      </MockedProvider>
    );

    const main = document.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('min-h-screen');
  });

  it('should render MovieBrowser component', () => {
    render(
      <MockedProvider mocks={[mockMovies, mockGenres]}>
        <App />
      </MockedProvider>
    );

    // MovieBrowser should render the logo
    expect(screen.getByAltText('BITFLIX')).toBeInTheDocument();
  });
});
