/* eslint-disable @typescript-eslint/no-unused-vars */
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getAuth } from "@clerk/remix/ssr.server";
import { useForm, UseFormReturnType } from "@mantine/form";
import {
  ActionFunctionArgs,
  NodeOnDiskFile,
  LoaderFunctionArgs,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  json,
} from "@remix-run/node";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { AddSwapFormStepOne } from "~/components/forms/AddSwap/AddSwapFormStepOne";
import { AddSwapFormStepTwo } from "~/components/forms/AddSwap/AddSwapFormStepTwo";
import { FormButtons } from "~/components/forms/FormButtons/FormButtons";

import { AdminSdk, getServerSdkWithToken } from "~/lib/api/api.server";
import { clerkClient } from "~/lib/clerkClient.server";
import { ServerS3Client } from "~/lib/s3/client.server";
import { TFormNewItem, TFormNewSwapTransaction } from "~/lib/types";
import { generateImageName } from "~/lib/utils";
import { Box } from "@mantine/core";
import {
  acceptedImagesTypes,
  MAX_ITEM_IMAGES,
  MAX_SWAP_FOR_ITEMS,
} from "~/lib/constants";
import { notifications } from "@mantine/notifications";
import {
  Item_Insert_Input,
  Transaction_Insert_Input,
} from "~/graphql/generated";
import { isNodeFileArray } from "~/lib/utils.server";
import { uploadImageFileToS3Bucket } from "~/lib/s3/uploadFile.server";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { newItemSchema } from "~/lib/schemas/newItemSchema";
import { newTransactionSchema } from "~/lib/schemas/newTransactionSchema";
import { nodeItemImagesSchema } from "~/lib/schemas/nodeItemImagesSchema.server";

const initialDescription =
  '<h2 style="text-align: center;">Describe your item...</h2><p>Here You can provide a detailed description of your item. Include any relevant information that will help others understand what you are offering.</p>';

export const loader = async ({
  request,
  params,
  context,
}: LoaderFunctionArgs) => {
  const { sessionId, userId } = await getAuth({ request, params, context });
  if (!sessionId || !userId) {
    return redirect("/login?redirect_url=" + request.url);
  }

  const { GEOAPIFY_API_KEY, GRAPHQL_ENDPOINT } = process.env;

  if (!GEOAPIFY_API_KEY) {
    throw new Error("GEOAPIFY_API_KEY is not defined");
  }
  if (!GRAPHQL_ENDPOINT) {
    throw new Error("GRAPHQL_ENDPOINT is not defined");
  }

  const adminSdk = AdminSdk;
  const itemFormData = await adminSdk.GetItemFormData();
  const currencyData = await adminSdk.GetCurrencies();

  if (!itemFormData || !currencyData) {
    throw new Error("Failed to fetch data");
  }

  return json({
    itemFormData,
    currencyData,
    GEOAPIFY_API_KEY,
    GRAPHQL_ENDPOINT,
  });
};

