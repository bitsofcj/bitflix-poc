import type { Meta, StoryObj } from '@storybook/react';
import MovieCard from './MovieCard';
import type { Movie } from '@/lib/graphql-types';

const meta: Meta<typeof MovieCard> = {
  title: 'Components/MovieCard',
  component: MovieCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '200px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MovieCard>;

const mockMovie: Movie = {
  id: '1',
  title: 'The Shawshank Redemption',
  summary:
    'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
  posterUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
  datePublished: '1994-09-23',
  duration: 'PT2H22M',
  rating: 'R',
  ratingValue: 9.3,
  genres: [
    { id: '1', title: 'Drama' },
    { id: '2', title: 'Crime' },
  ],
};

const mockMovieWithoutPoster: Movie = {
  ...mockMovie,
  posterUrl: null,
};

const mockMovieWithoutRating: Movie = {
  ...mockMovie,
  ratingValue: null,
};

const mockMovieLongTitle: Movie = {
  ...mockMovie,
  title:
    'The Lord of the Rings: The Fellowship of the Ring Extended Edition Director\'s Cut',
};

export const Default: Story = {
  args: {
    movie: mockMovie,
  },
};

export const WithoutPoster: Story = {
  args: {
    movie: mockMovieWithoutPoster,
  },
};

export const WithoutRating: Story = {
  args: {
    movie: mockMovieWithoutRating,
  },
};

export const LongTitle: Story = {
  args: {
    movie: mockMovieLongTitle,
  },
};

export const ShortSummary: Story = {
  args: {
    movie: {
      ...mockMovie,
      summary: 'A simple movie with a short summary.',
    },
  },
};
