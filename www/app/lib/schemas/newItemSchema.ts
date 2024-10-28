/* eslint-disable no-prototype-builtins */
import { z } from "zod";
import {
  // acceptedImagesTypes,
  MAX_ITEM_IMAGES,
  MAX_ITEM_IMAGES_SIZE_BYTES,
} from "../constants";
import {
  refineNullableParams,
  refineNullableValidator,
  toIntegerSchema,
} from "./schemaHelpers";

export const newItemSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(3, { message: "Name is too short" }),
  categoryId: toIntegerSchema.refine(
    refineNullableValidator,
    refineNullableParams
  ),
  subcategoryId: toIntegerSchema.refine(
    refineNullableValidator,
    refineNullableParams
  ),

  // IMPORTANT: this schema is valid on the client side, since images on the server are of type NodeOnDiskFile,
  // which cannot be imported on the client side, since it uses process from Node.js. For server side use nodeItemImagesSchema
  images: z
    .any()
    .transform((value) => {
      if (!value) {
        return null;
      }
      if (typeof FileList !== "undefined" && value instanceof FileList) {
        return Array.from(value);
      }

      if (Array.isArray(value) && value.every((file) => file instanceof File)) {
        return value;
      }

      if (
        typeof value === "object" &&
        value.prototype &&
        value.hasOwnProperty("name") &&
        value.hasOwnProperty("type") &&
        value.hasOwnProperty("lastModified")
      ) {
        // NodeOnDiskFile
        return [value] as File[];
      }
    })
    .superRefine((files, ctx) => {
      if (!files) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please attach at least one image",
          fatal: true,
        });
        return;
      }
      if (files.length === 0 || files.length > MAX_ITEM_IMAGES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please attach at least one image",
          fatal: true,
        });
        return;
      }
      const imagesSize = files.reduce((acc, file) => {
        return acc + file.size;
      }, 0);
      if (imagesSize > MAX_ITEM_IMAGES_SIZE_BYTES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Images exceed the size limit",
          fatal: true,
        });
        return;
      }
      return true;
    }),

  // TODO: check this
  tags: z.union([z.array(z.string()), z.string()]).transform((value) => {
    if (typeof value === "string") {
      if (value === "") {
        return [];
      } else if (value.startsWith("[") && value.endsWith("]")) {
        const parsedValue = JSON.parse(value);
        if (Array.isArray(parsedValue)) {
          return parsedValue;
        } else {
          return [value];
        }
      } else if (value.includes(",")) {
        return value.split(",").map((tag) => tag.trim());
      } else {
        return [value];
      }
    }
    return value;
  }),
  model: z.string().optional(),
  manufacturyDateYear: toIntegerSchema.optional(),
  manufacturyDateMonth: toIntegerSchema.optional(),
  manufacturyDateDay: toIntegerSchema.optional(),
  description: z.string().optional(),
  conditionId: toIntegerSchema.refine(
    refineNullableValidator,
    refineNullableParams
  ),
  mainColorId: toIntegerSchema.optional(),
  brandId: toIntegerSchema.optional(),
  sizeId: toIntegerSchema.optional(),
  madeInCountryId: toIntegerSchema.optional(),
  shippingFromCountryId: toIntegerSchema.refine(
    refineNullableValidator,
    refineNullableParams
  ),
  // City ID doesnt have to be required because it doesnt have to be in the db, if its not in the db it will be added by name
  shippingFromCityId: toIntegerSchema.optional(),
  // City name is required because it will be added to the db if there is no ID
  shippingFromCityName: z
    .string({
      message: "City is required",
    })
    .min(2, { message: "City is too short" }),
  shippingFromStateId: toIntegerSchema.optional(),
  quickInfo: z
    .string({ message: "Please provide a quick info" })
    .min(3, { message: "Quick info is too short" }),
});
