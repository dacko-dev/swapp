import { ButtonProps } from "@mantine/core";
import { byteSizes, swapTypes } from "./constants";
import { SerializeFrom } from "@remix-run/node";
import {
  Color,
  GetCurrenciesQuery,
  GetItemFormDataQuery,
} from "~/graphql/generated";
export type TButtonPropsWithoutRef = ButtonProps &
  React.ComponentPropsWithoutRef<"button">;

// export type TSwapType = (typeof swapTypes)[number];
export type TSwapType = (typeof swapTypes)[number];

export type AddSwapFormValues = {
  name: string | undefined;
  category: string | undefined;
  images: string[] | undefined;
  tags: string[] | undefined;
  manufacturer: string | undefined;
  model: string | undefined;
  manufacturerDate: string | undefined;
  subcategory: string | undefined;
  description: string | undefined;
  condition: string | undefined;
  canPayExtra: boolean | undefined;
  extraPayAmount: string | undefined;
  mainColor: string | undefined;
  brand: string | undefined;
  size: string | undefined;
  additionalInfo: string | undefined;
  shippingFromCountry: string | undefined;
  shippingFromCity: string | undefined;
  shipping: string | undefined;
  swapFor: string | undefined;
  preferredSwapFor: string[] | undefined;
  availableUntil: string | undefined;
};

export type TColor = {
  name: string;
  hex: string;
};

export type TSelectColor = SerializeFrom<Color>;

export type TFormNewItem = {
  name: string;
  categoryId: string;
  subcategoryId: string;
  images: FileList | undefined; // undefined for default value, since FileList has no constructor
  tags: string[];
  manufacturer: string | undefined;
  model: string | undefined;
  description: string | undefined;
  conditionId: string;
  mainColorId: TSelectColor["id"] | undefined;
  brandId: string | undefined;
  sizeId: string | undefined;
  madeInCountryId: string | undefined;
  quickInfo: string;
  shippingFromCountryId: string | undefined;
  shippingFromCountryName: string | undefined;
  shippingFromCityId: string | undefined;
  shippingFromCityName: string | undefined;
  shippingFromStateId: string | undefined;
  shippingFromStateName: string | undefined;
  manufacturyDateYear: number | undefined;
  manufacturyDateMonth: number | undefined;
  manufacturyDateDay: number | undefined;
};

export type TFormNewSwapTransaction = {
  wantedItems: TFormNewItem[];
  shippingFromSameCountry: boolean | undefined;
  shippingFromCountriesIds: string[];
  willPayExtra: boolean;
  extraPayMaxAmount: string | undefined;
  swapOnlyForProvidedWantedItems: boolean;
  willReceiveExtra: boolean;
  extraReceiveMaxAmount: string | undefined;
  availableUntil: string | undefined;
  willSwapForAnyItem: boolean;
  currencyIdPayExtra: string | number; // number for default currency value
  currencyIdReceiveExtra: string | number; // number for default currency value
};

export type TSerializedItemFormData = SerializeFrom<GetItemFormDataQuery>;
export type TSerializedCurrencyData = SerializeFrom<GetCurrenciesQuery>;

export type TSelectOption = {
  label: string;
  value: string;
};

// from zod docs
export type RefineParams = {
  // override error message
  message?: string;

  // appended to error path
  path?: (string | number)[];

  // params object you can use to customize message
  // in error map
  params?: object;
};

export type TByteSize = (typeof byteSizes)[number];
