import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import GenreFilter from './GenreFilter';
import { GET_GENRES } from '@/lib/graphql-queries';

const mockGenres = [
  { id: '1', title: 'Action', __typename: 'Genre' },
  { id: '2', title: 'Comedy', __typename: 'Genre' },
  { id: '3', title: 'Drama', __typename: 'Genre' },
];

const mocks = [
  {
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
  },
];

const errorMock = [
  {
    request: {
      query: GET_GENRES,
    },
    error: new Error('Failed to fetch genres'),
  },
];

describe('GenreFilter', () => {
  const mockOnGenreChange = jest.fn();

  beforeEach(() => {
    mockOnGenreChange.mockClear();
  });

  it('should render loading state initially', () => {
    render(
      <MockedProvider mocks={mocks}>
        <GenreFilter selectedGenre="all" onGenreChange={mockOnGenreChange} />
      </MockedProvider>
    );
    expect(screen.getByText('Loading genres...')).toBeInTheDocument();
  });

  it('should render genres after loading', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <GenreFilter selectedGenre="all" onGenreChange={mockOnGenreChange} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Action' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Comedy' })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Drama' })).toBeInTheDocument();
    });
  });

  it('should render "All" button', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <GenreFilter selectedGenre="all" onGenreChange={mockOnGenreChange} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    });
  });

  it('should call onGenreChange when clicking All', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <GenreFilter
          selectedGenre="Action"
          onGenreChange={mockOnGenreChange}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    });

    const allButton = screen.getByRole('button', { name: 'All' });
    fireEvent.click(allButton);
    expect(mockOnGenreChange).toHaveBeenCalledWith('all');
  });

  it('should call onGenreChange when clicking genre', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <GenreFilter selectedGenre="all" onGenreChange={mockOnGenreChange} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Action' })
      ).toBeInTheDocument();
    });

    const actionButton = screen.getByRole('button', { name: 'Action' });
    fireEvent.click(actionButton);
    expect(mockOnGenreChange).toHaveBeenCalledWith('Action');
  });

  it('should highlight selected genre', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <GenreFilter
          selectedGenre="Action"
          onGenreChange={mockOnGenreChange}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Action' })
      ).toBeInTheDocument();
    });

    const actionButton = screen.getByRole('button', { name: 'Action' });
    expect(actionButton).toHaveClass('bg-primary');
  });

  it('should highlight All when selectedGenre is "all"', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <GenreFilter selectedGenre="all" onGenreChange={mockOnGenreChange} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    });

    const allButton = screen.getByRole('button', { name: 'All' });
    expect(allButton).toHaveClass('bg-primary');
  });

  it('should render error state on fetch failure', async () => {
    render(
      <MockedProvider mocks={errorMock}>
        <GenreFilter selectedGenre="all" onGenreChange={mockOnGenreChange} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load genres')).toBeInTheDocument();
    });
  });

  it('should render filter heading', () => {
    render(
      <MockedProvider mocks={mocks}>
        <GenreFilter selectedGenre="all" onGenreChange={mockOnGenreChange} />
      </MockedProvider>
    );
    expect(screen.getByText('Filter by Genre')).toBeInTheDocument();
  });
});
