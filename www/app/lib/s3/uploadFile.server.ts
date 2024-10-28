import { NodeOnDiskFile } from "@remix-run/node";
import { generateImageName } from "../utils";
import { ServerS3Client } from "./client.server";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadImageFileToS3Bucket({
  imageFile,
}: {
  imageFile: NodeOnDiskFile;
}) {
  const bucketName = process.env.S3_BUCKET_NAME_ITEM_IMAGES;
  if (!bucketName) {
    throw new Error("S3_BUCKET_NAME_ITEM_IMAGES is not defined");
  }

  const newImageName = generateImageName(imageFile.type);

  // Create a buffer from the image file
  const arrayBuffer = await imageFile.arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);

  // Upload the image to S3
  try {
    await ServerS3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newImageName,
        // body must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-l an Array-like Object
        Body: imageBuffer,
        ContentType: imageFile.type,
      })
    );
  } catch (error) {
    throw new Error("Internal server error");
    // TODO: delete any uploaded images here
  }
  return newImageName;
}
