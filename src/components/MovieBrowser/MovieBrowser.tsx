import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MovieCard from '@/components/MovieCard';
import GenreFilter from '@/components/GenreFilter';
import Pagination from '@/components/Pagination';
import { GET_MOVIES_WITH_COUNT } from '@/lib/graphql-queries';
import type {
  MoviesWithCountResult,
  MovieFilterInput,
  PaginationInput,
} from '@/lib/graphql-types';

// eslint-disable-next-line no-undef
const ITEMS_PER_PAGE = parseInt(process.env.REACT_APP_ITEMS_PER_PAGE || '12', 10);

export default function MovieBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Build filter input
  const filterInput: MovieFilterInput = {};
  if (searchQuery) {
    filterInput.search = searchQuery;
  }
  if (selectedGenre !== 'all') {
    filterInput.genre = selectedGenre;
  }

  // Build pagination input
  const paginationInput: PaginationInput = {
    page: currentPage,
    perPage: ITEMS_PER_PAGE,
  };

  // Query movies from GraphQL (combines movie list + exact count in one request)
  const { loading, error, data } = useQuery<MoviesWithCountResult>(
    GET_MOVIES_WITH_COUNT,
    {
      variables: {
        pagination: paginationInput,
        where: Object.keys(filterInput).length > 0 ? filterInput : undefined,
      },
    }
  );

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre]);

  const movies = data?.movies.nodes || [];
  const totalPages = data?.movies.pagination.totalPages || 0;
  const totalCount = data?.totalCount.pagination.totalPages || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <img src="./BITFLIXLogo.png" alt="BITFLIX" className="h-8" />
            <div className="flex items-center gap-4 flex-1 max-w-2xl mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Genre Filter */}
        <div className="mb-8">
          <GenreFilter
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : error ? (
            <p className="text-destructive">
              Error loading movies: {error.message}
            </p>
          ) : (
            <p className="text-muted-foreground">
              Found{' '}
              <span className="text-foreground font-semibold">
                {totalCount}
              </span>{' '}
              {totalCount === 1 ? 'movie' : 'movies'}
              {searchQuery && <span> for &quot;{searchQuery}&quot;</span>}
              {selectedGenre !== 'all' && <span> in {selectedGenre}</span>}
            </p>
          )}
        </div>

        {/* Movie Grid */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Loading movies...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive text-lg">Failed to load movies</p>
            <p className="text-muted-foreground text-sm mt-2">
              {error.message}
            </p>
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No movies found</p>
            <p className="text-muted-foreground text-sm mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