// TODO: implement deleting data when something goes wrong
export async function action({ request, params, context }: ActionFunctionArgs) {
  const { sessionId, userId } = await getAuth({ request, params, context });
  if (!sessionId || !userId) {
    return redirect("/login");
  }

  const template = "swapp";

  const { jwt: jwtToken } = await clerkClient.sessions.getToken(
    sessionId,
    template
  );

  const sdk = getServerSdkWithToken(jwtToken);

  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      file: ({ filename }) => {
        // console.log("filename: ", filename);
        return filename;
      },
    }),
    // parse everything else into memory
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const images = formData.getAll("images"); // NodeOnDiskFile[]
  let willSwapForAnyItem = formData.get("willSwapForAnyItem") === "true";

  const wantedItemsString = formData.get("wantedItems");
  const wantedItems = wantedItemsString
    ? (JSON.parse(wantedItemsString?.toString()) as TFormNewItem[])
    : [];

  console.log("wantedItems: ", wantedItems);
  const formDataObj = Object.fromEntries(formData.entries());

  // console.log("formDataObj", formDataObj);
  // console.log("images: ", images);

  const parseItemImages = nodeItemImagesSchema.safeParse(images);
  const parseItemData = newItemSchema.safeParse(formDataObj);
  const parseTransactionData = newTransactionSchema.safeParse(formDataObj);

  // console.log("formData: ", formData);

  console.log(
    "parseItemData success + error: ",
    parseItemData.success + " " + parseItemData.error
  );
  console.log(
    "parseTransactionData success + errorName: ",
    parseTransactionData.success +
      " " +
      parseTransactionData.error?.issues[0].path
  );

  console.log(
    "parseItemImages success + error: ",
    parseItemImages.success + " " + parseItemImages.error
  );

  //
  if (!parseItemData.success) {
    console.error("parseItemData.error.issues: ", parseItemData.error.issues);
    const errorFieldNames: (string | number)[] = [];
    parseItemData.error.issues.forEach((error) => {
      if (typeof error.path === "string") {
        errorFieldNames.push(error.path);
      }
      error.path.forEach((path) => {
        errorFieldNames.push(path);
      });
    });

    return json({
      status: 400,
      response: {
        error: "Invalid item data",
        success: false,
        errorFieldNames: errorFieldNames,
      },
    });
  }

  if (!parseTransactionData.success) {
    console.error(
      "parseTransactionData.error.issues: ",
      parseTransactionData.error.issues
    );
    const errorFieldNames: (string | number)[] = [];
    parseTransactionData.error.issues.forEach((error) => {
      if (typeof error.path === "string") {
        errorFieldNames.push(error.path);
      }
      error.path.forEach((path) => {
        errorFieldNames.push(path);
      });
    });

    return json({
      status: 400,
      response: {
        error: "Invalid transaction data",
        success: false,
        errorFieldNames: errorFieldNames,
      },
    });
  }

  if (!parseItemImages.success) {
    console.error(
      "parseItemImages.error.issues: ",
      parseItemImages.error.issues
    );

    return json({
      status: 400,
      response: {
        error: "Invalid images",
        success: false,
        errorFieldNames: ["images"],
      },
    });
  }

  return json({
    status: 200,
    response: { success: true, error: null, errorFieldNames: [] },
  });

  if (wantedItems.length > MAX_SWAP_FOR_ITEMS) {
    return json({
      status: 400,
      response: {
        error: `Max number of wanted items is ${MAX_SWAP_FOR_ITEMS}`,
        success: false,
        errorFieldNames: [],
      },
    });
  }

  if (wantedItems.length === 0 && !willSwapForAnyItem) {
    willSwapForAnyItem = true;
  }

  // If there are wanted items
  if (!willSwapForAnyItem) {
    const wantedItemsImagesNamesArray: string[][] = [];
    for (let i = 0; i < wantedItems.length; i++) {
      // 1-wantedItemsImages
      const wantedItemsImages = formData.getAll(`${i}-wantedItemsImages`); // NodeOnDiskFile[]
      console.log(`${i}-wantedItemsImages -----`, wantedItemsImages);
      if (
        wantedItemsImages.length >= 0 &&
        !isNodeFileArray(wantedItemsImages)
      ) {
        return json({
          status: 400,
          response: {
            error: "Invalid wanted item images provided",
            success: false,
            errorFieldNames: [],
          },
        });
      }

      // Check if number of images is valid
      if (wantedItemsImages.length > MAX_ITEM_IMAGES) {
        return json({
          status: 400,
          response: {
            error: `Max number of images for wanted item is ${MAX_ITEM_IMAGES}`,
            success: false,
            errorFieldNames: [],
          },
        });
      }
      // Check if at least one image is provided
      else if (wantedItemsImages.length === 0) {
        return json({
          status: 400,
          response: {
            error: "At least one image is required for wanted item",
            success: false,
            errorFieldNames: [],
          },
        });
      }

      // Create a subarray for the wanted item images corresponding to the wanted item by index
      const wantedItemImagesSubarray = [];

      // Send the wanted item images to S3
      for (const imageFile of wantedItemsImages as unknown as NodeOnDiskFile[]) {
        const newWantedItemImageName = await uploadImageFileToS3Bucket({
          imageFile,
        })
          .then((res) => {
            return res;
          })
          .catch((err) => {
            console.error("Error uploading image to S3: ", err);
            return undefined;
          });
        if (!newWantedItemImageName) {
          return json({
            status: 500,
            response: {
              error: "Internal server error",
              success: false,
              errorFieldNames: [],
            },
          });
        }
        wantedItemImagesSubarray.push(newWantedItemImageName);
      }
      wantedItemsImagesNamesArray.push(wantedItemImagesSubarray);
    }
    console.log("wantedItemsImagesNamesArray: ", wantedItemsImagesNamesArray);
    // console.log("wantedItems: ", wantedItems);
    // Create wanted items data
    const wantedItemsData = wantedItems.map((wantedItem, index) => {
      // TODO: extact this to a function
      // check fields if they are empty
      const wantedItemParseResult = newItemSchema.safeParse(wantedItem);

      if (!wantedItemParseResult.success) {
        console.log(
          "wantedItemParseResult.error.errors: ",
          wantedItemParseResult.error.errors
        );
        return json({
          status: 400,
          response: {
            error: "Invalid wanted item data",
            success: false,
            errorFieldNames: [],
          },
        });
      }

      const tags = wantedItem.tags;
      console.log("tags: ", tags);

      const wantedItemData: Item_Insert_Input = {
        name: wantedItem.name,
        categoryId: Number(wantedItem.categoryId),
        subcategoryId: Number(wantedItem.subcategoryId),
        description: wantedItem.description,
        conditionId: Number(wantedItem.conditionId),
        mainColorId: Number(wantedItem.mainColorId),
        quickInfo: wantedItem.quickInfo,
        shippingFromCountryId: Number(wantedItem.shippingFromCountryId),
        shippingFromCityId: Number(wantedItem.shippingFromCityId),
        shippingFromStateId: Number(wantedItem.shippingFromStateId),
        brandId: Number(wantedItem.brandId),
        imageNames: wantedItemsImagesNamesArray[index],
        isWantedItem: true,
        userId: userId,
        sizeId: Number(wantedItem.sizeId),
        private: false,
        manufactury_date_day: wantedItem.manufacturyDateDay,
        manufactury_date_month: wantedItem.manufacturyDateMonth,
        manufactury_date_year: wantedItem.manufacturyDateYear,
        model: wantedItem.model,

        ItemTags: {
          data: tags.map((tag) => {
            return {
              Tag: {
                data: {
                  name: tag,
                },
              },
            };
          }),
        },
      };
      return wantedItemData;
    });
  }

  // Check if main item images are provided and are valid
  if (!images || !Array.isArray(images) || images.length === 0) {
    return json({
      status: 400,
      response: {
        error: "No images provided",
        success: false,
        errorFieldNames: ["images"],
      },
    });
  }

  if (!isNodeFileArray(images)) {
    return json({
      status: 400,
      response: {
        error: "Invalid images provided",
        success: false,
        errorFieldNames: [],
      },
    });
  }

  // Create a new SDK with the JWT token for the auth header

  // Check if the S3 bucket name is defined
  const bucketName = process.env.S3_BUCKET_NAME_ITEM_IMAGES;
  if (!bucketName) {
    console.error("S3_BUCKET_NAME_ITEM_IMAGES is not defined");
    return json({
      status: 500,
      response: {
        error: "Internal server error",
        success: false,
        errorFieldNames: [],
      },
    });
  }

  const imageNames: string[] = [];
  for (const imageFile of images as unknown as NodeOnDiskFile[]) {
    // Generate a random name for the image and add the extension from MIME type
    const newImageName = await uploadImageFileToS3Bucket({
      imageFile,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.error("Error uploading image to S3: ", err);
        return undefined;
      });
    if (!newImageName) {
      return json({
        status: 500,
        response: {
          error: "Internal server error",
          success: false,
          errorFieldNames: [],
        },
      });
    }
    imageNames.push(newImageName);
  }

  // const itemTags = formData.get("tags")

  const itemData: Item_Insert_Input = {
    name: formData.get("name")?.toString(),
    categoryId: Number(formData.get("categoryId")),
    subcategoryId: Number(formData.get("subcategoryId")),
    description: formData.get("description")?.toString() || null,
    conditionId: Number(formData.get("conditionId")) || null,
    mainColorId: Number(formData.get("mainColorId")),
    quickInfo: formData.get("quickInfo")?.toString() || null,
    shippingFromCountryId: Number(formData.get("shippingFromCountryId")),
    shippingFromCityId: Number(formData.get("shippingFromCityId")),
    shippingFromStateId: Number(formData.get("shippingFromStateId")) || null,
    brandId: Number(formData.get("brandId")) || null,
    imageNames: imageNames,
    manufacturyDateDay: formData.get("manufacturyDateDay") || null,
    manufacturyDateMonth: formData.get("manufacturyDateMonth") || null,
    manufacturyDateYear: Number(formData.get("manufacturyDateYear")) || null,
    sizeId: Number(formData.get("sizeId")) || null,
    model: formData.get("model")?.toString() || null,
    private: formData.get("private") === "true" ? true : false,
    userId: userId,
    ItemTags: {
      // TODO: change it
      data: [{ itemId: 1, tagId: 1 }],
    },
    isWantedItem: false,
  };

  // console.log("itemData: ", itemData);

  const transactionData: Transaction_Insert_Input = {
    // TODO: change it

    WantedItemTransactions: {
      data: [
        {
          transaction_id: 1,
          wanted_item_id: 1,
        },
      ],
    },
    availableUntil: formData.get("availableUntil")?.toString() || null,
    currencyId: Number(formData.get("currency")),
    extraPayMaxAmount: formData.get("extraPayMaxAmount") || null,
    extraReceiveMaxAmount: formData.get("extraReceiveMaxAmount") || null,
    offeredItemId: 1,
    isCompleted: false,
    swapOnlyForProvidedWantedItems:
      formData.get("swapOnlyForProvidedWantedItems") === "true" ? true : false,

    swapForAnyItem:
      formData.get("willSwapForAnyItem") === "true" ? true : false,
    transactionTypeId: 1, // Swap - from the database
    userId: userId,
    willPayExtra: formData.get("willPayExtra") === "true" ? true : false,
    willReceiveExtra:
      formData.get("willReceiveExtra") === "true" ? true : false,
  };

  // console.log("transactionData: ", transactionData);

  // const wantedItems = formData.getAll("wantedItems");
  // console.log("wantedItems: ", wantedItems);

  return json({
    status: 200,
    response: { success: true, error: null, errorFieldNames: [] },
  });
}

