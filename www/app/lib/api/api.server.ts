import { getSdk } from "~/graphql/generated";
import { GraphQLClient } from "graphql-request";

const { HASURA_ADMIN_SECRET, GRAPHQL_ENDPOINT } = process.env;

if (!GRAPHQL_ENDPOINT) {
  throw new Error("GRAPHQL_ENDPOINT is not set");
}
if (!HASURA_ADMIN_SECRET) {
  throw new Error("HASURA_ADMIN_SECRET is not set");
}

const AdminSdk = getSdk(
  new GraphQLClient(GRAPHQL_ENDPOINT!, {
    headers: {
      "x-hasura-role": "admin",
      "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
    },
  })
);

const AnonymousUserSdk = getSdk(
  new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: {
      "x-hasura-role": "user",
    },
  })
);

function getServerSdkWithToken(token: string) {
  return getSdk(
    new GraphQLClient(GRAPHQL_ENDPOINT!, {
      headers: {
        "x-hasura-role": "user",
        Authorization: `Bearer ${token}`,
      },
    })
  );
}

export { AdminSdk, AnonymousUserSdk, getServerSdkWithToken };
