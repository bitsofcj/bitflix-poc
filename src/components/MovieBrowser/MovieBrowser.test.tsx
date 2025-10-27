import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import MovieBrowser from './MovieBrowser';
import { GET_MOVIES_WITH_COUNT, GET_GENRES } from '@/lib/graphql-queries';

const mockMovies = [
  {
    id: '1',
    title: 'Inception',
    posterUrl: 'https://example.com/inception.jpg',
    summary: 'A thief who steals corporate secrets.',
    duration: 'PT2H28M',
    rating: 'PG-13',
    ratingValue: 8.8,
    datePublished: '2010-07-16T00:00:00.000Z',
    mainActors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    directors: ['Christopher Nolan'],
    writers: ['Christopher Nolan'],
    genres: [{ id: '1', title: 'Action', __typename: 'Genre' }],
    __typename: 'Movie',
  },
  {
    id: '2',
    title: 'The Matrix',
    posterUrl: 'https://example.com/matrix.jpg',
    summary: 'A computer hacker learns about reality.',
    duration: 'PT2H16M',
    rating: 'R',
    ratingValue: 8.7,
    datePublished: '1999-03-31T00:00:00.000Z',
    mainActors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    directors: ['Lana Wachowski', 'Lilly Wachowski'],
    writers: ['Lana Wachowski', 'Lilly Wachowski'],
    genres: [{ id: '1', title: 'Action', __typename: 'Genre' }],
    __typename: 'Movie',
  },
];

const mockGenres = [
  { id: '1', title: 'Action', __typename: 'Genre' },
  { id: '2', title: 'Comedy', __typename: 'Genre' },
];

const createMoviesMock = (variables: any) => ({
  request: {
    query: GET_MOVIES_WITH_COUNT,
    variables,
  },
  result: {
    data: {
      movies: {
        nodes: mockMovies,
        pagination: {
          page: 1,
          perPage: 12,
          totalPages: 5,
          __typename: 'PaginationInfo',
        },
        __typename: 'MovieConnection',
      },
      totalCount: {
        pagination: {
          totalPages: 50,
          __typename: 'PaginationInfo',
        },
        __typename: 'MovieConnection',
      },
    },
  },
});

const genresMock = {
  request: {
    query: GET_GENRES,
  },
  result: {
    data: {
      genres: {
        nodes: mockGenres,
        __typename: 'GenreConnection',
      },
    },
  },
};

describe('MovieBrowser Integration Test', () => {
  it('should render header with logo', async () => {
    const mocks = [
      createMoviesMock({
        pagination: { page: 1, perPage: 12 },
        where: undefined,
      }),
      genresMock,
    ];

    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <MovieBrowser />
        </MemoryRouter>
      </MockedProvider>
    );

    const logo = screen.getByAltText('BITFLIX');
    expect(logo).toBeInTheDocument();
  });

  it('should render search input', async () => {
    const mocks = [
      createMoviesMock({
        pagination: { page: 1, perPage: 12 },
        where: undefined,
      }),
      genresMock,
    ];

    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <MovieBrowser />
        </MemoryRouter>
      </MockedProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search movies...');
    expect(searchInput).toBeInTheDocument();
  });

  it('should render movies after loading', async () => {
    const mocks = [
      createMoviesMock({
        pagination: { page: 1, perPage: 12 },
        where: undefined,
      }),
      genresMock,
    ];

    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <MovieBrowser />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
      expect(screen.getByText('The Matrix')).toBeInTheDocument();
    });
  });

  it('should display total count of movies', async () => {
    const mocks = [
      createMoviesMock({
        pagination: { page: 1, perPage: 12 },
        where: undefined,
      }),
      genresMock,
    ];

    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <MovieBrowser />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Found/)).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText(/movies/)).toBeInTheDocument();
    });
  });

  it('should render genre filter component', async () => {
    const mocks = [
      createMoviesMock({
        pagination: { page: 1, perPage: 12 },
        where: undefined,
      }),
      genresMock,
    ];

    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <MovieBrowser />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Filter by Genre')).toBeInTheDocument();
    });
  });

  it('should render pagination when there are multiple pages', async () => {
    const mocks = [
      createMoviesMock({
        pagination: { page: 1, perPage: 12 },
        where: undefined,
      }),
      genresMock,
    ];

    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <MovieBrowser />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /previous/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });
  });

  it('should update search query when typing', async () => {
    const mocks = [
      createMoviesMock({
        pagination: { page: 1, perPage: 12 },
        where: undefined,
      }),
      createMoviesMock({
        pagination: { page: 1, perPage: 12 },
        where: { search: 'Inception' },
      }),
      genresMock,
    ];

    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <MovieBrowser />
        </MemoryRouter>
      </MockedProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search movies...');
    fireEvent.change(searchInput, { target: { value: 'Inception' } });

    expect(searchInput).toHaveValue('Inception');
  });

  it('should show loading state initially', () => {
    const mocks = [
      createMoviesMock({
        pagination: { page: 1, perPage: 12 },
        where: undefined,
      }),
      genresMock,
    ];

    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <MovieBrowser />
        </MemoryRouter>
      </MockedProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show no movies found when result is empty', async () => {
    const emptyMock = {
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

    render(
      <MockedProvider mocks={[emptyMock, genresMock]}>
        <MemoryRouter>
          <MovieBrowser />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No movies found')).toBeInTheDocument();
    });
  });

  it('should display error message on fetch failure', async () => {
    const errorMock = {
      request: {
        query: GET_MOVIES_WITH_COUNT,
        variables: { pagination: { page: 1, perPage: 12 }, where: undefined },
      },
      error: new Error('Network error'),
    };

    render(
      <MockedProvider mocks={[errorMock, genresMock]}>
        <MemoryRouter>
          <MovieBrowser />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading movies/)).toBeInTheDocument();
    });
  });
});
