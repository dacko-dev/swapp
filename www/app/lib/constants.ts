export const swapTypes = ["swap", "passOn", "seeking"] as const;
export const acceptedImagesTypes = [
  "image/png",
  "image/gif",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];
export const MAX_SWAP_FOR_ITEMS = 3;
export const MAX_ITEM_IMAGES = 10;
export const MAX_ITEM_IMAGES_SIZE_BYTES = 5_242_880; // 5MB
export const byteSizes = ["B", "KB", "MB", "GB", "TB"] as const;
