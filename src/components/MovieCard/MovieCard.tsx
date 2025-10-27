import { useState } from 'react';
import { Clock, Star, Play, Clapperboard, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Movie } from '@/lib/graphql-types';
import { getYear, formatDuration } from '@/lib/helpers';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);

  // Generate YouTube search URL with year
  const year = getYear(movie.datePublished);
  const searchQuery =
    year !== 'N/A'
      ? `${movie.title} ${year} Official Trailer`
      : `${movie.title} Official Trailer`;
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    searchQuery
  )}`;

  return (
    <Card className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 cursor-pointer">
      <a
        href={youtubeSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative aspect-[2/3] overflow-hidden bg-secondary">
          {!imageError && movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-50 group-hover:blur-sm transition-all duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span className="text-4xl">🎬</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 flex items-center justify-center -translate-y-8">
              <div className="bg-purple-600 rounded-full p-2 shadow-lg">
                <Play className="h-4 w-4 text-white fill-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
              <p className="text-xs text-foreground line-clamp-4 leading-relaxed drop-shadow-lg">
                {movie.summary || 'No summary available'}
              </p>
              <div className="flex flex-wrap gap-1">
                {movie.genres.slice(0, 2).map((genre) => (
                  <Badge
                    key={genre.id}
                    variant="secondary"
                    className="text-xs bg-secondary/80"
                  >
                    {genre.title}
                  </Badge>
                ))}
              </div>
              {(movie.directors?.length || movie.mainActors?.length) && (
                <div className="space-y-1 text-xs text-foreground/90 drop-shadow-lg">
                  {movie.directors && movie.directors.length > 0 && (
                    <div className="flex items-start gap-1.5">
                      <Clapperboard className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {movie.directors.slice(0, 1).join(', ')}
                      </span>
                    </div>
                  )}
                  {movie.mainActors && movie.mainActors.length > 0 && (
                    <div className="flex items-start gap-1.5">
                      <Users className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {movie.mainActors.slice(0, 3).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {movie.ratingValue !== null && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span className="text-xs font-semibold text-foreground">
                {movie.ratingValue.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 space-y-1">
          <h3 className="font-semibold text-sm line-clamp-1 text-foreground">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{getYear(movie.datePublished)}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(movie.duration)}</span>
            </div>
          </div>
        </div>
      </a>
    </Card>
  );
}
