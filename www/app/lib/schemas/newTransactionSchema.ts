import { z } from "zod";
import {
  refineNullableParams,
  refineNullableValidator,
  toArrayOfIntegersSchema,
  toBooleanSchema,
  toDateSchema,
  toFloatSchema,
  toIntegerSchema,
} from "./schemaHelpers";

export const newTransactionSchema = z.object({
  wantedItems: z
    .array(z.object({}))
    .or(
      z.string().refine((val) => {
        return val.endsWith("]") && val.startsWith("[");
      })
    )
    .optional(),
  shippingFromSameCountry: toBooleanSchema.optional(),
  // it is a string all the time thanks to how Multiselect components from Mantine handles values
  shippingFromCountriesIds: toArrayOfIntegersSchema.optional(),
  willPayExtra: toBooleanSchema.optional(),
  extraPayMaxAmount: toFloatSchema.optional(),
  willReceiveExtra: toBooleanSchema.optional(),
  extraReceiveMaxAmount: toFloatSchema.optional(),
  availableUntil: toDateSchema.optional(),
  currencyIdPayExtra: toIntegerSchema.refine(
    refineNullableValidator,
    refineNullableParams
  ),
  currencyIdReceiveExtra: toIntegerSchema.refine(
    refineNullableValidator,
    refineNullableParams
  ),
  willSwapForAnyItem: toBooleanSchema.refine(
    refineNullableValidator,
    refineNullableParams
  ),
});
