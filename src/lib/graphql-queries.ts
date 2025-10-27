import { gql } from '@apollo/client';

export const GET_MOVIES_WITH_COUNT = gql`
  query GetMoviesWithCount(
    $pagination: PaginationInput!
    $where: MovieFilterInput
  ) {
    movies(pagination: $pagination, where: $where) {
      nodes {
        id
        title
        posterUrl
        summary
        duration
        rating
        ratingValue
        datePublished
        mainActors
        directors
        writers
        genres {
          id
          title
        }
      }
      pagination {
        page
        perPage
        totalPages
      }
    }
    totalCount: movies(pagination: { page: 1, perPage: 1 }, where: $where) {
      pagination {
        totalPages
      }
    }
  }
`;

export const GET_GENRES = gql`
  query GetGenres {
    genres {
      nodes {
        id
        title
      }
    }
  }
`;
