/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FeatureCollection } from "geojson";
import {
  ComboboxProps,
  InputBaseProps,
  PolymorphicComponentProps,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect, useState } from "react";
import useDebounce from "~/hooks/useDebounce";
import { autocompleteGeolocationSearch } from "~/lib/autocomplete_geo";
import { AutocompleteCombobox } from "../AutocompleteCombobox/AutocompleteCombobox";
import { City } from "~/graphql/generated";
import { SerializeFrom } from "@remix-run/node";

// TODO: Fix fetching autocomplete after selecting a city
// TODO: Add loading spinner while fetching autocomplete

export default function CityAutocomplete({
  form,
  selectedCountry,
  geoapifyApkiKey,
  comboboxProps,
  inputProps,
  cities,
}: {
  form: UseFormReturnType<any>;
  selectedCountry: string | undefined;
  geoapifyApkiKey: string;
  comboboxProps?: ComboboxProps;
  inputProps?: PolymorphicComponentProps<"input", InputBaseProps>;
  cities: SerializeFrom<City>[];
}) {
  const [searchResults, setSearchResults] = useState<
    FeatureCollection | undefined
  >(undefined);

  const [inputValue, setInputValue] = useState<string | undefined>(
    form.getValues().shippingFromCityId
  );

  const debouncedInputValue = useDebounce(inputValue, 500);

  const options = Array.from(
    new Set(
      searchResults?.features
        .map((item) => item.properties?.city)
        .filter((city): city is string => typeof city === "string")
    )
  );

  useEffect(() => {
    if (!debouncedInputValue || !selectedCountry || !geoapifyApkiKey) {
      return;
    }
    console.log("country: ", selectedCountry);
    console.log("type of country: ", typeof selectedCountry);
    autocompleteGeolocationSearch({
      apiKey: geoapifyApkiKey,
      query: String(debouncedInputValue),
      countryCode: selectedCountry,
      isCity: true,
    }).then((results) => {
      setSearchResults(results);
      console.log("search results: ", results);
    });
    return () => {};
  }, [debouncedInputValue, selectedCountry, geoapifyApkiKey]);

  return (
    <AutocompleteCombobox
      // {...form.getInputProps("shippingFromCityId")}
      comboboxProps={comboboxProps}
      inputProps={inputProps}
      options={options}
      value={inputValue}
      setValue={(val) => {
        console.log("setting city val: ", val);
        form.setFieldValue("shippingFromCityName", val);
        const cityId = cities.find((city) => city.name === val)?.id;
        form.setFieldValue("shippingFromCityId", cityId);
        setInputValue(val ? val : "");
      }}
      customSearch={inputValue}
      customSetSearch={setInputValue}
    />
  );
}
