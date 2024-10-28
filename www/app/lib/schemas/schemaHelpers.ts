import { z } from "zod";
import { RefineParams } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const refineNullableValidator: <T>(data: T) => any = (data) => {
  return data !== null;
};

export const refineNullableParams: RefineParams = {
  message: "Invalid value",
};

export const toIntegerSchema = z
  .union([z.number(), z.string()])
  .transform((value) => {
    if (typeof value === "string") {
      if (value === "") {
        return null;
      }
      // return parseInt(value, 10);
      const parsedValue = parseInt(value, 10);
      if (Number.isNaN(parsedValue) || !Number.isFinite(parsedValue)) {
        return null;
      }
      return parsedValue;
    }
    return value;
  });

export const toFloatSchema = z
  .union([z.number(), z.string()])
  .transform((value) => {
    if (typeof value === "string") {
      if (value === "") {
        return null;
      }
      const parsedValue = parseFloat(value);
      if (Number.isNaN(parsedValue) || !Number.isFinite(parsedValue)) {
        return null;
      }
      return parsedValue;
    }
    return value;
  });

export const toBooleanSchema = z
  .union([z.boolean(), z.string()])
  .transform((value) => {
    if (typeof value === "boolean") {
      return value;
    }
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
    return false;
  });

export const toArrayOfStringsSchema = z
  .union([z.array(z.string()), z.string(), z.number()])
  .transform((value) => {
    if (typeof value === "string") {
      if (value === "") {
        return [];
      }
      if (value.includes(",")) {
        return value.split(",");
      }

      if (value.startsWith("[") && value.endsWith("]")) {
        const parsedValue = JSON.parse(value);
        if (Array.isArray(parsedValue)) {
          return parsedValue;
        } else {
          null;
        }
      }
      return [value];
    }
    if (typeof value === "number") {
      return [value.toString()];
    }
    return value;
  });

export const toArrayOfIntegersSchema = z
  .union([z.array(z.number()), z.number(), z.string()])
  .transform((value) => {
    if (typeof value === "string") {
      if (value === "") {
        return [];
      }
      if (value.includes(",")) {
        return value.split(",").map((val) => parseInt(val, 10));
      }

      if (value.startsWith("[") && value.endsWith("]")) {
        const parsedValue = JSON.parse(value);
        if (Array.isArray(parsedValue)) {
          return parsedValue.map((val) => parseInt(val, 10));
        }
      } else {
        return null;
      }
      return [parseInt(value, 10)];
    }

    if (typeof value === "number") {
      return [value];
    }
    return value;
  });
export const toDateSchema = z
  .union([z.date(), z.string()])
  .transform((value) => {
    if (typeof value === "string") {
      // Try to parse the string into a Date
      const parsedDate = new Date(value);
      if (isNaN(parsedDate.getTime())) {
        // If the parsed date is invalid, throw an error
        return null;
      }
      return parsedDate;
    }
    return value;
  });