export default function AddSwapPage() {
  const navigation = useNavigation();

  const stepOneForm = useForm<TFormNewItem>({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      categoryId: "",
      subcategoryId: "",
      images: undefined,
      tags: [],
      manufacturer: undefined,
      model: undefined,
      manufacturyDateDay: undefined,
      manufacturyDateMonth: undefined,
      manufacturyDateYear: undefined,
      description: initialDescription,
      conditionId: "",
      mainColorId: undefined,
      brandId: undefined,
      sizeId: undefined,
      madeInCountryId: undefined,
      quickInfo: "",
      shippingFromCountryId: undefined,
      shippingFromCountryName: undefined,
      shippingFromCityId: undefined,
      shippingFromCityName: undefined,
      shippingFromStateId: undefined,
      shippingFromStateName: undefined,
    },
    validate: zodResolver(newItemSchema),
  });

  const stepTwoForm = useForm<TFormNewSwapTransaction>({
    mode: "uncontrolled",
    initialValues: {
      wantedItems: [],
      shippingFromSameCountry: true,
      shippingFromCountriesIds: [],
      willPayExtra: false,
      extraPayMaxAmount: undefined,
      willReceiveExtra: false,
      extraReceiveMaxAmount: undefined,
      availableUntil: undefined,
      currencyIdPayExtra: 53, // Euro id
      currencyIdReceiveExtra: 53, // Euro id
      willSwapForAnyItem: true,
      swapOnlyForProvidedWantedItems: false,
    },
    validate: zodResolver(newTransactionSchema),
  });

  const { itemFormData, GEOAPIFY_API_KEY, currencyData, GRAPHQL_ENDPOINT } =
    useLoaderData<typeof loader>();
  const [step, setStep] = useState(1);

  const handleNext = (e?: React.FormEvent<HTMLFormElement>) => {
    if (step < 2) setStep(step + 1); // Move to next step
    // if (step === 2 && e) submit(e.currentTarget);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1); // Move to previous step
  };
  const actionData = useActionData<typeof action>();
  // console.log("actionData: ", actionData);
  const isSubmitting =
    (navigation.state === "submitting" || navigation.state === "loading") &&
    navigation.formMethod != null &&
    navigation.formMethod != "GET";

  const handleSubmit = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturnType<any>,
    e?: React.FormEvent<HTMLFormElement>
  ) => {
    const valResults = form.validate();
    console.log("valResults: ", valResults);
    if (valResults.hasErrors) {
      const errorPath = Object.keys(valResults.errors)[0];
      form.getInputNode(errorPath)?.focus();
      return;
    }
    handleNext(e);
  };

  useEffect(() => {
    if (actionData?.response) {
      if (actionData.response.success) {
        notifications.show({
          title: "Success",
          message: "Item added successfully",
          color: "green",
        });
      } else if (actionData.response.error) {
        notifications.show({
          title: "Error",
          message: actionData.response.error,
          color: "red",
        });
        if (actionData.response.errorFieldNames) {
          actionData.response.errorFieldNames.forEach((errorFieldName) => {
            stepOneForm.setFieldError(
              errorFieldName.toString(),
              "Invalid value"
            );
            stepTwoForm.setFieldError(
              errorFieldName.toString(),
              "Invalid value"
            );
          });
        }
      }
    }
  }, [actionData?.response, stepOneForm, stepTwoForm]);

  return (
    <Form method="post" encType="multipart/form-data">
      <Box
        style={{
          visibility: step === 1 ? "visible" : "hidden",
          display: step === 1 ? "block" : "none",
        }}
      >
        <AddSwapFormStepOne
          GRAPHQL_ENDPOINT={GRAPHQL_ENDPOINT}
          geoapifyApkiKey={GEOAPIFY_API_KEY}
          itemFormData={itemFormData}
          form={stepOneForm}
        />
        <FormButtons
          handleBack={handleBack}
          handleNext={() => handleSubmit(stepOneForm)}
          showBackBtn={false}
          wrapperProps={{ mt: "4rem" }}
        />
      </Box>

      <Box
        style={{
          visibility: step === 2 ? "visible" : "hidden",
          display: step === 2 ? "block" : "none",
        }}
      >
        <AddSwapFormStepTwo
          GRAPHQL_ENDPOINT={GRAPHQL_ENDPOINT}
          GEOAPIFY_API_KEY={GEOAPIFY_API_KEY}
          itemFormData={itemFormData}
          currencyData={currencyData}
          form={stepTwoForm}
        />
        <FormButtons
          isTypeSubmit={true}
          nextBtnText={"Submit"}
          handleBack={handleBack}
          wrapperProps={{ mt: "4rem" }}
          isSubmitting={isSubmitting}
        />
      </Box>
    </Form>
  );
}
