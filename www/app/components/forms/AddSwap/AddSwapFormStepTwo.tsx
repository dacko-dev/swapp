import { useForm, UseFormReturnType } from "@mantine/form";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import {
  TFormNewItem,
  TFormNewSwapTransaction,
  TSerializedCurrencyData,
  TSerializedItemFormData,
} from "~/lib/types";
import FormHeader from "../FormHeader/FormHeader";
import {
  ActionIcon,
  Collapse,
  Flex,
  Modal,
  MultiSelect,
  Paper,
  Stack,
  Checkbox,
  Text,
  Tooltip,
  Switch,
} from "@mantine/core";
import ItemForm from "../ItemForm/ItemForm";
import { IconHelp } from "@tabler/icons-react";
import { DNDFormSwapForItemList } from "~/components/DNDFormSwapForItemList/DNDFormSwapForItemList";
import { CurrencyInput } from "~/components/inputs/CurrencyInput/CurrencyInput";
import { FormButtons } from "../FormButtons/FormButtons";
import { MAX_SWAP_FOR_ITEMS } from "~/lib/constants";
import NewWantedItemButtonPopover from "./NewWantedItemButtonPopover";
import { zodResolver } from "mantine-form-zod-resolver";
import { newItemSchema } from "~/lib/schemas/newItemSchema";

