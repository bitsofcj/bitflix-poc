'use client';

import { useQuery } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { GET_GENRES } from '@/lib/graphql-queries';
import type { GenreConnection } from '@/lib/graphql-types';

interface GenreFilterProps {
  selectedGenre: string;
  // eslint-disable-next-line no-unused-vars
  onGenreChange: (genre: string) => void;
}

export default function GenreFilter({
  selectedGenre,
  onGenreChange,
}: GenreFilterProps) {
  const { loading, error, data } = useQuery<{ genres: GenreConnection }>(
    GET_GENRES
  );

  const genres = data?.genres.nodes || [];

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">Filter by Genre</h2>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading genres...</p>
      ) : error ? (
        <p className="text-sm text-destructive">Failed to load genres</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedGenre === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onGenreChange('all')}
            className={
              selectedGenre === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'border-border text-foreground hover:bg-secondary'
            }
          >
            All
          </Button>
          {genres.map((genre) => (
            <Button
              key={genre.id}
              variant={selectedGenre === genre.title ? 'default' : 'outline'}
              size="sm"
              onClick={() => onGenreChange(genre.title)}
              className={
                selectedGenre === genre.title
                  ? 'bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:bg-secondary'
              }
            >
              {genre.title}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
