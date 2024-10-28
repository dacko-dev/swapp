import { useAuth } from "@clerk/remix";
import { UseFormReturnType } from "@mantine/form";
import axios from "axios";
import { useCallback, useMemo } from "react";
import { AutocompleteComboboxAsync } from "~/components/Inputs/AutocompleteComboboxAsync/AutocompleteComboboxAsync";
import { getClientSdkWithToken } from "~/lib/api/api.client";
import { TFormNewItem } from "~/lib/types";

// function getAsyncData(searchQuery: string, signal: AbortSignal) {
//   return new Promise<string[]>((resolve, reject) => {
//     signal.addEventListener("abort", () => {
//       reject(new Error("Request aborted"));
//     });

//     setTimeout(() => {
//       resolve(
//         MOCKDATA.filter((item) =>
//           item.toLowerCase().includes(searchQuery.toLowerCase())
//         ).slice(0, 5)
//       );
//     }, Math.random() * 1000);
//   });
// }

export default function CountryAutocompleteAsync({
  onSubmitOption,
  form,
}: {
  GRAPHQL_ENDPOINT: string;
  onSubmitOption: (optionValue: string) => void;
  form: UseFormReturnType<TFormNewItem>;
}) {
  // const user = useAuth();

  // const fetchCountries = useCallback(
  //   async (query: string, signal: AbortSignal) => {
  //     return new Promise<string[]>((resolve, reject) => {
  //       signal.addEventListener("abort", () => {
  //         reject(new Error("Request aborted"));
  //       });

  //       const result = axios.get(
  //         "https://restcountries.com/v3.1/name/" + query,
  //         {
  //           signal,
  //         }
  //       );
  //       resolve(result);
  //     });
  //   },
  //   []
  // );

  return (
    <AutocompleteComboboxAsync
      comboboxProps={{
        size: "md",
      }}
      textInputProps={{
        // ...form.getInputProps("shippingFromCountryName"),
        label: "Shipping From Country",
        placeholder: "Country of shipping",
        w: "100%",
        error: form.errors.shippingFromCountryId,
        name: "shippingFromCountryName",
        size: "md",
      }}
      getAsyncData={fetchCountries}
      onSubmitOption={onSubmitOption}
    />
  );
}
