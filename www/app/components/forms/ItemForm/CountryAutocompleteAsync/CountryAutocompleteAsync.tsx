import { useAuth } from "@clerk/remix";
import { UseFormReturnType } from "@mantine/form";
import React, { useCallback, useMemo } from "react";
import AutocompleteComboboxAsync from "~/components/inputs/AutocompleteComboboxAsync/AutocompleteComboboxAsync";
import { getClientSdkWithToken } from "~/lib/api/api.client";
import { TFormNewItem } from "~/lib/types";

function CountryAutocompleteAsync({
  GRAPHQL_ENDPOINT,
  onSubmitOption,
  form,
}: {
  GRAPHQL_ENDPOINT: string;
  onSubmitOption: (optionValue: string) => void;
  form: UseFormReturnType<TFormNewItem>;
}) {
  const auth = useAuth();
  const handleGetAsyncData = useCallback(
    async (searchQuery: string, signal: AbortSignal) => {
      const token = await auth.getToken({
        template: "swapp",
      });
      console.log("handleGetAsyncData token");
      if (!token) {
        return [];
      }
      const clientSdk = getClientSdkWithToken(token, GRAPHQL_ENDPOINT);
      const response = await clientSdk
        .SearchCountries({
          limit: 5,
          query: `%${searchQuery}%`,
        })
        .then((res) =>
          res.Country.map((country) => {
            return country.name;
          })
        );
      return new Promise<string[]>((resolve) => {
        console.log("handleGetAsyncData response", response);
        resolve(response);
      });
    },
    [auth, GRAPHQL_ENDPOINT]
  );

  return (
    <AutocompleteComboboxAsync
      comboboxProps={{
        size: "md",
      }}
      textInputProps={{
        // ...form.getInputProps("shippingFromCountryName"),
        label: "Shipping From Country",
        placeholder: "Search for a country",
        w: "100%",
        error: form.errors.shippingFromCountryId,
        name: "shippingFromCountryName",
        size: "md",
      }}
      getAsyncData={handleGetAsyncData}
      onSubmitOption={onSubmitOption}
    />
  );
}

export default React.memo(CountryAutocompleteAsync);
