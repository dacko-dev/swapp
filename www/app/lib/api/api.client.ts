import { GraphQLClient } from "graphql-request";
import { getSdk } from "~/graphql/generated";

function getClientSdkWithToken(token: string, GRAPHQL_ENDPOINT: string) {
  return getSdk(
    new GraphQLClient(GRAPHQL_ENDPOINT, {
      headers: {
        "x-hasura-role": "user",
        Authorization: `Bearer ${token}`,
      },
    })
  );
}

export { getClientSdkWithToken };
