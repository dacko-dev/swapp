/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { SearchCountriesQuery } from "~/graphql/queries.client";

export function filterCountries(
  searchQuery: string,
  signal: AbortSignal,
  endpoint: string,
  authToken: string
) {
  return new Promise<any[]>((resolve, reject) => {
    signal.addEventListener("abort", () => {
      reject(new Error("Request aborted"));
    });

    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };

    const graphqlQuery = {
      operationName: "fetchAuthor",
      query: SearchCountriesQuery,
      variables: {
        limit: 5,
        query: `%${searchQuery}%`,
      },
    };

    const response = axios({
      method: "post",
      url: endpoint,
      headers,
      data: graphqlQuery,
      signal,
    });
    console.log("filterCountries response", response);
    resolve(response);
  });
}

// https://docs.locationiq.com/reference/autocomplete-2
export function autocompleteCities(
  query: string,
  locationiqAccessToken: string,
  countrycodes?: string[],
  limit?: number
) {
  {
    const countrycodesQuery = countrycodes
      ? `&countrycodes=${countrycodes.join(",")}`
      : "";
    return axios({
      method: "get",
      url: `https://api.locationiq.com/v1/autocomplete?key=${locationiqAccessToken}&q=${query}&tag=place:city${countrycodesQuery}`,
    });
  }
}
