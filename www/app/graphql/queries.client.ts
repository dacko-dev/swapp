import { gql } from "graphql-tag";

const GRAPHQL_ENDPOINT = window.ENV.GRAPHQL_ENDPOINT;

// Look in the AppData.graphql file for SearchCountries query
// query like below is needed for client side queries
export const SearchCountriesQuery = gql`
  {
    Country(
      limit: $limit
      order_by: { name: asc }
      where: { name: { _ilike: $query } }
    ) {
      id
      name
    }
  }
`;
