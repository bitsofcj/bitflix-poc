import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from './MovieCard';
import type { Movie } from '@/lib/graphql-types';

const mockMovie: Movie = {
  id: '1',
  title: 'Inception',
  posterUrl: 'https://example.com/inception.jpg',
  summary:
    'A thief who steals corporate secrets through dream-sharing technology.',
  duration: 'PT2H28M',
  rating: 'PG-13',
  ratingValue: 8.8,
  datePublished: '2010-07-16T00:00:00.000Z',
  mainActors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
  directors: ['Christopher Nolan'],
  writers: ['Christopher Nolan'],
  genres: [
    { id: '1', title: 'Action' },
    { id: '2', title: 'Sci-Fi' },
  ],
};

const mockMovieMinimal: Movie = {
  id: '2',
  title: 'Test Movie',
  posterUrl: null,
  summary: null,
  duration: null,
  rating: null,
  ratingValue: null,
  datePublished: null,
  genres: [],
};

describe('MovieCard', () => {
  it('should render movie title', () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });

  it('should render movie year', () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText('2010')).toBeInTheDocument();
  });

  it('should render formatted duration', () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText('2h 28m')).toBeInTheDocument();
  });

  it('should render rating value', () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText('8.8')).toBeInTheDocument();
  });

  it('should render genres', () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
  });

  it('should render summary on hover area', () => {
    render(<MovieCard movie={mockMovie} />);
    expect(
      screen.getByText(/A thief who steals corporate secrets/)
    ).toBeInTheDocument();
  });

  it('should have YouTube search link with title and year', () => {
    const { container } = render(<MovieCard movie={mockMovie} />);
    const link = container.querySelector('a');
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('youtube.com/results?search_query=')
    );
    expect(link?.href).toContain('Inception');
    expect(link?.href).toContain('2010');
  });

  it('should handle missing poster image', () => {
    render(<MovieCard movie={mockMovieMinimal} />);
    expect(screen.getByText('🎬')).toBeInTheDocument();
  });

  it('should show fallback when image fails to load', () => {
    const { container } = render(<MovieCard movie={mockMovie} />);

    const img = container.querySelector('img');

    // Simulate image load error
    if (img) {
      fireEvent.error(img);
    }

    // After error, should show fallback emoji
    expect(screen.getByText('🎬')).toBeInTheDocument();
  });

  it('should handle null duration', () => {
    render(<MovieCard movie={mockMovieMinimal} />);
    // Check for N/A in duration context (there may be multiple N/A on the page)
    expect(screen.getAllByText('N/A').length).toBeGreaterThan(0);
  });

  it('should not render rating when null', () => {
    render(<MovieCard movie={mockMovieMinimal} />);
    // Star icon should not be present
    const ratingElements = screen.queryByText(/\d\.\d/);
    expect(ratingElements).not.toBeInTheDocument();
  });

  it('should render play button icon', () => {
    const { container } = render(<MovieCard movie={mockMovie} />);
    // Check for play icon by class or SVG presence
    const playButton = container.querySelector('.bg-purple-600');
    expect(playButton).toBeInTheDocument();
  });

  it('should open YouTube link in new tab', () => {
    const { container } = render(<MovieCard movie={mockMovie} />);
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
