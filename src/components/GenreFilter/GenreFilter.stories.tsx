import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MockedProvider } from '@apollo/client/testing';
import GenreFilter from './GenreFilter';
import { GET_GENRES } from '@/lib/graphql-queries';

const meta: Meta<typeof GenreFilter> = {
  title: 'Components/GenreFilter',
  component: GenreFilter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onGenreChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GenreFilter>;

const mockGenres = [
  { id: '1', title: 'Action', __typename: 'Genre' as const },
  { id: '2', title: 'Comedy', __typename: 'Genre' as const },
  { id: '3', title: 'Drama', __typename: 'Genre' as const },
  { id: '4', title: 'Horror', __typename: 'Genre' as const },
  { id: '5', title: 'Sci-Fi', __typename: 'Genre' as const },
  { id: '6', title: 'Thriller', __typename: 'Genre' as const },
  { id: '7', title: 'Romance', __typename: 'Genre' as const },
  { id: '8', title: 'Animation', __typename: 'Genre' as const },
];

const genresMock = {
  request: {
    query: GET_GENRES,
  },
  result: {
    data: {
      genres: {
        nodes: mockGenres,
        __typename: 'GenreConnection' as const,
      },
    },
  },
};

const emptyGenresMock = {
  request: {
    query: GET_GENRES,
  },
  result: {
    data: {
      genres: {
        nodes: [],
        __typename: 'GenreConnection' as const,
      },
    },
  },
};

const errorGenresMock = {
  request: {
    query: GET_GENRES,
  },
  error: { message: 'Failed to load genres' } as globalThis.Error,
};

export const Default: Story = {
  args: {
    selectedGenre: 'all',
  },
  decorators: [
    (Story) => (
      <MockedProvider mocks={[genresMock]} addTypename={true}>
        <Story />
      </MockedProvider>
    ),
  ],
};

export const WithSelection: Story = {
  args: {
    selectedGenre: 'Action',
  },
  decorators: [
    (Story) => (
      <MockedProvider mocks={[genresMock]} addTypename={true}>
        <Story />
      </MockedProvider>
    ),
  ],
};

export const Loading: Story = {
  args: {
    selectedGenre: 'all',
  },
  decorators: [
    (Story) => (
      <MockedProvider mocks={[]} addTypename={true}>
        <Story />
      </MockedProvider>
    ),
  ],
};

export const Error: Story = {
  args: {
    selectedGenre: 'all',
  },
  decorators: [
    (Story) => (
      <MockedProvider mocks={[errorGenresMock]} addTypename={true}>
        <Story />
      </MockedProvider>
    ),
  ],
};

export const Empty: Story = {
  args: {
    selectedGenre: 'all',
  },
  decorators: [
    (Story) => (
      <MockedProvider mocks={[emptyGenresMock]} addTypename={true}>
        <Story />
      </MockedProvider>
    ),
  ],
};