export const AddSwapFormStepTwo = ({
  GRAPHQL_ENDPOINT,
  form,
  itemFormData,
  currencyData,
  GEOAPIFY_API_KEY,
}: {
  GRAPHQL_ENDPOINT: string;
  form: UseFormReturnType<TFormNewSwapTransaction>;
  itemFormData: TSerializedItemFormData;
  currencyData: TSerializedCurrencyData;
  GEOAPIFY_API_KEY: string;
}) => {
  const isMobile = useMediaQuery("(max-width: 50em)");
  const [opened, { open, close }] = useDisclosure(false);

  const formNewSwapForItem = useForm<TFormNewItem>({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      categoryId: "",
      subcategoryId: "",
      tags: [],
      images: undefined,
      manufacturer: undefined,
      model: undefined,
      manufacturyDateYear: undefined,
      manufacturyDateMonth: undefined,
      manufacturyDateDay: undefined,
      conditionId: "",
      mainColorId: undefined,
      description: undefined,
      shippingFromCityId: undefined,
      shippingFromCountryId: undefined,
      shippingFromCityName: undefined,
      shippingFromCountryName: undefined,
      shippingFromStateName: undefined,
      shippingFromStateId: undefined,
      brandId: undefined,
      madeInCountryId: undefined,
      sizeId: undefined,
      quickInfo: "",
    },
    validate: zodResolver(newItemSchema),
  });

  const [wantedItems, setWantedItems] = useState<
    (typeof formNewSwapForItem.values)[]
  >([]);

  form.watch("shippingFromSameCountry", ({ value }) => {
    if (value === true) {
      form.setFieldValue("shippingFromCountriesIds", []);
    }
  });

  const willSwapForAnyItem = form.getValues().willSwapForAnyItem;

  useEffect(() => {
    form.setFieldValue("wantedItems", wantedItems);
  }, [wantedItems, form]);

  return (
    <>
      <FormHeader
        title="What would you like to swap for?"
        description="Add items you would like to swap for, set extra payment options and shipping preferences"
      />

      <Stack gap={"lg"}>
        <Flex
          display="flex"
          gap={"lg"}
          w={"100%"}
          justify={"space-between"}
          align={"center"}
          my={"xl"}
        >
          <Switch
            w={"100%"}
            {...form.getInputProps("willSwapForAnyItem")}
            // size="md"
            label="Any item is fine"
            defaultChecked={form.getValues().willSwapForAnyItem}
            name="willSwapForAnyItem"
            description={
              willSwapForAnyItem
                ? "If you want a specific item, please uncheck this option"
                : undefined
            }
            fw={700}
            size="xl"
            fz={"h1"}
          />
        </Flex>

        <Collapse in={!form.getValues().willSwapForAnyItem}>
          <Stack gap={0}>
            <Flex display="flex" align={"center"} gap={"xs"} w={"100%"}>
              <Modal
                opened={opened}
                onClose={() => {
                  formNewSwapForItem.reset();
                  close();
                }}
                centered
                size={"xl"}
                closeOnClickOutside={false}
                withCloseButton={false}
                fullScreen={isMobile}
                transitionProps={{ transition: "fade", duration: 100 }}
              >
                <Modal.Header>
                  <Modal.Title>
                    <Text fz={"h3"} fw={700}>
                      Item details
                    </Text>
                  </Modal.Title>
                  <Modal.CloseButton />
                </Modal.Header>
                <ItemForm
                  GRAPHQL_ENDPOINT={GRAPHQL_ENDPOINT}
                  geoapifyApkiKey={GEOAPIFY_API_KEY}
                  itemFormData={itemFormData}
                  form={formNewSwapForItem}
                  imagesInputId={formNewSwapForItem.key("images")}
                />
                <FormButtons
                  showBackBtn={false}
                  handleNext={() => {
                    const validationResult = formNewSwapForItem.validate();
                    console.log(
                      "formNewSwapForItem.getValues():",
                      formNewSwapForItem.getValues()
                    );
                    console.log("validationResult: ", validationResult);
                    if (validationResult.hasErrors) {
                      const errorPath = Object.keys(validationResult.errors)[0];
                      form.getInputNode(errorPath)?.focus();
                      return;
                    } else if (
                      wantedItems.some(
                        (item) =>
                          item.name === formNewSwapForItem.getValues().name
                      )
                    ) {
                      form.getInputNode("name")?.focus();
                      formNewSwapForItem.setFieldError(
                        "name",
                        "Item with this name already exists"
                      );
                    } else {
                      const newItem = formNewSwapForItem.getValues();
                      console.log("newItem: ", newItem);
                      setWantedItems((prev) => [...prev, newItem]);
                      close();
                      formNewSwapForItem.reset();
                    }
                  }}
                  nextBtnText="Add item"
                />
              </Modal>
              <Text fw={"bold"} fz={"h3"}>
                Add items
              </Text>
              {/* TODO: implement adding existing item from users items/ any item in the app created by another user - search input etc */}
              <NewWantedItemButtonPopover
                onNewItemClick={open}
                disabled={wantedItems.length >= 5}
              />
            </Flex>
            <Text fz={"sm"} c={"dimmed"} mb={10}>
              Items you would like to swap for (max {MAX_SWAP_FOR_ITEMS})
            </Text>
          </Stack>
          {/* Hidden Input for items */}
          <input
            type="hidden"
            name="wantedItems"
            value={JSON.stringify(wantedItems)}
          />
          {/* Inputs for images for wantedItems */}
          {wantedItems.map((item, index) => (
            <input
              key={`${index}-${item.name}`}
              type="file"
              // on the server side, images comes with names like 0-wantedItemsImages, 1-wantedItemsImages, etc.
              name={`${index}-wantedItemsImages`}
              style={{ display: "none", visibility: "hidden" }} // Hide the input
              multiple
              ref={(node) => {
                if (node && item.images) {
                  node.files = item.images;
                }
              }}
            />
          ))}
          {wantedItems.length > 0 ? (
            <>
              <DNDFormSwapForItemList
                onDelete={(name) => {
                  setWantedItems((prev) =>
                    prev.filter((item) => item.name !== name)
                  );
                }}
                onEdit={(item) => {
                  formNewSwapForItem.setValues(item);
                  open();
                }}
                items={wantedItems}
              />
              <Switch
                ml={"auto"}
                label="Only these items"
                name="swapOnlyForProvidedWantedItems"
                {...form.getInputProps("swapOnlyForProvidedWantedItems")}
              />
            </>
          ) : (
            <Paper withBorder ta={"center"} py={"xl"}>
              <Text fz={"md"} c={"gray"}>
                No items added yet
              </Text>
            </Paper>
          )}
        </Collapse>

        <br></br>
        <Flex
          display="flex"
          direction={{
            xs: "column",
            sm: "row",
          }}
          gap={"lg"}
          w={"100%"}
          justify={"space-between"}
          align={"center"}
        >
          <Checkbox
            w={"100%"}
            size="md"
            label="Same country shipping"
            defaultChecked={form.getValues().shippingFromSameCountry}
            name="shippingFromSameCountry"
            style={{
              userSelect: "none",
            }}
            {...form.getInputProps("shippingFromSameCountry")}
          />

          {/* <Divider orientation="vertical" /> */}
          <MultiSelect
            w={"100%"}
            size="md"
            label="Shipping only from"
            placeholder={"Leave empty for any country"}
            data={itemFormData.Country.map((country) => ({
              value: String(country.id),
              label: country.name,
            }))}
            disabled={form.getValues().shippingFromSameCountry}
            searchable
            clearable
            key={form.key("shippingFromCountriesIds")}
            {...form.getInputProps("shippingFromCountriesIds")}
            name="shippingFromCountriesIds"
          />
          <Tooltip
            withArrow
            w={340}
            transitionProps={{ duration: 150 }}
            multiline
            label="You can choose to ship only from specific countries. If left empty, you will ship from any country"
          >
            <ActionIcon className="shrink" variant="transparent">
              <IconHelp />
            </ActionIcon>
          </Tooltip>
        </Flex>
        {/* <Divider my="md" /> */}
        <Flex
          display="flex"
          direction={{
            xs: "column",
            sm: "row",
          }}
          gap={"lg"}
          w={"100%"}
          justify={"space-between"}
          align={"center"}
        >
          <Checkbox
            w={"100%"}
            size="md"
            label={"Extra payment for other party"}
            {...form.getInputProps("willPayExtra")}
            defaultChecked={form.getValues().willPayExtra}
            name="willPayExtra"
            style={{
              userSelect: "none",
            }}
          />
          {/* <Divider orientation="vertical" /> */}
          <CurrencyInput
            textInputProps={{
              placeholder: "Any amount",
              label: "Would you like to pay extra?",
              w: "100%",
              error: form.errors.extraPayMaxAmount,
              disabled: !form.getValues().willPayExtra,
              name: "extraPayMaxAmount",
              ...form.getInputProps("extraPayMaxAmount"),
            }}
            currencySelectProps={{
              defaultValue: form.getValues().currencyIdPayExtra,
              disabled: !form.getValues().willPayExtra,
              ...form.getInputProps("currencyIdPayExtra"),
              onChange: (e) => {
                form.setFieldValue("currencyIdPayExtra", e.currentTarget.value);
              },
            }}
            currencyData={currencyData}
          />

          {/* Native select in CurrencyInput does not send data with form when not selected, even with default value/value provided by the useForm */}
          <input
            name="currencyIdPayExtra"
            type="hidden"
            {...form.getInputProps("currencyIdPayExtra")}
          />

          <Tooltip
            withArrow
            transitionProps={{ duration: 150 }}
            multiline
            w={340}
            label="The other party can offer you to pay extra for the swap, if your item is less valuable. Provide the maximum amount you are willing to pay."
          >
            <ActionIcon className="shrink" variant="transparent">
              <IconHelp />
            </ActionIcon>
          </Tooltip>
        </Flex>

        <Flex
          display="flex"
          direction={{
            xs: "column",
            sm: "row",
          }}
          gap={"lg"}
          w={"100%"}
          justify={"space-between"}
          align={"center"}
        >
          <Checkbox
            w={"100%"}
            size="md"
            label="Extra payment for You"
            defaultChecked={form.getValues().willReceiveExtra}
            name="willReceiveExtra"
            {...form.getInputProps("willReceiveExtra")}
            style={{
              userSelect: "none",
            }}
          />

          <CurrencyInput
            textInputProps={{
              placeholder: "Any amount",

              label: "Would you like to receive extra payment?",
              w: "100%",
              error: form.errors.extraReceiveMaxAmount,
              name: "extraReceiveMaxAmount",
              ...form.getInputProps("extraReceiveMaxAmount"),
              disabled: !form.getValues().willReceiveExtra,
            }}
            currencySelectProps={{
              defaultValue: form.getValues().currencyIdReceiveExtra,

              disabled: !form.getValues().willReceiveExtra,
              ...form.getInputProps("currencyIdReceiveExtra"),
              onChange: (e) => {
                form.setFieldValue(
                  "currencyIdReceiveExtra",
                  e.currentTarget.value
                );
              },
            }}
            currencyData={currencyData}
          />

          {/* Native select in CurrencyInput does not send data with form when not selected, even with default value/value provided by the useForm */}
          <input
            name="currencyIdReceiveExtra"
            type="hidden"
            {...form.getInputProps("currencyIdReceiveExtra")}
          />
          <Tooltip
            withArrow
            transitionProps={{ duration: 150 }}
            multiline
            w={340}
            label="The other party can offer you an extra payment for the swap, if their item is less valuable. Provide the maximum amount you are willing to receive."
          >
            <ActionIcon className="shrink" variant="transparent">
              <IconHelp />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Stack>
    </>
  );
};
