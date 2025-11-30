import type { Meta, StoryObj } from '@storybook/react';
import MovieCard from './MovieCard';

const meta: Meta<typeof MovieCard> = {
  title: 'Components/MovieCard',
  component: MovieCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MovieCard>;

export const Default: Story = {
  args: {
    movie: {
      id: '1',
      title: 'Inception',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
      summary: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
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
        { id: '3', title: 'Thriller' },
      ],
    },
  },
};

export const NoPoster: Story = {
  args: {
    movie: {
      id: '2',
      title: 'The Matrix',
      posterUrl: null,
      summary: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
      duration: 'PT2H16M',
      rating: 'R',
      ratingValue: 8.7,
      datePublished: '1999-03-31T00:00:00.000Z',
      mainActors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
      directors: ['Lana Wachowski', 'Lilly Wachowski'],
      writers: ['Lana Wachowski', 'Lilly Wachowski'],
      genres: [
        { id: '1', title: 'Action' },
        { id: '2', title: 'Sci-Fi' },
      ],
    },
  },
};

export const NoSummary: Story = {
  args: {
    movie: {
      id: '3',
      title: 'Interstellar',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
      summary: null,
      duration: 'PT2H49M',
      rating: 'PG-13',
      ratingValue: 8.6,
      datePublished: '2014-11-07T00:00:00.000Z',
      mainActors: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
      directors: ['Christopher Nolan'],
      writers: ['Jonathan Nolan', 'Christopher Nolan'],
      genres: [
        { id: '1', title: 'Adventure' },
        { id: '2', title: 'Drama' },
        { id: '3', title: 'Sci-Fi' },
      ],
    },
  },
};

export const MinimalInfo: Story = {
  args: {
    movie: {
      id: '4',
      title: 'The Dark Knight',
      posterUrl: null,
      summary: null,
      duration: null,
      rating: null,
      ratingValue: null,
      datePublished: null,
      mainActors: [],
      directors: [],
      writers: [],
      genres: [{ id: '1', title: 'Action' }],
    },
  },
};

export const LongTitle: Story = {
  args: {
    movie: {
      id: '5',
      title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BZWI3ZTMxNjctMjdlNS00NmUwLWFiM2YtZDUyY2I3N2MxYTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
      summary: 'An insane American general orders a bombing attack on the Soviet Union, triggering a path to nuclear holocaust that a war room full of politicians and generals frantically tries to stop.',
      duration: 'PT1H35M',
      rating: 'PG',
      ratingValue: 8.4,
      datePublished: '1964-01-29T00:00:00.000Z',
      mainActors: ['Peter Sellers', 'George C. Scott', 'Sterling Hayden'],
      directors: ['Stanley Kubrick'],
      writers: ['Stanley Kubrick', 'Terry Southern', 'Peter George'],
      genres: [{ id: '1', title: 'Comedy' }],
    },
  },
};
