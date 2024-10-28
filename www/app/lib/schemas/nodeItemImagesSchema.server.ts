import { NodeOnDiskFile } from "@remix-run/node";
import { z } from "zod";
import { MAX_ITEM_IMAGES, MAX_ITEM_IMAGES_SIZE_BYTES } from "../constants";

export const nodeItemImagesSchema = z
  .any()
  .transform((value) => {
    console.log("value node images: ", value);
    if (!value) {
      return null;
    }
    if (typeof FileList !== "undefined" && value instanceof FileList) {
      return Array.from(value);
    }

    if (Array.isArray(value) && value.every((file) => file instanceof File)) {
      return value;
    }
    if (value instanceof NodeOnDiskFile) {
      return [value];
    }
    if (
      Array.isArray(value) &&
      value.every((file) => file instanceof NodeOnDiskFile)
    ) {
      return value;
    }

    return null;
  })
  .superRefine((files, ctx) => {
    if (!files) {
      console.log("files: ", files);
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
  });
