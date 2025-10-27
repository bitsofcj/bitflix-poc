// GraphQL Types matching the API schema

export interface Genre {
  id: string;
  title: string;
}

export interface Movie {
  id: string;
  title: string;
  posterUrl: string | null;
  summary: string | null;
  duration: string | null;
  rating: string | null;
  ratingValue: number | null;
  datePublished: string | null;
  genres: Genre[];
  directors?: string[];
  mainActors?: string[];
  writers?: string[];
}

export interface Pagination {
  page: number;
  perPage: number;
  totalPages: number;
}

export interface MovieConnection {
  nodes: Movie[];
  pagination: Pagination;
}

export interface MoviesWithCountResult {
  movies: MovieConnection;
  totalCount: {
    pagination: {
      totalPages: number;
    };
  };
}

export interface GenreConnection {
  nodes: Genre[];
  pagination: Pagination;
}

export interface PaginationInput {
  page: number;
  perPage: number;
}

export interface MovieFilterInput {
  search?: string;
  genre?: string;
}
